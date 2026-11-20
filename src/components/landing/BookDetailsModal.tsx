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
  Sparkles
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-2xl bg-[#161311] border border-[#3d3227] rounded-3xl overflow-hidden shadow-2xl relative flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-[#2b241c] flex items-center justify-between bg-[#1a1613]">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-[#241c16] text-[#dea374] border border-[#cf7b3e]/30">
              {book.category}
            </span>
            <span className="text-xs text-[#8e8578]">• 30 Phone Recipes</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#9c9387] hover:text-white bg-[#251f19] hover:bg-[#332b23] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            {/* Left 9:16 Cover Mockup */}
            <div
              onClick={() => {
                onClose();
                onOpenReader(book.slug);
              }}
              className="w-full sm:w-5/12 aspect-[9/16] max-h-[380px] rounded-2xl overflow-hidden border-2 border-[#3d3227] relative group cursor-pointer shadow-xl bg-[#0c0a09] mx-auto flex-shrink-0"
            >
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-full h-full object-contain object-top group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end justify-center p-3">
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5 bg-black/60 px-3 py-1 rounded-full border border-amber-400/30">
                  <Eye className="w-3.5 h-3.5" />
                  <span>Tap Cover to Flip Book</span>
                </span>
              </div>
            </div>

            {/* Right Details */}
            <div className="w-full sm:w-7/12 space-y-3.5">
              <div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-white leading-tight">
                  {book.title}
                </h2>
                {book.subtitle && (
                  <p className="text-xs text-[#dea374] font-medium mt-1">
                    {book.subtitle}
                  </p>
                )}
              </div>

              {/* Rating & Likes */}
              <div className="flex items-center gap-3 text-xs flex-wrap">
                <button
                  type="button"
                  onClick={() => onOpenReviews(book)}
                  className="flex items-center gap-1 text-amber-400 bg-[#221c17] px-2.5 py-1 rounded-full border border-amber-500/30 hover:bg-[#2c241e]"
                >
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span className="font-bold text-white">
                    {stats.count > 0 ? stats.average.toFixed(1) : '★ New Launch'}
                  </span>
                  <span className="text-[#8e8578] text-[10px]">({stats.count} Reviews)</span>
                </button>

                {/* Like Button */}
                <button
                  type="button"
                  onClick={handleToggleFav}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition-all text-xs font-semibold ${
                    isFavorited
                      ? 'bg-rose-600 text-white border-rose-400'
                      : 'bg-[#221c17] text-rose-400 border-rose-500/30 hover:bg-rose-950/60'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-white text-white' : ''}`} />
                  <span>{isFavorited ? 'Liked' : 'Like'}</span>
                  <span className="font-bold">{book.likesCount ?? 0}</span>
                </button>

                {/* Share Button */}
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#221c17] text-[#c2bcaf] hover:text-white border border-[#382f25] text-xs font-semibold"
                >
                  <Share2 className="w-3.5 h-3.5 text-[#dea374]" />
                  <span>{copied ? 'Copied!' : 'Share'}</span>
                </button>
              </div>

              {/* Description */}
              <div className="bg-[#181512] p-3.5 rounded-xl border border-[#2b241c] text-xs text-[#c4bcae] leading-relaxed">
                <p>{book.description}</p>
              </div>

              {/* Highlights */}
              <div className="grid grid-cols-2 gap-2 text-[11px] text-[#dbd5cb]">
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

              {/* Price & Primary Action Buttons */}
              <div className="pt-2 border-t border-[#29221b] space-y-2.5">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-white">
                    {currency === 'ZAR' ? 'R20.00' : `$${book.price.toFixed(2)}`}
                  </span>
                  {book.originalPrice && (
                    <span className="text-sm line-through text-[#8e8578]">
                      {currency === 'ZAR' ? 'R260.00' : `$${book.originalPrice.toFixed(2)}`}
                    </span>
                  )}
                  <span className="text-xs font-bold text-[#dea374]">
                    {currency === 'ZAR' ? 'ZAR (Capitec / Card)' : 'USD (PayPal)'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      onClose();
                      onOpenReader(book.slug);
                    }}
                    className="py-2.5 px-4 rounded-xl bg-[#27211b] hover:bg-[#342c24] border border-amber-600/40 text-xs font-bold text-amber-300 flex items-center justify-center gap-2 transition-all cursor-pointer"
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
                    className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#cf7b3e] to-[#b8612b] hover:brightness-110 text-white text-xs font-bold shadow-lg shadow-[#cf7b3e]/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>{currency === 'ZAR' ? 'Buy Now (R20)' : `Buy Now ($${book.price.toFixed(2)})`}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
