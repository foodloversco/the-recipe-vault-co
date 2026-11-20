import React, { useState } from 'react';
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
  ArrowLeft
} from 'lucide-react';

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

  const supportEmail = 'jraysoc05@gmail.com';
  const supportWhatsAppDisplay = '+27 84 344 1313';
  const supportWhatsAppRaw = '27843441313';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(supportEmail);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !email.trim()) return;

    // Compose mailto as fallback / direct send
    const subject = encodeURIComponent(`The Recipe Vault Co. Support Request from ${name || 'Customer'}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nAccess Token (if any): ${tokenInput}\n\nMessage:\n${message}`
    );
    window.open(`mailto:${supportEmail}?subject=${subject}&body=${body}`, '_blank');
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

        {/* Quick Contact Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* WhatsApp Direct VIP Chat */}
          <div className="bg-[#171411] border border-emerald-500/40 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#25D366]/20 border border-[#25D366]/60 flex items-center justify-center text-[#25D366] flex-shrink-0 shadow-lg">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  FASTEST RESPONSE • WHATSAPP ONLY
                </span>
                <h3 className="font-serif text-lg font-bold text-white mt-1">
                  WhatsApp Direct Chat
                </h3>
              </div>
            </div>

            <p className="text-xs text-[#a8a196] leading-relaxed">
              Instant 1-on-1 assistance for verified buyers. Ask any question about your book, order receipt, or payment verification directly on WhatsApp.
            </p>

            <div className="bg-[#12100e] p-3 rounded-2xl border border-[#2b251f] space-y-1">
              <span className="text-[10px] text-[#8e8578] uppercase font-bold tracking-wider">
                Official Support Number (WhatsApp Only):
              </span>
              <p className="text-sm font-mono font-bold text-emerald-400">
                {supportWhatsAppDisplay}
              </p>
            </div>

            <a
              href={`https://api.whatsapp.com/send?phone=${supportWhatsAppRaw}&text=${encodeURIComponent(
                'Hi The Recipe Vault Co. Support! I need help with my recipe book / purchase order.'
              )}`}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-[#25D366] hover:bg-[#20ba59] text-white shadow-lg shadow-emerald-950/50 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat on WhatsApp (+27 84 344 1313)</span>
            </a>
          </div>

          {/* Email Support */}
          <div className="bg-[#171411] border border-[#382f25] rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl relative overflow-hidden">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#cf7b3e]/20 border border-[#cf7b3e]/60 flex items-center justify-center text-[#dea374] flex-shrink-0 shadow-lg">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#dea374] bg-[#29221b] px-2 py-0.5 rounded-full border border-[#cf7b3e]/30">
                  DIRECT EMAIL SUPPORT
                </span>
                <h3 className="font-serif text-lg font-bold text-white mt-1">
                  Email Support Team
                </h3>
              </div>
            </div>

            <p className="text-xs text-[#a8a196] leading-relaxed">
              Prefer traditional email? Send your transaction ID or query directly to our customer support inbox. We reply within 24 hours.
            </p>

            <div className="bg-[#12100e] p-3 rounded-2xl border border-[#2b251f] space-y-1">
              <span className="text-[10px] text-[#8e8578] uppercase font-bold tracking-wider">
                Support Email Address:
              </span>
              <p className="text-sm font-mono font-bold text-[#dea374] truncate">
                {supportEmail}
              </p>
            </div>

            <div className="flex gap-2">
              <a
                href={`mailto:${supportEmail}?subject=The%20Recipe%20Vault%20Support%20Request`}
                className="flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-[#cf7b3e] to-[#b8612b] hover:brightness-110 text-white shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <Mail className="w-4 h-4" />
                <span>Open Email App</span>
              </a>

              <button
                type="button"
                onClick={handleCopyEmail}
                className="px-3.5 py-3 rounded-xl bg-[#241d17] hover:bg-[#32271e] border border-[#3e3226] text-xs font-semibold text-[#c2bcaf] hover:text-white transition-all"
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
                Support Message Prepared
              </h3>
              <p className="text-xs text-[#a8a196] max-w-md mx-auto">
                Your email client was opened to send your inquiry to <strong>{supportEmail}</strong>. If you need immediate assistance, message us on WhatsApp at <strong>{supportWhatsAppDisplay}</strong>.
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
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#cf7b3e] to-[#b8612b] hover:brightness-110 text-white font-bold text-xs sm:text-sm shadow-lg shadow-[#cf7b3e]/30 transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Send Support Message</span>
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
