import React from 'react';
import { SendHorizontal } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0b0a09] border-t border-[#1e1c19] text-[#8e877e] py-6 px-4 sm:px-6 mt-10">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <img 
            src="/assets/images/logo.png" 
            alt="The Recipe Vault Co." 
            className="w-7 h-7 object-contain rounded-lg border border-[#cf7b3e]/30 p-0.5 bg-[#181614]" 
          />
          <span className="font-serif font-bold text-white text-sm tracking-wide">
            The Recipe Vault Co.
          </span>
        </div>

        {/* Clean Essential Links Only */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-xs text-[#a0988e]">
          <a
            href="https://t.me/RecipeVaultSales_bot"
            target="_blank"
            rel="noreferrer"
            className="text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1 transition-colors"
          >
            <SendHorizontal className="w-3.5 h-3.5" />
            <span>Customer Service</span>
          </a>

          <span className="text-[#3a352e] hidden sm:inline">•</span>

          <a href="?view=terms" className="hover:text-white transition-colors">
            Terms &amp; Conditions
          </a>

          <span className="text-[#3a352e] hidden sm:inline">•</span>

          <a href="?view=privacy" className="hover:text-white transition-colors">
            Privacy Policy
          </a>

          <span className="text-[#3a352e] hidden sm:inline">•</span>

          <a href="?view=refund" className="hover:text-white transition-colors">
            Refund &amp; Delivery Policy
          </a>
        </div>

        {/* Minimal Copyright */}
        <div className="text-[11px] text-[#554f48]">
          <a href="?view=admin" className="hover:text-[#cf7b3e] transition-colors" title="Vault Owner Access">©</a> {new Date().getFullYear()}
        </div>
      </div>
    </footer>
  );
};
