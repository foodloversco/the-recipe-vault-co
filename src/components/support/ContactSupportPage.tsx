import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  MessageCircle, 
  ShieldCheck, 
  Send, 
  CheckCircle2, 
  Phone, 
  Clock, 
  Sparkles,
  HelpCircle,
  FileCheck,
  ArrowLeft,
  SendHorizontal
} from 'lucide-react';
import { telegramService } from '../../services/telegramService';

interface ContactSupportPageProps {
  onBackToCatalog: () => void;
  buyerEmail?: string;
}

export const ContactSupportPage: React.FC<ContactSupportPageProps> = ({
  onBackToCatalog,
  buyerEmail = '',
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState(buyerEmail);
  const [tokenInput, setTokenInput] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [telegramUsername, setTelegramUsername] = useState('therecipevaultco');
  const [isSending, setIsSending] = useState(false);
  const [sentViaTelegram, setSentViaTelegram] = useState(false);

  const supportEmail = 'jraysoc05@gmail.com';
  const supportWhatsAppDisplay = '+27 84 344 1313';
  const supportWhatsAppRaw = '27843441313';

  useEffect(() => {
    const config = telegramService.getConfig();
    if (config.username) {
      setTelegramUsername(config.username.replace('@', ''));
    }
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(supportEmail);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !email.trim()) return;

    setIsSending(true);
    const sentTelegram = await telegramService.sendCustomerSupportInquiry(name, email, tokenInput, message);
    if (sentTelegram) {
      setSentViaTelegram(true);
    } else {
      // Direct mailto fallback if Telegram bot is not yet configured
      const subject = encodeURIComponent(`The Recipe Vault Co. Support Request from ${name || 'Customer'}`);
      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\nAccess Token (if any): ${tokenInput}\n\nMessage:\n${message}`
      );
      window.open(`mailto:${supportEmail}?subject=${subject}&body=${body}`, '_blank');
    }
    setIsSending(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#0e0c0a] text-[#f5f2eb] py-10 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Navigation Back */}
        <button
          type="button"
          onClick={onBackToCatalog}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1e1914] hover:bg-[#2b241e] text-xs font-semibold text-[#dea374] border border-[#3b3126] transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalog</span>
        </button>

        {/* Hero Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#241c15] border border-[#cf7b3e]/40 text-[#dea374] text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Dedicated Customer Care &amp; VIP Buyer Help</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Contact &amp; VIP Support
          </h1>

          <p className="text-xs sm:text-sm text-[#b8b0a4] max-w-xl mx-auto leading-relaxed">
            Need help retrieving your unlock token, downloading a PDF, or have a question about cooking from your collection? Our team is here to assist you promptly.
          </p>
        </div>

        {/* Quick Contact Cards Grid (WhatsApp, Telegram & Email) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* WhatsApp Direct VIP Chat */}
          <div className="bg-[#171411] border border-emerald-500/40 rounded-3xl p-5 space-y-4 shadow-xl relative overflow-hidden group flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#25D366]/20 border border-[#25D366]/60 flex items-center justify-center text-[#25D366] flex-shrink-0 shadow-lg">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold tracking-wider text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    WHATSAPP SUPPORT
                  </span>
                  <h3 className="font-serif text-base font-bold text-white mt-0.5">
                    WhatsApp Chat
                  </h3>
                </div>
              </div>

              <p className="text-xs text-[#a8a196] leading-relaxed">
                Direct phone assistance for verified buyers. Ask questions about orders, recipes, or Capitec proof.
              </p>

              <div className="bg-[#12100e] p-2.5 rounded-2xl border border-[#2b251f]">
                <span className="text-[9px] text-[#8e8578] uppercase font-bold tracking-wider block">
                  Official WhatsApp:
                </span>
                <p className="text-xs font-mono font-bold text-emerald-400">
                  {supportWhatsAppDisplay}
                </p>
              </div>
            </div>

            <a
              href={`https://api.whatsapp.com/send?phone=${supportWhatsAppRaw}&text=${encodeURIComponent(
                'Hi The Recipe Vault Co. Support! I need help with my recipe book / purchase order.'
              )}`}
              target="_blank"
              rel="noreferrer"
              className="w-full py-2.5 px-3 rounded-xl font-bold text-xs bg-[#25D366] hover:bg-[#20ba59] text-white shadow-lg transition-all flex items-center justify-center gap-1.5 active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>

          {/* Telegram VIP 1-on-1 Concierge */}
          <div className="bg-[#171411] border border-sky-500/40 rounded-3xl p-5 space-y-4 shadow-xl relative overflow-hidden group flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-sky-500/20 border border-sky-400/60 flex items-center justify-center text-sky-400 flex-shrink-0 shadow-lg">
                  <SendHorizontal className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold tracking-wider text-sky-400 bg-sky-950/80 px-2 py-0.5 rounded-full border border-sky-500/30">
                    INSTANT 1-ON-1 • TELEGRAM
                  </span>
                  <h3 className="font-serif text-base font-bold text-white mt-0.5">
                    Telegram VIP Concierge
                  </h3>
                </div>
              </div>

              <p className="text-xs text-[#a8a196] leading-relaxed">
                Connect directly with the chef on Telegram. Instant order assistance, unlock keys, and cooking advice.
              </p>

              <div className="bg-[#12100e] p-2.5 rounded-2xl border border-[#2b251f]">
                <span className="text-[9px] text-[#8e8578] uppercase font-bold tracking-wider block">
                  Official Telegram:
                </span>
                <p className="text-xs font-mono font-bold text-sky-400">
                  @{telegramUsername}
                </p>
              </div>
            </div>

            <a
              href={`https://t.me/${telegramUsername}`}
              target="_blank"
              rel="noreferrer"
              className="w-full py-2.5 px-3 rounded-xl font-bold text-xs bg-gradient-to-r from-sky-500 to-blue-600 hover:brightness-110 text-white shadow-lg shadow-sky-950/50 transition-all flex items-center justify-center gap-1.5 active:scale-95"
            >
              <SendHorizontal className="w-4 h-4" />
              <span>Chat on Telegram</span>
            </a>
          </div>

          {/* Email Support */}
          <div className="bg-[#171411] border border-[#382f25] rounded-3xl p-5 space-y-4 shadow-xl relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#cf7b3e]/20 border border-[#cf7b3e]/60 flex items-center justify-center text-[#dea374] flex-shrink-0 shadow-lg">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold tracking-wider text-[#dea374] bg-[#29221b] px-2 py-0.5 rounded-full border border-[#cf7b3e]/30">
                    DIRECT EMAIL
                  </span>
                  <h3 className="font-serif text-base font-bold text-white mt-0.5">
                    Email Support
                  </h3>
                </div>
              </div>

              <p className="text-xs text-[#a8a196] leading-relaxed">
                Traditional email for accounting, dispute resolution, and general feedback.
              </p>

              <div className="bg-[#12100e] p-2.5 rounded-2xl border border-[#2b251f]">
                <span className="text-[9px] text-[#8e8578] uppercase font-bold tracking-wider block">
                  Support Email:
                </span>
                <p className="text-xs font-mono font-bold text-[#dea374] truncate">
                  {supportEmail}
                </p>
              </div>
            </div>

            <div className="flex gap-1.5">
              <a
                href={`mailto:${supportEmail}?subject=The%20Recipe%20Vault%20Support%20Request`}
                className="flex-1 py-2.5 px-2 rounded-xl font-bold text-xs bg-gradient-to-r from-[#cf7b3e] to-[#b8612b] hover:brightness-110 text-white shadow-lg transition-all flex items-center justify-center gap-1.5 active:scale-95"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Open Email</span>
              </a>

              <button
                type="button"
                onClick={handleCopyEmail}
                className="px-2.5 py-2.5 rounded-xl bg-[#241d17] hover:bg-[#32271e] border border-[#3e3226] text-xs font-semibold text-[#c2bcaf] hover:text-white transition-all"
                title="Copy email address"
              >
                {copiedEmail ? 'Copied ✓' : 'Copy'}
              </button>
            </div>
          </div>
        </div>

        {/* Support Inquiry Form */}
        <div className="bg-[#171411] border border-[#30271f] rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl">
          <div className="border-b border-[#29221b] pb-4">
            <h2 className="font-serif text-xl font-bold text-white">
              Send a Priority Support Message
            </h2>
            <p className="text-xs text-[#a8a196] mt-0.5">
              Fill in your details below and our concierge team will follow up directly.
            </p>
          </div>

          {submitted ? (
            <div className="bg-emerald-950/60 border border-emerald-500/50 rounded-2xl p-6 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h3 className="font-serif font-bold text-white text-base">
                {sentViaTelegram ? 'Message Delivered to Telegram Concierge!' : 'Support Message Prepared'}
              </h3>
              <p className="text-xs text-[#a8a196] max-w-md mx-auto">
                {sentViaTelegram ? (
                  <>
                    Your message was transmitted in real time directly to our Telegram support desk. We will respond to <strong>{email}</strong> or on Telegram shortly.
                  </>
                ) : (
                  <>
                    Your email client was opened to send your inquiry to <strong>{supportEmail}</strong>. If you need immediate assistance, message us on WhatsApp at <strong>{supportWhatsAppDisplay}</strong> or on Telegram at <strong>@{telegramUsername}</strong>.
                  </>
                )}
              </p>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#c4bcae] mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Morgan"
                    className="w-full bg-[#120f0d] border border-[#382e23] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#686055] focus:outline-none focus:border-[#cf7b3e]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#c4bcae] mb-1">
                    Your Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="chef@example.com"
                    className="w-full bg-[#120f0d] border border-[#382e23] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#686055] focus:outline-none focus:border-[#cf7b3e]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#c4bcae] mb-1">
                  Access Token or Order Reference (Optional)
                </label>
                <input
                  type="text"
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value.toUpperCase())}
                  placeholder="e.g. RV-XXXX-XXXX (from your purchase confirmation)"
                  className="w-full bg-[#120f0d] border border-[#382e23] rounded-xl px-3.5 py-2.5 text-xs font-mono text-white placeholder-[#686055] focus:outline-none focus:border-[#cf7b3e]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#c4bcae] mb-1">
                  How can we help you? *
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your question or issue in detail..."
                  className="w-full bg-[#120f0d] border border-[#382e23] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#686055] focus:outline-none focus:border-[#cf7b3e]"
                />
              </div>

              <button
                type="submit"
                disabled={isSending}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#cf7b3e] to-[#b8612b] hover:brightness-110 text-white font-bold text-xs sm:text-sm shadow-lg shadow-[#cf7b3e]/30 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
              >
                {isSending ? (
                  <span>Transmitting Priority Message...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Support Message (Direct to Telegram &amp; Email)</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Frequently Asked Questions */}
        <div className="bg-[#14110e] border border-[#2b241c] rounded-3xl p-6 sm:p-7 space-y-4">
          <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#dea374]" />
            <span>Buyer Quick Help &amp; FAQs</span>
          </h3>

          <div className="space-y-3 text-xs text-[#b8b0a5] leading-relaxed">
            <div className="bg-[#1b1713] p-3.5 rounded-2xl border border-[#2c241c]">
              <strong className="text-white block mb-1">
                How do I unlock my book on another device or tablet?
              </strong>
              Enter your permanent <code>RV-...</code> access token into the unlock box in the reader or My Paid Books page. Your token never expires.
            </div>

            <div className="bg-[#1b1713] p-3.5 rounded-2xl border border-[#2c241c]">
              <strong className="text-white block mb-1">
                Can I print the recipes for kitchen use?
              </strong>
              Yes! Once unlocked, every recipe card and grocery checklist can be printed with 1 click using the Print button on your phone, iPad, or computer.
            </div>

            <div className="bg-[#1b1713] p-3.5 rounded-2xl border border-[#2c241c]">
              <strong className="text-white block mb-1">
                South African Capitec / Instant EFT verification:
              </strong>
              If you paid via Capitec Pay or cellphone banking to <strong>084 344 1313</strong>, tap the <strong>"WhatsApp Proof"</strong> button to send your reference and receive instant confirmation.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
