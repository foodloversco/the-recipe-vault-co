// Vercel Serverless Function — Pinterest OAuth Callback & 1-Click Token Generator
// Exchanges OAuth code for Access Token automatically

const CLIENT_ID = '1643989';
const CLIENT_SECRET = 'a69acab719554684929607256a9d83a637da9b4d';
const PINTEREST_TOKEN_URL = 'https://api.pinterest.com/v5/oauth/token';

export default async function handler(req, res) {
  const { code, redirect_uri } = req.query;

  // 1. If no code, output instructions and direct authorization link
  if (!code) {
    const defaultRedirect = `https://${req.headers.host || 'the-recipe-vault-co-six.vercel.app'}/api/pinterest-auth`;
    const scopes = 'boards:read,boards:write,pins:read,pins:write';
    const authUrl = `https://www.pinterest.com/oauth/?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(defaultRedirect)}&response_type=code&scope=${encodeURIComponent(scopes)}`;

    return res.status(200).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Pinterest App Connect | The Recipe Vault Co.</title>
          <style>
            body { background: #121110; color: #f7f5f0; font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
            .card { background: #1a1715; border: 1px solid #382f25; border-radius: 20px; padding: 32px; max-width: 500px; text-align: center; }
            h1 { color: #dea374; font-size: 20px; margin-bottom: 12px; }
            p { color: #a8a196; font-size: 13px; line-height: 1.6; margin-bottom: 24px; }
            .btn { background: #e60023; color: white; padding: 12px 24px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 14px; display: inline-block; }
            .btn:hover { background: #ad081b; }
            .note { font-size: 11px; color: #7a7164; margin-top: 16px; }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>Connect Pinterest Auto-Poster</h1>
            <p>Click the button below to authorize The Recipe Vault Co. with <strong>boards:write</strong> and <strong>pins:write</strong> permissions so pins can be posted automatically.</p>
            <a href="${authUrl}" class="btn">Connect Pinterest Account &rarr;</a>
            <p class="note">Note: If Pinterest shows an invalid redirect error, add <code>${defaultRedirect}</code> to your Redirect URIs in your Pinterest App settings.</p>
          </div>
        </body>
      </html>
    `);
  }

  // 2. Exchange code for Access Token
  try {
    const host = req.headers.host || 'the-recipe-vault-co-six.vercel.app';
    const effectiveRedirect = redirect_uri || `https://${host}/api/pinterest-auth`;
    const basicAuth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', effectiveRedirect);

    const tokenRes = await fetch(PINTEREST_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    });

    const data = await tokenRes.json();

    if (!tokenRes.ok) {
      return res.status(tokenRes.status).json({
        ok: false,
        error: 'Failed to exchange authorization code for token',
        details: data
      });
    }

    // If client requested JSON or query param has json=true
    if (req.headers.accept?.includes('application/json') || req.query.json === 'true') {
      return res.status(200).json({ ok: true, ...data });
    }

    return res.status(200).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Pinterest Connected! | The Recipe Vault Co.</title>
          <style>
            body { background: #121110; color: #f7f5f0; font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
            .card { background: #1a1715; border: 1px solid #2d4a2d; border-radius: 20px; padding: 32px; max-width: 550px; text-align: center; }
            h1 { color: #4ade80; font-size: 20px; margin-bottom: 12px; }
            p { color: #a8a196; font-size: 13px; line-height: 1.6; }
            code { background: #251d16; color: #dea374; padding: 8px 12px; border-radius: 8px; display: block; word-break: break-all; margin: 16px 0; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>✓ Pinterest Connected Successfully!</h1>
            <p>Your access token with write permissions is ready:</p>
            <code>${data.access_token}</code>
            <p>Copy this token and paste it into chat or your Admin Portal to activate 100% automated posting!</p>
          </div>
        </body>
      </html>
    `);
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
}
