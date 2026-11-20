// Persistent Browser Storage via native IndexedDB (Gigabyte-scale, zero quota limit)
import { Book } from '../types';

const DB_NAME = 'recipe_vault_db_v1';
const DB_VERSION = 1;
const BOOKS_STORE = 'books';
const PDF_STORE = 'pdf_blobs';

class IndexedDbService {
  private dbPromise: Promise<IDBDatabase> | null = null;

  private getDB(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !window.indexedDB) {
        reject(new Error('IndexedDB is not supported in this environment'));
        return;
      }

      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(BOOKS_STORE)) {
          db.createObjectStore(BOOKS_STORE, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(PDF_STORE)) {
          db.createObjectStore(PDF_STORE, { keyPath: 'id' });
        }
      };

      request.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        resolve(db);
      };

      request.onerror = (event) => {
        reject((event.target as IDBOpenDBRequest).error);
      };
    });

    return this.dbPromise;
  }

  public async saveBook(book: Book): Promise<void> {
    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(BOOKS_STORE, 'readwrite');
        const store = tx.objectStore(BOOKS_STORE);
        const req = store.put(book);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch (err) {
      console.warn('IndexedDB saveBook failed:', err);
    }
  }

  public async getAllBooks(): Promise<Book[]> {
    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(BOOKS_STORE, 'readonly');
        const store = tx.objectStore(BOOKS_STORE);
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => reject(req.error);
      });
    } catch (err) {
      console.warn('IndexedDB getAllBooks failed:', err);
      return [];
    }
  }

  public async deleteBook(bookId: string): Promise<void> {
    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(BOOKS_STORE, 'readwrite');
        const store = tx.objectStore(BOOKS_STORE);
        const req = store.delete(bookId);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch (err) {
      console.warn('IndexedDB deleteBook failed:', err);
    }
  }

  public async savePdfBlob(id: string, blob: Blob): Promise<void> {
    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(PDF_STORE, 'readwrite');
        const store = tx.objectStore(PDF_STORE);
        const req = store.put({ id, blob });
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch (err) {
      console.warn('IndexedDB savePdfBlob failed:', err);
    }
  }

  public async getPdfBlob(id: string): Promise<Blob | null> {
    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(PDF_STORE, 'readonly');
        const store = tx.objectStore(PDF_STORE);
        const req = store.get(id);
        req.onsuccess = () => resolve(req.result?.blob || null);
        req.onerror = () => reject(req.error);
      });
    } catch (err) {
      console.warn('IndexedDB getPdfBlob failed:', err);
      return null;
    }
  }
}

export const indexedDbService = new IndexedDbService();
