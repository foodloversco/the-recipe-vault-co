// Vercel Serverless Function — Telegram Bot FAQ Webhook
// Route: POST /api/telegram-webhook
// Handles incoming Telegram messages and auto-replies with FAQ answers

const BOT_TOKEN = '9002281093:AAH32gRNpbE8CKKMqE6SC3krwDKj-kldm34';
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

async function sendMessage(chatId, text, parseMode = 'HTML') {
  const url = `${TELEGRAM_API}/sendMessage`;
  const body = JSON.stringify({
    chat_id: chatId,
    text: text,
    parse_mode: parseMode,
    disable_web_page_preview: true,
  });

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  });

  return res.json();
}

// ── FAQ Replies ───────────────────────────────────────────────────────────────

const REPLIES = {
  start: `👋 <b>Welcome to The Recipe Vault Co. Support!</b>

Here are the commands you can use:

/download — How to download your recipe book PDF
/restore — How to restore access with your unlock key
/capitec — How to pay with Capitec / Bank EFT
/print — How to print your recipes
/contact — How to reach our team
/help — Show this menu again

Just tap a command or type it below. We are happy to help! 🍳`,

  help: `📋 <b>The Recipe Vault Co. — Help Menu</b>

Tap a command for instant help:

🔽 /download — Download your PDF book
🔑 /restore — Restore with your unlock key
🏦 /capitec — Pay with Capitec or Bank EFT
🖨️ /print — Print your recipe cards
📩 /contact — Talk to our team
❓ /help — Show this menu

You can also just type your question and we'll reply as soon as possible.`,

  download: `📥 <b>How to Download Your Recipe Book</b>

After purchase, your book unlocks instantly in the browser.

<b>To download the PDF:</b>
1️⃣ Go to the <b>My Paid Books</b> tab on our site
2️⃣ Tap your book title to open it
3️⃣ Tap the <b>Download PDF</b> button
4️⃣ Save the file to your phone or computer

💡 <b>Tip:</b> Your unlock key (RV-XXXX) lets you re-open the book on any device — save it somewhere safe!

Need help? Type your question here or use /contact.`,

  restore: `🔑 <b>How to Restore Access to Your Book</b>

<b>Option 1 — Use your unlock key:</b>
1️⃣ Go to the <b>My Paid Books</b> tab on our site
2️⃣ Enter your <b>RV-XXXX</b> unlock token
3️⃣ Your book will unlock instantly

<b>Option 2 — Use your email:</b>
1️⃣ Enter the email address you used at checkout
2️⃣ We'll match it to your purchase

<b>Lost your token?</b> Email us at jraysoc05@gmail.com with your PayPal transaction ID or Capitec payment reference and we will resend your key within a few hours.`,

  capitec: `🏦 <b>How to Pay with Capitec or Bank EFT</b>

<b>Steps to pay:</b>
1️⃣ On checkout, select <b>South Africa (R20)</b>
2️⃣ Tap <b>Pay with Capitec / Bank</b>
3️⃣ Transfer <b>R20</b> to Capitec Pay number: <code>084 344 1313</code>
4️⃣ Use the <b>payment reference</b> shown on screen (keep it!)
5️⃣ Tap <b>Telegram Proof</b> to send your receipt to us

⏱️ We send your unlock key within <b>a few minutes</b> after confirming payment.

Questions? Just ask here or use /contact.`,

  print: `🖨️ <b>How to Print Your Recipes</b>

<b>Steps to print:</b>
1️⃣ Unlock your book on our site
2️⃣ Open any recipe card you want to print
3️⃣ Tap the <b>Print</b> button on the recipe card
4️⃣ Your phone or browser will open the print dialog
5️⃣ Select your printer and print!

✅ Recipe cards are optimised for <b>A5 size and phone printing</b>.

💡 You can also download the full PDF (/download) and print from there.`,

  contact: `📩 <b>Contact Our Support Team</b>

You are already in the right place! 🎉

Just <b>type your question</b> here and we will reply as soon as possible.

You can also visit our website support page:
👉 https://the-recipe-vault-co-six.vercel.app/?view=contact

Or email us at: <b>jraysoc05@gmail.com</b>

We usually reply within a few hours. Thank you for your patience! 🙏`,

  unknown: `🤔 Not sure what you need?

Tap /help to see all available commands, or just type your question and we'll reply shortly.

👉 /help`,
};

// ── Main Handler ──────────────────────────────────────────────────────────────

export default async function handler(req, res) {
  // Only accept POST from Telegram
  if (req.method !== 'POST') {
    return res.status(200).json({ ok: true, message: 'Telegram webhook active' });
  }

  try {
    const body = req.body;

    // Telegram sends updates — we care about messages
    const message = body?.message || body?.edited_message;
    if (!message) {
      return res.status(200).json({ ok: true });
    }

    const chatId = message.chat?.id;
    const text = (message.text || '').trim().toLowerCase();

    if (!chatId || !text) {
      return res.status(200).json({ ok: true });
    }

    // Extract command (strip @botname suffix if present)
    const rawCommand = text.split(' ')[0].replace(/@\w+$/, '');

    let reply;
    switch (rawCommand) {
      case '/start':
        reply = REPLIES.start;
        break;
      case '/help':
        reply = REPLIES.help;
        break;
      case '/download':
        reply = REPLIES.download;
        break;
      case '/restore':
        reply = REPLIES.restore;
        break;
      case '/capitec':
        reply = REPLIES.capitec;
        break;
      case '/print':
        reply = REPLIES.print;
        break;
      case '/contact':
        reply = REPLIES.contact;
        break;
      default:
        // Freeform message — generic nudge
        reply = REPLIES.unknown;
        break;
    }

    await sendMessage(chatId, reply);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Telegram webhook error:', err);
    // Always return 200 so Telegram doesn't retry endlessly
    return res.status(200).json({ ok: true, error: err.message });
  }
}
