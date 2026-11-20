import React, { useState, useRef } from 'react';
import { Book } from '../../types';
import { ChevronLeft, ChevronRight, Eye, BookOpen, Sparkles, Layers } from 'lucide-react';

interface CoverCarouselSectionProps {
  title: string;
  subtitle?: string;
  categoryTag: string;
  books: Book[];
  onInspectBook: (book: Book) => void;
  onOpenReader: (slug: string) => void;
}

export const CoverCarouselSection: React.FC<CoverCarouselSectionProps> = ({
  title,
  subtitle,
  categoryTag,
  books,
  onInspectBook,
  onOpenReader,
}) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const touchStartX = useRef<number | null>(null);

  if (books.length === 0) return null;

  const handlePrev = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : books.length - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev < books.length - 1 ? prev + 1 : 0));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) handleNext();
      else handlePrev();
    }
    touchStartX.current = null;
  };

  return (
    <section className="pt-4 sm:pt-8 pb-12 px-3 sm:px-6 max-w-6xl mx-auto overflow-hidden">
      {/* Category Header */}
      <div className="text-center mb-5 sm:mb-8">
        <span className="text-[10px] sm:text-[11px] uppercase font-bold tracking-widest text-[#dea374] bg-[#241c16] px-3.5 py-1 rounded-full border border-[#cf7b3e]/30 inline-block mb-1.5 sm:mb-2">
          {categoryTag}
        </span>
        <h2 className="font-serif text-2xl sm:text-4xl font-extrabold text-white tracking-wide uppercase">
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs sm:text-sm text-[#a8a196] max-w-xl mx-auto mt-1 sm:mt-2 leading-relaxed">
            {subtitle}
          </p>
        )}

        {/* Quick Volume Switcher Tabs (when there are multiple books) */}
        {books.length > 1 && (
          <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
            {books.map((book, bIdx) => {
              const isSelected = bIdx === activeIndex;
              const shortTitle = book.title.includes('Series 2')
                ? 'Series 2 (New)'
                : book.title.includes('Series 1')
                ? 'Series 1'
                : `Vol 0${bIdx + 1}`;

              return (
                <button
                  key={book.id}
                  onClick={() => setActiveIndex(bIdx)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#cf7b3e] to-[#b8612b] text-white shadow-lg shadow-[#cf7b3e]/30 border border-[#dea374]'
                      : 'bg-[#1b1713] text-[#a89e91] hover:text-white border border-[#332b21] hover:bg-[#26201a]'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>{shortTitle}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 3D Carousel / Coverflow Stage */}
      <div
        className="relative flex items-center justify-center min-h-[500px] sm:min-h-[560px] select-none"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Left Arrow Button */}
        {books.length > 1 && (
          <button
            onClick={handlePrev}
            aria-label="Previous Book"
            className="absolute left-1 sm:left-6 z-30 w-11 h-11 rounded-full bg-black/80 hover:bg-black border border-[#cf7b3e]/40 text-white flex items-center justify-center shadow-2xl transition-all hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-md"
          >
            <ChevronLeft className="w-6 h-6 text-[#dea374]" />
          </button>
        )}

        {/* Cards Stack */}
        <div className="relative w-full max-w-[320px] sm:max-w-[360px] h-[460px] sm:h-[510px] flex items-center justify-center">
          {books.map((book, idx) => {
            const offset = idx - activeIndex;
            const isCenter = offset === 0;
            const isLeft = offset === -1 || (activeIndex === 0 && idx === books.length - 1);
            const isRight = offset === 1 || (activeIndex === books.length - 1 && idx === 0);

            if (!isCenter && !isLeft && !isRight) return null;

            let transformClass = '';
            let zIndexClass = 'z-10';
            let opacityClass = 'opacity-40 scale-85';

            if (isCenter) {
              transformClass = 'translate-x-0 scale-100';
              zIndexClass = 'z-20';
              opacityClass = 'opacity-100 shadow-[0_20px_50px_rgba(207,123,62,0.25)]';
            } else if (isLeft) {
              transformClass = '-translate-x-[36%] sm:-translate-x-[55%] scale-90 -rotate-3';
              opacityClass = 'opacity-60 hover:opacity-85 cursor-pointer';
            } else if (isRight) {
              transformClass = 'translate-x-[36%] sm:translate-x-[55%] scale-90 rotate-3';
              opacityClass = 'opacity-60 hover:opacity-85 cursor-pointer';
            }

            return (
              <div
                key={book.id}
                onClick={() => {
                  if (isCenter) {
                    onInspectBook(book);
                  } else {
                    setActiveIndex(idx);
                  }
                }}
                className={`absolute inset-0 transition-all duration-500 ease-out flex flex-col rounded-[26px] overflow-hidden bg-[#161310] border-2 ${
                  isCenter ? 'border-[#cf7b3e]' : 'border-[#332b22]'
                } ${transformClass} ${zIndexClass} ${opacityClass}`}
              >
                {/* Card Top Bezel Bar (Matching Screenshot Pill Layout) */}
                <div className="px-3.5 py-2 bg-[#1a1613] border-b border-[#29221b] flex items-center justify-between text-[10px] font-bold">
                  <span className="uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#261f18] text-[#dea374] border border-[#cf7b3e]/30 truncate max-w-[170px]">
                    {book.category}
                  </span>
                  <span className="uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#201c18] text-[#c2bcaf] border border-[#382f25]">
                    {book.recipeCount || 30} RECIPES
                  </span>
                </div>

                {/* 9:16 Full Cover Image Area */}
                <div className="flex-1 relative overflow-hidden bg-[#0c0a09] group cursor-pointer flex items-center justify-center">
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-full h-full object-contain object-top select-none transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Click to Inspect Overlay Tag (Matching Reference Screenshot) */}
                  <div className="absolute inset-x-0 bottom-4 flex justify-center px-3 pointer-events-none">
                    <span className="text-xs font-bold text-amber-300 bg-black/75 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-amber-400/40 flex items-center gap-1.5 shadow-xl">
                      <Eye className="w-3.5 h-3.5 text-amber-400" />
                      <span>Click to Inspect Book Details</span>
                    </span>
                  </div>
                </div>

                {/* Card Bottom Panel (Matching Screenshot Title & Inspect Card Button) */}
                <div className="p-3 bg-[#14110e] border-t border-[#29221b]">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0 pr-1">
                      <h3 className="font-serif text-xs sm:text-sm font-extrabold text-white uppercase tracking-wider truncate">
                        {book.title}
                      </h3>
                      <p className="text-[10px] text-[#8e8578] truncate mt-0.5">
                        {book.subtitle || '5 Free Pages Preview • Instant PDF'}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onInspectBook(book);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-[#261e17] hover:bg-[#352a20] text-amber-300 border border-amber-500/40 text-[11px] font-bold flex items-center gap-1 transition-all flex-shrink-0 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-amber-400" />
                      <span>Inspect</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Arrow Button */}
        {books.length > 1 && (
          <button
            onClick={handleNext}
            aria-label="Next Book"
            className="absolute right-1 sm:right-6 z-30 w-11 h-11 rounded-full bg-black/80 hover:bg-black border border-[#cf7b3e]/40 text-white flex items-center justify-center shadow-2xl transition-all hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-md"
          >
            <ChevronRight className="w-6 h-6 text-[#dea374]" />
          </button>
        )}
      </div>

      {/* Bottom Pagination & Glowing Dots (Matching Screenshot: Card X of Y) */}
      <div className="flex flex-col items-center justify-center mt-5 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-[#a8a196]">
            Card <strong className="text-white">{activeIndex + 1}</strong> of <strong className="text-white">{books.length}</strong>
          </span>
        </div>

        {/* Dot Progress Indicators */}
        <div className="flex items-center gap-1.5">
          {books.map((_, dotIdx) => (
            <button
              key={dotIdx}
              onClick={() => setActiveIndex(dotIdx)}
              aria-label={`Go to card ${dotIdx + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                dotIdx === activeIndex
                  ? 'w-6 bg-[#cf7b3e] shadow-sm shadow-[#cf7b3e]'
                  : 'w-2 bg-[#332b23] hover:bg-[#4d4034]'
              }`}
            />
          ))}
        </div>
      </div>

      {/* VISIBLE ALL VOLUMES SHELF (Shows both books clearly so none is hidden) */}
      {books.length > 1 && (
        <div className="mt-10 pt-6 border-t border-[#29221b]">
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="font-serif text-sm sm:text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#cf7b3e]" />
              <span>All Volumes in this Series ({books.length})</span>
            </h3>
            <span className="text-[11px] text-[#8e8578]">Tap to inspect or flip</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {books.map((b, bIdx) => {
              const isCurrent = bIdx === activeIndex;
              return (
                <div
                  key={b.id}
                  onClick={() => {
                    setActiveIndex(bIdx);
                    onInspectBook(b);
                  }}
                  className={`bg-[#181411] border rounded-2xl p-3 flex flex-col justify-between cursor-pointer group transition-all ${
                    isCurrent
                      ? 'border-[#cf7b3e] shadow-lg shadow-[#cf7b3e]/20 ring-1 ring-[#cf7b3e]/50'
                      : 'border-[#2d251d] hover:border-[#cf7b3e]/60 hover:bg-[#201a15]'
                  }`}
                >
                  <div className="aspect-[9/16] rounded-xl overflow-hidden bg-[#0c0a09] border border-[#26201a] mb-2.5 relative">
                    <img
                      src={b.coverImage}
                      alt={b.title}
                      className="w-full h-full object-contain object-top group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-1.5 left-1.5 bg-black/80 px-2 py-0.5 rounded-full text-[9px] font-bold text-[#dea374] border border-[#cf7b3e]/30">
                      {b.title.includes('Series 2') ? 'Series 2' : 'Series 1'}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-serif text-xs font-bold text-white line-clamp-1 leading-snug">
                      {b.title}
                    </h4>
                    <p className="text-[10px] text-[#9c9388] mt-0.5">
                      30 Recipes • 5 Free Pages
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 mt-2.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenReader(b.slug);
                      }}
                      className="flex-1 py-1.5 px-2 rounded-lg bg-[#241d17] hover:bg-[#32271e] text-[10px] font-bold text-amber-300 border border-amber-600/30 flex items-center justify-center gap-1"
                    >
                      <BookOpen className="w-3 h-3" />
                      <span>Flip</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onInspectBook(b);
                      }}
                      className="flex-1 py-1.5 px-2 rounded-lg bg-[#cf7b3e] hover:bg-[#b8612b] text-[10px] font-bold text-white flex items-center justify-center gap-1"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Inspect</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};
