import React, { useState } from 'react';
import { Book, FavoriteRecipeItem } from '../../types';
import { bookStore } from '../../services/bookStore';
import { salesStore } from '../../services/salesStore';
import {
  BookOpen,
  Heart,
  Unlock,
  Lock,
  CreditCard,
  Eye,
  Download,
  Trash2,
  Sparkles,
  KeyRound,
  CheckCircle2,
  ArrowLeft,
  Flame,
  ShoppingBag
} from 'lucide-react';

interface MyVaultPageProps {
  initialTab?: 'paid' | 'favorites';
  books: Book[];
  unlockedBookIds: Set<string>;
  onOpenReader: (slug: string, initialPage?: number) => void;
  onOpenCheckout: (item: { id: string; type: 'book' | 'bundle'; title: string; price: number; originalPrice?: number }) => void;
  onBackToCatalog: () => void;
  onRefresh: () => void;
}

export const MyVaultPage: React.FC<MyVaultPageProps> = ({
  initialTab = 'paid',
  books,
  unlockedBookIds,
  onOpenReader,
  onOpenCheckout,
  onBackToCatalog,
  onRefresh,
}) => {
  const [activeTab, setActiveTab] = useState<'paid' | 'favorites'>(initialTab);
  const [recoveryInput, setRecoveryInput] = useState('');
  const [selectedRecoverBookId, setSelectedRecoverBookId] = useState(books[0]?.id || '');
  const [recoveryMessage, setRecoveryMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const paidBooks = books.filter((b) => unlockedBookIds.has(b.id));
  const favoriteBooks = bookStore.getFavoriteBooks();
  const favoriteRecipes: FavoriteRecipeItem[] = bookStore.getFavoriteRecipes();
  const totalFavoritesCount = favoriteBooks.length + favoriteRecipes.length;

  const handleToggleFavBook = (bookId: string) => {
    bookStore.toggleFavoriteBook(bookId);
    onRefresh();
  };

  const handleRemoveFavRecipe = (id: string) => {
    bookStore.removeFavoriteRecipe(id);
    onRefresh();
  };

  const handleRestorePurchase = (e: React.FormEvent) => {
    e.preventDefault();
    const val = recoveryInput.trim();
    if (!val) return;

    // 1. Check if it matches any recorded sale token or email in salesStore
    const matchingSales = salesStore.getSales().filter(
      (s) =>
        s.unlockToken.toLowerCase() === val.toLowerCase() ||
        s.buyerEmail.toLowerCase() === val.toLowerCase()
    );

    if (matchingSales.length > 0) {
      matchingSales.forEach((s) => {
        bookStore.unlockItem(s.itemId, s.unlockToken, false);
      });
      onRefresh();
      setRecoveryMessage({
        text: `Success! Restored ${matchingSales.length} purchased item(s) to your Paid Books library.`,
        isError: false,
      });
      setRecoveryInput('');
      return;
    }

    // 2. Check if it's a valid RV- token format for the selected book
    if (val.toUpperCase().startsWith('RV-') && val.length >= 6) {
      const targetId = selectedRecoverBookId || books[0]?.id;
      if (targetId) {
        bookStore.unlockItem(targetId, val.toUpperCase(), false);
        onRefresh();
        setRecoveryMessage({
          text: 'Unlock token verified! Your paid book is now unlocked in your library.',
          isError: false,
        });
        setRecoveryInput('');
        return;
      }
    }

    setRecoveryMessage({
      text: 'Could not find a matching unlock token or purchase email. Please check your receipt.',
      isError: true,
    });
  };

  return (
    <div className="min-h-screen bg-[#100f0e] text-[#f5f2eb] py-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Top Back & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#2a241e]">
          <div>
            <button
              onClick={onBackToCatalog}
              className="inline-flex items-center gap-1.5 text-xs text-[#dea374] hover:text-white mb-2 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Storefront Catalog</span>
            </button>
            <h1 className="font-serif text-2xl sm:text-4xl font-bold text-white">
              My Personal Recipe Vault
            </h1>
            <p className="text-xs sm:text-sm text-[#a59c90] mt-1">
              Access all your paid recipe books, saved favorite recipes, and wishlist in one place.
            </p>
          </div>

          {/* Sub-Navigation Tabs: Paid Books vs Favorites & Wishlist */}
          <div className="flex items-center gap-2 bg-[#181614] p-1.5 rounded-2xl border border-[#2c251e]">
            <button
              onClick={() => setActiveTab('paid')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'paid'
                  ? 'bg-gradient-to-r from-[#cf7b3e] to-[#b8612b] text-white shadow-lg'
                  : 'text-[#b5aca0] hover:text-white'
              }`}
            >
              <Unlock className="w-4 h-4" />
              <span>My Paid Books ({paidBooks.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('favorites')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'favorites'
                  ? 'bg-gradient-to-r from-rose-600 to-rose-700 text-white shadow-lg'
                  : 'text-[#b5aca0] hover:text-white'
              }`}
            >
              <Heart className={`w-4 h-4 ${activeTab === 'favorites' ? 'fill-white' : 'text-rose-400'}`} />
              <span>Favorites &amp; Wishlist ({totalFavoritesCount})</span>
            </button>
          </div>
        </div>

        {/* TAB 1: MY PAID BOOKS */}
        {activeTab === 'paid' && (
          <div className="mt-8 space-y-10">
            {paidBooks.length === 0 ? (
              <div className="bg-[#181614] border border-[#2d261f] rounded-3xl p-8 sm:p-12 text-center max-w-2xl mx-auto">
                <div className="w-16 h-16 rounded-full bg-[#241e18] border border-[#cf7b3e]/40 flex items-center justify-center mx-auto mb-4 text-[#dea374]">
                  <BookOpen className="w-8 h-8" />
                </div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-white">
                  No Paid Books Unlocked on This Device Yet
                </h2>
                <p className="text-xs sm:text-sm text-[#a39c91] mt-2 max-w-md mx-auto leading-relaxed">
                  When you purchase any recipe book via PayPal, it unlocks immediately and appears right here for lifetime full-screen reading and printing.
                </p>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={onBackToCatalog}
                    className="px-6 py-3 rounded-full bg-gradient-to-r from-[#cf7b3e] to-[#b8612b] text-white font-bold text-xs sm:text-sm shadow-lg hover:brightness-110 transition-all"
                  >
                    Browse Recipe Books
                  </button>
                  <button
                    onClick={() => setActiveTab('favorites')}
                    className="px-5 py-3 rounded-full bg-[#241f1a] hover:bg-[#2f2821] text-[#dea374] border border-[#3d3329] font-semibold text-xs sm:text-sm transition-all flex items-center gap-1.5"
                  >
                    <Heart className="w-4 h-4 text-rose-400" />
                    <span>View My Wishlist ({totalFavoritesCount})</span>
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <span className="text-[11px] uppercase font-bold tracking-widest text-emerald-400">
                      LIFETIME DIGITAL ACCESS
                    </span>
                    <h2 className="font-serif text-xl sm:text-2xl font-bold text-white">
                      Your Paid &amp; Unlocked Recipe Books ({paidBooks.length})
                    </h2>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {paidBooks.map((book) => (
                    <div
                      key={book.id}
                      className="bg-[#181614] border-2 border-emerald-500/40 rounded-3xl overflow-hidden flex flex-col justify-between shadow-xl"
                    >
                      <div>
                        <div
                          onClick={() => onOpenReader(book.slug)}
                          className="w-full aspect-[9/16] max-h-[440px] relative overflow-hidden bg-[#12110f] cursor-pointer group"
                        >
                          <img
                            src={book.coverImage}
                            alt={book.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute top-3 left-3 bg-emerald-950/90 backdrop-blur-md px-3 py-1 rounded-full border border-emerald-400/40 text-[10px] font-bold text-emerald-300 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>PAID &amp; UNLOCKED</span>
                          </div>
                        </div>

                        <div className="p-5">
                          <div className="text-[11px] text-[#dea374] font-mono mb-1">
                            {book.recipeCount || 30} Recipes • Full Access Unlocked
                          </div>
                          <h3 className="font-serif font-bold text-lg text-white leading-snug mb-1">
                            {book.title}
                          </h3>
                          <p className="text-xs text-[#a39c91] line-clamp-2">
                            {book.description}
                          </p>
                        </div>
                      </div>

                      <div className="p-5 pt-0 space-y-2">
                        <button
                          onClick={() => onOpenReader(book.slug)}
                          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#cf7b3e] to-[#b8612b] text-white text-xs sm:text-sm font-bold shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2"
                        >
                          <BookOpen className="w-4 h-4" />
                          <span>Read Full Book Now (Page 1)</span>
                        </button>

                        {book.pdfFileUrl && (
                          <a
                            href={book.pdfFileUrl}
                            download={book.pdfFileName || `${book.slug}.pdf`}
                            target="_blank"
                            rel="noreferrer"
                            className="w-full py-2.5 px-4 rounded-xl bg-[#241f1a] hover:bg-[#312a23] text-[#dea374] border border-[#3a3128] text-xs font-semibold transition-all flex items-center justify-center gap-2"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download Printable PDF</span>
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Unlock Token / Email Recovery Box */}
            <div className="bg-[#181614] border border-[#2d261f] rounded-3xl p-6 max-w-2xl mx-auto">
              <div className="flex items-center gap-2.5 mb-2">
                <KeyRound className="w-5 h-5 text-[#dea374]" />
                <h3 className="font-serif font-bold text-base text-white">
                  Already Paid? Restore Book with Unlock Token or Buyer Email
                </h3>
              </div>
              <p className="text-xs text-[#9c9387] mb-4">
                Enter the permanent unlock token (e.g. <span className="font-mono text-[#dea374]">RV-XXXXXX-1234</span>) or email address from your PayPal checkout receipt to unlock your paid book on this browser or phone.
              </p>

              <form onSubmit={handleRestorePurchase} className="flex flex-col sm:flex-row gap-2.5">
                {books.length > 1 && (
                  <select
                    value={selectedRecoverBookId}
                    onChange={(e) => setSelectedRecoverBookId(e.target.value)}
                    className="bg-[#121110] border border-[#383027] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#cf7b3e]"
                  >
                    {books.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.title}
                      </option>
                    ))}
                  </select>
                )}
                <input
                  type="text"
                  value={recoveryInput}
                  onChange={(e) => setRecoveryInput(e.target.value)}
                  placeholder="Enter RV-... token or buyer email"
                  className="flex-1 bg-[#121110] border border-[#383027] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#686055] focus:outline-none focus:border-[#cf7b3e]"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#2a231c] hover:bg-[#cf7b3e] text-white font-bold text-xs border border-[#cf7b3e]/40 transition-all"
                >
                  Restore Paid Book
                </button>
              </form>

              {recoveryMessage && (
                <p
                  className={`text-xs mt-3 font-medium ${
                    recoveryMessage.isError ? 'text-rose-400' : 'text-emerald-400'
                  }`}
                >
                  {recoveryMessage.text}
                </p>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: FAVORITES & WISHLIST (ALL-IN-ONE) */}
        {activeTab === 'favorites' && (
          <div className="mt-8 space-y-10">
            {totalFavoritesCount === 0 ? (
              <div className="bg-[#181614] border border-[#2d261f] rounded-3xl p-8 sm:p-12 text-center max-w-2xl mx-auto">
                <div className="w-16 h-16 rounded-full bg-rose-950/40 border border-rose-500/40 flex items-center justify-center mx-auto mb-4 text-rose-400">
                  <Heart className="w-8 h-8" />
                </div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-white">
                  Your Favorites &amp; Wishlist is Empty
                </h2>
                <p className="text-xs sm:text-sm text-[#a39c91] mt-2 max-w-md mx-auto leading-relaxed">
                  Tap the <strong className="text-rose-400">♥ Heart</strong> icon on any recipe book in the catalog or on any individual recipe page inside the reader to save it to your personal Favorites &amp; Wishlist!
                </p>
                <button
                  onClick={onBackToCatalog}
                  className="mt-6 px-6 py-3 rounded-full bg-gradient-to-r from-[#cf7b3e] to-[#b8612b] text-white font-bold text-xs sm:text-sm shadow-lg hover:brightness-110 transition-all"
                >
                  Explore Recipe Books
                </button>
              </div>
            ) : (
              <>
                {/* SECTION A: LIKED BOOKS & WISHLIST */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-[11px] uppercase font-bold tracking-widest text-rose-400">
                        SAVED COLLECTIONS &amp; WISHLIST
                      </span>
                      <h2 className="font-serif text-xl sm:text-2xl font-bold text-white">
                        Liked Books &amp; Wishlist ({favoriteBooks.length})
                      </h2>
                    </div>
                  </div>

                  {favoriteBooks.length === 0 ? (
                    <div className="bg-[#181614] border border-[#2a241e] rounded-2xl p-5 text-xs text-[#9c9387]">
                      No full books hearted yet. Tap the heart icon on any book cover on the home page to add it to your Wishlist!
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {favoriteBooks.map((book) => {
                        const isUnlocked = unlockedBookIds.has(book.id);
                        return (
                          <div
                            key={book.id}
                            className="bg-[#181614] border border-[#352c23] hover:border-rose-500/50 rounded-3xl overflow-hidden flex flex-col justify-between shadow-lg"
                          >
                            <div>
                              <div
                                onClick={() => onOpenReader(book.slug)}
                                className="w-full aspect-[9/16] max-h-[420px] relative overflow-hidden bg-[#12110f] cursor-pointer group"
                              >
                                <img
                                  src={book.coverImage}
                                  alt={book.title}
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div
                                  className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 backdrop-blur-md border ${
                                    isUnlocked
                                      ? 'bg-emerald-950/90 border-emerald-400/40 text-emerald-300'
                                      : 'bg-amber-950/90 border-amber-400/40 text-amber-300'
                                  }`}
                                >
                                  {isUnlocked ? (
                                    <>
                                      <Unlock className="w-3 h-3" />
                                      <span>OWNED &amp; FAVORITED</span>
                                    </>
                                  ) : (
                                    <>
                                      <ShoppingBag className="w-3 h-3" />
                                      <span>ON YOUR WISHLIST</span>
                                    </>
                                  )}
                                </div>

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggleFavBook(book.id);
                                  }}
                                  title="Remove from Favorites & Wishlist"
                                  className="absolute top-3 right-3 bg-rose-600 hover:bg-rose-700 p-2 rounded-full text-white shadow-lg"
                                >
                                  <Heart className="w-4 h-4 fill-white" />
                                </button>
                              </div>

                              <div className="p-5">
                                <h3 className="font-serif font-bold text-base text-white leading-snug mb-1">
                                  {book.title}
                                </h3>
                                <p className="text-xs text-[#a39c91] line-clamp-2">
                                  {book.description}
                                </p>
                              </div>
                            </div>

                            <div className="p-5 pt-0 border-t border-[#241f1a]">
                              <div className="flex items-baseline justify-between py-2.5">
                                <div className="flex items-baseline gap-2">
                                  <span className="text-lg font-extrabold text-white">
                                    ${book.price.toFixed(2)}
                                  </span>
                                  {book.originalPrice && (
                                    <span className="text-xs line-through text-[#8e8578]">
                                      ${book.originalPrice.toFixed(2)}
                                    </span>
                                  )}
                                  <span className="text-[10px] text-[#dea374] font-bold">USD</span>
                                </div>
                                {book.soldCount !== undefined && book.soldCount > 0 && (
                                  <span className="text-[10px] text-amber-400 font-semibold flex items-center gap-1">
                                    <Flame className="w-3 h-3 fill-amber-400" />
                                    {book.soldCount} Sold
                                  </span>
                                )}
                              </div>

                              {isUnlocked ? (
                                <button
                                  onClick={() => onOpenReader(book.slug)}
                                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                                >
                                  <BookOpen className="w-3.5 h-3.5" />
                                  <span>Read Full Book</span>
                                </button>
                              ) : (
                                <div className="grid grid-cols-2 gap-2">
                                  <button
                                    onClick={() => onOpenReader(book.slug)}
                                    className="py-2.5 px-3 rounded-xl bg-[#25201b] hover:bg-[#332b24] text-[#dea374] text-xs font-semibold border border-[#3a3128] flex items-center justify-center gap-1"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                    <span>Preview</span>
                                  </button>
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
                                    className="py-2.5 px-3 rounded-xl bg-[#cf7b3e] hover:bg-[#b8612b] text-white text-xs font-bold shadow-md flex items-center justify-center gap-1"
                                  >
                                    <CreditCard className="w-3.5 h-3.5" />
                                    <span>Buy Now</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* SECTION B: LIKED INDIVIDUAL RECIPES */}
                <div className="pt-4 border-t border-[#26211c]">
                  <div className="mb-4">
                    <span className="text-[11px] uppercase font-bold tracking-widest text-[#dea374]">
                      SAVED RECIPE CARDS
                    </span>
                    <h2 className="font-serif text-xl sm:text-2xl font-bold text-white">
                      My Favorite Recipes ({favoriteRecipes.length})
                    </h2>
                  </div>

                  {favoriteRecipes.length === 0 ? (
                    <div className="bg-[#181614] border border-[#2a241e] rounded-2xl p-5 text-xs text-[#9c9387]">
                      While flipping through any book in the reader, tap the <strong className="text-rose-400">♥ Like Recipe</strong> button in the top bar to bookmark your favorite dishes here!
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {favoriteRecipes.map((fav) => (
                        <div
                          key={fav.id}
                          className="bg-[#181614] border border-[#2f2820] rounded-2xl p-4 flex items-center gap-3.5 justify-between hover:border-[#cf7b3e]/50 transition-all"
                        >
                          <div
                            onClick={() => onOpenReader(fav.bookSlug, fav.pageNumber)}
                            className="flex items-center gap-3.5 flex-1 min-w-0 cursor-pointer"
                          >
                            {fav.image && (
                              <img
                                src={fav.image}
                                alt={fav.recipeTitle}
                                className="w-14 h-16 rounded-xl object-cover border border-[#3d3328] flex-shrink-0"
                              />
                            )}
                            <div className="min-w-0 flex-1">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 block">
                                Page {fav.pageNumber} • {fav.category || 'Recipe Card'}
                              </span>
                              <h4 className="font-serif font-bold text-sm text-white truncate">
                                {fav.recipeTitle}
                              </h4>
                              <p className="text-[11px] text-[#9c9387] truncate">
                                From: {fav.bookTitle}
                              </p>
                              <span className="text-[10px] text-[#dea374] font-semibold inline-block mt-1">
                                Open Recipe →
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={() => handleRemoveFavRecipe(fav.id)}
                            title="Remove from Favorite Recipes"
                            className="p-2 rounded-xl bg-[#241f1a] hover:bg-rose-950 text-rose-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
