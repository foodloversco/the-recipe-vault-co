import { PromoCode } from '../types';
import { bookStore } from './bookStore';

const PROMOS_STORAGE_KEY = 'the_recipe_vault_promos_v1';

const INITIAL_PROMOS: PromoCode[] = [
  {
    id: 'promo-taste299',
    code: 'TASTE299',
    description: 'Special Launch Promo — Get Vol. 01 for $2.99 instead of $14.99',
    bookId: 'vault-vol-01',
    bookTitle: 'The Authentic Heritage Braai & Open-Flame Collection',
    regularPrice: 14.99,
    promoPrice: 2.99,
    durationDays: 30,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: true,
    timesUsed: 0,
  },
];

class PromoStore {
  private promos: PromoCode[] = [];

  constructor() {
    this.init();
  }

  private init() {
    try {
      const stored = localStorage.getItem(PROMOS_STORAGE_KEY);
      if (stored) {
        this.promos = JSON.parse(stored);
      } else {
        this.promos = [...INITIAL_PROMOS];
        this.saveToStorage();
      }
    } catch (e) {
      console.warn('Failed to load promos from localStorage:', e);
      this.promos = [...INITIAL_PROMOS];
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem(PROMOS_STORAGE_KEY, JSON.stringify(this.promos));
    } catch (e) {
      console.error('Failed to save promos to localStorage:', e);
    }
  }

  public getPromos(): PromoCode[] {
    return [...this.promos];
  }

  public getPromoById(id: string): PromoCode | undefined {
    return this.promos.find((p) => p.id === id);
  }

  public getPromoByCode(code: string): PromoCode | undefined {
    const cleanCode = code.trim().toUpperCase();
    return this.promos.find((p) => p.code.toUpperCase() === cleanCode);
  }

  public isPromoActive(promo: PromoCode): boolean {
    if (!promo.isActive) return false;
    if (!promo.expiresAt) return true; // lifetime
    return new Date(promo.expiresAt).getTime() > Date.now();
  }

  public getDaysRemaining(expiresAt: string | null): string {
    if (!expiresAt) return 'Runs for Life';
    const diffMs = new Date(expiresAt).getTime() - Date.now();
    if (diffMs <= 0) return 'Expired';
    const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    return `${days} ${days === 1 ? 'day' : 'days'} left`;
  }

  public savePromo(promoData: Omit<PromoCode, 'id' | 'createdAt' | 'timesUsed' | 'expiresAt'> & { id?: string; expiresAt?: string | null }): PromoCode {
    const expiresAt =
      promoData.durationDays === 'lifetime'
        ? null
        : new Date(Date.now() + Number(promoData.durationDays) * 24 * 60 * 60 * 1000).toISOString();

    const existingIndex = promoData.id ? this.promos.findIndex((p) => p.id === promoData.id) : -1;

    let savedPromo: PromoCode;

    if (existingIndex >= 0) {
      savedPromo = {
        ...this.promos[existingIndex],
        ...promoData,
        code: promoData.code.trim().toUpperCase(),
        expiresAt,
      };
      this.promos[existingIndex] = savedPromo;
    } else {
      savedPromo = {
        ...promoData,
        id: `promo-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        code: promoData.code.trim().toUpperCase(),
        createdAt: new Date().toISOString(),
        expiresAt,
        timesUsed: 0,
      };
      this.promos.unshift(savedPromo);
    }

    this.saveToStorage();

    // If promo applies to a specific book, sync book price & strikethrough in bookStore
    if (savedPromo.bookId && savedPromo.bookId !== 'all') {
      const book = bookStore.getBookById(savedPromo.bookId);
      if (book) {
        bookStore.saveBook({
          ...book,
          originalPrice: savedPromo.regularPrice,
          price: savedPromo.promoPrice,
          promoCode: savedPromo.code,
          promoExpiresAt: savedPromo.expiresAt,
          promoDurationDays: savedPromo.durationDays,
        });
      }
    }

    return savedPromo;
  }

  public deletePromo(id: string): void {
    const promo = this.getPromoById(id);
    if (promo && promo.bookId && promo.bookId !== 'all') {
      const book = bookStore.getBookById(promo.bookId);
      if (book) {
        // Revert book back to original price
        bookStore.saveBook({
          ...book,
          price: promo.regularPrice,
          originalPrice: undefined,
          promoCode: undefined,
          promoExpiresAt: undefined,
          promoDurationDays: undefined,
        });
      }
    }

    this.promos = this.promos.filter((p) => p.id !== id);
    this.saveToStorage();
  }

  public togglePromo(id: string): void {
    const promo = this.getPromoById(id);
    if (!promo) return;
    promo.isActive = !promo.isActive;
    this.saveToStorage();
  }

  public incrementUsage(code: string): void {
    const promo = this.getPromoByCode(code);
    if (promo) {
      promo.timesUsed = (promo.timesUsed || 0) + 1;
      this.saveToStorage();
    }
  }

  public validateCode(
    code: string,
    bookId?: string
  ): { valid: boolean; promo?: PromoCode; message: string; discountedPrice?: number; originalPrice?: number } {
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) {
      return { valid: false, message: 'Please enter a promo code.' };
    }

    const promo = this.getPromoByCode(cleanCode);
    if (!promo) {
      return { valid: false, message: `Promo code "${cleanCode}" was not found.` };
    }

    if (!promo.isActive) {
      return { valid: false, message: `Promo code "${cleanCode}" is currently inactive.` };
    }

    if (promo.expiresAt && new Date(promo.expiresAt).getTime() <= Date.now()) {
      return { valid: false, message: `Promo code "${cleanCode}" has expired.` };
    }

    if (promo.bookId && promo.bookId !== 'all' && bookId && promo.bookId !== bookId) {
      return {
        valid: false,
        message: `Promo code "${cleanCode}" only applies to: ${promo.bookTitle || 'another book'}.`,
      };
    }

    const remainingText = this.getDaysRemaining(promo.expiresAt);
    return {
      valid: true,
      promo,
      discountedPrice: promo.promoPrice,
      originalPrice: promo.regularPrice,
      message: `Code "${cleanCode}" applied! Strikethrough deal: was $${promo.regularPrice.toFixed(2)}, now $${promo.promoPrice.toFixed(2)} (${remainingText}).`,
    };
  }
}

export const promoStore = new PromoStore();
