import React from 'react';
import { X, ShieldCheck, Lock, FileText, Mail, CheckCircle2 } from 'lucide-react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({
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
            <div className="w-10 h-10 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400 flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-500/30">
                GOOGLE PLAY COMPLIANT LEGAL DOCUMENT
              </span>
              <h2 className="font-serif text-lg sm:text-xl font-bold text-white mt-0.5 leading-tight">
                Privacy Policy
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

        {/* Policy Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6 text-xs text-[#c4bcae] leading-relaxed">
          <div className="bg-[#1f1a15] p-3.5 rounded-2xl border border-[#332a20] flex items-center justify-between text-[11px] text-[#a8a196]">
            <span><strong>Effective Date:</strong> January 1, 2026</span>
            <span><strong>Last Updated:</strong> November 2026</span>
            <span><strong>App:</strong> The Recipe Vault Co.</span>
          </div>

          {/* Section 1 */}
          <div className="space-y-2">
            <h3 className="font-serif text-base font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#28211b] text-[#dea374] flex items-center justify-center text-xs font-mono">1</span>
              <span>Overview &amp; Developer Identity</span>
            </h3>
            <p>
              The Recipe Vault Co. ("we," "our," or "us") provides collectible digital cookbook collections, grocery checklists, and culinary flip readers. We are committed to protecting your personal data in strict compliance with Google Play Developer Program Policies, the General Data Protection Regulation (GDPR), and the South African Protection of Personal Information Act (POPIA).
            </p>
            <p>
              Official Developer Contact: <strong>jraysoc05@gmail.com</strong> | Telegram Support: <strong>@RecipeVaultSales_bot</strong>.
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-2">
            <h3 className="font-serif text-base font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#28211b] text-[#dea374] flex items-center justify-center text-xs font-mono">2</span>
              <span>Information We Collect</span>
            </h3>
            <p>
              We collect minimal information strictly necessary to provide and license your digital purchases:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2 text-[#dbd5cb]">
              <li><strong>Email Address:</strong> Provided during checkout to deliver your digital receipt, transaction verification, and permanent <code>RV-...</code> access key.</li>
              <li><strong>Customer Name (Optional):</strong> Used to personalize your purchase confirmation and digital chef license.</li>
              <li><strong>Local Device Storage (Cache):</strong> Stores your unlocked collection tokens, checked grocery items, and favorites locally on your device for seamless offline kitchen access.</li>
            </ul>
            <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-xl text-emerald-300 text-[11px]">
              ✓ We do <strong>NOT</strong> access your precise GPS location, contacts, camera, microphone, or external storage beyond saving your downloaded recipe PDF.
            </div>
          </div>

          {/* Section 3 */}
          <div className="space-y-2">
            <h3 className="font-serif text-base font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#28211b] text-[#dea374] flex items-center justify-center text-xs font-mono">3</span>
              <span>Secure Payment Processing</span>
            </h3>
            <p>
              All financial transactions are conducted exclusively through PCI-DSS Level 1 certified payment processors:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2 text-[#dbd5cb]">
              <li><strong>PayPal (USD):</strong> International buyers transact securely through PayPal's encrypted infrastructure.</li>
              <li><strong>Capitec Bank / South African Rails (ZAR):</strong> Compliant with South African Reserve Bank (SARB) regulations for domestic South African buyers.</li>
            </ul>
            <p className="italic">
              * The Recipe Vault Co. never views, stores, or processes your credit card numbers, CVVs, or bank login credentials on our servers.
            </p>
          </div>

          {/* Section 4 */}
          <div className="space-y-2">
            <h3 className="font-serif text-base font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#28211b] text-[#dea374] flex items-center justify-center text-xs font-mono">4</span>
              <span>Zero Data Selling Policy</span>
            </h3>
            <p>
              We do <strong>NOT</strong> sell, rent, lease, or monetize your personal information or email address to third-party data brokers, marketers, or advertisers under any circumstances.
            </p>
          </div>

          {/* Section 5 */}
          <div className="space-y-2">
            <h3 className="font-serif text-base font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#28211b] text-[#dea374] flex items-center justify-center text-xs font-mono">5</span>
              <span>Children's Privacy (COPPA &amp; Google Families)</span>
            </h3>
            <p>
              The Recipe Vault Co. is a general audience culinary application intended for home chefs, grillers, and cooking enthusiasts. We do not knowingly collect personal information from children under the age of 13.
            </p>
          </div>

          {/* Section 6 */}
          <div className="space-y-2">
            <h3 className="font-serif text-base font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#28211b] text-[#dea374] flex items-center justify-center text-xs font-mono">6</span>
              <span>Your Rights &amp; Data Deletion</span>
            </h3>
            <p>
              You may request immediate and complete deletion of your customer email and order record from our registry at any time by emailing <strong>jraysoc05@gmail.com</strong> with the subject line <em>"Data Deletion Request"</em>. Requests are fulfilled within 48 hours.
            </p>
          </div>

          {/* Section 7 */}
          <div className="space-y-2">
            <h3 className="font-serif text-base font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#28211b] text-[#dea374] flex items-center justify-center text-xs font-mono">7</span>
              <span>Contact Us</span>
            </h3>
            <div className="bg-[#120f0d] p-3.5 rounded-2xl border border-[#2b241c] space-y-1 font-mono text-xs">
              <p className="text-white">The Recipe Vault Co. Support</p>
              <p className="text-[#dea374]">Email: jraysoc05@gmail.com</p>
              <p className="text-sky-400">Telegram: @RecipeVaultSales_bot</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#2b241c] flex items-center justify-between bg-[#191512]">
          <span className="text-[11px] text-[#8e8578]">
            Compliant with Google Play Developer Policy Standards
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#cf7b3e] hover:bg-[#b8612b] text-white text-xs font-bold transition-all"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
