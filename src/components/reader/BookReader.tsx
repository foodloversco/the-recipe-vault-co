import React, { useState, useEffect, useRef } from 'react';
import { Book, RecipePage } from '../../types';
import { 
  ChevronLeft, 
  ChevronRight, 
  Printer, 
  Lock, 
  Unlock, 
  Share2, 
  Maximize2, 
  Minimize2, 
  List, 
  Clock, 
  Flame, 
  Users, 
  CheckSquare, 
  Sparkles, 
  X,
  CreditCard,
  FileText
} from 'lucide-react';

interface BookReaderProps {
  book: Book;
  isUnlocked: boolean;
  onBack: () => void;
  onOpenCheckout: (item: { id: string; type: 'book'; title: string; price: number; originalPrice?: number }) => void;
  onUnlockSuccess: () => void;
}

export const BookReader: React.FC<BookReaderProps> = ({
  book,
  isUnlocked,
  onBack,
  onOpenCheckout,
  onUnlockSuccess
}) => {
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showToc, setShowToc] = useState<boolean>(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [tokenInput, setTokenInput] = useState<string>('');
  const [tokenError, setTokenError] = useState<string>('');
  const [isFlipping, setIsFlipping] = useState<'next' | 'prev' | null>(null);

  const pages = book.pages || [];
  const totalPages = pages.length > 0 ? pages.length : 30;
  const previewLimit = book.previewPagesAllowed || 5;

  const currentPage: RecipePage | undefined = pages[currentPageIndex];
  const isPageLocked = !isUnlocked && currentPageIndex >= previewLimit;

  // Handle URL hash or query update for unique book link
  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set('book', book.slug);
    window.history.replaceState({}, '', url.toString());
  }, [book.slug]);

  // Keyboard navigation like Kindle
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        handleNextPage();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        handlePrevPage();
      } else if (e.key === 'Escape') {
        if (showToc) setShowToc(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPageIndex, isUnlocked]);

  const handleNextPage = () => {
    if (currentPageIndex < totalPages - 1) {
      setIsFlipping('next');
      setTimeout(() => {
        setCurrentPageIndex((prev) => prev + 1);
        setIsFlipping(null);
      }, 150);
    }
  };

  const handlePrevPage = () => {
    if (currentPageIndex > 0) {
      setIsFlipping('prev');
      setTimeout(() => {
        setCurrentPageIndex((prev) => prev - 1);
        setIsFlipping(null);
      }, 150);
    }
  };

  // Touch Swipe Handling for Phone
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    if (diff > 45) {
      // Swiped Left -> Next page
      handleNextPage();
    } else if (diff < -45) {
      // Swiped Right -> Prev page
      handlePrevPage();
    }
    setTouchStartX(null);
  };

  const handleCopyLink = () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}?book=${book.slug}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handlePrint = () => {
    if (!isUnlocked) {
      alert('Printing is enabled once you unlock the full collection!');
      return;
    }
    window.print();
  };

  const handleValidateToken = (e: React.FormEvent) => {
    e.preventDefault();
    if (tokenInput.trim().toUpperCase().startsWith('RV-') || tokenInput.trim().length >= 6) {
      onUnlockSuccess();
      setTokenError('');
    } else {
      setTokenError('Invalid access token. Please check your purchase email.');
    }
  };

  return (
    <div className={`min-h-screen bg-[#0e0d0c] text-white flex flex-col items-center select-none ${isFullscreen ? 'p-0' : 'p-2 sm:p-6'}`}>
      {/* Top Floating Control Bar */}
      <div className="w-full max-w-4xl flex items-center justify-between pb-3 px-2 border-b border-[#25221e] mb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs sm:text-sm text-[#c2bcaf] hover:text-white bg-[#1c1a18] px-3 py-1.5 rounded-full border border-[#302c27] transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Catalog</span>
        </button>

        {/* Title & Preview Indicator */}
        <div className="text-center px-2 truncate max-w-[200px] sm:max-w-md">
          <h2 className="text-xs sm:text-sm font-semibold truncate text-[#f2efe9]">
            {book.title}
          </h2>
          <div className="flex items-center justify-center gap-1 text-[11px] text-[#a8a196]">
            <span>Page {currentPageIndex + 1} of {totalPages}</span>
            {!isUnlocked && (
              <span className="ml-1 text-[10px] text-amber-400 bg-amber-950/60 px-1.5 py-0.2 rounded border border-amber-600/30">
                Preview ({Math.min(currentPageIndex + 1, previewLimit)}/5)
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons: TOC, Print, Share, Fullscreen */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowToc(!showToc)}
            title="Table of Contents"
            className="p-2 rounded-full bg-[#1c1a18] border border-[#302c27] text-[#cf7b3e] hover:bg-[#2b2722]"
          >
            <List className="w-4 h-4" />
          </button>

          <button
            onClick={handlePrint}
            title={isUnlocked ? "Print Current Recipe Card" : "Unlock to print"}
            className={`p-2 rounded-full border transition-all ${
              isUnlocked 
                ? 'bg-[#1c1a18] border-[#302c27] text-white hover:bg-[#2b2722] hover:text-[#dea374]' 
                : 'bg-[#161413] border-[#222] text-[#666] cursor-not-allowed'
            }`}
          >
            <Printer className="w-4 h-4" />
          </button>

          <button
            onClick={handleCopyLink}
            title="Copy Unique Book Link"
            className="p-2 rounded-full bg-[#1c1a18] border border-[#302c27] text-[#c2bcaf] hover:text-white hover:bg-[#2b2722]"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            title="Toggle Phone Frame / Fullscreen"
            className="p-2 rounded-full bg-[#1c1a18] border border-[#302c27] text-[#c2bcaf] hover:text-white hover:bg-[#2b2722] hidden sm:block"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {copiedLink && (
        <div className="fixed top-16 z-50 bg-[#cf7b3e] text-white text-xs px-4 py-2 rounded-full shadow-xl">
          Unique link copied to clipboard!
        </div>
      )}

      {/* Main Reader Container: EXACT default phone size 360 x 600 */}
      <div 
        className={`relative transition-all duration-300 flex flex-col justify-between overflow-hidden ${
          isFullscreen 
            ? 'w-full max-w-[420px] h-[92vh] rounded-none sm:rounded-3xl' 
            : 'w-[360px] h-[600px] rounded-[36px] shadow-2xl border-[8px] border-[#25221e]'
        } bg-[#181614] shadow-kindle`}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Phone Speaker Notch Header (Kindle mobile bezel style) */}
        <div className="h-6 w-full bg-[#121110] flex items-center justify-between px-6 text-[10px] text-[#706a62] select-none border-b border-[#211f1c]">
          <span>9:41</span>
          <div className="w-12 h-1.5 bg-[#25221e] rounded-full"></div>
          <div className="flex items-center gap-1 font-mono">
            <span>VAULT</span>
            <span>100%</span>
          </div>
        </div>

        {/* Page Content Body */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden relative p-4 print:p-0 print:overflow-visible flex flex-col justify-between">
          {/* If Page is Locked: Show Elegant Paywall */}
          {isPageLocked ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-4 bg-gradient-to-b from-[#211a14] via-[#1a1612] to-[#12100e] rounded-2xl border border-[#cf7b3e]/30">
              <div className="w-16 h-16 rounded-full bg-[#cf7b3e]/20 border border-[#cf7b3e] flex items-center justify-center mb-4 text-[#dea374] animate-pulse">
                <Lock className="w-8 h-8" />
              </div>

              <span className="text-[11px] font-bold tracking-widest uppercase text-[#dea374] mb-1">
                PREVIEW LIMIT REACHED
              </span>

              <h3 className="font-serif text-xl font-bold text-white mb-2 leading-tight">
                Unlock the Full 30-Recipe Collection
              </h3>

              <p className="text-xs text-[#b8b0a5] mb-4 leading-relaxed">
                You’ve explored the first 5 free preview cards. Unlock all 30 phone-ready recipes, full step-by-step master guides, and one-stop grocery checklists for this collection.
              </p>

              <div className="w-full bg-[#27211b] p-3 rounded-xl border border-[#3f352c] mb-4">
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-3xl font-extrabold text-white">${book.price.toFixed(2)}</span>
                  {book.originalPrice && (
                    <span className="text-xs line-through text-[#827a70]">${book.originalPrice.toFixed(2)}</span>
                  )}
                  <span className="text-[11px] text-[#dea374] font-medium">USD</span>
                </div>
                <p className="text-[10px] text-[#9c9388] mt-0.5">One-time purchase • Instant Phone & PDF Access</p>
              </div>

              {/* PayPal Checkout Trigger Button */}
              <button
                onClick={() => onOpenCheckout({ id: book.id, type: 'book', title: book.title, price: book.price, originalPrice: book.originalPrice })}
                className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-[#cf7b3e] to-[#b8612b] text-white shadow-lg shadow-[#cf7b3e]/30 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 mb-3"
              >
                <CreditCard className="w-4 h-4" />
                <span>Buy Now with PayPal (${book.price.toFixed(2)})</span>
              </button>

              {/* Already purchased unlock code input */}
              <form onSubmit={handleValidateToken} className="w-full mt-2 pt-2 border-t border-[#2e2720]">
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={tokenInput}
                    onChange={(e) => setTokenInput(e.target.value)}
                    placeholder="Already bought? Enter token"
                    className="flex-1 bg-[#141210] border border-[#3b332b] rounded-lg px-2.5 py-1 text-xs text-white placeholder-[#6c655b] focus:outline-none focus:border-[#cf7b3e]"
                  />
                  <button
                    type="submit"
                    className="bg-[#2e2720] hover:bg-[#3d332a] text-[#dea374] text-xs font-semibold px-3 py-1 rounded-lg border border-[#443a2f]"
                  >
                    Unlock
                  </button>
                </div>
                {tokenError && <p className="text-[10px] text-rose-400 mt-1">{tokenError}</p>}
              </form>

              <button
                onClick={() => setCurrentPageIndex(0)}
                className="mt-3 text-[11px] text-[#938b80] hover:text-white underline"
              >
                Return to Cover
              </button>
            </div>
          ) : currentPage ? (
            /* Render Current Page Content */
            <div className={`h-full flex flex-col justify-between transition-transform duration-200 ${isFlipping === 'next' ? 'translate-x-1 opacity-90' : isFlipping === 'prev' ? '-translate-x-1 opacity-90' : ''}`}>
              {/* Cover Page (Page 1) - Full 9:16 Phone Cover Display */}
              {currentPage.isCover ? (
                <div 
                  className="h-full w-full relative flex flex-col justify-between overflow-hidden rounded-2xl group cursor-pointer select-none" 
                  onClick={handleNextPage}
                >
                  {/* Full 9:16 Cover Image Background */}
                  <img 
                    src={currentPage.image || book.coverImage} 
                    alt={book.title} 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  />

                  {/* Subtle Top & Bottom Cinematic Vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/60 pointer-events-none" />

                  {/* Top Brand Header */}
                  <div className="relative z-10 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img 
                        src="/assets/images/logo.png" 
                        alt="Logo" 
                        className="w-8 h-8 rounded-full border border-[#dea374]/60 object-contain" 
                      />
                      <div>
                        <span className="text-[9px] uppercase tracking-widest font-bold text-[#dea374] block">
                          THE RECIPE VAULT CO.
                        </span>
                        <span className="text-[10px] text-white/90 font-serif">PAGE 1 • COVER</span>
                      </div>
                    </div>

                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/60 border border-white/20 text-[#dea374] font-semibold">
                      9:16 COLLECTIBLE
                    </span>
                  </div>

                  {/* Bottom Title & Tap to Flip Prompt */}
                  <div className="relative z-10 p-5 pt-8 text-center">
                    <h1 className="font-serif text-xl sm:text-2xl font-bold text-white leading-tight drop-shadow-md">
                      {book.title}
                    </h1>
                    <p className="text-xs text-[#dea374] mt-1 font-serif italic drop-shadow">
                      {currentPage.subtitle || book.subtitle}
                    </p>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNextPage();
                      }}
                      className="mt-4 w-full py-3 rounded-xl bg-gradient-to-r from-[#cf7b3e] to-[#b8612b] hover:brightness-110 text-white font-bold text-xs tracking-wider uppercase shadow-xl transition-all flex items-center justify-center gap-2 active:scale-95"
                    >
                      <span>Tap to Start Reading (Page 2)</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : currentPage.isChecklist ? (
                /* Master Grocery Checklist Page */
                <div className="h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between border-b border-[#2b251f] pb-2 mb-3">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#dea374] tracking-widest">
                          STEP 01 • PROVISIONS
                        </span>
                        <h2 className="font-serif text-lg font-bold text-white leading-tight">
                          {currentPage.title}
                        </h2>
                      </div>
                      <CheckSquare className="w-5 h-5 text-[#dea374]" />
                    </div>

                    <div className="space-y-3 overflow-y-auto max-h-[380px] pr-1">
                      {currentPage.groceryChecklist?.map((group, idx) => (
                        <div key={idx} className="bg-[#1f1b17] p-2.5 rounded-xl border border-[#322c25]">
                          <h4 className="text-[11px] font-bold text-[#dea374] uppercase tracking-wider mb-1.5">
                            {group.category}
                          </h4>
                          <ul className="space-y-1">
                            {group.items.map((item, itemIdx) => (
                              <li key={itemIdx} className="text-xs text-[#d6d0c5] flex items-start gap-1.5">
                                <span className="text-[#cf7b3e] font-mono">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>

                  {currentPage.chefTip && (
                    <div className="mt-2 p-2 bg-[#26201a] rounded-lg border-l-2 border-[#cf7b3e] text-[10px] text-[#c9c1b5]">
                      {currentPage.chefTip}
                    </div>
                  )}
                </div>
              ) : (
                /* Standard Editorial Phone Recipe Card */
                <div className="h-full flex flex-col justify-between print:text-black">
                  <div>
                    {/* Header info */}
                    <div className="flex items-start justify-between border-b border-[#2b251f] pb-2 mb-2">
                      <div>
                        <span className="text-[9px] uppercase font-bold tracking-widest text-[#dea374]">
                          {currentPage.category || 'RECIPE CARD'} • #{currentPage.pageNumber}
                        </span>
                        <h2 className="font-serif text-base sm:text-lg font-bold text-white leading-tight">
                          {currentPage.title}
                        </h2>
                        {currentPage.subtitle && (
                          <p className="text-[11px] text-[#a8a196] italic mt-0.5">
                            {currentPage.subtitle}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Quick Stats: Time, Servings, Heat */}
                    <div className="grid grid-cols-3 gap-1 bg-[#1e1a16] p-1.5 rounded-lg border border-[#2d261f] text-[10px] mb-2 text-[#ccc4b8]">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#dea374]" />
                        <span>{currentPage.cookTime || '20m'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3 text-[#dea374]" />
                        <span>{currentPage.servings || '4 Serv'}</span>
                      </div>
                      <div className="flex items-center gap-1 truncate">
                        <Flame className="w-3 h-3 text-[#dea374]" />
                        <span className="truncate">{currentPage.heatLevel || 'Medium'}</span>
                      </div>
                    </div>

                    {/* Recipe Image */}
                    {currentPage.image && (
                      <div className="h-28 w-full rounded-xl overflow-hidden border border-[#332b22] mb-2 shadow-md">
                        <img 
                          src={currentPage.image} 
                          alt={currentPage.title} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                    )}

                    {/* Ingredients & Step Flow */}
                    <div className="space-y-2 text-xs overflow-y-auto max-h-[180px] pr-1">
                      {currentPage.ingredients && currentPage.ingredients.length > 0 && (
                        <div>
                          <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#dea374] mb-1">
                            Key Ingredients
                          </h4>
                          <ul className="space-y-0.5 text-[11px] text-[#dbd4c8]">
                            {currentPage.ingredients.map((ing, i) => (
                              <li key={i} className="flex items-start gap-1">
                                <span className="text-[#cf7b3e]">•</span>
                                <span>{ing}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {currentPage.instructions && currentPage.instructions.length > 0 && (
                        <div className="pt-1">
                          <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#dea374] mb-1">
                            Step-by-Step Method
                          </h4>
                          <ol className="space-y-1 text-[11px] text-[#dbd4c8]">
                            {currentPage.instructions.map((step, i) => (
                              <li key={i} className="flex items-start gap-1.5">
                                <span className="font-bold text-[#dea374] min-w-[14px]">{i + 1}.</span>
                                <span className="leading-tight">{step}</span>
                              </li>
                            ))}
                          </ol>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Chef Tip & Footer */}
                  {currentPage.chefTip && (
                    <div className="mt-2 p-1.5 bg-[#231d17] rounded-lg border-l-2 border-[#dea374] text-[10px] text-[#c7beaf] italic">
                      <span className="font-bold not-italic text-[#dea374]">Vault Note: </span>
                      {currentPage.chefTip}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-center text-xs text-[#888]">
              No page data available.
            </div>
          )}
        </div>

        {/* Bottom Kindle Navigation Bar */}
        <div className="h-12 bg-[#121110] border-t border-[#23201c] flex items-center justify-between px-4 text-xs">
          <button
            onClick={handlePrevPage}
            disabled={currentPageIndex === 0}
            className={`flex items-center gap-1 font-semibold ${
              currentPageIndex === 0 ? 'text-[#444] cursor-not-allowed' : 'text-[#dea374] hover:text-white'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Prev</span>
          </button>

          {/* Page Tracker Dots */}
          <div className="flex items-center gap-1">
            <span className="text-[11px] font-mono text-[#8a8277]">
              {currentPageIndex + 1} / {totalPages}
            </span>
          </div>

          <button
            onClick={handleNextPage}
            disabled={currentPageIndex === totalPages - 1}
            className={`flex items-center gap-1 font-semibold ${
              currentPageIndex === totalPages - 1 ? 'text-[#444] cursor-not-allowed' : 'text-[#dea374] hover:text-white'
            }`}
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Under-Reader Quick Hint */}
      <div className="mt-3 flex items-center justify-center gap-4 text-[11px] text-[#7d756a]">
        <span>← Swipe or use arrow keys to flip</span>
        <span>•</span>
        <span>Target: 360 × 600 phone scale</span>
        {isUnlocked ? (
          <>
            <span>•</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <Unlock className="w-3 h-3" /> Fully Unlocked
            </span>
          </>
        ) : (
          <>
            <span>•</span>
            <span className="text-amber-400 font-semibold">5 Pages Free</span>
          </>
        )}
      </div>

      {/* Table of Contents Drawer Modal */}
      {showToc && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-[#1a1715] border border-[#362f28] rounded-2xl w-full max-w-sm max-h-[80vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-[#2b251f] flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-white text-base">Table of Contents</h3>
                <p className="text-xs text-[#a8a196]">{book.title}</p>
              </div>
              <button 
                onClick={() => setShowToc(false)}
                className="p-1 rounded-lg text-[#888] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-1">
              {pages.map((p, idx) => {
                const isLocked = !isUnlocked && idx >= previewLimit;
                return (
                  <button
                    key={p.id || idx}
                    onClick={() => {
                      setCurrentPageIndex(idx);
                      setShowToc(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl flex items-center justify-between transition-all ${
                      currentPageIndex === idx 
                        ? 'bg-[#cf7b3e]/20 border border-[#cf7b3e] text-white' 
                        : 'hover:bg-[#25201b] text-[#c9c2b6]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span className="text-[11px] font-mono text-[#8a8277] w-5">
                        {idx + 1}.
                      </span>
                      <span className="text-xs truncate font-medium">
                        {p.title}
                      </span>
                    </div>

                    <div>
                      {isLocked ? (
                        <Lock className="w-3.5 h-3.5 text-amber-500" />
                      ) : (
                        <span className="text-[10px] text-[#777] uppercase font-mono">
                          {p.category || 'Page'}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
