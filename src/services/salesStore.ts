import { SaleTransaction } from '../types';

const SALES_STORAGE_KEY = 'the_recipe_vault_sales_v1';

class SalesStore {
  private sales: SaleTransaction[] = [];

  constructor() {
    this.init();
  }

  private init() {
    try {
      const stored = localStorage.getItem(SALES_STORAGE_KEY);
      if (stored) {
        const parsed: SaleTransaction[] = JSON.parse(stored);
        // Automatically purge mock/seed demonstration data
        this.sales = parsed.filter(
          (s) =>
            s.id !== 'sale_101' &&
            s.id !== 'sale_102' &&
            s.buyerEmail !== 'sarah.cooks@gmail.com' &&
            s.buyerEmail !== 'johan.braaimaster@outlook.com'
        );
        this.save();
      } else {
        this.sales = [];
      }
    } catch (e) {
      console.error('Failed to load sales store:', e);
      this.sales = [];
    }
  }

  private save() {
    try {
      localStorage.setItem(SALES_STORAGE_KEY, JSON.stringify(this.sales));
    } catch (e) {
      console.warn('Could not save sales:', e);
    }
  }

  public getSales(): SaleTransaction[] {
    return [...this.sales];
  }

  public clearAllSales(): void {
    this.sales = [];
    this.save();
  }

  public recordSale(saleData: Omit<SaleTransaction, 'id' | 'createdAt'>): SaleTransaction {
    const newSale: SaleTransaction = {
      ...saleData,
      id: `sale_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
    };

    this.sales.unshift(newSale);
    this.save();
    return newSale;
  }

  public getTotalRevenue(): number {
    return this.sales
      .filter((s) => s.status === 'COMPLETED')
      .reduce((sum, s) => sum + s.amount, 0);
  }

  public exportCsv(): string {
    const headers = ['Sale ID', 'Order ID', 'PayPal TX', 'Buyer Email', 'Buyer Name', 'Item Type', 'Item Title', 'Amount USD', 'Status', 'Date', 'Unlock Token'];
    const rows = this.sales.map((s) => [
      s.id,
      s.orderId,
      s.paypalTransactionId,
      s.buyerEmail,
      `"${s.buyerName || ''}"`,
      s.itemType,
      `"${s.itemTitle.replace(/"/g, '""')}"`,
      s.amount.toFixed(2),
      s.status,
      s.createdAt,
      s.unlockToken
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }
}

export const salesStore = new SalesStore();

