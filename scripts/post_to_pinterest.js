/**
 * The Recipe Vault Co. - Pinterest API Poster Script
 * 
 * Usage:
 *   node scripts/post_to_pinterest.js --token=YOUR_ACCESS_TOKEN [--limit=5] [--board=BOARD_ID]
 * 
 * Or set environment variable:
 *   PINTEREST_ACCESS_TOKEN=your_token node scripts/post_to_pinterest.js
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const PINTEREST_API_BASE = 'https://api.pinterest.com/v5';
const TOKEN = process.env.PINTEREST_ACCESS_TOKEN || 
  process.argv.find(arg => arg.startsWith('--token='))?.split('=')[1] ||
  '';

async function request(endpoint, options = {}) {
  const url = `${PINTEREST_API_BASE}${endpoint}`;
  const headers = {
    'Authorization': `Bearer ${TOKEN}`,
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  return new Promise((resolve, reject) => {
    const req = https.request(url, {
      method: options.method || 'GET',
      headers
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(json);
          } else {
            reject({ status: res.statusCode, body: json });
          }
        } catch (e) {
          reject({ status: res.statusCode, text: data });
        }
      });
    });

    req.on('error', reject);
    if (options.body) {
      req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
    }
    req.end();
  });
}

function parseCSV(content) {
  const lines = content.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  const pins = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Regex to handle quoted CSV values properly
    const matches = line.match(/(?:^|,)("(?:[^"]|"")*"|[^,]*)/g);
    if (!matches) continue;

    const values = matches.map(m => {
      let val = m.replace(/^,/, '').trim();
      if (val.startsWith('"') && val.endsWith('"')) {
        val = val.substring(1, val.length - 1).replace(/""/g, '"');
      }
      return val;
    });

    pins.push({
      title: values[0] || '',
      mediaUrl: values[1] || '',
      board: values[2] || '',
      description: values[3] || '',
      link: values[4] || '',
      publishDate: values[5] || '',
      keywords: values[6] || ''
    });
  }

  return pins;
}

async function main() {
  console.log('====================================================');
  console.log('       THE RECIPE VAULT CO. - PINTEREST UPLOADER     ');
  console.log('====================================================\n');

  if (!TOKEN) {
    console.log('No access token provided.');
    console.log('To post via API:');
    console.log('  node scripts/post_to_pinterest.js --token=<ACCESS_TOKEN>');
    console.log('\nAlternative (Recommended & Instant):');
    console.log('  1. Go to Pinterest Business Hub -> Create -> Create Pins in Bulk');
    console.log('  2. Upload: "pinterest_bulk_upload.csv" (scheduled) or "pinterest_bulk_upload_immediate.csv"');
    return;
  }

  try {
    console.log('Verifying token with Pinterest API...');
    const user = await request('/user_account');
    console.log(`Connected successfully as: @${user.username} (${user.account_type})\n`);

    console.log('Fetching Pinterest boards...');
    const boardsResponse = await request('/boards?page_size=100');
    const boards = boardsResponse.items || [];
    console.log(`Found ${boards.length} board(s):`);
    boards.forEach(b => console.log(`  - [${b.id}] ${b.name}`));

    const boardMap = {};
    boards.forEach(b => {
      boardMap[b.name.toLowerCase().trim()] = b.id;
    });

    // Read CSV
    const csvPath = path.join(__dirname, '..', 'pinterest_bulk_upload.csv');
    if (!fs.existsSync(csvPath)) {
      console.error('pinterest_bulk_upload.csv not found!');
      return;
    }

    const pins = parseCSV(fs.readFileSync(csvPath, 'utf8'));
    console.log(`\nLoaded ${pins.length} pins from CSV.`);

    let successCount = 0;
    for (let i = 0; i < pins.length; i++) {
      const pin = pins[i];
      let boardId = boardMap[pin.board.toLowerCase().trim()];

      if (!boardId) {
        console.warn(`Board "${pin.board}" not found on account. Attempting to create it...`);
        try {
          const newBoard = await request('/boards', {
            method: 'POST',
            body: { name: pin.board, privacy: 'PUBLIC' }
          });
          boardId = newBoard.id;
          boardMap[pin.board.toLowerCase().trim()] = boardId;
          console.log(`Created board: ${pin.board} (${boardId})`);
        } catch (e) {
          console.error(`Could not find or create board "${pin.board}". Skipping pin #${i+1}`);
          continue;
        }
      }

      console.log(`[${i+1}/${pins.length}] Creating pin: "${pin.title}"...`);
      try {
        const payload = {
          title: pin.title,
          description: pin.description,
          link: pin.link,
          board_id: boardId,
          media_source: {
            source_type: 'image_url',
            url: pin.mediaUrl
          }
        };

        const res = await request('/pins', {
          method: 'POST',
          body: payload
        });
        console.log(`  ✓ Published Pin ID: ${res.id}`);
        successCount++;
        // Short rate limit pause
        await new Promise(r => setTimeout(r, 600));
      } catch (err) {
        console.error(`  ✗ Error creating pin:`, err.body || err.text || err.message);
      }
    }

    console.log(`\nDone! Successfully posted ${successCount}/${pins.length} pins.`);
  } catch (err) {
    console.error('Pinterest API Error:', err);
  }
}

main();
