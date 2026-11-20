import { Book, Bundle, RecipePage, FavoriteRecipeItem } from '../types';
import { INITIAL_BOOKS, INITIAL_BUNDLES } from '../data/initialBooks';
import { storageService } from './storageService';

const BOOKS_STORAGE_KEY = 'the_recipe_vault_books_v1';
const BUNDLES_STORAGE_KEY = 'the_recipe_vault_bundles_v1';
const UNLOCKED_ITEMS_KEY = 'the_recipe_vault_unlocked_items_v1';
const FAV_BOOKS_KEY = 'the_recipe_vault_fav_books_v1';
const FAV_RECIPES_KEY = 'the_recipe_vault_fav_recipes_v1';

class BookStore {
  private books: Book[] = [];
  private bundles: Bundle[] = [];
  private unlockedItems: Set<string> = new Set();
  private favoriteBookIds: Set<string> = new Set();
  private favoriteRecipes: FavoriteRecipeItem[] = [];
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.init();
  }

  private async init() {
    const LEGACY_SAMPLE_SLUGS = new Set([
      'authentic-heritage-braai-masterclass',
      'timeless-hearth-comfort-classics',
      'global-street-food-spice-trails',
    ]);
    const LEGACY_SAMPLE_IDS = new Set(['vault-vol-02', 'vault-vol-03']);
    const LEGACY_BUNDLE_IDS = new Set(['bundle-master-culinary-library']);

    try {
      const storedBooks = localStorage.getItem(BOOKS_STORAGE_KEY);
      if (storedBooks) {
        const parsed: Book[] = JSON.parse(storedBooks);
        // Strip out legacy sample books from localStorage so only real books show
        const cleaned = parsed.filter(
          (b) => !LEGACY_SAMPLE_SLUGS.has(b.slug) && !LEGACY_SAMPLE_IDS.has(b.id)
        );
        if (cleaned.length > 0) {
          this.books = cleaned.map((b) => {
            if (b.slug === 'south-africa-braai-heritage') {
              return {
                ...b,
                title: 'South African Braai & Heritage Series 1',
                priceZAR: 20,
                coverImage:
                  b.coverImage && b.coverImage !== '/assets/images/recipe-card-sample.png'
                    ? b.coverImage
                    : '/assets/images/south-africa-braai-cover.jpg',
                pdfFileUrl: '/assets/books/South_African_Braai_Heritage_Series_1.pdf',
                pdfFileName: 'South_African_Braai_Heritage_Series_1.pdf',
                soldCount: typeof b.soldCount === 'number' && b.soldCount < 40 ? b.soldCount : 0,
                likesCount: b.likesCount !== undefined ? b.likesCount : 191,
              };
            }
            return b;
          });
        } else {
          this.books = [...INITIAL_BOOKS];
        }
        this.saveBooksToStorage();
      } else {
        this.books = [...INITIAL_BOOKS];
        this.saveBooksToStorage();
      }

      const storedBundles = localStorage.getItem(BUNDLES_STORAGE_KEY);
      if (storedBundles) {
        const parsedBundles: Bundle[] = JSON.parse(storedBundles);
        // Strip out legacy default 3-volume bundle so only admin-created combos appear
        this.bundles = parsedBundles.filter(
          (b) => !LEGACY_BUNDLE_IDS.has(b.id) && b.slug !== 'complete-culinary-vault-bundle'
        );
        this.saveBundlesToStorage();
      } else {
        this.bundles = [...INITIAL_BUNDLES];
        this.saveBundlesToStorage();
      }

      const storedUnlocked = localStorage.getItem(UNLOCKED_ITEMS_KEY);
      if (storedUnlocked) {
        this.unlockedItems = new Set(JSON.parse(storedUnlocked));
      }

      const storedFavBooks = localStorage.getItem(FAV_BOOKS_KEY);
      if (storedFavBooks) {
        this.favoriteBookIds = new Set(JSON.parse(storedFavBooks));
      }

      const storedFavRecipes = localStorage.getItem(FAV_RECIPES_KEY);
      if (storedFavRecipes) {
        this.favoriteRecipes = JSON.parse(storedFavRecipes);
      }
    } catch (e) {
      console.error('Failed to init BookStore:', e);
      this.books = [...INITIAL_BOOKS];
      this.bundles = [...INITIAL_BUNDLES];
    }

    // Connect Cloudflare R2 to sync cloud books between Dev Mode and Live Mode
    this.pullFromCloud();
  }

  public async pullFromCloud(): Promise<void> {
    try {
      const cloudBooks = await storageService.fetchBooksManifestFromCloud();
      if (cloudBooks && Array.isArray(cloudBooks) && cloudBooks.length > 0) {
        this.books = cloudBooks;
        this.saveBooksToStorage();
        this.notifyListeners();
      }
    } catch (err) {
      console.warn('Could not sync books from cloud:', err);
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch (err) {
        console.error('Error in bookStore listener:', err);
      }
    });
  }

  private saveBooksToStorage() {
    try {
      localStorage.setItem(BOOKS_STORAGE_KEY, JSON.stringify(this.books));
    } catch (e) {
      console.warn('Could not persist books to localStorage (quota?):', e);
    }
  }

  private saveBundlesToStorage() {
    try {
      localStorage.setItem(BUNDLES_STORAGE_KEY, JSON.stringify(this.bundles));
    } catch (e) {
      console.warn('Could not persist bundles to localStorage:', e);
    }
  }

  private saveFavoritesToStorage() {
    try {
      localStorage.setItem(FAV_BOOKS_KEY, JSON.stringify(Array.from(this.favoriteBookIds)));
      localStorage.setItem(FAV_RECIPES_KEY, JSON.stringify(this.favoriteRecipes));
    } catch (e) {
      console.warn('Could not persist favorites to localStorage:', e);
    }
  }

  public getBooks(): Book[] {
    return [...this.books];
  }

  public getBookById(id: string): Book | undefined {
    return this.books.find((b) => b.id === id);
  }

  public getBookBySlug(slug: string): Book | undefined {
    return this.books.find((b) => b.slug === slug || b.id === slug);
  }

  public saveBook(book: Book): void {
    const index = this.books.findIndex((b) => b.id === book.id);
    if (index >= 0) {
      this.books[index] = book;
    } else {
      this.books.unshift(book);
    }
    this.saveBooksToStorage();
    this.notifyListeners();

    // Sync to Cloudflare R2 cloud so live mode and dev mode always reflect the change
    storageService.syncBooksManifestToCloud(this.books).catch(() => {});
  }

  public updateBookSoldCount(bookId: string, newCount: number): void {
    const book = this.books.find((b) => b.id === bookId);
    if (!book) return;
    book.soldCount = Math.max(0, Math.floor(newCount));
    this.saveBooksToStorage();
    this.notifyListeners();
    storageService.syncBooksManifestToCloud(this.books).catch(() => {});
  }

  public incrementBookSoldCount(itemId: string): void {
    let changed = false;
    const book = this.books.find((b) => b.id === itemId);
    if (book) {
      book.soldCount = (book.soldCount || 0) + 1;
      changed = true;
    } else {
      const bundle = this.bundles.find((b) => b.id === itemId);
      if (bundle) {
        bundle.bookIds.forEach((bId) => {
          const bundledBook = this.books.find((b) => b.id === bId);
          if (bundledBook) {
            bundledBook.soldCount = (bundledBook.soldCount || 0) + 1;
            changed = true;
          }
        });
      }
    }

    if (changed) {
      this.saveBooksToStorage();
      this.notifyListeners();
      storageService.syncBooksManifestToCloud(this.books).catch(() => {});
    }
  }

  public async deleteBook(id: string): Promise<void> {
    const bookToDelete = this.getBookById(id);
    if (bookToDelete) {
      if (bookToDelete.pdfFileUrl) {
        storageService.deleteFileFromCloud(bookToDelete.pdfFileUrl).catch(() => {});
      }
      if (bookToDelete.coverImage) {
        storageService.deleteFileFromCloud(bookToDelete.coverImage).catch(() => {});
      }
    }

    this.books = this.books.filter((b) => b.id !== id);
    this.favoriteBookIds.delete(id);
    this.favoriteRecipes = this.favoriteRecipes.filter((r) => r.bookId !== id);
    this.saveBooksToStorage();
    this.saveFavoritesToStorage();
    this.notifyListeners();

    storageService.syncBooksManifestToCloud(this.books).catch(() => {});
  }

  public getBundles(): Bundle[] {
    return [...this.bundles];
  }

  public getBundleById(id: string): Bundle | undefined {
    return this.bundles.find((b) => b.id === id);
  }

  public saveBundle(bundle: Bundle): void {
    const index = this.bundles.findIndex((b) => b.id === bundle.id);
    if (index >= 0) {
      this.bundles[index] = bundle;
    } else {
      this.bundles.push(bundle);
    }
    this.saveBundlesToStorage();
    this.notifyListeners();
  }

  public deleteBundle(id: string): void {
    this.bundles = this.bundles.filter((b) => b.id !== id);
    this.saveBundlesToStorage();
    this.notifyListeners();
  }

  public isBookUnlocked(bookId: string): boolean {
    if (this.unlockedItems.has(bookId)) return true;
    for (const bundleId of this.unlockedItems) {
      const bundle = this.bundles.find((b) => b.id === bundleId);
      if (bundle && bundle.bookIds.includes(bookId)) {
        return true;
      }
    }
    return false;
  }

  public getUnlockedBooks(): Book[] {
    return this.books.filter((b) => this.isBookUnlocked(b.id));
  }

  public unlockItem(itemId: string, _unlockToken?: string, incrementSaleCount: boolean = false): void {
    this.unlockedItems.add(itemId);
    const bundle = this.bundles.find((b) => b.id === itemId);
    if (bundle) {
      bundle.bookIds.forEach((bId) => this.unlockedItems.add(bId));
    }
    localStorage.setItem(UNLOCKED_ITEMS_KEY, JSON.stringify(Array.from(this.unlockedItems)));
    if (incrementSaleCount) {
      this.incrementBookSoldCount(itemId);
    } else {
      this.notifyListeners();
    }
  }

  public resetPurchases(): void {
    this.unlockedItems.clear();
    localStorage.removeItem(UNLOCKED_ITEMS_KEY);
    this.books = this.books.map((b) => ({ ...b, soldCount: 0 }));
    this.saveBooksToStorage();
    this.notifyListeners();
  }

  // --- Favorites & Wishlist (All-in-One) ---

  public isBookFavorited(bookId: string): boolean {
    return this.favoriteBookIds.has(bookId);
  }

  public toggleFavoriteBook(bookId: string): boolean {
    let isFav = false;
    if (this.favoriteBookIds.has(bookId)) {
      this.favoriteBookIds.delete(bookId);
      isFav = false;
    } else {
      this.favoriteBookIds.add(bookId);
      isFav = true;
    }

    const target = this.books.find((b) => b.id === bookId || b.slug === bookId);
    if (target) {
      const currentLikes = target.likesCount !== undefined ? target.likesCount : 191;
      target.likesCount = isFav ? currentLikes + 1 : Math.max(191, currentLikes - 1);
      this.saveBooksToStorage();
    }

    this.saveFavoritesToStorage();
    this.notifyListeners();
    return isFav;
  }

  public getFavoriteBookIds(): Set<string> {
    return new Set(this.favoriteBookIds);
  }

  public getFavoriteBooks(): Book[] {
    return this.books.filter((b) => this.favoriteBookIds.has(b.id));
  }

  public isRecipeFavorited(bookId: string, pageNumber: number): boolean {
    const id = `${bookId}_${pageNumber}`;
    return this.favoriteRecipes.some((r) => r.id === id);
  }

  public toggleFavoriteRecipe(book: Book, page: RecipePage): boolean {
    const id = `${book.id}_${page.pageNumber}`;
    const existingIdx = this.favoriteRecipes.findIndex((r) => r.id === id);
    let isFav = false;
    if (existingIdx >= 0) {
      this.favoriteRecipes.splice(existingIdx, 1);
      isFav = false;
    } else {
      this.favoriteRecipes.unshift({
        id,
        bookId: book.id,
        bookSlug: book.slug,
        bookTitle: book.title,
        pageNumber: page.pageNumber,
        recipeTitle: page.title,
        recipeSubtitle: page.subtitle,
        category: page.category,
        image: page.image || book.coverImage,
        addedAt: new Date().toISOString(),
      });
      isFav = true;
    }
    this.saveFavoritesToStorage();
    this.notifyListeners();
    return isFav;
  }

  public removeFavoriteRecipe(id: string): void {
    this.favoriteRecipes = this.favoriteRecipes.filter((r) => r.id !== id);
    this.saveFavoritesToStorage();
    this.notifyListeners();
  }

  public getFavoriteRecipes(): FavoriteRecipeItem[] {
    return [...this.favoriteRecipes];
  }

  public getTotalFavoritesCount(): number {
    return this.favoriteBookIds.size + this.favoriteRecipes.length;
  }
}

export const bookStore = new BookStore();
