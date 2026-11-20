import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  SlidersHorizontal,
  Heart,
  BookOpen,
  ShoppingBag,
  Menu,
  X,
  MessageCircle,
  Sparkles,
} from 'lucide-react';
import { currencyStore, CurrencyCode } from '../../services/currencyStore';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string, slug?: string) => void;
  unlockedCount: number;
  favoritesCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  unlockedCount,
  favoritesCount,
}) => {
  const [currency, setCurrency] = useState<CurrencyCode>(currencyStore.getCurrency());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    return currencyStore.subscribe((cur) => {
      setCurrency(cur);
    });
  }, []);

  const handleNavClick = (view: string) => {
    setIsMobileMenuOpen(false);
    onNavigate(view);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#121110]/95 backdrop-blur-md border-b border-[#2a2724] px-2.5 sm:px-6 py-2 sm:py-3 transition-all">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-1.5 sm:gap-2">
        {/* Brand Logo & Name */}
        <div
          onClick={() => handleNavClick('landing')}
          className="flex items-center gap-1.5 sm:gap-3 cursor-pointer group min-w-0"
        >
          <img
            src="/assets/images/logo.png"
            alt="The Recipe Vault Co."
            className="w-8 h-8 sm:w-10 sm:h-10 object-contain rounded-lg border border-[#cf7b3e]/30 shadow-md group-hover:border-[#cf7b3e] transition-all flex-shrink-0"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <span className="font-serif tracking-wider text-xs sm:text-base md:text-xl font-bold text-white group-hover:text-[#dea374] transition-colors leading-tight truncate">
                The Recipe Vault Co.
              </span>
              <span className="text-[8px] sm:text-[10px] uppercase font-bold tracking-widest px-1 py-0.5 rounded bg-[#cf7b3e]/20 text-[#dea374] border border-[#cf7b3e]/30 flex-shrink-0">
                PRO
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-[#a39c94] hidden lg:block">
              Collectible Digital Recipe Card Packs &amp; Checklists
            </p>
          </div>
        </div>

        {/* Currency Switcher & Navigation */}
        <div className="flex items-center gap-1 sm:gap-2.5 flex-shrink-0">
          {/* Country / Currency Flag Switcher (Always visible on mobile & desktop) */}
          <div className="flex items-center bg-[#171513] border border-[#302b25] rounded-full p-0.5 shadow-inner">
            <button
              type="button"
              onClick={() => currencyStore.setCurrency('USD')}
              title="USA & International: Pay with PayPal in USD ($1.00)"
              className={`flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-bold transition-all ${
                currency === 'USD'
                  ? 'bg-[#cf7b3e] text-white shadow-md'
                  : 'text-[#9c9388] hover:text-white'
              }`}
            >
              <span className="text-xs sm:text-sm leading-none">🇺🇸</span>
              <span className="text-[9px] sm:text-[11px] leading-none">$1</span>
            </button>

            <button
              type="button"
              onClick={() => currencyStore.setCurrency('ZAR')}
              title="South Africa: Pay with Capitec / Card in ZAR (R20)"
              className={`flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-bold transition-all ${
                currency === 'ZAR'
                  ? 'bg-emerald-700 text-white shadow-md'
                  : 'text-[#9c9388] hover:text-white'
              }`}
            >
              <span className="text-xs sm:text-sm leading-none">🇿🇦</span>
              <span className="text-[9px] sm:text-[11px] leading-none">R20</span>
            </button>
          </div>

          {/* Desktop Navigation Links (Hidden on small mobile screens to keep header ultra-clean) */}
          <nav className="hidden md:flex items-center gap-2">
            <button
              onClick={() => handleNavClick('landing')}
              className={`px-3 py-1.5 text-xs sm:text-sm rounded-full font-medium transition-all ${
                currentView === 'landing'
                  ? 'bg-[#2a2724] text-white border border-[#cf7b3e]/40'
                  : 'text-[#c2bcaf] hover:text-white hover:bg-[#1e1c19]'
              }`}
            >
              Catalog
            </button>

            {/* My Paid Books Page Button */}
            <button
              onClick={() => handleNavClick('paid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm rounded-full font-medium transition-all ${
                currentView === 'paid'
                  ? 'bg-emerald-700 text-white border border-emerald-400/50 shadow-lg'
                  : unlockedCount > 0
                  ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60'
                  : 'bg-[#1d1a17] text-[#c2bcaf] border border-[#302b25] hover:text-white'
              }`}
            >
              {unlockedCount > 0 ? (
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <BookOpen className="w-3.5 h-3.5 text-[#dea374]" />
              )}
              <span>My Paid Books ({unlockedCount})</span>
            </button>

            {/* Favorites & Wishlist Button */}
            <button
              onClick={() => handleNavClick('favorites')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm rounded-full font-medium transition-all ${
                currentView === 'favorites'
                  ? 'bg-rose-600 text-white border border-rose-400/50 shadow-lg'
                  : 'bg-[#1d1a17] text-[#f3d1d8] border border-rose-500/30 hover:bg-rose-950/50'
              }`}
            >
              <Heart
                className={`w-3.5 h-3.5 ${
                  currentView === 'favorites' || favoritesCount > 0
                    ? 'text-rose-400 fill-rose-400'
                    : 'text-rose-400'
                }`}
              />
              <span>Wishlist ({favoritesCount})</span>
            </button>

            {/* Grocery Shopping Lists Button */}
            <button
              onClick={() => handleNavClick('groceries')}
              title="In-Store Grocery Shopping Checklists"
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm rounded-full font-medium transition-all ${
                currentView === 'groceries'
                  ? 'bg-emerald-700 text-white border border-emerald-400/50 shadow-lg'
                  : 'bg-[#1d1a17] text-emerald-400/90 border border-emerald-500/30 hover:bg-emerald-950/40'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <span>Groceries</span>
            </button>

            {/* Admin Portal Button */}
            {currentView === 'admin' && (
              <button
                onClick={() => handleNavClick('admin')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm rounded-full font-semibold bg-[#cf7b3e] text-white shadow-lg shadow-[#cf7b3e]/30 transition-all"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Admin</span>
              </button>
            )}
          </nav>

          {/* Mobile Hamburger Menu Toggle Button (Visible strictly on small mobile screens) */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden relative p-2 rounded-xl bg-[#1c1a17] hover:bg-[#282420] border border-[#383129] text-[#e3ded6] hover:text-white transition-all active:scale-95"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5 text-[#dea374]" />
            ) : (
              <Menu className="w-5 h-5 text-[#dea374]" />
            )}

            {/* Unlocked / Wishlist Notification Badge */}
            {(unlockedCount > 0 || favoritesCount > 0) && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-[#121110] animate-pulse" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Slide-Down Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-2 pt-2 border-t border-[#26221d] animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-2 gap-2 pb-2">
            <button
              onClick={() => handleNavClick('landing')}
              className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold transition-all ${
                currentView === 'landing'
                  ? 'bg-[#29241f] text-white border border-[#cf7b3e]/40'
                  : 'bg-[#181613] text-[#c2bcaf] hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#cf7b3e]" />
              <span>All Catalog</span>
            </button>

            <button
              onClick={() => handleNavClick('paid')}
              className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold transition-all ${
                currentView === 'paid'
                  ? 'bg-emerald-900/80 text-white border border-emerald-500/50'
                  : 'bg-[#181613] text-[#c2bcaf] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <span>My Books</span>
              </div>
              <span className="px-1.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                {unlockedCount}
              </span>
            </button>

            <button
              onClick={() => handleNavClick('favorites')}
              className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold transition-all ${
                currentView === 'favorites'
                  ? 'bg-rose-950/80 text-white border border-rose-500/50'
                  : 'bg-[#181613] text-[#c2bcaf] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-400" />
                <span>Wishlist</span>
              </div>
              <span className="px-1.5 py-0.5 rounded-full bg-rose-950 text-rose-300 text-[10px] font-bold border border-rose-500/30">
                {favoritesCount}
              </span>
            </button>

            <button
              onClick={() => handleNavClick('groceries')}
              className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold transition-all ${
                currentView === 'groceries'
                  ? 'bg-emerald-900/80 text-white border border-emerald-500/50'
                  : 'bg-[#181613] text-emerald-400 hover:text-white'
              }`}
            >
              <ShoppingBag className="w-4 h-4 text-emerald-400" />
              <span>Groceries</span>
            </button>
          </div>

          <div className="pt-2 border-t border-[#231f1a] flex items-center justify-between text-xs text-[#9c9388] px-1">
            <a
              href="https://api.whatsapp.com/send?phone=27843441313&text=Hi%20The%20Recipe%20Vault%20Co%20Support%2C%20I%20have%20a%20question%20or%20need%20help"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-semibold py-1"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp VIP Support</span>
            </a>

            {currentView === 'admin' && (
              <button
                onClick={() => handleNavClick('admin')}
                className="flex items-center gap-1 text-[#dea374] font-semibold py-1"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Publisher Admin</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
