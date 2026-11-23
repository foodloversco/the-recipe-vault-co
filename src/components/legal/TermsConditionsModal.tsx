import React from 'react';
import { X, FileText, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface TermsConditionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TermsConditionsModal: React.FC<TermsConditionsModalProps> = ({
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
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#dea374] bg-[#29221b] px-2 py-0.5 rounded-full border border-[#cf7b3e]/30">
                GOOGLE PLAY COMPLIANT LEGAL TERMS
              </span>
              <h2 className="font-serif text-lg sm:text-xl font-bold text-white mt-0.5 leading-tight">
                Terms &amp; Conditions
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#999] hover:text-white bg-[#26201a] hover:bg-[#332b23] border border-[#3b3227] transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Terms Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6 text-xs text-[#c4bcae] leading-relaxed">
          <div className="bg-[#1f1a15] p-3.5 rounded-2xl border border-[#332a20] flex items-center justify-between text-[11px] text-[#a8a196]">
            <span><strong>Effective:</strong> January 2026</span>
            <span><strong>Platform:</strong> The Recipe Vault Co. Mobile &amp; Web App</span>
            <span><strong>Contact:</strong> jraysoc05@gmail.com</span>
          </div>

          {/* Section 1 */}
          <div className="space-y-2">
            <h3 className="font-serif text-base font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#28211b] text-[#dea374] flex items-center justify-center text-xs font-mono">1</span>
              <span>Agreement to Terms</span>
            </h3>
            <p>
              By accessing, browsing, or purchasing digital recipe collections through The Recipe Vault Co. application, you agree to be bound by these Terms and Conditions and our Privacy Policy. If you do not agree with any part of these terms, please do not use the application.
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-2">
            <h3 className="font-serif text-base font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#28211b] text-[#dea374] flex items-center justify-center text-xs font-mono">2</span>
              <span>Digital License &amp; Usage Rights</span>
            </h3>
            <p>
              Upon successful purchase, The Recipe Vault Co. grants you a non-exclusive, non-transferable, revocable personal license to view, flip, read, and print the digital recipe card collection and grocery checklists for personal, non-commercial culinary use.
            </p>
            <p>
              You may not resell, redistribute, sub-license, bulk-upload to public repositories, or commercially exploit any PDF, card artwork, or recipe text without prior written consent.
            </p>
          </div>

          {/* Section 3 */}
          <div className="space-y-2">
            <h3 className="font-serif text-base font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#28211b] text-[#dea374] flex items-center justify-center text-xs font-mono">3</span>
              <span>Instant Digital Delivery &amp; Token Access</span>
            </h3>
            <p>
              Our collections are 100% digital products. Access is granted instantly in-app upon transaction completion via a permanent <code>RV-...</code> access token and verified email confirmation.
            </p>
          </div>

          {/* Section 4 */}
          <div className="space-y-2">
            <h3 className="font-serif text-base font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#28211b] text-[#dea374] flex items-center justify-center text-xs font-mono">4</span>
              <span>Pricing, Currencies &amp; Refund Policy</span>
            </h3>
            <p>
              Prices are clearly listed in US Dollars ($1.00 USD) and South African Rand (R20.00 ZAR). Due to the immediate delivery of digital goods, orders are non-refundable once unlocked; however, if you experience any technical defect, token error, or accidental duplicate payment, contact <strong>jraysoc05@gmail.com</strong> or Telegram <strong>@RecipeVaultSales_bot</strong> for prompt token replacement or dispute resolution.
            </p>
          </div>

          {/* Section 5 */}
          <div className="space-y-2">
            <h3 className="font-serif text-base font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#28211b] text-[#dea374] flex items-center justify-center text-xs font-mono">5</span>
              <span>Kitchen Safety &amp; Allergen Disclaimer</span>
            </h3>
            <p>
              Our recipes include instructions for open-fire cooking, braai embers, high-heat grilling, and handling meat, seafood, and dairy. You are solely responsible for ensuring proper food safety, safe grill clearance, cooking meat to safe internal temperatures, and verifying potential allergens (e.g. shellfish, nuts, dairy, gluten) for yourself and your guests.
            </p>
          </div>

          {/* Section 6 */}
          <div className="space-y-2">
            <h3 className="font-serif text-base font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#28211b] text-[#dea374] flex items-center justify-center text-xs font-mono">6</span>
              <span>Intellectual Property</span>
            </h3>
            <p>
              All trademarks, logos, photography, recipe phrasing, and brand assets displayed in the application are the proprietary property of The Recipe Vault Co. and its creator.
            </p>
          </div>

          {/* Section 7 */}
          <div className="space-y-2">
            <h3 className="font-serif text-base font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#28211b] text-[#dea374] flex items-center justify-center text-xs font-mono">7</span>
              <span>Customer Care &amp; Inquiries</span>
            </h3>
            <div className="bg-[#120f0d] p-3.5 rounded-2xl border border-[#2b241c] space-y-1 font-mono text-xs">
              <p className="text-white">The Recipe Vault Co.</p>
              <p className="text-[#dea374]">Support Email: jraysoc05@gmail.com</p>
              <p className="text-sky-400">Telegram Care: @RecipeVaultSales_bot</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#2b241c] flex items-center justify-between bg-[#191512]">
          <span className="text-[11px] text-[#8e8578]">
            The Recipe Vault Co. • All rights reserved
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#cf7b3e] hover:bg-[#b8612b] text-white text-xs font-bold transition-all"
          >
            Agree &amp; Close
          </button>
        </div>
      </div>
    </div>
  );
};
