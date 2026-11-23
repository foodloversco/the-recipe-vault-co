import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  CheckCircle2, 
  ArrowLeft,
  SendHorizontal,
  Send
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
  const [isSending, setIsSending] = useState(false);
  const [sentViaTelegram, setSentViaTelegram] = useState(false);
  const [telegramUsername, setTelegramUsername] = useState('RecipeVaultSales_bot');

  const supportEmail = 'jraysoc05@gmail.com';

  useEffect(() => {
    const config = telegramService.getConfig();
    if (config.username) {
      setTelegramUsername(config.username.replace('@', ''));
    }
  }, []);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !email.trim()) return;

    setIsSending(true);
    const sent = await telegramService.sendCustomerSupportInquiry(name, email, tokenInput, message);
    if (sent) {
      setSentViaTelegram(true);
    } else {
      const subject = encodeURIComponent(`Customer Service Request from ${name || 'Customer'}`);
      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\nOrder/Token: ${tokenInput}\n\nMessage:\n${message}`
      );
      window.open(`mailto:${supportEmail}?subject=${subject}&body=${body}`, '_blank');
    }
    setIsSending(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#0e0c0a] text-[#f5f2eb] py-8 px-4 sm:px-6">
      <div className="max-w-xl mx-auto space-y-6">
        {/* Back Button */}
        <button
          type="button"
          onClick={onBackToCatalog}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1e1914] hover:bg-[#2b241e] text-xs font-semibold text-[#dea374] border border-[#3b3126] transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        {/* Simple Header */}
        <div className="text-center space-y-2">
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Customer Service
          </h1>
          <p className="text-xs text-[#a8a196]">
            Connect with support directly via Telegram or send a message below.
          </p>
        </div>

        {/* Telegram Direct Action Button */}
        <div className="bg-[#171411] border border-sky-500/40 rounded-3xl p-5 sm:p-6 text-center space-y-3 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-sky-500/20 border border-sky-400/60 flex items-center justify-center text-sky-400 mx-auto shadow-lg">
            <SendHorizontal className="w-6 h-6" />
          </div>

          <div>
            <h2 className="font-serif text-lg font-bold text-white">
              Instant Chat on Telegram
            </h2>
            <p className="text-xs text-[#a8a196] mt-0.5">
              Fastest response for order assistance, access keys, or questions.
            </p>
          </div>

          <a
            href={`https://t.me/${telegramUsername}`}
            target="_blank"
            rel="noreferrer"
            className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-sky-500 to-blue-600 hover:brightness-110 text-white shadow-lg shadow-sky-950/50 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <SendHorizontal className="w-4 h-4" />
            <span>Open Telegram Chat</span>
          </a>
        </div>

        {/* Direct Message Form */}
        <div className="bg-[#171411] border border-[#30271f] rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
          <h3 className="font-serif text-base font-bold text-white">
            Send a Direct Message
          </h3>

          {submitted ? (
            <div className="bg-emerald-950/60 border border-emerald-500/50 rounded-2xl p-5 text-center space-y-1.5">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <h4 className="font-serif font-bold text-white text-sm">
                Message Sent
              </h4>
              <p className="text-xs text-[#a8a196]">
                {sentViaTelegram 
                  ? 'Your inquiry was delivered directly to Customer Service on Telegram. We will reply shortly.'
                  : `Your email client was opened to send your inquiry to ${supportEmail}.`}
              </p>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#c4bcae] mb-1 font-medium">Your Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full bg-[#120f0d] border border-[#382e23] rounded-xl px-3 py-2 text-white placeholder-[#686055] focus:outline-none focus:border-[#cf7b3e]"
                  />
                </div>

                <div>
                  <label className="block text-[#c4bcae] mb-1 font-medium">Your Email *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full bg-[#120f0d] border border-[#382e23] rounded-xl px-3 py-2 text-white placeholder-[#686055] focus:outline-none focus:border-[#cf7b3e]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#c4bcae] mb-1 font-medium">Order Reference / Token (optional)</label>
                <input
                  type="text"
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  placeholder="e.g. RV-XXXX-XXXX"
                  className="w-full bg-[#120f0d] border border-[#382e23] rounded-xl px-3 py-2 text-white placeholder-[#686055] focus:outline-none focus:border-[#cf7b3e]"
                />
              </div>

              <div>
                <label className="block text-[#c4bcae] mb-1 font-medium">Message *</label>
                <textarea
                  required
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can customer service help you?"
                  className="w-full bg-[#120f0d] border border-[#382e23] rounded-xl px-3 py-2 text-white placeholder-[#686055] focus:outline-none focus:border-[#cf7b3e]"
                />
              </div>

              <button
                type="submit"
                disabled={isSending}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#cf7b3e] to-[#b8612b] hover:brightness-110 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSending ? 'Sending...' : 'Send to Customer Service'}</span>
              </button>
            </form>
          )}

          {/* Email Fallback */}
          <div className="pt-2 text-center text-[11px] text-[#7d756b]">
            Prefer email? Reach us at{' '}
            <a href={`mailto:${supportEmail}`} className="text-[#dea374] hover:underline">
              {supportEmail}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
