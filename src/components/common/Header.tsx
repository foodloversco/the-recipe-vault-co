import React from 'react';
import { ShieldCheck, SlidersHorizontal, Heart, BookOpen } from 'lucide-react';

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
  return (
    <header className="sticky top-0 z-40 bg-[#121110]/95 backdrop-blur-md border-b border-[#2a2724] px-4 py-3 sm:px-6">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
        {/* Brand Logo & Name */}
        <div
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <img
            src="/assets/images/logo.png"
            alt="The Recipe Vault Co."
            className="w-10 h-10 object-contain rounded-lg border border-[#cf7b3e]/30 shadow-md group-hover:border-[#cf7b3e] transition-all"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-serif tracking-wider text-base sm:text-xl font-bold text-white group-hover:text-[#dea374] transition-colors">
                The Recipe Vault Co.
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-[#cf7b3e]/20 text-[#dea374] border border-[#cf7b3e]/30">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-[#a39c94] hidden md:block">
              Collectible Digital Recipe Card Packs &amp; Checklists
            </p>
          </div>
        </div>

        {/* Navigation Actions */}
        <nav className="flex items-center gap-1.5 sm:gap-2.5 flex-wrap justify-end">
          <button
            onClick={() => onNavigate('landing')}
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
            onClick={() => onNavigate('paid')}
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
            onClick={() => onNavigate('favorites')}
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
            <span className="hidden sm:inline">Favorites &amp; Wishlist</span>
            <span className="sm:hidden">Wishlist</span>
            <span>({favoritesCount})</span>
          </button>

          <button
            onClick={() => onNavigate('admin')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm rounded-full font-semibold transition-all ${
              currentView === 'admin'
                ? 'bg-[#cf7b3e] text-white shadow-lg shadow-[#cf7b3e]/30'
                : 'bg-[#25221e] text-[#dea374] border border-[#cf7b3e]/30 hover:bg-[#2f2b26]'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Admin Portal</span>
            <span className="sm:hidden">Admin</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
