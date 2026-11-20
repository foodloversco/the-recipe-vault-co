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
  ChevronDown,
  Clock,
  ShoppingBag,
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
  const [showFullMission, setShowFullMission] = useState<boolean>(false);
  const [currency, setCurrency] = useState<CurrencyCode>(currencyStore.getCurrency());

  useEffect(() => {
    return currencyStore.subscribe((cur) => {
      setCurrency(cur);
    });
  }, []);

  const featuredBook = books.find((b) => b.isFeatured) || books[0];
  const primaryBundle = bundles[0];

  // Category Filter: Open-Fire & Grilling (Series 1 and related)
  const openFireBooks = books.filter(
    (b) =>
      b.category === 'Open-Fire & Grilling' ||
      b.category?.toLowerCase().includes('open-fire') ||
      b.category?.toLowerCase().includes('braai') ||
      (!b.category?.toLowerCase().includes('monthly') && b.slug !== 'monthly-weekend-feasts-4-saturdays-4-sundays')
  );

  // Category Filter: Monthly Recipes (Only real user-uploaded monthly books)
  const monthlyRecipeBooks = books.filter(
    (b) =>
      b.category === 'Monthly Recipes' ||
      b.category?.toLowerCase().includes('monthly')
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
      {/* 1. COMPACT MOBILE-FIRST HERO SECTION */}
      <section className="relative pt-4 sm:pt-8 pb-6 sm:pb-10 px-3 sm:px-6 overflow-hidden border-b border-[#26211c]">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#cf7b3e]/15 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-3xl mx-auto text-center relative z-10">
          {/* Tagline Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#201b17] border border-[#3d3329] shadow-sm mb-3 sm:mb-4">
            <Smartphone className="w-3.5 h-3.5 text-[#cf7b3e]" />
            <span className="text-[10px] sm:text-xs uppercase font-bold tracking-widest text-[#dea374]">
              PHONE-READY DIGITAL RECIPE CARDS
            </span>
          </div>

          <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-2 sm:mb-3 leading-tight">
            The Recipe Vault Co.
          </h1>

          {/* Punchy Mobile Subtitle */}
          <p className="text-xs sm:text-sm md:text-base text-[#cfc7bc] leading-relaxed max-w-2xl mx-auto mb-3">
            Collectible, 9:16 phone-ready recipe card series with 1-tap grocery checklists, screen wake lock &amp; fireside timers. Flip like a book, cook offline with zero clutter.
          </p>

          {/* Expandable Full Mission Subheading for curious readers */}
          <div className="mb-4">
            <button
              type="button"
              onClick={() => setShowFullMission(!showFullMission)}
              className="text-[11px] text-[#dea374] hover:text-[#eed2b8] inline-flex items-center gap-1 font-medium transition-colors"
            >
              <span>{showFullMission ? 'Show less' : 'About The Recipe Vault Co.'}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showFullMission ? 'rotate-180' : ''}`} />
            </button>
            {showFullMission && (
              <p className="mt-2 text-xs text-[#a89f92] leading-relaxed bg-[#191613] p-3 rounded-xl border border-[#2b251f] animate-in fade-in">
                {APP_SUBHEADING}
              </p>
            )}
          </div>

          {/* Mobile Trust Quick Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-w-2xl mx-auto text-[11px] text-[#a39a8e]">
            <div className="bg-[#171412] px-2.5 py-1.5 rounded-lg border border-[#28221b] flex items-center justify-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-[#cf7b3e] flex-shrink-0" />
              <span>9:16 Phone Flip</span>
            </div>
            <div className="bg-[#171412] px-2.5 py-1.5 rounded-lg border border-[#28221b] flex items-center justify-center gap-1.5">
              <ShoppingBag className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <span>Aisle Checklists</span>
            </div>
            <div className="bg-[#171412] px-2.5 py-1.5 rounded-lg border border-[#28221b] flex items-center justify-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              <span>Kitchen Timer</span>
            </div>
            <div className="bg-[#171412] px-2.5 py-1.5 rounded-lg border border-[#28221b] flex items-center justify-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <span>{currency === 'ZAR' ? 'R20 Capitec / Card' : '$1.00 USD PayPal'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. 3D COVERFLOW CAROUSELS (MATCHING USER'S SCREENSHOT LAYOUT) */}

      {/* Category 1: Open-Fire & Grilling Series */}
      <CoverCarouselSection
        categoryTag="🔥 OPEN-FIRE & GRILLING"
        title="Open-Fire & Grilling Series"
        subtitle="30 phone-ready recipes: traditional Karoo boerewors, lams-tjoppies, coastal snoek, potjiekos & braaibroodjies."
        books={openFireBooks}
        onInspectBook={(b) => setInspectedBook(b)}
        onOpenReader={onOpenReader}
      />

      {/* Category 2: Monthly Recipes (Only displayed when user uploads a book into this category) */}
      <CoverCarouselSection
        categoryTag="📅 MONTHLY RECIPES"
        title="Monthly Recipes Collection"
        subtitle="A full course planned for 4 Saturdays and 4 Sundays. Complete multi-course menus designed for effortless weekend hosting, Saturday fireside feasts, and Sunday heritage slow roasts."
        books={monthlyRecipeBooks}
        onInspectBook={(b) => setInspectedBook(b)}
        onOpenReader={onOpenReader}
      />

      {/* 3. CURATED BUNDLES (IF CREATED BY ADMIN) */}
      {bundles && bundles.length > 0 && primaryBundle && (
        <section className="py-10 px-4 sm:px-6 max-w-6xl mx-auto border-t border-[#231e19]">
          <div className="bg-gradient-to-r from-[#211b15] via-[#2a211a] to-[#211b15] p-6 sm:p-8 rounded-3xl border border-[#cf7b3e]/30 shadow-2xl">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center lg:text-left">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#dea374] bg-[#cf7b3e]/20 px-2.5 py-1 rounded-full border border-[#cf7b3e]/30">
                  EXCLUSIVE CULINARY BUNDLE
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                  {primaryBundle.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#cac1b4] max-w-xl">
                  {primaryBundle.description}
                </p>
              </div>

              <div className="text-center lg:text-right bg-[#17120e] p-4 rounded-2xl border border-[#3d2f23] w-full lg:w-auto min-w-[240px]">
                <div className="flex items-baseline justify-center lg:justify-end gap-2">
                  <span className="text-2xl sm:text-3xl font-extrabold text-white">
                    {currency === 'ZAR' ? `R${(primaryBundle.price * 20).toFixed(0)}` : `$${primaryBundle.price.toFixed(2)}`}
                  </span>
                  {primaryBundle.originalPrice && (
                    <span className="text-xs line-through text-[#797165]">
                      {currency === 'ZAR' ? `R${(primaryBundle.originalPrice * 20).toFixed(0)}` : `$${primaryBundle.originalPrice.toFixed(2)}`}
                    </span>
                  )}
                  <span className="text-xs font-bold text-[#dea374]">{currency === 'ZAR' ? 'ZAR' : 'USD'}</span>
                </div>

                <button
                  onClick={() => onOpenCheckout({ id: primaryBundle.id, type: 'bundle', title: primaryBundle.title, price: primaryBundle.price, originalPrice: primaryBundle.originalPrice })}
                  className="w-full mt-3 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#cf7b3e] to-[#b8612b] text-white font-bold text-xs sm:text-sm shadow-xl shadow-[#cf7b3e]/30 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Unlock {primaryBundle.title}</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

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
