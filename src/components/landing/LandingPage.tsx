import React, { useState, useEffect } from 'react';
import { Book, Bundle } from '../../types';
import { APP_SUBHEADING } from '../../data/initialBooks';
import { promoStore } from '../../services/promoStore';
import { bookStore } from '../../services/bookStore';
import { reviewStore } from '../../services/reviewStore';
import { currencyStore, CurrencyCode } from '../../services/currencyStore';
import { BookReviewsModal } from '../reviews/BookReviewsModal';
import { CoverCarouselSection } from './CoverCarouselSection';
import { BookDetailsModal } from './BookDetailsModal';
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
  Tag,
  Heart,
  Star
} from 'lucide-react';

interface LandingPageProps {
  books: Book[];
  bundles: Bundle[];
  unlockedBookIds: Set<string>;
  onOpenReader: (slug: string) => void;
  onOpenCheckout: (item: { id: string; type: 'book' | 'bundle'; title: string; price: number; originalPrice?: number }) => void;
  onRefresh?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  books,
  bundles,
  unlockedBookIds,
  onOpenReader,
  onOpenCheckout,
  onRefresh,
}) => {
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [, setFavTick] = useState(0);
  const [reviewModalBook, setReviewModalBook] = useState<Book | null>(null);
  const [inspectedBook, setInspectedBook] = useState<Book | null>(null);
  const [isChaptersExpanded, setIsChaptersExpanded] = useState<boolean>(false);
  const [currency, setCurrency] = useState<CurrencyCode>(currencyStore.getCurrency());

  useEffect(() => {
    return currencyStore.subscribe((cur) => {
      setCurrency(cur);
    });
  }, []);

  const featuredBook = books.find((b) => b.isFeatured) || books[0];
  const primaryBundle = bundles[0];

  const openFireBooks = books.filter(
    (b) =>
      b.category === 'Open-Fire & Grilling' ||
      b.category?.toLowerCase().includes('open-fire') ||
      (!b.category?.toLowerCase().includes('monthly') && b.id !== 'vault-vol-02')
  );

  const monthlyRecipeBooks = books.filter(
    (b) =>
      b.category === 'Monthly Recipes' ||
      b.category?.toLowerCase().includes('monthly') ||
      b.id === 'vault-vol-02'
  );

  const handleToggleFavoriteBook = (bookId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    bookStore.toggleFavoriteBook(bookId);
    setFavTick((t) => t + 1);
    if (onRefresh) onRefresh();
  };

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
                <span>{primaryBundle.title} (${primaryBundle.price.toFixed(2)})</span>
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
                className="w-[260px] sm:w-[280px] aspect-[9/16] rounded-[24px] overflow-hidden border-[5px] border-[#2d251d] shadow-book cursor-pointer group relative transition-transform duration-300 hover:scale-105 bg-[#141210]"
              >
                <img 
                  src={featuredBook.coverImage} 
                  alt={featuredBook.title} 
                  className="w-full h-full object-contain object-top select-none group-hover:brightness-95 transition-all" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent flex flex-col justify-end p-4">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#dea374]">
                    CLICK TO OPEN FULL BOOK (PAGE 1)
                  </span>
                  <h3 className="text-sm font-bold text-white leading-tight">
                    {featuredBook.title}
                  </h3>
                </div>
              </div>
              <span className="text-[11px] text-[#7d756a] mt-3">
                Full 9:16 Phone Ratio • Tap Cover to Read Page 1
              </span>
            </div>

            {/* Right: Details, Pricing, PayPal & Free Preview */}
            <div className="w-full md:w-7/12 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-[11px] uppercase font-bold tracking-wider text-[#dea374] bg-[#29221b] px-3 py-1 rounded-full border border-[#cf7b3e]/30">
                  FLAGSHIP FIRST EDITION
                </span>
                
                <div className="flex items-center gap-2">
                  {/* Like / Save to Favorites & Wishlist Button */}
                  <button
                    onClick={(e) => handleToggleFavoriteBook(featuredBook.id, e)}
                    className={`text-xs flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all ${
                      bookStore.isBookFavorited(featuredBook.id)
                        ? 'bg-rose-600 text-white border-rose-400 shadow-md'
                        : 'bg-[#171513] text-[#f3d1d8] hover:text-white border-rose-500/30 hover:bg-rose-950/50'
                    }`}
                    title="Add to Favorites & Wishlist"
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${
                        bookStore.isBookFavorited(featuredBook.id) ? 'fill-white text-white' : 'text-rose-400'
                      }`}
                    />
                    <span>{bookStore.isBookFavorited(featuredBook.id) ? 'Liked' : 'Like'}</span>
                    <span className="text-xs font-bold text-white/90 ml-0.5">
                      {featuredBook.likesCount ?? 0}
                    </span>
                  </button>

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
              </div>

              <div>
                <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white leading-tight">
                  {featuredBook.title}
                </h2>

                {/* Dynamic Star Rating Badge (Clickable to open reviews) */}
                {(() => {
                  const featuredStats = reviewStore.getRatingStats(featuredBook.slug || featuredBook.id);
                  return (
                    <button
                      type="button"
                      onClick={() => setReviewModalBook(featuredBook)}
                      className="mt-2 inline-flex items-center gap-2 bg-[#201b17] hover:bg-[#2b241e] border border-[#3b3228] px-3 py-1 rounded-full text-xs transition-all group"
                    >
                      <div className="flex items-center gap-0.5 text-amber-400">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              featuredStats.count > 0
                                ? i < Math.round(featuredStats.average)
                                  ? 'fill-amber-400'
                                  : 'text-[#443b32]'
                                : 'fill-amber-400'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-bold text-white">
                        {featuredStats.count > 0 ? `${featuredStats.average.toFixed(1)} / 5.0` : '★ New Launch'}
                      </span>
                      <span className="text-[#a8a196] group-hover:text-[#dea374]">
                        {featuredStats.count > 0
                          ? `• ${featuredStats.count} Verified Review${featuredStats.count === 1 ? '' : 's'} →`
                          : '• Be First to Review →'}
                      </span>
                    </button>
                  );
                })()}
              </div>

              {/* Tagline Hook */}
              {featuredBook.tagline && (
                <div className="bg-[#241c16] border-l-4 border-[#cf7b3e] p-3 rounded-r-xl">
                  <p className="text-xs sm:text-sm font-semibold text-[#dea374]">
                    {featuredBook.tagline}
                  </p>
                </div>
              )}

              {/* Formatted Description with Spacing & Lines */}
              <div className="space-y-3 text-xs sm:text-sm text-[#b8b0a5] leading-relaxed">
                <p>
                  Stop losing recipes in your saved videos or guessing measurements at the coals. Get all <strong>30 iconic South African braai &amp; heritage recipes</strong>, <strong>30 aisle-by-aisle grocery checklists</strong>, <strong>30 full-page dish photos</strong>, and <strong>5 essential wood, coal, spice &amp; temperature guides</strong> in one phone-ready vertical PDF.
                </p>

                {/* Chapters Breakdown with Lines & Spacing */}
                <div className="bg-[#181513] border border-[#2e261f] rounded-2xl p-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] uppercase font-bold tracking-wider text-[#dea374]">
                      Inside Series 1 (Chapters 01–08):
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsChaptersExpanded(!isChaptersExpanded)}
                      className="text-[11px] text-[#dea374] hover:text-white underline font-medium"
                    >
                      {isChaptersExpanded ? 'Collapse List ▲' : 'View All 30 Recipes ▼'}
                    </button>
                  </div>

                  <ul className="space-y-2 text-xs text-[#cfc7bb]">
                    <li className="flex items-start gap-2">
                      <span className="text-base leading-none">🔥</span>
                      <div>
                        <strong className="text-white">Braai Meat &amp; Chops:</strong> Traditional Boerewors, Karoo Lamb Chops (Lams-Tjoppies), Flame-Grilled Beef T-Bone Steak, Sticky Sweet Mustard Pork Ribs
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-base leading-none">🍗</span>
                      <div>
                        <strong className="text-white">Poultry &amp; Skewers:</strong> Peri-Peri Spatchcock Chicken, Cape Malay Curried Chicken Sosaties, Sticky Apricot &amp; Chutney Chicken, Smoky Beer-Can Braai Chicken
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-base leading-none">🦞</span>
                      <div>
                        <strong className="text-white">Seafood Classics:</strong> Whole Braaied Snoek with Apricot Butter, Garlic Butter Braai Crayfish Tails, Braaied Cape Yellowtail, Fire-Roasted Peri-Peri Tiger Prawns
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-base leading-none">🍲</span>
                      <div>
                        <strong className="text-white">Potjiekos Heritage:</strong> Traditional Oxtail Potjie, Creamy Chicken &amp; Mushroom Potjie, Karoo Lamb Potjie, Rich Beef &amp; Red Wine Potjie
                      </div>
                    </li>

                    {isChaptersExpanded && (
                      <>
                        <li className="flex items-start gap-2 pt-2 border-t border-[#29221b]">
                          <span className="text-base leading-none">🍞</span>
                          <div>
                            <strong className="text-white">Braai Breads, Salads &amp; Condiments:</strong> Cheese &amp; Onion Braaibroodjies, Grid Roosterkoek, Cheesy Bacon &amp; Sweetcorn Pap Tart, Campfire Garlic Braai Loaf, Curried Noodle Salad, Creamy Potato Salad, Beetroot Salad, Apple &amp; Pecan Coleslaw, Charred Sweetcorn &amp; Feta Salad, Spicy Chakalaka, Cape Malay Apricot Blatjang, Pickled Radish Sambal
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-base leading-none">🍮</span>
                          <div>
                            <strong className="text-white">Sweet Desserts:</strong> Traditional South African Melktert &amp; Warm Caramelized Malva Pudding
                          </div>
                        </li>
                      </>
                    )}
                  </ul>
                </div>

                <p className="text-[11px] text-[#dea374] font-medium italic">
                  Tap below to unlock all 30 recipes + grocery lists instantly for $1!
                </p>
              </div>

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
                      {currency === 'ZAR' ? 'R20.00' : `$${featuredBook.price.toFixed(2)}`}
                    </span>
                    {featuredBook.originalPrice && (
                      <span className="text-base line-through text-[#8e8578] font-semibold">
                        {currency === 'ZAR' ? 'R260.00' : `$${featuredBook.originalPrice.toFixed(2)}`}
                      </span>
                    )}
                    <span className="text-xs font-semibold text-[#dea374]">
                      {currency === 'ZAR' ? 'ZAR (Capitec / Card)' : 'USD (PayPal)'}
                    </span>
                    {featuredBook.originalPrice && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/40">
                        {featuredBook.promoExpiresAt !== undefined ? promoStore.getDaysRemaining(featuredBook.promoExpiresAt) : 'LIMITED PROMO'}
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-[#857d72] flex items-center gap-1.5">
                    <span>
                      {currency === 'ZAR'
                        ? 'One-time charge • R20.00 ZAR via Capitec / Card'
                        : 'One-time charge • $1.00 USD via PayPal'}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:items-end gap-1.5">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-amber-300 bg-amber-950/85 px-2.5 py-0.5 rounded-full border border-amber-500/40 w-fit">
                    <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span>
                      {featuredBook.soldCount !== undefined && featuredBook.soldCount > 0
                        ? `${featuredBook.soldCount} Copies Sold`
                        : '🔥 1st Edition • Just Launched'}
                    </span>
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
                      <span>
                        {currency === 'ZAR'
                          ? 'Buy with Capitec / Card (R20)'
                          : `Pay with PayPal ($${featuredBook.price.toFixed(2)})`}
                      </span>
                    </button>
                  </div>
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
                {primaryBundle.badge && (
                  <span className="text-[11px] font-bold tracking-widest uppercase bg-[#cf7b3e] text-white px-3 py-1 rounded-full shadow-md">
                    {primaryBundle.badge}
                  </span>
                )}

                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-2">
                  {primaryBundle.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#cbc2b6] leading-relaxed">
                  {primaryBundle.description}
                </p>

                <div className="flex flex-wrap gap-3 pt-2 text-xs text-[#dea374]">
                  {primaryBundle.bookIds.map((bId) => {
                    const matched = books.find(b => b.id === bId);
                    return <span key={bId}>✓ {matched ? matched.title : bId}</span>;
                  })}
                </div>
              </div>

              {/* Price & Checkout */}
              <div className="text-center lg:text-right bg-[#17120e] p-5 rounded-2xl border border-[#3d2f23] w-full lg:w-auto min-w-[260px]">
                <div className="flex items-baseline justify-center lg:justify-end gap-2">
                  <span className="text-3xl sm:text-4xl font-extrabold text-white">
                    ${primaryBundle.price.toFixed(2)}
                  </span>
                  {primaryBundle.originalPrice && (
                    <span className="text-sm line-through text-[#797165]">
                      ${primaryBundle.originalPrice.toFixed(2)}
                    </span>
                  )}
                  <span className="text-xs font-bold text-[#dea374]">USD</span>
                </div>
                <p className="text-[10px] text-emerald-400 font-semibold mt-1">Instant Multi-Book Access</p>

                <button
                  onClick={() => onOpenCheckout({ id: primaryBundle.id, type: 'bundle', title: primaryBundle.title, price: primaryBundle.price, originalPrice: primaryBundle.originalPrice })}
                  className="w-full mt-3 py-3 px-5 rounded-xl bg-gradient-to-r from-[#cf7b3e] to-[#b8612b] text-white font-bold text-xs sm:text-sm shadow-xl shadow-[#cf7b3e]/30 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Unlock {primaryBundle.title} (${primaryBundle.price.toFixed(2)})</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. 3D COVERFLOW CAROUSELS BY CATEGORY (Matching Requested Layout) */}
      {/* Category 1: Open-Fire & Grilling Series */}
      <CoverCarouselSection
        categoryTag="🔥 OPEN-FIRE & GRILLING"
        title="Open-Fire & Grilling Series"
        subtitle="30 phone-ready recipes: traditional Karoo boerewors, lams-tjoppies, coastal snoek, potjiekos & braaibroodjies."
        books={openFireBooks}
        onInspectBook={(b) => setInspectedBook(b)}
        onOpenReader={onOpenReader}
      />

      {/* Category 2: Monthly Recipes (A full course planned for 4 Saturdays and 4 Sundays) */}
      <CoverCarouselSection
        categoryTag="📅 MONTHLY RECIPES"
        title="Monthly Recipes Collection"
        subtitle="A full course planned for 4 Saturdays and 4 Sundays. Complete multi-course menus designed for effortless weekend hosting, Saturday fireside feasts, and Sunday heritage slow roasts."
        books={monthlyRecipeBooks}
        onInspectBook={(b) => setInspectedBook(b)}
        onOpenReader={onOpenReader}
      />

      {/* Book Inspect & Full Details Modal (When card or Inspect is clicked) */}
      {inspectedBook && (
        <BookDetailsModal
          book={inspectedBook}
          isOpen={!!inspectedBook}
          onClose={() => setInspectedBook(null)}
          onOpenReader={onOpenReader}
          onOpenCheckout={onOpenCheckout}
          onOpenReviews={(b) => setReviewModalBook(b)}
        />
      )}

      {/* Book Reviews & Ratings Modal */}
      {reviewModalBook && (
        <BookReviewsModal
          book={reviewModalBook}
          isOpen={!!reviewModalBook}
          isUnlocked={unlockedBookIds.has(reviewModalBook.id)}
          onClose={() => setReviewModalBook(null)}
          onOpenCheckout={onOpenCheckout}
          onReviewSubmitted={() => {
            if (onRefresh) onRefresh();
          }}
        />
      )}
    </div>
  );
};

