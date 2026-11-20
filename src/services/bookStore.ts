import { Book, Bundle } from '../types';
import { INITIAL_BOOKS, INITIAL_BUNDLES } from '../data/initialBooks';
import { storageService } from './storageService';

const BOOKS_STORAGE_KEY = 'the_recipe_vault_books_v1';
const BUNDLES_STORAGE_KEY = 'the_recipe_vault_bundles_v1';
const UNLOCKED_ITEMS_KEY = 'the_recipe_vault_unlocked_items_v1';

class BookStore {
  private books: Book[] = [];
  private bundles: Bundle[] = [];
  private unlockedItems: Set<string> = new Set();
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.init();
  }

  private async init() {
    try {
      const storedBooks = localStorage.getItem(BOOKS_STORAGE_KEY);
      if (storedBooks) {
        this.books = JSON.parse(storedBooks);
      } else {
        this.books = [...INITIAL_BOOKS];
        this.saveBooksToStorage();
      }

      const storedBundles = localStorage.getItem(BUNDLES_STORAGE_KEY);
      if (storedBundles) {
        this.bundles = JSON.parse(storedBundles);
      } else {
        this.bundles = [...INITIAL_BUNDLES];
        this.saveBundlesToStorage();
      }

      const storedUnlocked = localStorage.getItem(UNLOCKED_ITEMS_KEY);
      if (storedUnlocked) {
        this.unlockedItems = new Set(JSON.parse(storedUnlocked));
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

  public async deleteBook(id: string): Promise<void> {
    const bookToDelete = this.getBookById(id);
    if (bookToDelete) {
      // Remove PDF and Cover from Cloudflare R2
      if (bookToDelete.pdfFileUrl) {
        storageService.deleteFileFromCloud(bookToDelete.pdfFileUrl).catch(() => {});
      }
      if (bookToDelete.coverImage) {
        storageService.deleteFileFromCloud(bookToDelete.coverImage).catch(() => {});
      }
    }

    this.books = this.books.filter((b) => b.id !== id);
    this.saveBooksToStorage();
    this.notifyListeners();

    // Sync deletion to Cloudflare R2 cloud manifest
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
  }

  public deleteBundle(id: string): void {
    this.bundles = this.bundles.filter((b) => b.id !== id);
    this.saveBundlesToStorage();
  }

  public isBookUnlocked(bookId: string): boolean {
    if (this.unlockedItems.has(bookId)) return true;
    // Check if any purchased bundle contains this book
    for (const bundleId of this.unlockedItems) {
      const bundle = this.bundles.find((b) => b.id === bundleId);
      if (bundle && bundle.bookIds.includes(bookId)) {
        return true;
      }
    }
    return false;
  }

  public unlockItem(itemId: string, _unlockToken?: string): void {
    this.unlockedItems.add(itemId);
    const bundle = this.bundles.find((b) => b.id === itemId);
    if (bundle) {
      bundle.bookIds.forEach((bId) => this.unlockedItems.add(bId));
    }
    localStorage.setItem(UNLOCKED_ITEMS_KEY, JSON.stringify(Array.from(this.unlockedItems)));
  }

  public resetPurchases(): void {
    this.unlockedItems.clear();
    localStorage.removeItem(UNLOCKED_ITEMS_KEY);
  }
}

export const bookStore = new BookStore();

