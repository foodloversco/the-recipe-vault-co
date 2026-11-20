export type CurrencyCode = 'USD' | 'ZAR';

const CURRENCY_STORAGE_KEY = 'the_recipe_vault_currency_pref';

class CurrencyStore {
  private currentCurrency: CurrencyCode = 'USD';
  private listeners: Set<(cur: CurrencyCode) => void> = new Set();

  constructor() {
    this.init();
  }

  private init() {
    try {
      const stored = localStorage.getItem(CURRENCY_STORAGE_KEY);
      if (stored === 'ZAR' || stored === 'USD') {
        this.currentCurrency = stored;
      } else {
        // Detect South African locale/timezone if available
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (tz && (tz.includes('Johannesburg') || tz.includes('Harare') || tz.includes('Africa'))) {
          this.currentCurrency = 'ZAR';
        } else {
          this.currentCurrency = 'USD';
        }
      }
    } catch {
      this.currentCurrency = 'USD';
    }
  }

  public getCurrency(): CurrencyCode {
    return this.currentCurrency;
  }

  public setCurrency(currency: CurrencyCode): void {
    this.currentCurrency = currency;
    try {
      localStorage.setItem(CURRENCY_STORAGE_KEY, currency);
    } catch {}
    this.notify();
  }

  public toggle(): CurrencyCode {
    const next = this.currentCurrency === 'USD' ? 'ZAR' : 'USD';
    this.setCurrency(next);
    return next;
  }

  public subscribe(listener: (cur: CurrencyCode) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((l) => {
      try {
        l(this.currentCurrency);
      } catch (e) {
        console.error('Currency listener error:', e);
      }
    });
  }

  public formatPrice(priceUSD: number, priceZAR = 20): string {
    if (this.currentCurrency === 'ZAR') {
      return `R${priceZAR}`;
    }
    return `$${priceUSD.toFixed(2)}`;
  }
}

export const currencyStore = new CurrencyStore();
