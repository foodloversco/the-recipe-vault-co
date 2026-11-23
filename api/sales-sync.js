// Vercel Serverless — Sales Sync Cache
// POST: receives stats snapshot from admin portal
// GET: returns latest cached stats

// Module-level cache (warm-instance ephemeral storage)
let cachedStats = null;
let cachedAt = null;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'POST') {
    try {
      const stats = req.body;
      cachedStats = stats;
      cachedAt = new Date().toISOString();
      return res.status(200).json({ ok: true, cachedAt });
    } catch (err) {
      return res.status(500).json({ ok: false, error: err.message });
    }
  }

  if (req.method === 'GET') {
    return res.status(200).json({ ok: true, stats: cachedStats, cachedAt });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
