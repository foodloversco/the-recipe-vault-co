import React, { useState, useEffect, useRef } from 'react';
import { Book, RecipePage } from '../../types';
import { bookStore } from '../../services/bookStore';
import { reviewStore } from '../../services/reviewStore';
import { loadPdfDocument, renderSinglePdfPage } from '../../utils/pdfPageExtractor';
import { BookReviewsModal } from '../reviews/BookReviewsModal';
import { GroceryChecklistModal } from '../grocery/GroceryChecklistModal';
import { getBookTableOfContents, ChapterTOCItem } from '../../data/tableOfContentsData';
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
  Sparkles,
  ShoppingBag,
  Search
} from 'lucide-react';

const WhatsAppIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.53 7.33C9.35 7.33 9.06 7.4 8.81 7.67C8.56 7.94 7.86 8.6 7.86 9.94C7.86 11.28 8.84 12.57 8.98 12.75C9.11 12.94 10.9 15.68 13.64 16.86C14.29 17.14 14.8 17.31 15.2 17.44C15.85 17.65 16.44 17.62 16.91 17.55C17.43 17.47 18.52 16.89 18.75 16.25C18.98 15.61 18.98 15.06 18.91 14.95C18.84 14.84 18.66 14.77 18.39 14.64C18.12 14.5 16.8 13.85 16.55 13.76C16.31 13.67 16.13 13.62 15.95 13.89C15.77 14.17 15.26 14.77 15.11 14.95C14.95 15.13 14.8 15.15 14.53 15.01C14.26 14.88 13.39 14.59 12.35 13.67C11.55 12.95 11 12.07 10.85 11.8C10.7 11.53 10.83 11.39 10.97 11.25C11.09 11.13 11.24 10.94 11.38 10.78C11.52 10.61 11.56 10.49 11.65 10.31C11.75 10.13 11.7 9.97 11.63 9.83C11.56 9.7 11.05 8.44 10.83 7.92C10.62 7.42 10.4 7.48 10.24 7.47C10.09 7.46 9.91 7.46 9.73 7.46" />
  </svg>
);

const FacebookIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const InstagramIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const TikTokIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z"/>
  </svg>
);

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
  const [showGroceryModal, setShowGroceryModal] = useState<boolean>(false);
  const [tocActiveTab, setTocActiveTab] = useState<'chapters' | 'grid'>('chapters');
  const [tocSearchQuery, setTocSearchQuery] = useState<string>('');
  const bookTocItems = getBookTableOfContents(book.slug);

  const handleJumpToPage = (targetIdx: number) => {
    if (targetIdx < 0 || targetIdx >= totalPages) return;
    const targetPageImg = getActivePageImage(targetIdx);
    setTurningFromImage(targetPageImg);
    setCurrentPageIndex(targetIdx);
    setShowToc(false);
    playPageFlipSound();
  };
  const [hasSharedForBonus, setHasSharedForBonus] = useState<boolean>(() => {
    try {
      return localStorage.getItem(`rv_shared_bonus_${book.id}`) === 'true';
    } catch {
      return false;
    }
  });
  const [bonusShareSuccess, setBonusShareSuccess] = useState<string | null>(null);

  // 1 platform per book lock & 6-second anti-fraud timer states
  const [sharedPlatform, setSharedPlatform] = useState<string | null>(() => {
    try {
      return localStorage.getItem(`rv_shared_platform_${book.id}`);
    } catch {
      return null;
    }
  });
  const [sharingPlatformName, setSharingPlatformName] = useState<string | null>(null);
  const [shareCountdown, setShareCountdown] = useState<number>(0);
  const [isVerifyingShare, setIsVerifyingShare] = useState<boolean>(false);
  const shareTimerRef = useRef<any>(null);
  const shareStartTimeRef = useRef<number>(0);

  useEffect(() => {
    return () => {
      if (shareTimerRef.current) clearInterval(shareTimerRef.current);
    };
  }, []);

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

  // Viral Feature: Share on Page 6 via WhatsApp, Facebook, Instagram or TikTok
  // Requirements:
  // 1. Must be away/wait at least 6 seconds before unlocking
  // 2. Can only use one platform per book
  // 3. Shares book image preview + message from friend
  const handlePlatformShare = (platformKey: 'whatsapp' | 'facebook' | 'instagram' | 'tiktok', platformTitle: string) => {
    const lockedPlatform = localStorage.getItem(`rv_shared_platform_${book.id}`);
    if (lockedPlatform && lockedPlatform !== platformKey) {
      alert(`You can only use 1 platform per book. This book was already shared with ${lockedPlatform.toUpperCase()}.`);
      return;
    }

    const shareUrl = `${window.location.origin}/?book=${book.slug}&from=friend`;
    const friendMessage = `Hey! A friend shared this awesome cookbook with you: "${book.title}" on The Recipe Vault Co. 🔥 Check out the 30 recipes, 108 phone-ready pages, and free preview here: ${shareUrl}`;

    // Open platform in new window
    if (platformKey === 'whatsapp') {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(friendMessage)}`, '_blank');
    } else if (platformKey === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(friendMessage)}`, '_blank');
    } else if (platformKey === 'instagram') {
      try {
        navigator.clipboard.writeText(friendMessage);
      } catch {}
      window.open('https://www.instagram.com/', '_blank');
    } else if (platformKey === 'tiktok') {
      try {
        navigator.clipboard.writeText(friendMessage);
      } catch {}
      window.open('https://www.tiktok.com/', '_blank');
    }

    // Start 6-second timer: user must be away or wait at least 6 seconds before unlocking
    setSharingPlatformName(platformTitle);
    setIsVerifyingShare(true);
    setShareCountdown(6);
    shareStartTimeRef.current = Date.now();

    if (shareTimerRef.current) clearInterval(shareTimerRef.current);

    shareTimerRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - shareStartTimeRef.current) / 1000);
      const remaining = Math.max(0, 6 - elapsed);
      setShareCountdown(remaining);

      if (remaining <= 0) {
        clearInterval(shareTimerRef.current);
        shareTimerRef.current = null;
        setIsVerifyingShare(false);

        try {
          localStorage.setItem(`rv_shared_bonus_${book.id}`, 'true');
          localStorage.setItem(`rv_shared_platform_${book.id}`, platformKey);
        } catch {}

        setSharedPlatform(platformKey);
        setHasSharedForBonus(true);
        setBonusShareSuccess(`🎉 Share verified on ${platformTitle}! 4 Bonus Pages Unlocked (Pages 6 to 9).`);
        playPageFlipSound();

        setTimeout(() => {
          setBonusShareSuccess(null);
        }, 4500);
      }
    }, 500);
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
            onClick={() => setShowGroceryModal(true)}
            title="In-Store Grocery Shopping Checklist & Print"
            className="p-2 rounded-full bg-[#1c1a18] border border-[#302c27] text-emerald-400 hover:bg-emerald-950/60 hover:text-emerald-300 transition-all flex items-center gap-1"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="text-[10px] font-bold hidden md:inline">Grocery Checklist</span>
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
            <div className="h-full relative flex flex-col items-center justify-center text-center p-4 sm:p-5 bg-gradient-to-b from-[#211a14] via-[#1a1612] to-[#12100e]">
              {/* Faded-Out Teaser Recipe Page Behind Paywall */}
              {activePdfSlideUrl && (
                <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none select-none">
                  <img
                    src={activePdfSlideUrl}
                    alt="Faded Teaser Page"
                    className="w-full h-full object-contain filter blur-[7px] opacity-25 scale-95 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-[#0e0c0a]/80 via-[#14110e]/85 to-[#0e0c0a]/95 backdrop-blur-[2px]" />
                </div>
              )}

              <div className="relative z-10 flex flex-col items-center max-w-xs">
                {/* Clear Locked Status Badge */}
                <div className="mb-2 bg-rose-950/80 border border-rose-500/60 px-3.5 py-1 rounded-full inline-flex items-center gap-1.5 text-[11px] font-bold text-rose-300 shadow-xl">
                  <Lock className="w-3.5 h-3.5 text-rose-400" />
                  <span>
                    Page {currentPageNumber} is Locked •{' '}
                    {bookTocItems.find((t) => t.pageNumber === currentPageNumber)?.recipeTitle || 'Full Collection'}
                  </span>
                </div>

                {!hasSharedForBonus ? (
                  /* Option A (Page 6 reached, initial 5 pages done): Share to unlock next 4 pages for FREE! */
                  <>
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500/20 to-[#cf7b3e]/30 border-2 border-amber-500 flex items-center justify-center mb-1 text-amber-400 shadow-lg shadow-amber-900/30">
                      <Gift className="w-6 h-6 text-amber-400 animate-bounce" />
                    </div>

                    <span className="text-[10px] font-bold tracking-widest uppercase text-amber-400 mb-0.5">
                      FREE BONUS RECIPES UNLOCK
                    </span>

                    <h3 className="font-serif text-base sm:text-lg font-bold text-white mb-1 leading-tight">
                      Unlock the Next 4 Pages Free!
                    </h3>

                    <p className="text-[11px] text-[#b8b0a5] mb-1.5 leading-relaxed">
                      Choose 1 platform to share with friends. After a 6-second verification, Pages 6, 7, 8 &amp; 9 unlock immediately!
                    </p>

                    {/* 6-Second Verification Countdown Screen */}
                    {isVerifyingShare ? (
                      <div className="w-full bg-[#1e1915] p-3.5 rounded-2xl border-2 border-amber-500/60 shadow-2xl flex flex-col items-center text-center my-2 animate-pulse">
                        <div className="w-11 h-11 rounded-full border-3 border-amber-400 border-t-transparent animate-spin flex items-center justify-center mb-1.5">
                          <span className="text-xs font-bold text-amber-300 not-italic">{shareCountdown}s</span>
                        </div>
                        <span className="text-xs font-bold text-amber-300">
                          Verifying Share on {sharingPlatformName}...
                        </span>
                        <p className="text-[10px] text-[#c2bcaf] mt-1 leading-snug">
                          Please complete your share. Unlocking the next 4 recipes in <strong>{shareCountdown} seconds</strong>...
                        </p>
                        <div className="w-full bg-[#2c241c] h-1.5 rounded-full mt-2.5 overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-amber-500 to-[#cf7b3e] h-full transition-all duration-500" 
                            style={{ width: `${((6 - shareCountdown) / 6) * 100}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <>
                        {/* 4 Social Share Buttons (WhatsApp, Facebook, Instagram, TikTok) */}
                        <div className="grid grid-cols-2 gap-2 w-full my-1.5">
                          {/* WhatsApp */}
                          <button
                            type="button"
                            onClick={() => handlePlatformShare('whatsapp', 'WhatsApp')}
                            className="py-2 px-2.5 rounded-xl font-bold text-xs bg-[#25D366] hover:bg-[#20ba59] text-white shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5 truncate"
                          >
                            <WhatsAppIcon className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">WhatsApp</span>
                          </button>

                          {/* Facebook */}
                          <button
                            type="button"
                            onClick={() => handlePlatformShare('facebook', 'Facebook')}
                            className="py-2 px-2.5 rounded-xl font-bold text-xs bg-[#1877F2] hover:bg-[#1464cc] text-white shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5 truncate"
                          >
                            <FacebookIcon className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">Facebook</span>
                          </button>

                          {/* Instagram */}
                          <button
                            type="button"
                            onClick={() => handlePlatformShare('instagram', 'Instagram')}
                            className="py-2 px-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:brightness-110 text-white shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5 truncate"
                          >
                            <InstagramIcon className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">Instagram</span>
                          </button>

                          {/* TikTok */}
                          <button
                            type="button"
                            onClick={() => handlePlatformShare('tiktok', 'TikTok')}
                            className="py-2 px-2.5 rounded-xl font-bold text-xs bg-black hover:bg-[#141414] text-white border border-[#25F4EE]/60 hover:border-[#FE2C55] shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5 truncate"
                          >
                            <TikTokIcon className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">TikTok</span>
                          </button>
                        </div>

                        {/* Message preview from friend */}
                        <div className="bg-[#191512] border border-[#332a21] rounded-xl p-2 my-1 text-left w-full">
                          <div className="flex items-center gap-1 text-[9px] text-[#dea374] font-semibold mb-0.5">
                            <Sparkles className="w-3 h-3 flex-shrink-0" />
                            <span>Message shared with book cover &amp; site:</span>
                          </div>
                          <p className="text-[9px] text-[#b8b0a4] italic leading-tight bg-[#12100e] p-1.5 rounded-lg border border-[#26201a]">
                            "Hey! A friend shared this awesome cookbook with you: <strong>{book.title}</strong> on The Recipe Vault Co. 🔥 Check out the 30 recipes, 108 pages &amp; free preview here!"
                          </p>
                          <div className="flex items-center justify-between text-[8px] text-[#797166] mt-1">
                            <span>✓ 1 platform per book</span>
                            <span>• 6-second verification</span>
                          </div>
                        </div>
                      </>
                    )}

                    <div className="w-full flex items-center gap-2 my-1 text-[9px] text-[#6e665d] uppercase tracking-wider font-semibold">
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
                      className="w-full py-2 px-3 rounded-xl font-bold text-xs bg-[#241d17] hover:bg-[#30271f] text-[#dea374] border border-[#3f3428] transition-all flex items-center justify-center gap-1.5 mb-1"
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
                  className="mt-2 text-[11px] text-[#dea374] hover:text-white underline"
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
                  <span>Bonus Page {currentPageNumber} of 9 (Unlocked via {sharedPlatform ? sharedPlatform.toUpperCase() : 'Share'})</span>
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

              {/* In-Book Page 3 / TOC Quick Trigger */}
              {(currentPageNumber === 2 || currentPageNumber === 3) && (
                <button
                  onClick={() => setShowToc(true)}
                  className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 bg-gradient-to-r from-[#cf7b3e] to-[#b8612b] hover:brightness-110 text-white text-[11px] font-bold px-3.5 py-1.5 rounded-full shadow-2xl flex items-center gap-1.5 border border-amber-400/40"
                >
                  <List className="w-3.5 h-3.5" />
                  <span>Click Table of Contents to Jump</span>
                </button>
              )}

              {/* In-Book Grocery Checklist Quick Trigger */}
              {(currentPageNumber === 2 || currentPageNumber === 36 || currentPage?.isChecklist) && (
                <button
                  onClick={() => setShowGroceryModal(true)}
                  className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:brightness-110 text-white text-[11px] font-bold px-3.5 py-1.5 rounded-full shadow-2xl flex items-center gap-1.5 border border-emerald-400/40"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Open In-Store Grocery Checklist &amp; Print</span>
                </button>
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

      {/* Interactive Table of Contents Modal */}
      {showToc && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex justify-center items-center p-3 sm:p-5">
          <div className="bg-[#191613] border border-[#3b3228] rounded-3xl w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-[#2d251d] bg-[#1f1b16] flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#dea374]">
                  SERIES DIRECTORY &amp; JUMP
                </span>
                <h3 className="font-serif font-bold text-white text-base sm:text-lg leading-tight">
                  Table of Contents ({totalPages} Pages)
                </h3>
              </div>
              <button
                onClick={() => setShowToc(false)}
                className="p-2 rounded-full text-[#999] hover:text-white bg-[#26201a] border border-[#382f25]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search & Tabs */}
            <div className="p-3 bg-[#151210] border-b border-[#28211a] space-y-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#797165]" />
                <input
                  type="text"
                  value={tocSearchQuery}
                  onChange={(e) => setTocSearchQuery(e.target.value)}
                  placeholder="Search recipe or chapter (e.g. Boerewors, Lamb, Potjie)..."
                  className="w-full bg-[#1e1915] border border-[#362c22] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-[#70685e] focus:outline-none focus:border-[#cf7b3e]"
                />
              </div>

              <div className="flex rounded-xl bg-[#1b1713] p-1 border border-[#2d251d]">
                <button
                  type="button"
                  onClick={() => setTocActiveTab('chapters')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    tocActiveTab === 'chapters'
                      ? 'bg-[#cf7b3e] text-white shadow-md'
                      : 'text-[#9c9386] hover:text-white'
                  }`}
                >
                  Chapters &amp; Recipes ({bookTocItems.length})
                </button>
                <button
                  type="button"
                  onClick={() => setTocActiveTab('grid')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    tocActiveTab === 'grid'
                      ? 'bg-[#cf7b3e] text-white shadow-md'
                      : 'text-[#9c9386] hover:text-white'
                  }`}
                >
                  All {totalPages} Pages Grid
                </button>
              </div>
            </div>

            {/* Tab 1: Chapters & Recipes List */}
            {tocActiveTab === 'chapters' ? (
              <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-1.5 divide-y divide-[#241e18]">
                {bookTocItems
                  .filter(
                    (item) =>
                      item.recipeTitle.toLowerCase().includes(tocSearchQuery.toLowerCase()) ||
                      item.chapterTitle.toLowerCase().includes(tocSearchQuery.toLowerCase())
                  )
                  .map((item, idx) => {
                    const pageIdx = item.pageNumber - 1;
                    const isBonus = !isUnlocked && hasSharedForBonus && pageIdx >= 5 && pageIdx < 9;
                    const isLocked = !isUnlocked && (hasSharedForBonus ? pageIdx >= 9 : pageIdx >= 5);
                    const isCurrent = currentPageIndex === pageIdx;

                    return (
                      <div
                        key={idx}
                        onClick={() => handleJumpToPage(pageIdx)}
                        className={`pt-1.5 pb-1.5 px-3 rounded-xl flex items-center justify-between cursor-pointer transition-all ${
                          isCurrent
                            ? 'bg-[#cf7b3e]/20 border border-[#cf7b3e]'
                            : 'hover:bg-[#221c17]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0 pr-2">
                          <span className="text-base select-none">{item.icon}</span>
                          <div className="min-w-0">
                            <span className="text-[10px] text-[#8e8578] uppercase font-bold block truncate">
                              {item.chapterTitle}
                            </span>
                            <span className="text-xs font-semibold text-[#f0ebe3] block truncate">
                              {item.recipeTitle}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-[11px] font-mono text-[#c2bcaf]">
                            P.{item.pageNumber}
                          </span>
                          {isLocked ? (
                            <span className="text-[10px] bg-rose-950/80 border border-rose-500/50 text-rose-300 font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                              <Lock className="w-3 h-3 text-rose-400" />
                              <span>Locked</span>
                            </span>
                          ) : isBonus ? (
                            <span className="text-[10px] bg-amber-950/80 border border-amber-500/50 text-amber-300 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-amber-400" />
                              <span>Bonus</span>
                            </span>
                          ) : (
                            <span className="text-[10px] bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 font-bold px-2 py-0.5 rounded-full">
                              ✓ Free
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            ) : (
              /* Tab 2: All Pages Visual Grid */
              <div className="flex-1 overflow-y-auto p-3 sm:p-4 grid grid-cols-4 sm:grid-cols-5 gap-2">
                {Array.from({ length: totalPages }, (_, idx) => {
                  const isBonus = !isUnlocked && hasSharedForBonus && idx >= 5 && idx < 9;
                  const isLocked = !isUnlocked && (hasSharedForBonus ? idx >= 9 : idx >= 5);
                  return (
                    <button
                      key={idx}
                      onClick={() => handleJumpToPage(idx)}
                      className={`p-2.5 rounded-xl flex flex-col items-center justify-center border text-xs font-bold transition-all ${
                        currentPageIndex === idx
                          ? 'bg-[#cf7b3e] border-[#dea374] text-white'
                          : isBonus
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
                          {idx === 0 ? 'Cover' : isBonus ? 'Bonus' : idx < 5 ? 'Free' : 'Open'}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* In-Store Grocery Shopping Checklist & Print Modal */}
      <GroceryChecklistModal
        book={book}
        isOpen={showGroceryModal}
        onClose={() => setShowGroceryModal(false)}
      />

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
