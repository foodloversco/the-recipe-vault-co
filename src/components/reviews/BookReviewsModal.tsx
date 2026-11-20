import React, { useState } from 'react';
import { Book, BookReview } from '../../types';
import { reviewStore } from '../../services/reviewStore';
import {
  Star,
  X,
  CheckCircle2,
  Lock,
  MessageSquare,
  ThumbsUp,
  Sparkles,
  CreditCard,
  Send
} from 'lucide-react';

interface BookReviewsModalProps {
  book: Book;
  isOpen: boolean;
  isUnlocked: boolean;
  isThirdOpenPrompt?: boolean;
  onClose: () => void;
  onOpenCheckout?: (item: { id: string; type: 'book'; title: string; price: number; originalPrice?: number }) => void;
  onReviewSubmitted?: () => void;
}

export const BookReviewsModal: React.FC<BookReviewsModalProps> = ({
  book,
  isOpen,
  isUnlocked,
  isThirdOpenPrompt = false,
  onClose,
  onOpenCheckout,
  onReviewSubmitted,
}) => {
  const [reviews, setReviews] = useState<BookReview[]>(() =>
    reviewStore.getReviewsForBook(book.slug || book.id)
  );
  const [showAddReviewForm, setShowAddReviewForm] = useState<boolean>(isThirdOpenPrompt);
  const [selectedRating, setSelectedRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [authorName, setAuthorName] = useState<string>('');
  const [authorLocation, setAuthorLocation] = useState<string>('');
  const [reviewComment, setReviewComment] = useState<string>('');
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const stats = reviewStore.getRatingStats(book.slug || book.id);
  const hasAlreadyRated = reviewStore.hasUserRatedBook(book.id);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    const newRev = reviewStore.addReview(
      book.id,
      authorName.trim() || 'Verified Home Chef',
      selectedRating,
      reviewComment.trim(),
      authorLocation.trim() || 'Verified Buyer'
    );

    setReviews([newRev, ...reviews]);
    setSubmitSuccess(true);
    setShowAddReviewForm(false);
    if (onReviewSubmitted) onReviewSubmitted();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-[#181614] border border-[#3b3228] rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl relative text-[#f5f2eb] my-auto">
        {/* Header */}
        <div className="p-5 border-b border-[#29241e] flex items-center justify-between bg-gradient-to-r from-[#211b15] to-[#181614]">
          <div className="flex items-center gap-3">
            <img
              src={book.coverImage}
              alt={book.title}
              className="w-10 h-14 rounded-lg object-cover border border-[#cf7b3e]/40 shadow-md"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif font-bold text-white text-base truncate max-w-[260px] sm:max-w-md">
                  {book.title}
                </span>
              </div>
              <p className="text-[11px] text-[#dea374] flex items-center gap-1">
                <span>Verified Buyer Reviews &amp; Ratings</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#888] hover:text-white hover:bg-[#25201b]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3rd Open Special Welcome Banner */}
        {isThirdOpenPrompt && !submitSuccess && (
          <div className="bg-gradient-to-r from-[#cf7b3e]/20 via-[#2a1e15] to-[#cf7b3e]/20 border-b border-[#cf7b3e]/40 px-5 py-3 flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-amber-400 flex-shrink-0 animate-bounce" />
            <div className="text-xs">
              <strong className="text-white">Welcome back for your 3rd session!</strong>
              <p className="text-[#d8cfc4] text-[11px] mt-0.5">
                Since you own this collection, please leave a quick rating to help new buyers discover these recipes!
              </p>
            </div>
          </div>
        )}

        <div className="p-5 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Rating Summary Card */}
          <div className="bg-[#201b17] border border-[#322a21] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-5">
            <div className="text-center sm:text-left flex items-center gap-4">
              <div>
                <div className="font-serif text-4xl sm:text-5xl font-extrabold text-white">
                  {stats.count > 0 ? stats.average.toFixed(1) : '5.0'}
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-1 mt-1 text-amber-400">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        stats.count > 0
                          ? i < Math.round(stats.average)
                            ? 'fill-amber-400'
                            : 'text-[#443b32]'
                          : 'fill-amber-400'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-[11px] text-[#a1998f] mt-1">
                  {stats.count > 0
                    ? `${stats.count} Verified Rating${stats.count === 1 ? '' : 's'} • 100% Recommended`
                    : '★ New First Edition • Be the first verified buyer to leave a review!'}
                </p>
              </div>
            </div>

            {/* Rating Breakdown Bars */}
            <div className="w-full sm:w-1/2 space-y-1 text-[11px] text-[#b3aaa0]">
              {[5, 4, 3, 2, 1].map((star) => {
                const pct = stats.breakdown[star] || 0;
                return (
                  <div key={star} className="flex items-center gap-2">
                    <span className="w-10 text-right">{star} Star</span>
                    <div className="flex-1 bg-[#131110] rounded-full h-2 overflow-hidden border border-[#2e2720]">
                      <div
                        className="bg-amber-400 h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                    <span className="w-8 text-right font-mono text-[#dea374]">{pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Rate Button or Verified Gate */}
          {submitSuccess ? (
            <div className="bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 rounded-2xl p-4 text-xs flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <span>Thank you! Your verified 5-star rating &amp; review has been published.</span>
            </div>
          ) : !isUnlocked ? (
            /* Locked Rating Gate for Non-Buyers */
            <div className="bg-[#211a14] border border-[#3e3226] rounded-2xl p-4 text-xs flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 text-center sm:text-left">
                <div className="p-2 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-400 flex-shrink-0">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs">Verified Buyers Only</h4>
                  <p className="text-[11px] text-[#a8a196]">
                    Unlock this collection for $1.00 to submit your verified rating.
                  </p>
                </div>
              </div>

              {onOpenCheckout && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenCheckout({
                      id: book.id,
                      type: 'book',
                      title: book.title,
                      price: book.price,
                      originalPrice: book.originalPrice,
                    })
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#cf7b3e] to-[#b8612b] hover:brightness-110 text-white font-bold text-xs shadow-md flex items-center gap-1.5 whitespace-nowrap"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Buy Collection ($1)</span>
                </button>
              )}
            </div>
          ) : !showAddReviewForm && !hasAlreadyRated ? (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowAddReviewForm(true)}
                className="px-4 py-2 rounded-xl bg-[#251f1a] hover:bg-[#332b23] border border-[#cf7b3e]/40 text-[#dea374] text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <Star className="w-3.5 h-3.5 fill-[#dea374]" />
                <span>Write a Verified Review</span>
              </button>
            </div>
          ) : null}

          {/* Interactive Rating Form (For Verified Buyers) */}
          {showAddReviewForm && !submitSuccess && (
            <form onSubmit={handleSubmitReview} className="bg-[#201b17] border border-[#cf7b3e]/50 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-[#2e261f] pb-2.5">
                <h4 className="font-serif font-bold text-white text-sm flex items-center gap-2">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>Leave Your Verified Review</span>
                </h4>
                <button
                  type="button"
                  onClick={() => setShowAddReviewForm(false)}
                  className="text-xs text-[#888] hover:text-white"
                >
                  Cancel
                </button>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#c4bcae] mb-1">
                  Select Your Star Rating *
                </label>
                <div className="flex items-center gap-2 py-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setSelectedRating(star)}
                      className="p-1 text-2xl transition-transform hover:scale-110 focus:outline-none"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= (hoverRating || selectedRating)
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-[#443b32]'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-amber-300 ml-2 font-mono">
                    {hoverRating || selectedRating} / 5 Stars
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#c4bcae] mb-1">
                    Your Name / Nickname *
                  </label>
                  <input
                    type="text"
                    required
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="e.g. Johan van Zyl"
                    className="w-full bg-[#131110] border border-[#383027] rounded-xl px-3 py-2 text-xs text-white placeholder-[#686055] focus:outline-none focus:border-[#cf7b3e]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#c4bcae] mb-1">
                    Your City / Country (Optional)
                  </label>
                  <input
                    type="text"
                    value={authorLocation}
                    onChange={(e) => setAuthorLocation(e.target.value)}
                    placeholder="e.g. Cape Town, SA"
                    className="w-full bg-[#131110] border border-[#383027] rounded-xl px-3 py-2 text-xs text-white placeholder-[#686055] focus:outline-none focus:border-[#cf7b3e]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#c4bcae] mb-1">
                  Your Feedback for Other Home Cooks *
                </label>
                <textarea
                  rows={3}
                  required
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Which braai or heritage recipe did you cook? How did the spices and grocery checklist work for you?"
                  className="w-full bg-[#131110] border border-[#383027] rounded-xl px-3 py-2 text-xs text-white placeholder-[#686055] focus:outline-none focus:border-[#cf7b3e]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#cf7b3e] to-[#b8612b] hover:brightness-110 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Verified Review</span>
              </button>
            </form>
          )}

          {/* Verified Reviews Feed */}
          <div className="space-y-3.5">
            <h4 className="text-xs uppercase font-bold tracking-wider text-[#dea374]">
              Customer Reviews ({reviews.length})
            </h4>

            {reviews.length === 0 ? (
              <div className="bg-[#1e1915] border border-[#2e261f] rounded-2xl p-6 text-center space-y-2">
                <Star className="w-8 h-8 text-amber-400 mx-auto fill-amber-400/20" />
                <h5 className="font-serif font-bold text-white text-sm">No Reviews Yet</h5>
                <p className="text-xs text-[#a8a196] max-w-sm mx-auto leading-relaxed">
                  Be the first verified buyer to leave a rating and review for this brand-new collection!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="bg-[#1e1915] border border-[#2e261f] rounded-2xl p-4 space-y-2 hover:border-[#cf7b3e]/40 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-white">{rev.authorName}</span>
                          {rev.isVerifiedBuyer && (
                            <span className="text-[9px] uppercase font-bold tracking-wider text-emerald-400 bg-emerald-950/70 px-2 py-0.2 rounded-full border border-emerald-500/30 flex items-center gap-1">
                              <CheckCircle2 className="w-2.5 h-2.5" />
                              <span>Verified Buyer</span>
                            </span>
                          )}
                        </div>
                        {rev.authorLocation && (
                          <p className="text-[10px] text-[#8e8578]">{rev.authorLocation}</p>
                        )}
                      </div>

                      <div className="flex items-center gap-1 text-amber-400">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < rev.rating ? 'fill-amber-400' : 'text-[#443b32]'
                            }`}
                          />
                        ))}
                        <span className="text-[10px] text-[#8e8578] font-mono ml-1">
                          {rev.date}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-[#d1c8bd] leading-relaxed italic">
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
