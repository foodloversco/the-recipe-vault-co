import React, { useState } from 'react';
import { Book } from '../../types';
import { bookStore } from '../../services/bookStore';
import { reviewStore } from '../../services/reviewStore';
import { currencyStore } from '../../services/currencyStore';
import {
  X,
  Eye,
  CreditCard,
  Heart,
  Share2,
  Star,
  Check,
  Flame,
  Calendar,
  BookOpen,
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface BookDetailsModalProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenReader: (slug: string) => void;
  onOpenCheckout: (item: { id: string; type: 'book'; title: string; price: number; originalPrice?: number }) => void;
  onOpenReviews: (book: Book) => void;
}

export const BookDetailsModal: React.FC<BookDetailsModalProps> = ({
  book,
  isOpen,
  onClose,
  onOpenReader,
  onOpenCheckout,
  onOpenReviews,
}) => {
  const [, setFavTick] = useState(0);
  const [copied, setCopied] = useState(false);
  const currency = currencyStore.getCurrency();

  if (!isOpen || !book) return null;

  const isFavorited = bookStore.isBookFavorited(book.id);
  const stats = reviewStore.getRatingStats(book.slug || book.id);

  const handleToggleFav = (e: React.MouseEvent) => {
    e.stopPropagation();
    bookStore.toggleFavoriteBook(book.id);
    setFavTick((t) => t + 1);
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}${window.location.pathname}?book=${book.slug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  /**
   * Automatically parses raw book descriptions into formatted lists,
   * highlighted chapter headers, and clean paragraph blocks with dividing lines.
   */
  const renderFormattedDescription = (rawText: string) => {
    if (!rawText) return null;

    // Split text into distinct paragraphs/blocks
    const paragraphs = rawText.split(/\n\s*\n/);

    return (
      <div className="space-y-4 text-xs sm:text-sm text-[#d1c9bd] leading-relaxed">
        {paragraphs.map((para, pIdx) => {
          const lines = para.split('\n').map((l) => l.trim()).filter(Boolean);

          // Check if this paragraph contains bullet points
          const isListBlock = lines.some((l) => /^[•\-\*]/.test(l));

          if (isListBlock) {
            return (
              <div
                key={pIdx}
                className="bg-[#181512] p-4 rounded-2xl border border-[#30271f] space-y-2.5 shadow-inner"
              >
                {lines.map((line, lIdx) => {
                  const isBullet = /^[•\-\*]/.test(line);

                  if (isBullet) {
                    const cleanLine = line.replace(/^[•\-\*]\s*/, '');
                    // Check if bullet has bold or colon prefix (e.g. "🔥 Braai Meat: ...")
                    const colonIndex = cleanLine.indexOf(':');

                    if (colonIndex > 0) {
                      const titlePart = cleanLine.substring(0, colonIndex);
                      const bodyPart = cleanLine.substring(colonIndex + 1);
                      return (
                        <div key={lIdx} className="flex items-start gap-2.5 text-xs text-[#cfc7bc]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#cf7b3e] mt-1.5 flex-shrink-0" />
                          <div>
                            <span className="font-bold text-white text-xs">{titlePart}:</span>
                            <span className="text-[#b5ada0] ml-1">{bodyPart}</span>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div key={lIdx} className="flex items-start gap-2.5 text-xs text-[#cfc7bc]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#cf7b3e] mt-1.5 flex-shrink-0" />
                        <span>{cleanLine}</span>
                      </div>
                    );
                  }

                  // Header line before list (e.g. "Inside Series 1 (Chapters 01–08):")
                  return (
                    <div
                      key={lIdx}
                      className="font-bold text-xs uppercase tracking-wider text-[#dea374] pb-1 border-b border-[#2b241c] mb-2"
                    >
                      {line}
                    </div>
                  );
                })}
              </div>
            );
          }

          // Single regular paragraph
          return (
            <div key={pIdx} className="border-b border-[#26201a] pb-3 last:border-b-0 last:pb-0">
              <p className="text-xs sm:text-[13px] text-[#c5bdaf] leading-relaxed">
                {para}
              </p>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-xl bg-[#151210] border border-[#3d3227] rounded-3xl overflow-hidden shadow-2xl relative flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="p-3.5 sm:p-4 border-b border-[#2b241c] flex items-center justify-between bg-[#191512] sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-[#241c16] text-[#dea374] border border-[#cf7b3e]/30">
              {book.category}
            </span>
            <span className="text-xs text-[#8e8578]">• 30 Phone Recipes</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#9c9387] hover:text-white bg-[#251f19] hover:bg-[#332b23] transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body - STACKED VERTICALLY AS REQUESTED */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* 1. Center 9:16 Phone Cover Card */}
          <div className="flex flex-col items-center">
            <div
              onClick={() => {
                onClose();
                onOpenReader(book.slug);
              }}
              className="w-[200px] sm:w-[240px] aspect-[9/16] rounded-2xl overflow-hidden border-2 border-[#cf7b3e]/40 relative group cursor-pointer shadow-2xl bg-[#0c0a09] transition-transform duration-300 hover:scale-105"
            >
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-full h-full object-contain object-top group-hover:brightness-95 transition-all"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent flex items-end justify-center p-3">
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5 bg-black/70 px-3 py-1 rounded-full border border-amber-400/40 shadow-lg">
                  <Eye className="w-3.5 h-3.5" />
                  <span>Tap Cover to Flip Book</span>
                </span>
              </div>
            </div>
            <span className="text-[11px] text-[#7d756a] mt-2 font-medium">
              Full 9:16 Phone Reader • 30 Step-by-Step Recipes
            </span>
          </div>

          {/* 2. Book Title & Subtitle */}
          <div className="text-center space-y-1 border-t border-[#26201a] pt-4">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-white leading-tight">
              {book.title}
            </h2>
            {book.subtitle && (
              <p className="text-xs text-[#dea374] font-medium">
                {book.subtitle}
              </p>
            )}
          </div>

          {/* 3. Rating, Likes & Share Buttons */}
          <div className="flex items-center justify-center gap-2.5 text-xs flex-wrap">
            <button
              type="button"
              onClick={() => onOpenReviews(book)}
              className="flex items-center gap-1 text-amber-400 bg-[#1e1915] px-3 py-1 rounded-full border border-amber-500/30 hover:bg-[#2b241e]"
            >
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span className="font-bold text-white">
                {stats.count > 0 ? stats.average.toFixed(1) : '★ New Launch'}
              </span>
              <span className="text-[#8e8578] text-[10px]">({stats.count} Reviews)</span>
            </button>

            <button
              type="button"
              onClick={handleToggleFav}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all text-xs font-semibold ${
                isFavorited
                  ? 'bg-rose-600 text-white border-rose-400'
                  : 'bg-[#1e1915] text-rose-400 border-rose-500/30 hover:bg-rose-950/60'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-white text-white' : ''}`} />
              <span>{isFavorited ? 'Liked' : 'Like'}</span>
              <span className="font-bold">{book.likesCount ?? 0}</span>
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#1e1915] text-[#c2bcaf] hover:text-white border border-[#382f25] text-xs font-semibold"
            >
              <Share2 className="w-3.5 h-3.5 text-[#dea374]" />
              <span>{copied ? 'Copied!' : 'Share'}</span>
            </button>
          </div>

          {/* 4. Action Buttons (Preview & Buy) - Positioned High for Quick Access */}
          <div className="bg-[#1c1713] p-3.5 rounded-2xl border border-[#332a21] space-y-3">
            <div className="flex items-baseline justify-between px-1">
              <div>
                <span className="text-2xl font-extrabold text-white">
                  {currency === 'ZAR' ? `R${Math.round(book.price * 20)}.00` : `$${book.price.toFixed(2)}`}
                </span>
                {book.originalPrice && (
                  <span className="text-sm line-through text-[#8e8578] ml-2">
                    {currency === 'ZAR' ? `R${Math.round(book.originalPrice * 20)}.00` : `$${book.originalPrice.toFixed(2)}`}
                  </span>
                )}
              </div>
              <span className="text-xs font-bold text-[#dea374]">
                {currency === 'ZAR' ? 'Capitec & Cards (ZAR)' : 'PayPal Instant (USD)'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  onClose();
                  onOpenReader(book.slug);
                }}
                className="py-2.5 px-3 rounded-xl bg-[#26201a] hover:bg-[#342c24] border border-amber-600/40 text-xs font-bold text-amber-300 flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
              >
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>Flip 5 Free Pages</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenCheckout({
                    id: book.id,
                    type: 'book',
                    title: book.title,
                    price: book.price,
                    originalPrice: book.originalPrice,
                  });
                }}
                className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#cf7b3e] to-[#b8612b] hover:brightness-110 text-white text-xs font-bold shadow-lg shadow-[#cf7b3e]/30 flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
              >
                <CreditCard className="w-4 h-4" />
                <span>{currency === 'ZAR' ? `Buy Now (R${Math.round(book.price * 20)})` : `Buy Now ($${book.price.toFixed(2)})`}</span>
              </button>
            </div>
          </div>

          {/* 5. Feature Perks */}
          <div className="grid grid-cols-2 gap-2 text-[11px] text-[#dbd5cb] bg-[#181411] p-3 rounded-xl border border-[#2b241c]">
            <div className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <span>5-Page Free Preview</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <span>Viral Share Unlock (+4 Pages)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <span>Aisle-by-Aisle Grocery List</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <span>Printable 9:16 PDF Format</span>
            </div>
          </div>

          {/* 6. Formatted Description with Lists and Paragraph Dividers */}
          <div className="space-y-2 pt-1">
            <h3 className="text-xs uppercase font-bold tracking-widest text-[#dea374]">
              About This Collection &amp; Chapters
            </h3>
            {renderFormattedDescription(book.description)}
          </div>
        </div>
      </div>
    </div>
  );
};
