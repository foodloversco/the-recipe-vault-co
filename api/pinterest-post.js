// Vercel Serverless Function — Pinterest Automated Poster & Cron
// Posts recipe pins directly to Pinterest via Pinterest API v5

import pins from './pins-data.json' assert { type: 'json' };

const TELEGRAM_BOT_TOKEN = '9002281093:AAH32gRNpbE8CKKMqE6SC3krwDKj-kldm34';
const TELEGRAM_CHAT_ID = '6920006386';
const PINTEREST_API = 'https://api.pinterest.com/v5';
const APP_SECRET_DEFAULT = 'a69acab719554684929607256a9d83a637da9b4d';

// Ephemeral index pointer across warm invocations
let currentPinIndex = 0;

async function notifyTelegram(message) {
  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML',
        disable_web_page_preview: false,
      }),
    });
  } catch (err) {
    console.error('Telegram notification error:', err);
  }
}

async function getPinterestBoards(token) {
  const res = await fetch(`${PINTEREST_API}/boards?page_size=100`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to fetch boards (${res.status}): ${err}`);
  }
  const data = await res.json();
  return data.items || [];
}

async function ensureBoard(token, boardName, existingBoards) {
  const match = existingBoards.find(b => b.name.toLowerCase().trim() === boardName.toLowerCase().trim());
  if (match) return match.id;

  // Create board if not existing
  const res = await fetch(`${PINTEREST_API}/boards`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: boardName,
      privacy: 'PUBLIC',
      description: 'Official digital recipe card collections from The Recipe Vault Co.'
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to create board "${boardName}": ${err}`);
  }
  const newBoard = await res.json();
  return newBoard.id;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const token = req.headers.authorization?.replace(/^Bearer\s+/i, '') ||
                req.query.token ||
                req.body?.token ||
                process.env.PINTEREST_ACCESS_TOKEN;

  const action = req.query.action || req.body?.action || 'status';

  // 1. Status Check & App Configuration Guidance
  if (action === 'status' && !token) {
    return res.status(200).json({
      ok: true,
      service: 'The Recipe Vault Co. - Pinterest Automated Poster',
      configured: false,
      totalPinsInQueue: pins.length,
      currentPinIndex: currentPinIndex,
      appSecretConfigured: true,
      appSecretMasked: 'a69aca...9b4d',
      instructions: {
        step1: 'Open Pinterest Developer Portal: https://developers.pinterest.com/apps/',
        step2: 'Under your app, generate a "User access token" or "Trial access token" with scopes: boards:read, boards:write, pins:read, pins:write',
        step3: 'Save the token in Admin Portal or trigger this endpoint with ?token=YOUR_TOKEN&action=post-next'
      }
    });
  }

  if (!token) {
    return res.status(401).json({
      ok: false,
      error: 'Missing Pinterest Access Token. Please provide token via Authorization header or ?token= parameter.'
    });
  }

  // 2. Fetch User & Board Info
  if (action === 'verify-account') {
    try {
      const userRes = await fetch(`${PINTEREST_API}/user_account`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!userRes.ok) {
        return res.status(401).json({ ok: false, error: 'Invalid or expired Pinterest token.' });
      }
      const userData = await userRes.json();
      const boards = await getPinterestBoards(token);
      return res.status(200).json({
        ok: true,
        user: userData,
        boards: boards.map(b => ({ id: b.id, name: b.name })),
        totalPinsInQueue: pins.length,
        nextPin: pins[currentPinIndex % pins.length]
      });
    } catch (err) {
      return res.status(500).json({ ok: false, error: err.message });
    }
  }

  // 3. Post Next Pin in Queue
  if (action === 'post-next' || req.method === 'GET') {
    try {
      const pinIndexToPost = typeof req.body?.pinIndex === 'number' 
        ? req.body.pinIndex 
        : (currentPinIndex % pins.length);

      const targetPin = pins[pinIndexToPost];
      if (!targetPin) {
        return res.status(400).json({ ok: false, error: 'Pin not found at index ' + pinIndexToPost });
      }

      // Check / ensure board
      const boards = await getPinterestBoards(token);
      const boardId = await ensureBoard(token, targetPin.board, boards);

      // Create Pin on Pinterest API v5
      const pinRes = await fetch(`${PINTEREST_API}/pins`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: targetPin.title,
          description: targetPin.description,
          link: targetPin.link,
          board_id: boardId,
          media_source: {
            source_type: 'image_url',
            url: targetPin.mediaUrl
          }
        }),
      });

      if (!pinRes.ok) {
        const errorDetail = await pinRes.text();
        return res.status(pinRes.status).json({
          ok: false,
          error: `Pinterest API rejected pin: ${errorDetail}`,
          attemptedPin: targetPin
        });
      }

      const createdPin = await pinRes.json();
      currentPinIndex = (pinIndexToPost + 1) % pins.length;

      // Telegram notification
      const tgMsg = `📌 <b>Pinterest Auto-Post Success!</b>\n\n` +
        `• <b>Pin Title:</b> ${targetPin.title}\n` +
        `• <b>Board:</b> ${targetPin.board}\n` +
        `• <b>Pin ID:</b> <code>${createdPin.id}</code>\n` +
        `• <b>Queue Progress:</b> #${pinIndexToPost + 1} of ${pins.length}\n` +
        `• <b>Link:</b> ${targetPin.link}\n\n` +
        `<i>Next auto-pin scheduled in queue!</i> 🚀`;

      await notifyTelegram(tgMsg);

      return res.status(200).json({
        ok: true,
        message: `Successfully published Pin #${pinIndexToPost + 1} to board "${targetPin.board}"!`,
        pin: createdPin,
        nextIndex: currentPinIndex
      });

    } catch (err) {
      console.error('Pinterest Post Handler Error:', err);
      return res.status(500).json({ ok: false, error: err.message });
    }
  }

  return res.status(400).json({ ok: false, error: `Unknown action "${action}"` });
}
