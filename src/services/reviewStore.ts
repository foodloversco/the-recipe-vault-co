import { BookReview } from '../types';

const REVIEWS_STORAGE_KEY = 'the_recipe_vault_reviews_v2';
const BOOK_OPENS_KEY_PREFIX = 'the_recipe_vault_book_opens_';
const HAS_RATED_KEY_PREFIX = 'the_recipe_vault_has_rated_';

// Real verified reviews start empty on launch to guarantee 100% authenticity for TikTok visitors & payment compliance
export const INITIAL_REVIEWS: BookReview[] = [];

class ReviewStore {
  private reviews: BookReview[] = [];

  constructor() {
    this.init();
  }

  private init() {
    try {
      const stored = localStorage.getItem(REVIEWS_STORAGE_KEY);
      if (stored) {
        this.reviews = JSON.parse(stored);
      } else {
        this.reviews = [];
        this.save();
      }
    } catch {
      this.reviews = [];
    }
  }

  private save() {
    try {
      localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(this.reviews));
    } catch (e) {
      console.warn('Could not save reviews:', e);
    }
  }

  public getReviewsForBook(bookIdOrSlug: string): BookReview[] {
    const norm = bookIdOrSlug.toLowerCase();
    return this.reviews.filter(
      (r) =>
        r.bookId === norm ||
        r.bookId === 'south-africa-braai-heritage' ||
        r.bookId === 'south-african-braai-heritage' ||
        r.bookId === 'vault-vol-01'
    );
  }

  public getRatingStats(bookIdOrSlug: string): {
    average: number;
    count: number;
    breakdown: { [star: number]: number };
  } {
    const bookReviews = this.getReviewsForBook(bookIdOrSlug);
    if (bookReviews.length === 0) {
      return { average: 0, count: 0, breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } };
    }

    const total = bookReviews.reduce((sum, r) => sum + r.rating, 0);
    const avg = Number((total / bookReviews.length).toFixed(1));
    const breakdown: { [star: number]: number } = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    bookReviews.forEach((r) => {
      const star = Math.min(5, Math.max(1, Math.round(r.rating)));
      breakdown[star] = (breakdown[star] || 0) + 1;
    });

    const percentBreakdown: { [star: number]: number } = {};
    for (let s = 1; s <= 5; s++) {
      percentBreakdown[s] = Math.round(((breakdown[s] || 0) / bookReviews.length) * 100);
    }

    return {
      average: avg,
      count: bookReviews.length,
      breakdown: percentBreakdown,
    };
  }

  public addReview(
    bookId: string,
    authorName: string,
    rating: number,
    comment: string,
    authorLocation?: string
  ): BookReview {
    const newRev: BookReview = {
      id: `rev-${Date.now()}`,
      bookId,
      authorName: authorName.trim() || 'Verified Chef',
      authorLocation: authorLocation?.trim() || 'Verified Home Cook',
      rating: Math.min(5, Math.max(1, rating)),
      comment: comment.trim(),
      date: 'Just now',
      isVerifiedBuyer: true,
    };
    this.reviews.unshift(newRev);
    this.save();
    try {
      localStorage.setItem(`${HAS_RATED_KEY_PREFIX}${bookId}`, 'true');
    } catch {}
    return newRev;
  }

  public hasUserRatedBook(bookId: string): boolean {
    return localStorage.getItem(`${HAS_RATED_KEY_PREFIX}${bookId}`) === 'true';
  }

  /**
   * Tracks open counter. If user is a verified buyer and this is their 3rd open,
   * returns true so we pop up the review request!
   */
  public recordBookOpen(bookId: string, isUnlocked: boolean): boolean {
    if (!isUnlocked) return false;
    if (this.hasUserRatedBook(bookId)) return false;

    const key = `${BOOK_OPENS_KEY_PREFIX}${bookId}`;
    const prev = parseInt(localStorage.getItem(key) || '0', 10);
    const next = prev + 1;
    localStorage.setItem(key, String(next));

    // Exactly on 3rd open, prompt for review
    return next === 3;
  }
}

export const reviewStore = new ReviewStore();
