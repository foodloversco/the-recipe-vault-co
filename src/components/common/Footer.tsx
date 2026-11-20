import React from 'react';
import { APP_SUBHEADING } from '../../data/initialBooks';
import { ShieldCheck, Download, Printer, Smartphone, DollarSign } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0b0a09] border-t border-[#262320] text-[#a09a90] py-12 px-4 sm:px-6 mt-16">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-[#211f1c]">
          <div className="flex items-center gap-3">
            <img 
              src="/assets/images/logo.png" 
              alt="The Recipe Vault Co." 
              className="w-12 h-12 object-contain rounded-xl border border-[#cf7b3e]/30 p-1 bg-[#181614]" 
            />
            <div>
              <h3 className="font-serif text-xl font-bold text-white tracking-wide">
                The Recipe Vault Co.
              </h3>
              <p className="text-xs text-[#cf7b3e]">
                Authentic Global Cuisines • Open-Fire Grilling • Timeless Heritage
              </p>
            </div>
          </div>

          {/* Value Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="flex items-center gap-2 bg-[#171513] px-3 py-2 rounded-lg border border-[#2b2723]">
              <Smartphone className="w-4 h-4 text-[#dea374]" />
              <span>Phone-Ready (360x600)</span>
            </div>
            <div className="flex items-center gap-2 bg-[#171513] px-3 py-2 rounded-lg border border-[#2b2723]">
              <Printer className="w-4 h-4 text-[#dea374]" />
              <span>Instant Printable Cards</span>
            </div>
            <div className="flex items-center gap-2 bg-[#171513] px-3 py-2 rounded-lg border border-[#2b2723]">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>Secure PayPal in USD</span>
            </div>
            <div className="flex items-center gap-2 bg-[#171513] px-3 py-2 rounded-lg border border-[#2b2723]">
              <ShieldCheck className="w-4 h-4 text-[#dea374]" />
              <span>5-Page Free Preview</span>
            </div>
          </div>
        </div>

        <div className="pt-6 text-xs leading-relaxed text-[#7e776e]">
          <p className="max-w-3xl mb-4 italic">
            "{APP_SUBHEADING}"
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-[#635d55]">
            <p>
              <a href="?view=admin" className="hover:text-[#cf7b3e] transition-colors" title="Vault Owner Access">©</a> {new Date().getFullYear()} The Recipe Vault Co. All rights reserved. Powered by Vercel &amp; Capacitor.
            </p>
            <p>Designed for mobile phone culinary reading & offline kitchen access.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

