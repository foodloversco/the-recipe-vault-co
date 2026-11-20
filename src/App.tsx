import React, { useState, useEffect } from 'react';
import { Book, Bundle } from './types';
import { bookStore } from './services/bookStore';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { LandingPage } from './components/landing/LandingPage';
import { BookReader } from './components/reader/BookReader';
import { AdminPortal } from './components/admin/AdminPortal';
import { PayPalCheckoutModal } from './components/checkout/PayPalCheckoutModal';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'reader' | 'admin'>('landing');
  const [activeBookSlug, setActiveBookSlug] = useState<string | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [unlockedSet, setUnlockedSet] = useState<Set<string>>(new Set());

  // Checkout Modal State
  const [checkoutItem, setCheckoutItem] = useState<{ id: string; type: 'book' | 'bundle'; title: string; price: number } | null>(null);

  useEffect(() => {
    refreshData();

    // Check URL parameters for direct book links: ?book=slug
    const urlParams = new URLSearchParams(window.location.search);
    const bookParam = urlParams.get('book');
    const viewParam = urlParams.get('view');

    if (viewParam === 'admin') {
      setCurrentView('admin');
    } else if (bookParam) {
      setActiveBookSlug(bookParam);
      setCurrentView('reader');
    }
  }, []);

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
  };

  const handleOpenReader = (slug: string) => {
    setActiveBookSlug(slug);
    setCurrentView('reader');
    const url = new URL(window.location.href);
    url.searchParams.set('book', slug);
    url.searchParams.delete('view');
    window.history.pushState({}, '', url.toString());
  };

  const handleNavigate = (view: string, slug?: string) => {
    if (view === 'admin') {
      setCurrentView('admin');
      const url = new URL(window.location.href);
      url.searchParams.set('view', 'admin');
      url.searchParams.delete('book');
      window.history.pushState({}, '', url.toString());
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

  const handleOpenCheckout = (item: { id: string; type: 'book' | 'bundle'; title: string; price: number }) => {
    setCheckoutItem(item);
  };

  const handleCheckoutSuccess = (_token: string) => {
    refreshData();
  };

  const currentActiveBook = activeBookSlug ? bookStore.getBookBySlug(activeBookSlug) || books[0] : null;

  return (
    <div className="min-h-screen flex flex-col bg-[#100f0e] text-[#f5f2eb]">
      {/* Show Main Header only when not in reader or admin */}
      {currentView !== 'reader' && currentView !== 'admin' && (
        <Header
          currentView={currentView}
          onNavigate={handleNavigate}
          unlockedCount={unlockedSet.size}
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
          />
        )}

        {currentView === 'reader' && currentActiveBook && (
          <BookReader
            book={currentActiveBook}
            isUnlocked={bookStore.isBookUnlocked(currentActiveBook.id)}
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

      {/* Footer on landing */}
      {currentView === 'landing' && <Footer />}

      {/* Checkout Modal */}
      {checkoutItem && (
        <PayPalCheckoutModal
          item={checkoutItem}
          isOpen={!!checkoutItem}
          onClose={() => setCheckoutItem(null)}
          onSuccess={handleCheckoutSuccess}
        />
      )}
    </div>
  );
};
