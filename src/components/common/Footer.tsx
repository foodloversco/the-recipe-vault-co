import React from 'react';
import { SendHorizontal } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0b0a09] border-t border-[#262320] text-[#a09a90] py-8 px-4 sm:px-6 mt-16">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <img 
            src="/assets/images/logo.png" 
            alt="The Recipe Vault Co." 
            className="w-9 h-9 object-contain rounded-xl border border-[#cf7b3e]/30 p-0.5 bg-[#181614]" 
          />
          <span className="font-serif text-base font-bold text-white tracking-wide">
            The Recipe Vault Co.
          </span>
        </div>

        {/* Essential Links */}
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-[#a39c92]">
          <a
            href="https://t.me/RecipeVaultSales_bot"
            target="_blank"
            rel="noreferrer"
            className="text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1.5 transition-colors"
          >
            <SendHorizontal className="w-3.5 h-3.5" />
            <span>Customer Service (Telegram)</span>
          </a>

          <a href="?view=contact" className="hover:text-white transition-colors">
            Contact Us
          </a>

          <a href="?view=terms" className="hover:text-white transition-colors">
            Terms &amp; Conditions
          </a>

          <a href="?view=privacy" className="hover:text-white transition-colors">
            Privacy Policy
          </a>

          <a href="?view=refund" className="hover:text-white transition-colors">
            Refund &amp; Return Policy
          </a>

          <a href="?view=refund" className="hover:text-white transition-colors">
            Digital Delivery ($0 Shipping)
          </a>
        </div>

        {/* Minimal Copyright */}
        <div className="text-[11px] text-[#635d55]">
          <a href="?view=admin" className="hover:text-[#cf7b3e] transition-colors" title="Vault Owner Access">©</a> {new Date().getFullYear()} All rights reserved.
        </div>
      </div>
    </footer>
  );
};
