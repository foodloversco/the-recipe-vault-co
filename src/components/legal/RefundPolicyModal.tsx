import React from 'react';
import { X, RefreshCw, ShieldCheck, CheckCircle2, Truck, Mail, Phone, CreditCard } from 'lucide-react';

interface RefundPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RefundPolicyModal: React.FC<RefundPolicyModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-[#171412] border border-[#382f25] rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl relative text-[#f5f2eb]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#2d251d] flex items-center justify-between bg-[#1f1a15]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#cf7b3e]/20 border border-[#cf7b3e]/60 flex items-center justify-center text-[#dea374] flex-shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#dea374] bg-[#29221b] px-2 py-0.5 rounded-full border border-[#cf7b3e]/30">
                PINTEREST &amp; GOOGLE MERCHANT POLICY
              </span>
              <h2 className="font-serif text-lg sm:text-xl font-bold text-white mt-0.5 leading-tight">
                Refund, Return &amp; Delivery Policy
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#999] hover:text-white bg-[#26201a] hover:bg-[#332b23] border border-[#3b3227] transition-all"
            aria-label="Close Refund Policy"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Policy Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6 text-xs text-[#c4bcae] leading-relaxed">
          <div className="bg-[#1f1a15] p-3.5 rounded-2xl border border-[#332a20] flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#a8a196]">
            <span><strong>Brand:</strong> The Recipe Vault Co.</span>
            <span><strong>Products:</strong> Digital Recipe Card Collections &amp; Cookbooks</span>
            <span><strong>Delivery:</strong> Instant Digital Download ($0.00 Shipping)</span>
          </div>

          {/* Section 1: Digital Delivery Policy */}
          <section className="space-y-2">
            <h3 className="font-serif text-sm font-bold text-white flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#cf7b3e]" />
              <span>1. Digital Delivery &amp; Shipping Policy</span>
            </h3>
            <p>
              All products sold on <strong>The Recipe Vault Co.</strong> (including <em>South African Braai &amp; Heritage Series 1</em> and <em>Series 2</em>) are <strong>digital goods (phone-ready PDF recipe books, grocery checklists, and in-app 3D flip readers)</strong>.
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Zero Shipping Fees:</strong> There are no physical shipping charges or physical courier shipments. Shipping fee is <strong>$0.00 / Free</strong> worldwide.</li>
              <li><strong>Instant Delivery:</strong> Immediately upon successful payment through PayPal, Credit Card, or Capitec Pay, access is unlocked instantly in your browser and phone app. A high-resolution printable PDF download link is immediately provided on screen.</li>
              <li><strong>Lifetime Cloud Access:</strong> Your purchased books can be restored at any time using your checkout email address or unlock token on the "My Paid Books" tab.</li>
            </ul>
          </section>

          {/* Section 2: Refund & Satisfaction Policy */}
          <section className="space-y-2">
            <h3 className="font-serif text-sm font-bold text-white flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-[#cf7b3e]" />
              <span>2. 14-Day Customer Satisfaction &amp; Refund Guarantee</span>
            </h3>
            <p>
              We want you to be completely delighted with every recipe. While digital products are accessible immediately upon checkout, we stand behind the quality of our content with a <strong>14-day customer support and refund guarantee</strong> under the following circumstances:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Accidental Duplicate Charges:</strong> If you were accidentally charged twice for the same book, we will issue a full refund for the duplicate transaction within 24–48 hours.</li>
              <li><strong>Technical Access Failure:</strong> If you experience any technical defect preventing you from accessing, reading, or downloading your purchased PDF after contacting our support, and we cannot resolve the issue, you are entitled to a 100% full refund.</li>
              <li><strong>Content Discrepancy:</strong> If the delivered digital cards do not match the published chapter description or recipe count shown on the product page.</li>
            </ul>
          </section>

          {/* Section 3: How to Request a Refund */}
          <section className="space-y-2">
            <h3 className="font-serif text-sm font-bold text-white flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#cf7b3e]" />
              <span>3. How to Request a Refund or Support</span>
            </h3>
            <p>
              To request assistance or a refund, simply send an email or Telegram message with your PayPal transaction ID or the email address used at checkout:
            </p>
            <div className="bg-[#12100e] p-4 rounded-xl border border-[#2b241c] space-y-1.5 text-xs text-white">
              <p><strong>Support Email:</strong> <a href="mailto:jraysoc05@gmail.com" className="text-[#dea374] underline">jraysoc05@gmail.com</a></p>
              <p><strong>Telegram Customer Service:</strong> <a href="https://t.me/RecipeVaultSales_bot" target="_blank" rel="noreferrer" className="text-sky-400 underline">@RecipeVaultSales_bot</a></p>
              <p><strong>Response Time:</strong> Within 12 to 24 hours</p>
            </div>
            <p className="text-[11px] text-[#8e8578]">
              Approved refunds are processed back to the original PayPal or Card payment method within 3–5 business days depending on your bank.
            </p>
          </section>

          {/* Section 4: Transparent Pricing & Currencies */}
          <section className="space-y-2">
            <h3 className="font-serif text-sm font-bold text-white flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#cf7b3e]" />
              <span>4. Currency &amp; Pricing Transparency</span>
            </h3>
            <p>
              All prices are transparently displayed before checkout:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Series 1:</strong> $1.00 USD / R20.00 ZAR</li>
              <li><strong>Series 2:</strong> $1.99 USD / R40.00 ZAR</li>
              <li>No recurring subscriptions, hidden fees, or auto-renewals. Each purchase is a one-time lifetime payment.</li>
            </ul>
          </section>

          {/* Compliance Badge */}
          <div className="p-3.5 rounded-2xl bg-[#1b1612] border border-[#cf7b3e]/30 flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-[#cf7b3e] flex-shrink-0" />
            <p className="text-[11px] text-[#c4bcae]">
              <strong>Merchant Compliance Notice:</strong> This policy complies with Pinterest Merchant Guidelines, Google Play Commerce Standards, and international consumer protection policies for digital content.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#29221b] bg-[#1a1612] flex items-center justify-between">
          <span className="text-[11px] text-[#888]">The Recipe Vault Co. • Secure Verified Merchant</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#cf7b3e] to-[#b8612b] text-white font-bold text-xs shadow-lg shadow-[#cf7b3e]/30 hover:brightness-110 active:scale-95 transition-all"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
