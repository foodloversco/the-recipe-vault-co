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
        this.sales = JSON.parse(stored);
      } else {
        // Initialize with realistic seed demonstration data
        this.sales = [
          {
            id: 'sale_101',
            orderId: 'PP-9AK827391L4',
            paypalTransactionId: 'TX-7HG19283746',
            buyerEmail: 'sarah.cooks@gmail.com',
            buyerName: 'Sarah Jenkins',
            itemType: 'bundle',
            itemId: 'bundle-master-culinary-library',
            itemTitle: 'The Master Culinary Vault Library (All 3 Volumes)',
            amount: 29.99,
            currency: 'USD',
            status: 'COMPLETED',
            createdAt: '2026-11-19T14:22:10.000Z',
            unlockToken: 'RV-UNLOCK-884920'
          },
          {
            id: 'sale_102',
            orderId: 'PP-4NM119280Q2',
            paypalTransactionId: 'TX-2QQ88391024',
            buyerEmail: 'johan.braaimaster@outlook.com',
            buyerName: 'Johan van der Merwe',
            itemType: 'book',
            itemId: 'vault-vol-01',
            itemTitle: 'The Authentic Heritage Braai & Open-Flame Collection',
            amount: 14.99,
            currency: 'USD',
            status: 'COMPLETED',
            createdAt: '2026-11-20T06:15:44.000Z',
            unlockToken: 'RV-UNLOCK-392019'
          }
        ];
        this.save();
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

