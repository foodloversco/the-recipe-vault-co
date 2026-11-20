import React, { useState, useEffect, useRef } from 'react';
import { Book, RecipePage } from '../../types';
import { bookStore } from '../../services/bookStore';
import { reviewStore } from '../../services/reviewStore';
import { loadPdfDocument, renderSinglePdfPage } from '../../utils/pdfPageExtractor';
import { BookReviewsModal } from '../reviews/BookReviewsModal';
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
  X,
  CreditCard,
  Heart,
  Volume2,
  VolumeX,
  Download,
  Loader2,
  BookOpen,
  Star,
  Gift,
  Sparkles
} from 'lucide-react';

interface BookReaderProps {
  book: Book;
  isUnlocked: boolean;
  initialPage?: number;
  onBack: () => void;
  onOpenCheckout: (item: { id: string; type: 'book'; title: string; price: number; originalPrice?: number }) => void;
  onUnlockSuccess: () => void;
}

export const BookReader: React.FC<BookReaderProps> = ({
  book,
  isUnlocked,
  initialPage,
  onBack,
  onOpenCheckout,
  onUnlockSuccess,
}) => {
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(
    initialPage && initialPage > 0 ? initialPage - 1 : 0
  );
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showToc, setShowToc] = useState<boolean>(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [tokenInput, setTokenInput] = useState<string>('');
  const [tokenError, setTokenError] = useState<string>('');
  const [, setFavTick] = useState<number>(0);
  const [showReviewModal, setShowReviewModal] = useState<boolean>(false);
  const [isThirdOpenPrompt, setIsThirdOpenPrompt] = useState<boolean>(false);

  // 3rd Time Book Open Pop-Up For Verified Buyers
  useEffect(() => {
    if (isUnlocked) {
      const isThird = reviewStore.recordBookOpen(book.id, true);
      if (isThird) {
        setIsThirdOpenPrompt(true);
        const timer = setTimeout(() => {
          setShowReviewModal(true);
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [book.id, isUnlocked]);

  // 3D Page Flip Animation State
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev' | null>(null);
  const [flipProgress, setFlipProgress] = useState<boolean>(false);
  const [turningFromImage, setTurningFromImage] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Live PDF Document Rendering State
  const pdfDocRef = useRef<any>(null);
  const [pdfNumPages, setPdfNumPages] = useState<number>(0);
  const [renderedPdfPages, setRenderedPdfPages] = useState<Record<number, string>>({});
  const [isLoadingPdfPage, setIsLoadingPdfPage] = useState<boolean>(false);

  const pages = book.pages || [];
  const totalPages = pdfNumPages > 0 ? pdfNumPages : pages.length > 0 ? pages.length : 30;

  // Share to unlock next 4 bonus pages mechanism (Pages 1-5 free -> Share on P.6 -> Pages 6-9 unlocked -> Paywall on P.10)
  const [hasSharedForBonus, setHasSharedForBonus] = useState<boolean>(() => {
    try {
      return localStorage.getItem(`rv_shared_bonus_${book.id}`) === 'true';
    } catch {
      return false;
    }
  });
  const [bonusShareSuccess, setBonusShareSuccess] = useState<string | null>(null);

  const basePreviewLimit = book.previewPagesAllowed || 5; // 5 pages free initially
  const bonusPagesCount = hasSharedForBonus ? 4 : 0; // +4 pages if shared
  const effectivePreviewLimit = basePreviewLimit + bonusPagesCount; // 5 if unshared, 9 if shared!

  const currentPageNumber = currentPageIndex + 1;
  const currentPage: RecipePage | undefined = pages[currentPageIndex];
  const isPageLocked = !isUnlocked && currentPageIndex >= effectivePreviewLimit;
  const isCurrentPageBonus = !isUnlocked && hasSharedForBonus && currentPageIndex >= basePreviewLimit && currentPageIndex < effectivePreviewLimit;

  // Synthesize a subtle, realistic paper page-flip rustle sound via Web Audio API
  const playPageFlipSound = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const duration = 0.16;
      const bufferSize = ctx.sampleRate * duration;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        const env = Math.sin((i / bufferSize) * Math.PI);
        data[i] = (Math.random() * 2 - 1) * env * 0.12;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1100, ctx.currentTime);
      filter.Q.setValueAtTime(1.8, ctx.currentTime);

      noise.connect(filter);
      filter.connect(ctx.destination);
      noise.start();
    } catch {
      // Ignore audio context restrictions
    }
  };

  // Load actual uploaded PDF document when book opens
  useEffect(() => {
    let cancelled = false;
    if (!book.pdfFileUrl) return;

    (async () => {
      try {
        setIsLoadingPdfPage(true);
        const doc = await loadPdfDocument(book.pdfFileUrl!);
        if (cancelled) return;
        pdfDocRef.current = doc;
        setPdfNumPages(doc.numPages);

        // Immediately render Page 1 and Page 2
        const p1 = await renderSinglePdfPage(doc, 1, 900);
        if (cancelled) return;
        setRenderedPdfPages((prev) => ({ ...prev, 1: p1 }));
        setIsLoadingPdfPage(false);

        if (doc.numPages >= 2) {
          const p2 = await renderSinglePdfPage(doc, 2, 850);
          if (!cancelled) {
            setRenderedPdfPages((prev) => ({ ...prev, 2: p2 }));
          }
        }
      } catch (err) {
        console.warn('Could not load live PDF via pdfjs, falling back to book.pages:', err);
        if (!cancelled) setIsLoadingPdfPage(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [book.pdfFileUrl]);

  // Render current & next PDF pages on demand as user flips
  useEffect(() => {
    let cancelled = false;
    const doc = pdfDocRef.current;
    if (!doc) return;

    const pagesToEnsure = [currentPageNumber, currentPageNumber + 1, currentPageNumber - 1].filter(
      (p) => p >= 1 && p <= doc.numPages
    );

    (async () => {
      for (const pNum of pagesToEnsure) {
        if (renderedPdfPages[pNum]) continue;
        if (pNum === currentPageNumber) setIsLoadingPdfPage(true);
        try {
          const url = await renderSinglePdfPage(doc, pNum, 880);
          if (!cancelled) {
            setRenderedPdfPages((prev) => ({ ...prev, [pNum]: url }));
          }
        } catch (e) {
          console.warn('Failed to render PDF page', pNum, e);
        } finally {
          if (!cancelled && pNum === currentPageNumber) setIsLoadingPdfPage(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [currentPageNumber, pdfNumPages]);

  // Handle URL query update for unique book link
  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set('book', book.slug);
    window.history.replaceState({}, '', url.toString());
  }, [book.slug]);

  const getActivePageImage = (pageIdx: number): string | null => {
    const pNum = pageIdx + 1;
    if (renderedPdfPages[pNum]) return renderedPdfPages[pNum];
    const pObj = pages[pageIdx];
    if (pObj?.rawPdfPageUrl) return pObj.rawPdfPageUrl;
    if (pObj?.isCover && (pObj.image || book.coverImage)) return pObj.image || book.coverImage;
    if (pageIdx === 0 && book.coverImage) return book.coverImage;
    return null;
  };

  // Trigger real 3D page turn forward
  const handleNextPage = () => {
    if (currentPageIndex < totalPages - 1 && !flipDirection) {
      const currentImg = getActivePageImage(currentPageIndex);
      setTurningFromImage(currentImg);
      setFlipDirection('next');
      setFlipProgress(false);
      playPageFlipSound();

      // Advance underlying page so it reveals underneath the turning 3D sheet
      setCurrentPageIndex((prev) => prev + 1);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setFlipProgress(true);
        });
      });

      setTimeout(() => {
        setFlipDirection(null);
        setFlipProgress(false);
        setTurningFromImage(null);
      }, 520);
    }
  };

  // Trigger real 3D page turn backward
  const handlePrevPage = () => {
    if (currentPageIndex > 0 && !flipDirection) {
      const targetImg = getActivePageImage(currentPageIndex - 1);
      setTurningFromImage(targetImg);
      setFlipDirection('prev');
      setFlipProgress(false);
      playPageFlipSound();

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setFlipProgress(true);
        });
      });

      setTimeout(() => {
        setCurrentPageIndex((prev) => prev - 1);
        setFlipDirection(null);
        setFlipProgress(false);
        setTurningFromImage(null);
      }, 520);
    }
  };

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
  }, [currentPageIndex, isUnlocked, totalPages, flipDirection]);

  // Touch Swipe Handling for Phone
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    if (diff > 40) {
      handleNextPage();
    } else if (diff < -40) {
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

  // Viral Feature: Share on Page 6 to unlock the next 4 pages (Pages 6, 7, 8 & 9)
  const handleShareToUnlockBonus = async () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}?book=${book.slug}`;
    const shareTitle = `${book.title} - The Recipe Vault Co.`;
    const shareText = `Check out ${book.title}! Read free recipes and get the complete digital collection:`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          try {
            await navigator.clipboard.writeText(shareUrl);
          } catch {}
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
      } catch {}
    }

    try {
      localStorage.setItem(`rv_shared_bonus_${book.id}`, 'true');
    } catch {}
    setHasSharedForBonus(true);
    setBonusShareSuccess('🎉 4 Bonus Pages Unlocked! You can now flip through Pages 6 to 9.');
    playPageFlipSound();

    setTimeout(() => {
      setBonusShareSuccess(null);
    }, 4500);
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

  const activePdfSlideUrl = getActivePageImage(currentPageIndex);
  const currentSyntheticRecipe: RecipePage = currentPage || {
    id: `pdf-p-${currentPageNumber}`,
    pageNumber: currentPageNumber,
    title: currentPageNumber === 1 ? book.title : `${book.title} • Page ${currentPageNumber}`,
    subtitle: `Page ${currentPageNumber} of ${totalPages}`,
    category: currentPageNumber === 1 ? 'Cover' : 'Heritage Mains',
    image: activePdfSlideUrl || book.coverImage,
    isCover: currentPageNumber === 1,
  };

  const isCurrentLiked =
    currentPageNumber === 1
      ? bookStore.isBookFavorited(book.id)
      : bookStore.isRecipeFavorited(book.id, currentPageNumber);

  return (
    <div
      className={`min-h-screen bg-[#0e0d0c] text-white flex flex-col items-center select-none ${
        isFullscreen ? 'p-0' : 'p-2 sm:p-6'
      }`}
    >
      {/* Top Floating Control Bar */}
      <div className="w-full max-w-4xl flex items-center justify-between pb-3 px-2 border-b border-[#25221e] mb-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs sm:text-sm text-[#c2bcaf] hover:text-white bg-[#1c1a18] px-3 py-1.5 rounded-full border border-[#302c27] transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Catalog</span>
        </button>

        {/* Title & Preview Indicator */}
        <div className="text-center px-2 truncate max-w-[190px] sm:max-w-md">
          <h2 className="text-xs sm:text-sm font-semibold truncate text-[#f2efe9]">
            {book.title}
          </h2>
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#a8a196]">
            <span>
              Page {currentPageNumber} of {totalPages}
            </span>
            {!isUnlocked ? (
              <span className="text-[10px] text-amber-400 bg-amber-950/60 px-1.5 py-0.2 rounded border border-amber-600/30">
                {hasSharedForBonus ? (
                  <span>Bonus Preview ({Math.min(currentPageNumber, effectivePreviewLimit)}/{effectivePreviewLimit})</span>
                ) : (
                  <span>Free Preview ({Math.min(currentPageNumber, effectivePreviewLimit)}/{effectivePreviewLimit})</span>
                )}
              </span>
            ) : (
              <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-500/30">
                Full PDF Unlocked
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons: Reviews / Ratings, Favorite Recipe, Flip Sound, TOC, Print, Share, Fullscreen */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              setIsThirdOpenPrompt(false);
              setShowReviewModal(true);
            }}
            title="Read or Submit Verified Buyer Reviews"
            className="px-2.5 py-1.5 rounded-full border border-amber-500/30 bg-[#1c1a18] hover:bg-[#2b2722] text-amber-400 text-xs font-semibold flex items-center gap-1 transition-all"
          >
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>4.7</span>
            <span className="hidden sm:inline text-[#a8a196]">(Reviews)</span>
          </button>

          <button
            onClick={() => {
              if (currentPageNumber > 1) {
                bookStore.toggleFavoriteRecipe(book, currentSyntheticRecipe);
              } else {
                bookStore.toggleFavoriteBook(book.id);
              }
              setFavTick((t) => t + 1);
            }}
            title={
              currentPageNumber > 1
                ? 'Like & Save This Recipe Page to Favorites'
                : 'Like & Save Book to Favorites / Wishlist'
            }
            className={`px-2.5 py-1.5 rounded-full border text-xs font-semibold flex items-center gap-1 transition-all ${
              isCurrentLiked
                ? 'bg-rose-600 text-white border-rose-400 shadow-md'
                : 'bg-[#1c1a18] border-rose-500/30 text-rose-400 hover:bg-rose-950/60'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isCurrentLiked ? 'fill-white text-white' : 'text-rose-400'}`} />
            <span className="hidden sm:inline">{isCurrentLiked ? 'Saved' : 'Like'}</span>
          </button>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? 'Mute Page-Turn Sound' : 'Enable Page-Turn Sound'}
            className="p-2 rounded-full bg-[#1c1a18] border border-[#302c27] text-[#dea374] hover:bg-[#2b2722]"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-[#777]" />}
          </button>

          <button
            onClick={() => setShowToc(!showToc)}
            title="Jump to Page / Table of Contents"
            className="p-2 rounded-full bg-[#1c1a18] border border-[#302c27] text-[#cf7b3e] hover:bg-[#2b2722]"
          >
            <List className="w-4 h-4" />
          </button>

          {isUnlocked && book.pdfFileUrl && (
            <a
              href={book.pdfFileUrl}
              download={book.pdfFileName || `${book.slug}.pdf`}
              target="_blank"
              rel="noreferrer"
              title="Download Full Original PDF"
              className="p-2 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900"
            >
              <Download className="w-4 h-4" />
            </a>
          )}

          <button
            onClick={handlePrint}
            title={isUnlocked ? 'Print Current Recipe Page' : 'Unlock to print'}
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
            title="Toggle Fullscreen Reader"
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

      {bonusShareSuccess && (
        <div className="fixed top-16 z-50 bg-gradient-to-r from-amber-600 to-[#cf7b3e] text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 border border-amber-300/40">
          <Sparkles className="w-4 h-4 text-amber-200 animate-spin" />
          <span>{bonusShareSuccess}</span>
        </div>
      )}

      {/* Main 3D Flip Book Frame (9:16 Vertical Phone Scale) */}
      <div
        className={`relative transition-all duration-300 flex flex-col justify-between overflow-hidden ${
          isFullscreen
            ? 'w-full max-w-[430px] h-[92vh] rounded-none sm:rounded-3xl'
            : 'w-[360px] sm:w-[380px] h-[640px] sm:h-[675px] rounded-[36px] shadow-2xl border-[7px] border-[#25221e]'
        } bg-[#141210] shadow-kindle`}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Top Phone Bezel Bar */}
        <div className="h-6 w-full bg-[#121110] flex items-center justify-between px-6 text-[10px] text-[#706a62] select-none border-b border-[#211f1c] z-30">
          <span>3D FLIP BOOK</span>
          <div className="w-12 h-1.5 bg-[#25221e] rounded-full"></div>
          <div className="flex items-center gap-1 font-mono text-[#dea374]">
            <span>P.{currentPageNumber}</span>
          </div>
        </div>

        {/* 3D Perspective Stage */}
        <div
          className="flex-1 relative overflow-hidden bg-[#0e0c0a] flex flex-col justify-between"
          style={{ perspective: '1600px' }}
        >
          {/* Left Book Spine Crease & Realism Shadow */}
          <div
            className="absolute inset-y-0 left-0 w-5 z-20 pointer-events-none"
            style={{
              background:
                'linear-gradient(to right, rgba(0,0,0,0.65) 0%, rgba(255,255,255,0.06) 35%, rgba(0,0,0,0.22) 70%, transparent 100%)',
            }}
          />

          {/* 3D Turning Page Leaf Overlay (Animates around the left book spine!) */}
          {flipDirection && (
            <div
              className="absolute inset-0 z-30 pointer-events-none overflow-hidden rounded-r-xl"
              style={{
                transformOrigin: 'left center',
                transformStyle: 'preserve-3d',
                transition: 'transform 520ms cubic-bezier(0.645, 0.045, 0.355, 1), box-shadow 520ms ease',
                transform:
                  flipDirection === 'next'
                    ? flipProgress
                      ? 'rotateY(-180deg)'
                      : 'rotateY(0deg)'
                    : flipProgress
                    ? 'rotateY(0deg)'
                    : 'rotateY(-180deg)',
                boxShadow: flipProgress
                  ? '-20px 0 50px rgba(0,0,0,0.85)'
                  : '25px 0 60px rgba(0,0,0,0.9)',
              }}
            >
              {turningFromImage ? (
                <img
                  src={turningFromImage}
                  alt="Turning Page"
                  className="w-full h-full object-contain bg-[#141210]"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-[#241e18] via-[#1c1814] to-[#141210]" />
              )}
              {/* Dynamic Page-Curl Specular Highlight & Shadow */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(to right, rgba(0,0,0,0.55) 0%, rgba(255,235,205,0.16) 25%, rgba(0,0,0,0.05) 65%, rgba(0,0,0,0.6) 100%)',
                }}
              />
            </div>
          )}

          {/* Main Active Page Area */}
          {isPageLocked ? (
            /* Paywall & Viral Bonus Unlock Stage */
            <div className="h-full relative flex flex-col items-center justify-center text-center p-5 bg-gradient-to-b from-[#211a14] via-[#1a1612] to-[#12100e]">
              {/* Blurred PDF Page Preview Behind Paywall */}
              {activePdfSlideUrl && (
                <img
                  src={activePdfSlideUrl}
                  alt="Locked PDF Page"
                  className="absolute inset-0 w-full h-full object-cover opacity-15 blur-md pointer-events-none"
                />
              )}

              <div className="relative z-10 flex flex-col items-center max-w-xs">
                {!hasSharedForBonus ? (
                  /* Option A (Page 6 reached, initial 5 pages done): Share to unlock next 4 pages for FREE! */
                  <>
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-500/20 to-[#cf7b3e]/30 border-2 border-amber-500 flex items-center justify-center mb-3 text-amber-400 shadow-lg shadow-amber-900/30">
                      <Gift className="w-7 h-7 text-amber-400 animate-bounce" />
                    </div>

                    <span className="text-[10px] font-bold tracking-widest uppercase text-amber-400 mb-1">
                      FREE BONUS RECIPES UNLOCK
                    </span>

                    <h3 className="font-serif text-lg sm:text-xl font-bold text-white mb-1.5 leading-tight">
                      Unlock the Next 4 Pages Free!
                    </h3>

                    <p className="text-xs text-[#b8b0a5] mb-3 leading-relaxed">
                      You’ve finished the first 5 free pages. Share this collection to immediately unlock Pages 6, 7, 8 &amp; 9 with full recipe instructions!
                    </p>

                    {/* Viral Primary Action: Share to unlock 4 pages */}
                    <button
                      type="button"
                      onClick={handleShareToUnlockBonus}
                      className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-amber-600 to-[#cf7b3e] text-white shadow-xl shadow-amber-900/40 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 mb-2"
                    >
                      <Share2 className="w-4 h-4 text-white" />
                      <span>Share to Unlock Next 4 Pages (Free)</span>
                    </button>

                    <div className="w-full flex items-center gap-2 my-2 text-[9px] text-[#6e665d] uppercase tracking-wider font-semibold">
                      <div className="flex-1 h-[1px] bg-[#2a241e]" />
                      <span>Or Get Full 108 Pages</span>
                      <div className="flex-1 h-[1px] bg-[#2a241e]" />
                    </div>

                    <button
                      onClick={() =>
                        onOpenCheckout({
                          id: book.id,
                          type: 'book',
                          title: book.title,
                          price: book.price,
                          originalPrice: book.originalPrice,
                        })
                      }
                      className="w-full py-2.5 px-3 rounded-xl font-bold text-xs bg-[#241d17] hover:bg-[#30271f] text-[#dea374] border border-[#3f3428] transition-all flex items-center justify-center gap-1.5 mb-2"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Buy Full Book &amp; PDF (${book.price.toFixed(2)})</span>
                    </button>
                  </>
                ) : (
                  /* Option B (User shared, enjoyed pages 6-9, now at Page 10+): Final paywall */
                  <>
                    <div className="w-14 h-14 rounded-full bg-[#cf7b3e]/20 border border-[#cf7b3e] flex items-center justify-center mb-3 text-[#dea374] animate-pulse">
                      <Lock className="w-7 h-7" />
                    </div>

                    <span className="text-[10px] font-bold tracking-widest uppercase text-[#dea374] mb-1">
                      FREE PREVIEW COMPLETED (9 PAGES)
                    </span>

                    <h3 className="font-serif text-lg sm:text-xl font-bold text-white mb-1.5 leading-tight">
                      Unlock All {totalPages} Pages of {book.title}
                    </h3>

                    <p className="text-xs text-[#b8b0a5] mb-3 leading-relaxed">
                      You’ve enjoyed 9 free recipes (including your 4 bonus shared pages). Unlock all 30 iconic recipes, grocery checklists, and printable PDF now!
                    </p>

                    <div className="w-full bg-[#27211b]/95 p-2.5 rounded-xl border border-[#3f352c] mb-3">
                      <div className="flex items-baseline justify-center gap-1.5">
                        <span className="text-2xl font-extrabold text-white">${book.price.toFixed(2)}</span>
                        {book.originalPrice && (
                          <span className="text-xs line-through text-[#827a70]">
                            ${book.originalPrice.toFixed(2)}
                          </span>
                        )}
                        <span className="text-[10px] text-[#dea374] font-medium">USD</span>
                      </div>
                      <p className="text-[9px] text-[#9c9388] mt-0.5">
                        One-time purchase • Instant Full Book &amp; PDF Download
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        onOpenCheckout({
                          id: book.id,
                          type: 'book',
                          title: book.title,
                          price: book.price,
                          originalPrice: book.originalPrice,
                        })
                      }
                      className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-[#cf7b3e] to-[#b8612b] text-white shadow-lg shadow-[#cf7b3e]/30 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 mb-2"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Buy &amp; Unlock Full Book (${book.price.toFixed(2)})</span>
                    </button>
                  </>
                )}

                {/* Token Unlock Form */}
                <form onSubmit={handleValidateToken} className="w-full mt-1 pt-2 border-t border-[#2e2720]">
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={tokenInput}
                      onChange={(e) => setTokenInput(e.target.value)}
                      placeholder="Already bought? Enter RV-... token"
                      className="flex-1 bg-[#141210] border border-[#3b332b] rounded-lg px-2.5 py-1 text-[11px] text-white placeholder-[#6c655b] focus:outline-none focus:border-[#cf7b3e]"
                    />
                    <button
                      type="submit"
                      className="bg-[#2e2720] hover:bg-[#3d332a] text-[#dea374] text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-[#443a2f]"
                    >
                      Unlock
                    </button>
                  </div>
                  {tokenError && <p className="text-[10px] text-rose-400 mt-1">{tokenError}</p>}
                </form>

                <button
                  onClick={() => setCurrentPageIndex(0)}
                  className="mt-2.5 text-[11px] text-[#dea374] hover:text-white underline"
                >
                  ← Flip Back to Page 1 Cover
                </button>
              </div>
            </div>
          ) : activePdfSlideUrl ? (
            /* Full-Bleed 9:16 Rendered PDF Page (with left/right tap zones to flip like a real book!) */
            <div className="h-full w-full relative flex items-center justify-center bg-[#0e0c0a] overflow-hidden group">
              {/* Bonus Page indicator banner on pages 6-9 */}
              {isCurrentPageBonus && (
                <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-20 bg-amber-500/25 backdrop-blur-md border border-amber-500/60 text-amber-200 text-[10px] font-bold px-3 py-0.5 rounded-full shadow-lg flex items-center gap-1.5 pointer-events-none">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  <span>Bonus Page {currentPageNumber} of 9 (Unlocked via Share)</span>
                </div>
              )}

              <img
                src={activePdfSlideUrl}
                alt={`${book.title} - Page ${currentPageNumber}`}
                className="w-full h-full object-contain select-none"
              />

              {isLoadingPdfPage && (
                <div className="absolute top-3 right-3 bg-black/75 px-2.5 py-1 rounded-full flex items-center gap-1.5 text-[10px] text-[#dea374] border border-[#cf7b3e]/30">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>Rendering HD Page...</span>
                </div>
              )}

              {/* Left Edge Tap Zone (Flip Backward) */}
              {currentPageIndex > 0 && (
                <div
                  onClick={handlePrevPage}
                  title="Click or Tap Left Edge to Flip Back"
                  className="absolute inset-y-0 left-0 w-1/4 z-10 cursor-pointer flex items-center justify-start pl-2 opacity-0 hover:opacity-100 transition-opacity"
                >
                  <div className="bg-black/60 backdrop-blur-sm p-2 rounded-full border border-white/15 text-white shadow-lg">
                    <ChevronLeft className="w-5 h-5" />
                  </div>
                </div>
              )}

              {/* Right Edge Tap Zone (Flip Forward) */}
              {currentPageIndex < totalPages - 1 && (
                <div
                  onClick={handleNextPage}
                  title="Click or Tap Right Edge to Flip Page"
                  className="absolute inset-y-0 right-0 w-2/3 z-10 cursor-pointer flex items-center justify-end pr-2 opacity-0 hover:opacity-100 transition-opacity"
                >
                  <div className="bg-black/60 backdrop-blur-sm p-2 rounded-full border border-white/15 text-[#dea374] shadow-lg">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              )}

              {/* Bottom Corner Interactive Page-Curl Hint */}
              {currentPageIndex < totalPages - 1 && (
                <button
                  onClick={handleNextPage}
                  className="absolute bottom-3 right-3 z-20 bg-gradient-to-r from-[#cf7b3e]/90 to-[#b8612b]/90 hover:brightness-110 text-white text-[11px] font-bold px-3.5 py-1.5 rounded-full shadow-xl flex items-center gap-1 border border-white/20 backdrop-blur-sm transition-transform active:scale-95"
                >
                  <span>{currentPageNumber === 1 ? 'Open Book (Flip to Page 2)' : 'Flip Page'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ) : currentPage ? (
            /* Fallback Structured Card View if no PDF URL or cover image */
            <div className="h-full p-4 overflow-y-auto flex flex-col justify-between">
              {currentPage.isChecklist ? (
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
                </div>
              ) : (
                <div className="h-full flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] uppercase font-bold tracking-widest text-[#dea374]">
                      {currentPage.category || 'RECIPE CARD'} • #{currentPage.pageNumber}
                    </span>
                    <h2 className="font-serif text-base sm:text-lg font-bold text-white leading-tight">
                      {currentPage.title}
                    </h2>
                    <div className="grid grid-cols-3 gap-1 bg-[#1e1a16] p-1.5 rounded-lg border border-[#2d261f] text-[10px] my-2 text-[#ccc4b8]">
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
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-xs text-[#a8a196]">
              <Loader2 className="w-6 h-6 text-[#dea374] animate-spin mb-2" />
              <span>Loading PDF Page {currentPageNumber}...</span>
            </div>
          )}
        </div>

        {/* Bottom 3D Book Flip Bar */}
        <div className="h-12 bg-[#121110] border-t border-[#23201c] flex items-center justify-between px-4 text-xs z-30">
          <button
            onClick={handlePrevPage}
            disabled={currentPageIndex === 0}
            className={`flex items-center gap-1 font-semibold px-2.5 py-1 rounded-lg transition-all ${
              currentPageIndex === 0
                ? 'text-[#444] cursor-not-allowed'
                : 'text-[#dea374] hover:text-white hover:bg-[#1f1b17]'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Flip Back</span>
          </button>

          <div className="flex items-center gap-2">
            <BookOpen className="w-3.5 h-3.5 text-[#dea374]" />
            <span className="text-[11px] font-mono text-[#c2bcaf]">
              Page {currentPageNumber} / {totalPages}
            </span>
          </div>

          <button
            onClick={handleNextPage}
            disabled={currentPageIndex === totalPages - 1}
            className={`flex items-center gap-1 font-semibold px-2.5 py-1 rounded-lg transition-all ${
              currentPageIndex === totalPages - 1
                ? 'text-[#444] cursor-not-allowed'
                : 'text-[#dea374] hover:text-white hover:bg-[#1f1b17]'
            }`}
          >
            <span>Flip Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Under-Reader Quick Hint */}
      <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-[11px] text-[#7d756a]">
        <span>← Tap page edges, swipe, or use arrow keys for 3D page flip →</span>
        <span>•</span>
        {isUnlocked ? (
          <span className="text-emerald-400 font-semibold flex items-center gap-1">
            <Unlock className="w-3 h-3" /> All {totalPages} PDF Pages Unlocked
          </span>
        ) : hasSharedForBonus ? (
          <span className="text-amber-400 font-semibold flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" /> 9 Free Pages Unlocked (5 Free + 4 Shared Bonus)
          </span>
        ) : (
          <span className="text-amber-400 font-semibold">
            First 5 Pages Free Preview • Share on Page 6 to Unlock +4 Bonus Pages!
          </span>
        )}
      </div>

      {/* Table of Contents / Page Jump Drawer Modal */}
      {showToc && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-[#1a1715] border border-[#362f28] rounded-2xl w-full max-w-sm max-h-[80vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-[#2b251f] flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-white text-base">
                  Jump to PDF Page ({totalPages} Pages)
                </h3>
                <p className="text-xs text-[#a8a196]">{book.title}</p>
              </div>
              <button
                onClick={() => setShowToc(false)}
                className="p-1 rounded-lg text-[#888] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 grid grid-cols-4 gap-2">
              {Array.from({ length: totalPages }, (_, idx) => {
                const isBonusUnlocked = !isUnlocked && hasSharedForBonus && idx >= 5 && idx < 9;
                const isLocked = !isUnlocked && (hasSharedForBonus ? idx >= 9 : idx >= 5);
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setCurrentPageIndex(idx);
                      setShowToc(false);
                    }}
                    className={`p-2.5 rounded-xl flex flex-col items-center justify-center border text-xs font-bold transition-all ${
                      currentPageIndex === idx
                        ? 'bg-[#cf7b3e] border-[#dea374] text-white'
                        : isBonusUnlocked
                        ? 'bg-amber-950/40 border-amber-500/50 text-amber-300 hover:bg-amber-900/60'
                        : isLocked
                        ? 'bg-[#141210] border-[#26201a] text-[#777] hover:border-amber-500/40'
                        : 'bg-[#221d18] border-[#332b22] text-[#dea374] hover:bg-[#2d261f]'
                    }`}
                  >
                    <span>P.{idx + 1}</span>
                    {isLocked ? (
                      <Lock className="w-3 h-3 text-amber-500 mt-0.5" />
                    ) : (
                      <span className="text-[9px] text-emerald-400 font-normal mt-0.5">
                        {idx === 0 ? 'Cover' : isBonusUnlocked ? 'Bonus' : idx < 5 ? 'Free' : 'Open'}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Verified Reviews & 3rd Open Rating Pop-Up Modal */}
      {showReviewModal && (
        <BookReviewsModal
          book={book}
          isOpen={showReviewModal}
          isUnlocked={isUnlocked}
          isThirdOpenPrompt={isThirdOpenPrompt}
          onClose={() => setShowReviewModal(false)}
          onOpenCheckout={onOpenCheckout}
        />
      )}
    </div>
  );
};
