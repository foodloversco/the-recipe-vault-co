export interface GroceryCategory {
  category: string;
  items: string[];
}

export interface RecipePage {
  id: string;
  pageNumber: number;
  title: string;
  subtitle?: string;
  category?: 'Cover' | 'Checklist' | 'Heritage Mains' | 'Open-Flame Beef' | 'Fire Potjie' | 'Artisanal Bakes' | 'Sides & Sauces';
  prepTime?: string;
  cookTime?: string;
  servings?: string;
  heatLevel?: string;
  image?: string;
  ingredients?: string[];
  instructions?: string[];
  chefTip?: string;
  groceryChecklist?: GroceryCategory[];
  isCover?: boolean;
  isChecklist?: boolean;
  rawPdfPageUrl?: string;
}

export interface Book {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  tagline: string;
  description: string;
  coverImage: string;
  price: number; // in USD
  originalPrice?: number;
  recipeCount: number;
  previewPagesAllowed: number; // default 5
  pdfFileUrl?: string;
  pdfFileName?: string;
  pdfFileSize?: string;
  category: string;
  tags: string[];
  isFeatured?: boolean;
  pages: RecipePage[];
  createdAt: string;
}

export interface Bundle {
  id: string;
  slug: string;
  title: string;
  description: string;
  bookIds: string[];
  price: number; // in USD
  originalPrice: number;
  badge: string;
  coverImage: string;
  includesChecklists: boolean;
  createdAt: string;
}

export interface SaleTransaction {
  id: string;
  orderId: string;
  paypalTransactionId: string;
  buyerEmail: string;
  buyerName?: string;
  itemType: 'book' | 'bundle';
  itemId: string;
  itemTitle: string;
  amount: number;
  currency: string;
  status: 'COMPLETED' | 'PENDING' | 'REFUNDED';
  createdAt: string;
  unlockToken: string;
}

export interface AppSettings {
  appName: string;
  subHeading: string;
  paypalClientId: string;
  paypalMode: 'sandbox' | 'live';
  storageProvider: 'supabase' | 'browser' | 'firebase';
  supabaseUrl: string;
  supabaseAnonKey: string;
  supabaseBucket: string;
  adminPasswordHash?: string;
}
