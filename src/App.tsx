import React, { useState, useEffect } from 'react';
import { App as CapacitorApp } from '@capacitor/app';
import { Book, Bundle } from './types';
import { bookStore } from './services/bookStore';
import { hybridSyncService } from './services/hybridSyncService';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { CulinarySplashLoader } from './components/common/CulinarySplashLoader';
import { LandingPage } from './components/landing/LandingPage';
import { BookReader } from './components/reader/BookReader';
import { AdminPortal } from './components/admin/AdminPortal';
import { PayPalCheckoutModal } from './components/checkout/PayPalCheckoutModal';
import { MyVaultPage } from './components/library/MyVaultPage';
import { ContactSupportPage } from './components/support/ContactSupportPage';
import { PrivacyPolicyModal } from './components/legal/PrivacyPolicyModal';
import { TermsConditionsModal } from './components/legal/TermsConditionsModal';
import { RefundPolicyModal } from './components/legal/RefundPolicyModal';
import { CookingTimerModal } from './components/timer/CookingTimerModal';
import { TimerFloatingWidget } from './components/timer/TimerFloatingWidget';
import { AppInstallPrompt } from './components/common/AppInstallPrompt';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'reader' | 'admin' | 'paid' | 'favorites' | 'groceries' | 'contact'>('landing');
  const [showPrivacyModal, setShowPrivacyModal] = useState<boolean>(false);
  const [showTermsModal, setShowTermsModal] = useState<boolean>(false);
  const [showRefundModal, setShowRefundModal] = useState<boolean>(false);
  const [activeBookSlug, setActiveBookSlug] = useState<string | null>(null);
  const [readerInitialPage, setReaderInitialPage] = useState<number | undefined>(undefined);
  const [books, setBooks] = useState<Book[]>([]);
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [unlockedSet, setUnlockedSet] = useState<Set<string>>(new Set());
  const [favoritesCount, setFavoritesCount] = useState<number>(0);
  const [showGlobalTimerModal, setShowGlobalTimerModal] = useState<boolean>(false);

  // Checkout Modal State
  const [checkoutItem, setCheckoutItem] = useState<{
    id: string;
    type: 'book' | 'bundle';
    title: string;
    price: number;
    originalPrice?: number;
  } | null>(null);

  useEffect(() => {
    // Check URL parameters for direct reset or relock: ?relock=1
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('relock') || urlParams.has('reset')) {
      bookStore.resetPurchases();
      const allBooks = bookStore.getBooks();
      allBooks.forEach((b) => {
        localStorage.removeItem(`rv_shared_bonus_${b.id}`);
        localStorage.removeItem(`rv_shared_platform_${b.id}`);
        localStorage.removeItem(`rv_shared_platforms_${b.id}`);
      });
      localStorage.removeItem('the_recipe_vault_reviews_v1');
      console.log('Purchases, reviews, and bonus keys reset for test mode.');
    }

    // Auto-catch Pinterest OAuth code redirect
    const pinOAuthCode = urlParams.get('code');
    if (pinOAuthCode) {
      fetch(`/api/pinterest-auth?code=${pinOAuthCode}&redirect_uri=${encodeURIComponent(window.location.origin + '/')}&json=true`)
        .then(r => r.json())
        .then(data => {
          if (data.access_token) {
            localStorage.setItem('trv_pinterest_token', data.access_token);
            alert('✓ Pinterest connected successfully with Pin & Board write permissions! Auto-posting active.');
          }
        })
        .catch(() => {});
    }

    refreshData();

    // Check URL parameters & pathname for direct navigation: /admin, ?book=slug, or ?view=admin/paid/favorites/groceries
    const pathname = window.location.pathname.toLowerCase();
    const isPathAdmin = pathname === '/admin' || pathname === '/admin/' || pathname.endsWith('/admin');
    const bookParam = urlParams.get('book');
    const viewParam = urlParams.get('view');

    if (viewParam === 'admin' || isPathAdmin) {
      setCurrentView('admin');
    } else if (viewParam === 'paid') {
      setCurrentView('paid');
    } else if (viewParam === 'favorites') {
      setCurrentView('favorites');
    } else if (viewParam === 'groceries') {
      setCurrentView('groceries');
    } else if (viewParam === 'contact') {
      setCurrentView('contact');
    } else if (viewParam === 'privacy') {
      setShowPrivacyModal(true);
    } else if (viewParam === 'terms') {
      setShowTermsModal(true);
    } else if (viewParam === 'refund') {
      setShowRefundModal(true);
    } else if (bookParam) {
      setActiveBookSlug(bookParam);
      setCurrentView('reader');
    }

    // Subscribe to cloud sync & store updates
    const unsubscribe = bookStore.subscribe(() => {
      refreshData();
    });

    // Hybrid Mode A + Mode B: sync live Vercel deploy if online in APK, else stay on offline bundle
    hybridSyncService.checkAndSyncLiveUpdate().catch(() => {});

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    // Native Android Hardware Back Button listener
    const backListener = CapacitorApp.addListener('backButton', () => {
      if (checkoutItem) {
        setCheckoutItem(null);
      } else if (currentView !== 'landing') {
        handleNavigate('landing');
      } else {
        CapacitorApp.exitApp();
      }
    });

    return () => {
      backListener.then((sub) => sub.remove()).catch(() => {});
    };
  }, [currentView, checkoutItem]);

  const refreshData = () => {
    const loadedBooks = bookStore.getBooks();
    const loadedBundles = bookStore.getBundles();
    setBooks(loadedBooks);
    setBundles(loadedBundles);

    const unlocked = new Set<string>();
    loadedBooks.forEach((b) => {
      if (bookStore.isBookUnlocked(b.id)) {
        unlocked.add(b.id);
      }
    });
    setUnlockedSet(unlocked);
    setFavoritesCount(bookStore.getTotalFavoritesCount());
  };

  const handleOpenReader = (slug: string, initialPage?: number) => {
    setActiveBookSlug(slug);
    setReaderInitialPage(initialPage);
    setCurrentView('reader');
    const url = new URL(window.location.href);
    url.searchParams.set('book', slug);
    url.searchParams.delete('view');
    window.history.pushState({}, '', url.toString());
  };

  const handleNavigate = (view: string, slug?: string) => {
    refreshData();
    if (view === 'admin') {
      setCurrentView('admin');
      const url = new URL(window.location.href);
      url.searchParams.set('view', 'admin');
      url.searchParams.delete('book');
      window.history.pushState({}, '', url.toString());
    } else if (view === 'paid') {
      setCurrentView('paid');
      const url = new URL(window.location.href);
      url.searchParams.set('view', 'paid');
      url.searchParams.delete('book');
      window.history.pushState({}, '', url.toString());
    } else if (view === 'favorites') {
      setCurrentView('favorites');
      const url = new URL(window.location.href);
      url.searchParams.set('view', 'favorites');
      url.searchParams.delete('book');
      window.history.pushState({}, '', url.toString());
    } else if (view === 'groceries') {
      setCurrentView('groceries');
      const url = new URL(window.location.href);
      url.searchParams.set('view', 'groceries');
      url.searchParams.delete('book');
      window.history.pushState({}, '', url.toString());
    } else if (view === 'contact') {
      setCurrentView('contact');
      const url = new URL(window.location.href);
      url.searchParams.set('view', 'contact');
      url.searchParams.delete('book');
      window.history.pushState({}, '', url.toString());
    } else if (view === 'privacy') {
      setShowPrivacyModal(true);
    } else if (view === 'terms') {
      setShowTermsModal(true);
    } else if (view === 'refund') {
      setShowRefundModal(true);
    } else if (view === 'reader' && slug) {
      handleOpenReader(slug);
    } else {
      setCurrentView('landing');
      setActiveBookSlug(null);
      const url = new URL(window.location.href);
      url.searchParams.delete('book');
      url.searchParams.delete('view');
      window.history.pushState({}, '', url.toString());
    }
  };

  const handleOpenCheckout = (item: {
    id: string;
    type: 'book' | 'bundle';
    title: string;
    price: number;
    originalPrice?: number;
  }) => {
    setCheckoutItem(item);
  };

  const handleCheckoutSuccess = (_token: string) => {
    refreshData();
  };

  const currentActiveBook = activeBookSlug
    ? bookStore.getBookBySlug(activeBookSlug) || books[0]
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-[#100f0e] text-[#f5f2eb]">
      <CulinarySplashLoader />

      {/* Show Main Header only when not in reader or admin */}
      {currentView !== 'reader' && currentView !== 'admin' && (
        <Header
          currentView={currentView}
          onNavigate={handleNavigate}
          unlockedCount={unlockedSet.size}
          favoritesCount={favoritesCount}
        />
      )}

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'landing' && (
          <LandingPage
            books={books}
            bundles={bundles}
            unlockedBookIds={unlockedSet}
            onOpenReader={handleOpenReader}
            onOpenCheckout={handleOpenCheckout}
            onRefresh={refreshData}
          />
        )}

        {currentView === 'contact' && (
          <ContactSupportPage
            onBackToCatalog={() => handleNavigate('landing')}
          />
        )}

        {(currentView === 'paid' || currentView === 'favorites' || currentView === 'groceries') && (
          <MyVaultPage
            key={currentView}
            initialTab={currentView === 'groceries' ? 'groceries' : currentView === 'favorites' ? 'favorites' : 'paid'}
            books={books}
            unlockedBookIds={unlockedSet}
            onOpenReader={handleOpenReader}
            onOpenCheckout={handleOpenCheckout}
            onBackToCatalog={() => handleNavigate('landing')}
            onRefresh={refreshData}
          />
        )}

        {currentView === 'reader' && currentActiveBook && (
          <BookReader
            book={currentActiveBook}
            isUnlocked={bookStore.isBookUnlocked(currentActiveBook.id)}
            initialPage={readerInitialPage}
            onBack={() => handleNavigate('landing')}
            onOpenCheckout={(item) => handleOpenCheckout({ ...item, type: 'book' })}
            onUnlockSuccess={() => {
              bookStore.unlockItem(currentActiveBook.id);
              refreshData();
            }}
          />
        )}

        {currentView === 'admin' && (
          <AdminPortal
            onBackToApp={() => handleNavigate('landing')}
            onPreviewBook={(slug) => handleOpenReader(slug)}
          />
        )}
      </main>

      {/* Footer on landing, paid, favorites, and contact */}
      {(currentView === 'landing' || currentView === 'paid' || currentView === 'favorites' || currentView === 'contact') && (
        <Footer />
      )}

      {/* Checkout Modal */}
      {checkoutItem && (
        <PayPalCheckoutModal
          item={checkoutItem}
          isOpen={!!checkoutItem}
          onClose={() => setCheckoutItem(null)}
          onSuccess={handleCheckoutSuccess}
        />
      )}

      {/* Google Play Compliant Legal Modals */}
      <PrivacyPolicyModal
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
      />

      <TermsConditionsModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
      />

      <RefundPolicyModal
        isOpen={showRefundModal}
        onClose={() => setShowRefundModal(false)}
      />

      {/* 10-Second Web App Download & Install Prompt */}
      <AppInstallPrompt />

      {/* Global Braai & Oven Cooking Timer (runs across landing, groceries, reader, etc.) */}
      {currentView !== 'reader' && (
        <>
          <TimerFloatingWidget onOpenTimerModal={() => setShowGlobalTimerModal(true)} />
          <CookingTimerModal
            isOpen={showGlobalTimerModal}
            onClose={() => setShowGlobalTimerModal(false)}
          />
        </>
      )}
    </div>
  );
};
