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
  soldCount?: number; // Admin configurable base count + auto-incremented on each sale
  promoCode?: string;
  promoExpiresAt?: string | null; // ISO timestamp or null for lifetime
  promoDurationDays?: number | 'lifetime';
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
  storageProvider: 'cloudflare-r2' | 'supabase' | 'browser';
  // Cloudflare R2 (10GB Free + Unlimited $0 Egress Bandwidth)
  r2AccountId?: string;
  r2AccessKeyId?: string;
  r2SecretAccessKey?: string;
  r2BucketName?: string;
  r2PublicUrl?: string; // e.g. https://pub-xxx.r2.dev or https://assets.therecipevault.co
  // Supabase
  supabaseUrl?: string;
  supabaseAnonKey?: string;
  supabaseBucket?: string;
  adminPasswordHash?: string;
  // Hybrid Mode A (Vercel Cloud Sync) + Mode B (Offline Bundle Fallback)
  vercelLiveUrl?: string;
  hybridUpdateMode?: 'both' | 'cloud-only' | 'offline-only';
}

export interface PromoCode {
  id: string;
  code: string; // e.g. "TASTE299", "CHEF50"
  description?: string;
  bookId: string; // 'all' or specific book ID
  bookTitle?: string;
  regularPrice: number; // e.g. 6.99
  promoPrice: number; // e.g. 2.99
  durationDays: number | 'lifetime'; // 'lifetime', 25, 30, 50, or custom number of days
  createdAt: string;
  expiresAt: string | null; // null for lifetime, or ISO date
  isActive: boolean;
  timesUsed: number;
}

export interface FavoriteRecipeItem {
  id: string; // `${bookId}_${pageNumber}`
  bookId: string;
  bookSlug: string;
  bookTitle: string;
  pageNumber: number;
  recipeTitle: string;
  recipeSubtitle?: string;
  category?: string;
  image?: string;
  addedAt: string;
}

export interface BookReview {
  id: string;
  bookId: string;
  authorName: string;
  authorLocation?: string;
  rating: number; // 1 to 5
  comment: string;
  date: string;
  isVerifiedBuyer: boolean;
}



