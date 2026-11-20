import { Book, Bundle } from '../types';
import { INITIAL_BOOKS, INITIAL_BUNDLES } from '../data/initialBooks';

const BOOKS_STORAGE_KEY = 'the_recipe_vault_books_v1';
const BUNDLES_STORAGE_KEY = 'the_recipe_vault_bundles_v1';
const UNLOCKED_ITEMS_KEY = 'the_recipe_vault_unlocked_items_v1';

class BookStore {
  private books: Book[] = [];
  private bundles: Bundle[] = [];
  private unlockedItems: Set<string> = new Set();

  constructor() {
    this.init();
  }

  private init() {
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
  }

  public deleteBook(id: string): void {
    this.books = this.books.filter((b) => b.id !== id);
    this.saveBooksToStorage();
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
