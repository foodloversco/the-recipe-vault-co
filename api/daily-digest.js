// Vercel Cron Function — Daily Sales Digest
// Schedule: 0 18 * * * (18:00 UTC = 20:00 SAST)

const BOT_TOKEN = '9002281093:AAH32gRNpbE8CKKMqE6SC3krwDKj-kldm34';
const OWNER_CHAT_ID = '6920006386';
const SITE_URL = 'https://the-recipe-vault-co-six.vercel.app';

export default async function handler(req, res) {
  // Vercel invokes cron jobs with GET requests
  // Optionally protect with a secret header
  
  try {
    // Try to fetch cached stats from sales-sync endpoint
    let statsText = '';
    try {
      const syncRes = await fetch(`${SITE_URL}/api/sales-sync`);
      const syncData = await syncRes.json();
      
      if (syncData.ok && syncData.stats) {
        const s = syncData.stats;
        const totalUSD = typeof s.totalUSD === 'number' ? s.totalUSD.toFixed(2) : '0.00';
        const totalZAR = typeof s.totalZAR === 'number' ? s.totalZAR.toFixed(2) : '0.00';
        const count = s.count || 0;
        const lastSync = syncData.cachedAt ? new Date(syncData.cachedAt).toLocaleTimeString('en-ZA', { timeZone: 'Africa/Johannesburg', hour: '2-digit', minute: '2-digit' }) : 'unknown';
        
        statsText = `
📊 <b>Today's Sales Summary:</b>
• Total Sales: <b>${count}</b>
• Revenue: <b>$${totalUSD} USD</b> / <b>R${totalZAR} ZAR</b>
• Last sync: ${lastSync}`;
      } else {
        statsText = '\n📊 <i>No stats synced today. Open the admin portal to sync.</i>';
      }
    } catch (e) {
      statsText = '\n📊 <i>Stats unavailable — open admin portal to sync.</i>';
    }

    const now = new Date().toLocaleDateString('en-ZA', {
      timeZone: 'Africa/Johannesburg',
      weekday: 'long', day: 'numeric', month: 'long'
    });

    const message = `🌙 <b>Evening Digest — ${now}</b>
${statsText}

🔗 Admin Portal: ${SITE_URL}/admin
📱 Check Telegram for all sale notifications.

Good night! 🍳`;

    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: OWNER_CHAT_ID,
        text: message,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    });

    return res.status(200).json({ ok: true, sent: true });
  } catch (err) {
    console.error('Daily digest error:', err);
    return res.status(200).json({ ok: false, error: err.message });
  }
}
