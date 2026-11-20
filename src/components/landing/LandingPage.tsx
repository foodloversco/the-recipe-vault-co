import React, { useState } from 'react';
import { Book, Bundle } from '../../types';
import { APP_SUBHEADING } from '../../data/initialBooks';
import { promoStore } from '../../services/promoStore';
import { 
  BookOpen, 
  Sparkles, 
  ShieldCheck, 
  Printer, 
  Smartphone, 
  Check, 
  Share2, 
  CreditCard, 
  ArrowRight, 
  Flame, 
  Utensils, 
  Lock, 
  Unlock, 
  Eye, 
  DollarSign, 
  Layers,
  Tag
} from 'lucide-react';

interface LandingPageProps {
  books: Book[];
  bundles: Bundle[];
  unlockedBookIds: Set<string>;
  onOpenReader: (slug: string) => void;
  onOpenCheckout: (item: { id: string; type: 'book' | 'bundle'; title: string; price: number; originalPrice?: number }) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  books,
  bundles,
  unlockedBookIds,
  onOpenReader,
  onOpenCheckout,
}) => {
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  const featuredBook = books.find((b) => b.isFeatured) || books[0];
  const primaryBundle = bundles[0];

  const handleCopyLink = (slug: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}${window.location.pathname}?book=${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2500);
  };

  return (
    <div className="text-[#f5f2eb]">
      {/* 1. HERO SECTION */}
      <section className="relative pt-8 pb-16 px-4 sm:px-6 overflow-hidden border-b border-[#26211c]">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#cf7b3e]/15 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Logo Badge */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#201b17] border border-[#3d3329] shadow-lg mb-6">
            <img 
              src="/assets/images/logo.png" 
              alt="Logo" 
              className="w-5 h-5 rounded-md object-contain" 
            />
            <span className="text-xs uppercase font-bold tracking-widest text-[#dea374]">
              PHONE-READY DIGITAL RECIPE CARDS
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 leading-[1.15]">
            The Recipe Vault Co.
          </h1>

          {/* Prompt exact sub-heading */}
          <p className="text-sm sm:text-base lg:text-lg text-[#cbc3b6] leading-relaxed max-w-3xl mx-auto mb-8 font-normal font-sans">
            {APP_SUBHEADING}
          </p>

          {/* Quick Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-10">
            <button
              onClick={() => onOpenReader(featuredBook.slug)}
              className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-gradient-to-r from-[#cf7b3e] to-[#b8612b] text-white font-bold text-sm shadow-xl shadow-[#cf7b3e]/25 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Eye className="w-4 h-4" />
              <span>Preview First 5 Pages Free</span>
            </button>

            {primaryBundle && (
              <button
                onClick={() => onOpenCheckout({ id: primaryBundle.id, type: 'bundle', title: primaryBundle.title, price: primaryBundle.price })}
                className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-[#211b16] hover:bg-[#2c241e] border border-[#cf7b3e]/40 text-[#dea374] font-bold text-sm transition-all flex items-center justify-center gap-2"
              >
                <Layers className="w-4 h-4" />
                <span>Get All 3 Volumes Bundle (${primaryBundle.price.toFixed(2)})</span>
              </button>
            )}
          </div>

          {/* Trust Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto text-xs text-[#9c9387]">
            <div className="bg-[#171412] p-2.5 rounded-xl border border-[#2a241e] flex items-center justify-center gap-2">
              <Smartphone className="w-4 h-4 text-[#dea374]" />
              <span>Single-Hand Phone Flip</span>
            </div>
            <div className="bg-[#171412] p-2.5 rounded-xl border border-[#2a241e] flex items-center justify-center gap-2">
              <Printer className="w-4 h-4 text-[#dea374]" />
              <span>Printable PDF Cards</span>
            </div>
            <div className="bg-[#171412] p-2.5 rounded-xl border border-[#2a241e] flex items-center justify-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Grocery Checklists</span>
            </div>
            <div className="bg-[#171412] p-2.5 rounded-xl border border-[#2a241e] flex items-center justify-center gap-2">
              <CreditCard className="w-4 h-4 text-[#dea374]" />
              <span>PayPal Live in USD</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FLAGSHIP SERIES SHOWCASE: VOLUME 01 (HERITAGE BRAAI & OPEN FIRE) */}
      {featuredBook && (
        <section className="py-16 px-4 sm:px-6 max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8 lg:gap-12 bg-gradient-to-br from-[#1c1815] to-[#141210] p-6 sm:p-10 rounded-[32px] border border-[#3b3228] shadow-2xl relative overflow-hidden">
            {/* Left: Book Cover & Kindle Mockup Preview */}
            <div className="w-full md:w-5/12 flex flex-col items-center">
              <div 
                onClick={() => onOpenReader(featuredBook.slug)}
                className="w-[260px] h-[430px] rounded-[28px] overflow-hidden border-[6px] border-[#2d251d] shadow-book cursor-pointer group relative transition-transform duration-300 hover:scale-105"
              >
                <img 
                  src={featuredBook.coverImage} 
                  alt={featuredBook.title} 
                  className="w-full h-full object-cover group-hover:brightness-95 transition-all" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#dea374]">
                    TAP TO FLIP PREVIEW
                  </span>
                  <h3 className="text-sm font-bold text-white leading-tight">
                    {featuredBook.title}
                  </h3>
                </div>
              </div>
              <span className="text-[11px] text-[#7d756a] mt-3">
                Default phone viewport: 360 × 600 Kindle view
              </span>
            </div>

            {/* Right: Details, Pricing, PayPal & Free Preview */}
            <div className="w-full md:w-7/12 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase font-bold tracking-wider text-[#dea374] bg-[#29221b] px-3 py-1 rounded-full border border-[#cf7b3e]/30">
                  FLAGSHIP FIRST EDITION
                </span>
                
                {/* Unique URL Link Share Button */}
                <button
                  onClick={(e) => handleCopyLink(featuredBook.slug, e)}
                  className="text-xs text-[#a1998f] hover:text-white flex items-center gap-1.5 bg-[#171513] px-3 py-1 rounded-full border border-[#2b251f]"
                  title="Copy Unique Book Link"
                >
                  <Share2 className="w-3.5 h-3.5 text-[#dea374]" />
                  <span>{copiedSlug === featuredBook.slug ? 'Link Copied!' : 'Copy Unique Link'}</span>
                </button>
              </div>

              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white leading-tight">
                {featuredBook.title}
              </h2>

              <p className="text-xs sm:text-sm text-[#dea374] font-medium font-serif italic">
                {featuredBook.subtitle}
              </p>

              <p className="text-xs sm:text-sm text-[#b8b0a5] leading-relaxed">
                {featuredBook.description}
              </p>

              {/* What’s Inside */}
              <div className="grid grid-cols-2 gap-2 text-xs py-2">
                <div className="flex items-center gap-2 text-[#dbd5cb]">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>30 Collectible Recipe Cards</span>
                </div>
                <div className="flex items-center gap-2 text-[#dbd5cb]">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Categorized Grocery Checklists</span>
                </div>
                <div className="flex items-center gap-2 text-[#dbd5cb]">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>5-Page Free Preview Included</span>
                </div>
                <div className="flex items-center gap-2 text-[#dbd5cb]">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Instant Printable PDF Format</span>
                </div>
              </div>

              {/* Price & Purchase Actions */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-[#29221b]">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-white">
                      ${featuredBook.price.toFixed(2)}
                    </span>
                    {featuredBook.originalPrice && (
                      <span className="text-base line-through text-[#8e8578] font-semibold">
                        ${featuredBook.originalPrice.toFixed(2)}
                      </span>
                    )}
                    <span className="text-xs font-semibold text-[#dea374]">USD</span>
                    {featuredBook.originalPrice && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/40">
                        {featuredBook.promoExpiresAt !== undefined ? promoStore.getDaysRemaining(featuredBook.promoExpiresAt) : 'LIMITED PROMO'}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-[#857d72]">One-time digital charge • Instant unlock</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-2.5">
                  <button
                    onClick={() => onOpenReader(featuredBook.slug)}
                    className="px-5 py-3 rounded-xl bg-[#26201b] hover:bg-[#342c24] border border-[#44382e] text-xs font-bold text-white transition-all flex items-center justify-center gap-1.5"
                  >
                    <Eye className="w-4 h-4 text-[#dea374]" />
                    <span>Flip 5 Free Pages</span>
                  </button>

                  <button
                    onClick={() => onOpenCheckout({ id: featuredBook.id, type: 'book', title: featuredBook.title, price: featuredBook.price, originalPrice: featuredBook.originalPrice })}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#cf7b3e] to-[#b8612b] hover:brightness-110 text-white font-bold text-xs shadow-lg shadow-[#cf7b3e]/30 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Pay with PayPal (${featuredBook.price.toFixed(2)})</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. VALUE BUNDLE SECTION */}
      {primaryBundle && (
        <section className="py-12 px-4 sm:px-6 max-w-6xl mx-auto">
          <div className="bg-gradient-to-r from-[#2a1a11] via-[#1f1610] to-[#16120f] border-2 border-[#cf7b3e]/60 rounded-3xl p-6 sm:p-10 shadow-2xl relative">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <span className="text-[11px] font-bold tracking-widest uppercase bg-[#cf7b3e] text-white px-3 py-1 rounded-full shadow-md">
                  {primaryBundle.badge}
                </span>

                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-2">
                  {primaryBundle.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#cbc2b6] leading-relaxed">
                  {primaryBundle.description}
                </p>

                <div className="flex flex-wrap gap-3 pt-2 text-xs text-[#dea374]">
                  <span>✓ Vol 01: Authentic Heritage Braai</span>
                  <span>✓ Vol 02: Timeless Comfort Food</span>
                  <span>✓ Vol 03: Global Street Cuisines</span>
                </div>
              </div>

              {/* Price & Checkout */}
              <div className="text-center lg:text-right bg-[#17120e] p-5 rounded-2xl border border-[#3d2f23] w-full lg:w-auto min-w-[260px]">
                <div className="flex items-baseline justify-center lg:justify-end gap-2">
                  <span className="text-3xl sm:text-4xl font-extrabold text-white">
                    ${primaryBundle.price.toFixed(2)}
                  </span>
                  <span className="text-sm line-through text-[#797165]">
                    ${primaryBundle.originalPrice.toFixed(2)}
                  </span>
                  <span className="text-xs font-bold text-[#dea374]">USD</span>
                </div>
                <p className="text-[10px] text-emerald-400 font-semibold mt-1">Instant All-Volume Access</p>

                <button
                  onClick={() => onOpenCheckout({ id: primaryBundle.id, type: 'bundle', title: primaryBundle.title, price: primaryBundle.price, originalPrice: primaryBundle.originalPrice })}
                  className="w-full mt-3 py-3 px-5 rounded-xl bg-gradient-to-r from-[#cf7b3e] to-[#b8612b] text-white font-bold text-xs sm:text-sm shadow-xl shadow-[#cf7b3e]/30 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Unlock Master Bundle ($29.99)</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. ALL VOLUMES & DIGITAL CATALOG */}
      <section className="py-12 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-xs uppercase font-bold tracking-widest text-[#dea374]">
            COLLECTIBLE DIGITAL SERIES
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white mt-1">
            Browse the Entire Recipe Vault
          </h2>
          <p className="text-xs sm:text-sm text-[#9c9488] max-w-xl mx-auto mt-2">
            Each volume contains 30 phone-ready recipes formatted for quick cooking and printable reference.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {books.map((book) => {
            const isUnlocked = unlockedBookIds.has(book.id);

            return (
              <div 
                key={book.id} 
                className="bg-[#181614] border border-[#2d261f] hover:border-[#cf7b3e]/50 rounded-3xl overflow-hidden transition-all flex flex-col justify-between shadow-lg"
              >
                <div>
                  {/* Cover */}
                  <div className="h-48 relative overflow-hidden bg-[#12110f]">
                    <img 
                      src={book.coverImage} 
                      alt={book.title} 
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
                    />
                    <div className="absolute top-3 left-3 bg-[#111]/80 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/10 text-[10px] font-bold text-white">
                      {book.category}
                    </div>

                    <button
                      onClick={(e) => handleCopyLink(book.slug, e)}
                      title="Copy Unique Link"
                      className="absolute top-3 right-3 bg-[#111]/80 hover:bg-[#111] p-1.5 rounded-full text-[#c2bcaf] border border-white/10"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Body */}
                  <div className="p-5">
                    <div className="flex items-center justify-between text-[11px] text-[#dea374] mb-1 font-mono">
                      <span>30 Phone Recipes</span>
                      <span>5 Free Pages</span>
                    </div>

                    <h3 className="font-serif font-bold text-base text-white leading-snug mb-1">
                      {book.title}
                    </h3>

                    <p className="text-xs text-[#a39c91] line-clamp-2 mb-3">
                      {book.description}
                    </p>

                    <div className="text-[10px] text-[#7d756a] font-mono truncate">
                      Link: /book/{book.slug}
                    </div>
                  </div>
                </div>

                {/* Footer Price & Buttons */}
                <div className="p-5 pt-0 border-t border-[#241f1a] mt-2">
                  <div className="flex items-baseline justify-between py-2">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="text-lg font-extrabold text-white">
                        ${book.price.toFixed(2)}
                      </span>
                      {book.originalPrice && (
                        <span className="text-xs line-through text-[#8e8578] font-semibold">
                          ${book.originalPrice.toFixed(2)}
                        </span>
                      )}
                      <span className="text-[10px] text-[#dea374] font-semibold">USD</span>
                      {book.originalPrice && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 font-bold border border-emerald-500/30">
                          {book.promoExpiresAt !== undefined ? promoStore.getDaysRemaining(book.promoExpiresAt) : 'SALE'}
                        </span>
                      )}
                    </div>
                    {isUnlocked && (
                      <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                        <Unlock className="w-3 h-3" /> Unlocked
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <button
                      onClick={() => onOpenReader(book.slug)}
                      className="py-2.5 px-3 rounded-xl bg-[#25201b] hover:bg-[#332b24] text-[#dea374] text-xs font-semibold border border-[#3a3128] transition-all flex items-center justify-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{isUnlocked ? 'Read Full' : 'Preview (5)'}</span>
                    </button>

                    <button
                      onClick={() => onOpenCheckout({ id: book.id, type: 'book', title: book.title, price: book.price, originalPrice: book.originalPrice })}
                      className="py-2.5 px-3 rounded-xl bg-[#cf7b3e] hover:bg-[#b8612b] text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Buy ($)</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

