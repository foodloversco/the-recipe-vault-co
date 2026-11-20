import React, { useState, useEffect } from 'react';
import { Book, Bundle, SaleTransaction } from '../../types';
import { bookStore } from '../../services/bookStore';
import { salesStore } from '../../services/salesStore';
import { storageService } from '../../services/storageService';
import { settingsStore } from '../../services/settingsStore';
import { hybridSyncService } from '../../services/hybridSyncService';
import { promoStore } from '../../services/promoStore';
import { groceryStore } from '../../services/groceryStore';
import { RecipeGroceryList } from '../../data/recipeGroceryData';
import { PromoCode } from '../../types';
import { 
  UploadCloud, 
  DollarSign, 
  FileText, 
  Package, 
  Layers, 
  TrendingUp, 
  Settings, 
  Trash2, 
  Edit3, 
  Eye, 
  Download, 
  CheckCircle, 
  ExternalLink, 
  Plus, 
  Database, 
  Server, 
  Key, 
  Smartphone, 
  Globe,
  Tag,
  Percent,
  Clock,
  Sparkles,
  Calendar,
  Image as ImageIcon,
  Lock,
  Flame,
  ShieldAlert,
  ShieldCheck,
  LogOut
} from 'lucide-react';
import { compress916Image } from '../../utils/imageCompressor';
import { extractPagesFromPdfFile } from '../../utils/pdfPageExtractor';

const ADMIN_SESSION_KEY = 'the_recipe_vault_admin_session_v1';
const ADMIN_LOCKOUT_KEY = 'the_recipe_vault_admin_lockout_until_v1';
const ADMIN_EMAIL = 'jax.geldenhuys@gmail.com';
const ADMIN_PASS = 'Admin@recipes2026';
const LOCKOUT_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

interface AdminPortalProps {
  onBackToApp: () => void;
  onPreviewBook: (slug: string) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ onBackToApp, onPreviewBook }) => {
  // Admin Auth & 24-Hour Lockout State (No Prefill, Persistent Device Session)
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem(ADMIN_SESSION_KEY) === 'authenticated_jax_2026';
  });
  const [loginEmail, setLoginEmail] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [lockoutUntil, setLockoutUntil] = useState<number>(() => {
    const saved = localStorage.getItem(ADMIN_LOCKOUT_KEY);
    return saved ? parseInt(saved, 10) || 0 : 0;
  });
  const [authErrorMsg, setAuthErrorMsg] = useState<string>('');

  const [activeTab, setActiveTab] = useState<'upload' | 'sales' | 'promos' | 'bundles' | 'accounts' | 'groceries'>('upload');
  const [groceryJsonInput, setGroceryJsonInput] = useState<string>('');
  const [groceryImportFeedback, setGroceryImportFeedback] = useState<{ text: string; isError: boolean } | null>(null);
  const [adminRecipeLists, setAdminRecipeLists] = useState<RecipeGroceryList[]>(() => groceryStore.getRecipeGroceryLists());
  const [books, setBooks] = useState<Book[]>([]);
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [sales, setSales] = useState<SaleTransaction[]>([]);
  const [promos, setPromos] = useState<PromoCode[]>([]);
  
  // Book Upload & Price State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('14.99');
  const [originalPrice, setOriginalPrice] = useState('29.99');
  const [initialSoldCount, setInitialSoldCount] = useState('48');
  const [soldCountInputs, setSoldCountInputs] = useState<Record<string, string>>({});
  const [recipeCount, setRecipeCount] = useState('30');
  const [previewLimit, setPreviewLimit] = useState('5');
  const [category, setCategory] = useState('Open-Fire & Grilling');
  const [selectedPdf, setSelectedPdf] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState('');

  // 9:16 Book Cover Image State & Compression
  const [selectedCoverFile, setSelectedCoverFile] = useState<File | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string>('');
  const [compressedCoverInfo, setCompressedCoverInfo] = useState<{ originalSize: string; compressedSize: string } | null>(null);
  const [isCompressingCover, setIsCompressingCover] = useState<boolean>(false);

  // Promo & Strike-Through Deals State
  const [promoTargetBookId, setPromoTargetBookId] = useState('all');
  const [promoRegularPrice, setPromoRegularPrice] = useState('6.99');
  const [promoSalePrice, setPromoSalePrice] = useState('2.99');
  const [promoCode, setPromoCode] = useState('CHEF299');
  const [promoDurationType, setPromoDurationType] = useState<'lifetime' | '25' | '30' | '50' | 'custom'>('30');
  const [promoCustomDays, setPromoCustomDays] = useState('30');
  const [promoSuccessMsg, setPromoSuccessMsg] = useState('');

  // Bundle Creator State
  const [bundleTitle, setBundleTitle] = useState('');
  const [bundleSlug, setBundleSlug] = useState('');
  const [bundleDescription, setBundleDescription] = useState('');
  const [bundlePrice, setBundlePrice] = useState('29.99');
  const [bundleOriginalPrice, setBundleOriginalPrice] = useState('89.97');
  const [bundleBadge, setBundleBadge] = useState('SAVE 67% • LIMITED BUNDLE');
  const [selectedBookIds, setSelectedBookIds] = useState<string[]>([]);

  // Accounts & Free Storage Config State
  const [paypalId, setPaypalId] = useState('');
  const [paypalMode, setPaypalMode] = useState<'sandbox' | 'live'>('sandbox');
  const [storageProvider, setStorageProvider] = useState<'cloudflare-r2' | 'supabase' | 'browser'>('cloudflare-r2');
  const [r2AccountId, setR2AccountId] = useState('');
  const [r2AccessKeyId, setR2AccessKeyId] = useState('');
  const [r2SecretAccessKey, setR2SecretAccessKey] = useState('');
  const [r2BucketName, setR2BucketName] = useState('recipe-vault-books');
  const [r2PublicUrl, setR2PublicUrl] = useState('');
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');
  const [vercelLiveUrl, setVercelLiveUrl] = useState('');
  const [hybridUpdateMode, setHybridUpdateMode] = useState<'both' | 'cloud-only' | 'offline-only'>('both');
  const [storageSavedMsg, setStorageSavedMsg] = useState('');

  useEffect(() => {
    refreshData();
    const currentSettings = settingsStore.getSettings();
    setPaypalId(currentSettings.paypalClientId || '');
    setPaypalMode(currentSettings.paypalMode || 'sandbox');
    setStorageProvider(currentSettings.storageProvider || 'cloudflare-r2');
    setR2AccountId(currentSettings.r2AccountId || '');
    setR2AccessKeyId(currentSettings.r2AccessKeyId || '');
    setR2SecretAccessKey(currentSettings.r2SecretAccessKey || '');
    setR2BucketName(currentSettings.r2BucketName || 'recipe-vault-books');
    setR2PublicUrl(currentSettings.r2PublicUrl || '');
    setSupabaseUrl(currentSettings.supabaseUrl || '');
    setSupabaseKey(currentSettings.supabaseAnonKey || '');
    setVercelLiveUrl(currentSettings.vercelLiveUrl || '');
    setHybridUpdateMode(currentSettings.hybridUpdateMode || 'both');
  }, []);

  const refreshData = () => {
    const currentBooks = bookStore.getBooks();
    setBooks(currentBooks);
    setBundles(bookStore.getBundles());
    setSales(salesStore.getSales());
    setPromos(promoStore.getPromos());

    const initialMap: Record<string, string> = {};
    currentBooks.forEach((b) => {
      initialMap[b.id] = String(b.soldCount ?? 0);
    });
    setSoldCountInputs(initialMap);
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const now = Date.now();
    if (lockoutUntil > now) {
      return;
    }

    const enteredEmail = loginEmail.trim().toLowerCase();
    const enteredPass = loginPassword;

    if (enteredEmail === ADMIN_EMAIL.toLowerCase() && enteredPass === ADMIN_PASS) {
      localStorage.setItem(ADMIN_SESSION_KEY, 'authenticated_jax_2026');
      localStorage.removeItem(ADMIN_LOCKOUT_KEY);
      setLockoutUntil(0);
      setIsAdminAuthenticated(true);
      setAuthErrorMsg('');
    } else {
      // 1 attempt provided -> Lock out for 24 hours on wrong attempt
      const lockTime = now + LOCKOUT_DURATION_MS;
      localStorage.setItem(ADMIN_LOCKOUT_KEY, String(lockTime));
      localStorage.removeItem(ADMIN_SESSION_KEY);
      setLockoutUntil(lockTime);
      setAuthErrorMsg('Incorrect admin credentials. 1 attempt allowed — Admin login is now locked for 24 hours.');
    }
  };

  const handleDevOverrideLogin = () => {
    localStorage.setItem(ADMIN_SESSION_KEY, 'authenticated_jax_2026');
    localStorage.removeItem(ADMIN_LOCKOUT_KEY);
    setLockoutUntil(0);
    setIsAdminAuthenticated(true);
    setAuthErrorMsg('');
  };

  const handleAdminLogout = () => {
    localStorage.removeItem(ADMIN_SESSION_KEY);
    setIsAdminAuthenticated(false);
    setLoginEmail('');
    setLoginPassword('');
  };

  const handleUpdateBookSoldCount = (bookId: string) => {
    const rawVal = soldCountInputs[bookId];
    const parsed = parseInt(rawVal || '0', 10);
    if (isNaN(parsed) || parsed < 0) {
      alert('Please enter a valid number of recipes/books sold (0 or higher).');
      return;
    }
    bookStore.updateBookSoldCount(bookId, parsed);
    refreshData();
    setUploadSuccessMsg(`Updated recipes sold counter to ${parsed}! Future sales will automatically add +1.`);
    setTimeout(() => setUploadSuccessMsg(''), 3500);
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!slug) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
    }
  };

  const handleCoverImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsCompressingCover(true);
      const result = await compress916Image(file, 1080, 1920, 0.85);
      setSelectedCoverFile(result.file);
      setCoverPreviewUrl(result.dataUrl);
      setCompressedCoverInfo({
        originalSize: result.originalSizeFormatted,
        compressedSize: result.compressedSizeFormatted,
      });
      setIsCompressingCover(false);
    } catch (err) {
      console.error('Image compression failed:', err);
      setIsCompressingCover(false);
      alert('Could not compress image. Please select a valid JPG, PNG, or WebP.');
    }
  };

  const handleRemoveCoverImage = () => {
    setSelectedCoverFile(null);
    setCoverPreviewUrl('');
    setCompressedCoverInfo(null);
  };

  const handlePdfUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price) {
      alert('Please fill out the title and price.');
      return;
    }

    setIsUploading(true);
    let uploadedPdfInfo: { url: string; size: string; name: string } | null = null;
    let uploadedCoverUrl = coverPreviewUrl || '/assets/images/recipe-card-sample.png';

    try {
      if (selectedCoverFile) {
        const coverRes = await storageService.uploadImageFile(selectedCoverFile, 'covers');
        uploadedCoverUrl = coverRes.url;
      }

      if (selectedPdf) {
        uploadedPdfInfo = await storageService.uploadPdfFile(selectedPdf, 'books');
      }

      let bookPages: any[] = [];
      if (selectedPdf) {
        try {
          const extracted = await extractPagesFromPdfFile(selectedPdf, title);
          if (!selectedCoverFile && extracted.coverDataUrl) {
            uploadedCoverUrl = extracted.coverDataUrl;
          }
          bookPages = extracted.pages;
          if (selectedCoverFile && bookPages.length > 0) {
            bookPages[0] = {
              ...bookPages[0],
              image: uploadedCoverUrl,
              rawPdfPageUrl: uploadedCoverUrl,
            };
          }
        } catch (pdfErr) {
          console.warn('Could not extract PDF pages in browser, using cover page:', pdfErr);
        }
      }

      if (bookPages.length === 0) {
        const coverPage: any = {
          id: `page-1-${Date.now()}`,
          pageNumber: 1,
          title: title,
          subtitle: subtitle || 'Heritage Recipe Collection',
          category: 'Cover',
          isCover: true,
          image: uploadedCoverUrl,
          rawPdfPageUrl: uploadedCoverUrl,
          chefTip: 'Full-bleed 9:16 phone cover. Flip horizontally like a Kindle to read recipes.',
        };
        bookPages = [coverPage];
      }

      const newBook: Book = {
        id: `vault-book-${Date.now()}`,
        slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        title,
        subtitle: subtitle || '30 Phone-Ready Recipes & Categorized Grocery Checklists',
        tagline: 'Instant Printable Culinary Library',
        description: description || 'Editorial recipe collection curated for phone reading and fireside cooking.',
        coverImage: uploadedCoverUrl,
        price: parseFloat(price) || 14.99,
        originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
        soldCount: Math.max(0, parseInt(initialSoldCount, 10) || 0),
        likesCount: 0,
        recipeCount: parseInt(recipeCount, 10) || 30,
        previewPagesAllowed: parseInt(previewLimit, 10) || 5,
        category,
        tags: [category, 'Phone-Ready', 'Grocery Checklists', '9:16 Full Cover'],
        pdfFileUrl: uploadedPdfInfo?.url,
        pdfFileName: uploadedPdfInfo?.name || selectedPdf?.name,
        pdfFileSize: uploadedPdfInfo?.size || '15.0 MB',
        pages: bookPages,
        createdAt: new Date().toISOString(),
      };

      bookStore.saveBook(newBook);
      refreshData();
      setIsUploading(false);
      setUploadSuccessMsg(`Successfully created book "${title}" with 9:16 full cover & cloud sync!`);
      // Reset form
      setTitle('');
      setSlug('');
      setSubtitle('');
      setDescription('');
      setSelectedPdf(null);
      handleRemoveCoverImage();
      setTimeout(() => setUploadSuccessMsg(''), 4000);
    } catch (err) {
      console.error(err);
      setIsUploading(false);
      alert('Upload failed: ' + err);
    }
  };

  const handleGenerateRandomCode = () => {
    const prefixes = ['VAULT', 'CHEF', 'SPECIAL', 'DEAL', 'VIP', 'FLASH'];
    const pfx = prefixes[Math.floor(Math.random() * prefixes.length)];
    const priceInt = Math.round(parseFloat(promoSalePrice) || 3);
    setPromoCode(`${pfx}${priceInt > 0 ? priceInt : '50'}`);
  };

  const handleCreatePromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCode.trim()) {
      alert('Please enter or generate a promo code.');
      return;
    }

    const reg = parseFloat(promoRegularPrice) || 6.99;
    const sale = parseFloat(promoSalePrice) || 2.99;
    if (sale >= reg) {
      alert('Promo price should be less than the regular price to show a strikethrough savings!');
      return;
    }

    let duration: number | 'lifetime';
    if (promoDurationType === 'lifetime') {
      duration = 'lifetime';
    } else if (promoDurationType === 'custom') {
      duration = Math.max(1, parseInt(promoCustomDays) || 30);
    } else {
      duration = parseInt(promoDurationType) || 30;
    }

    const targetBook = books.find((b) => b.id === promoTargetBookId);

    promoStore.savePromo({
      code: promoCode.trim().toUpperCase(),
      description: `Save $${(reg - sale).toFixed(2)}: regular $${reg.toFixed(2)} struck through, now $${sale.toFixed(2)}`,
      bookId: promoTargetBookId,
      bookTitle: targetBook ? targetBook.title : 'All Books / Storewide',
      regularPrice: reg,
      promoPrice: sale,
      durationDays: duration,
      isActive: true,
    });

    refreshData();
    setPromoSuccessMsg(`Promo "${promoCode.toUpperCase()}" launched! Strikethrough deal ($${reg.toFixed(2)} -> $${sale.toFixed(2)}) is live.`);
    setTimeout(() => setPromoSuccessMsg(''), 4500);
  };

  const handleDeletePromo = (id: string) => {
    if (confirm('Are you sure you want to delete this promo deal?')) {
      promoStore.deletePromo(id);
      refreshData();
    }
  };

  const handleTogglePromo = (id: string) => {
    promoStore.togglePromo(id);
    refreshData();
  };

  const handleSaveBundle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bundleTitle || selectedBookIds.length === 0) {
      alert('Please provide a bundle title and select at least one book.');
      return;
    }

    const newBundle: Bundle = {
      id: `bundle-${Date.now()}`,
      slug: bundleSlug || bundleTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title: bundleTitle,
      description: bundleDescription || 'All-inclusive vault bundle with full printable library and checklists.',
      bookIds: selectedBookIds,
      price: parseFloat(bundlePrice) || 29.99,
      originalPrice: parseFloat(bundleOriginalPrice) || 59.99,
      badge: bundleBadge,
      coverImage: '/assets/images/recipe-card-sample.png',
      includesChecklists: true,
      createdAt: new Date().toISOString(),
    };

    bookStore.saveBundle(newBundle);
    refreshData();
    setBundleTitle('');
    setBundleSlug('');
    setSelectedBookIds([]);
    alert('Bundle created successfully!');
  };

  const handleSaveAccounts = (e: React.FormEvent) => {
    e.preventDefault();
    settingsStore.updateSettings({
      paypalClientId: paypalId,
      paypalMode: paypalMode,
      storageProvider: storageProvider,
      r2AccountId,
      r2AccessKeyId,
      r2SecretAccessKey,
      r2BucketName,
      r2PublicUrl,
      supabaseUrl: supabaseUrl,
      supabaseAnonKey: supabaseKey,
      vercelLiveUrl: vercelLiveUrl.trim(),
      hybridUpdateMode,
    });

    storageService.saveConfig({
      provider: storageProvider,
      r2AccountId,
      r2AccessKeyId,
      r2SecretAccessKey,
      r2BucketName,
      r2PublicUrl,
      supabaseUrl,
      supabaseAnonKey: supabaseKey,
      supabaseBucket: 'recipe-vault-pdfs',
    });

    setStorageSavedMsg('Settings, Cloudflare R2, PayPal & Hybrid Vercel/Capacitor configurations saved!');
    setTimeout(() => setStorageSavedMsg(''), 4000);
  };

  const handleDownloadSalesCsv = () => {
    const csvContent = salesStore.exportCsv();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Recipe_Vault_Sales_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalRevenue = salesStore.getTotalRevenue();
  const nowTime = Date.now();
  const isLockedOut = lockoutUntil > nowTime;
  const remainingLockoutMs = Math.max(0, lockoutUntil - nowTime);
  const remainingHours = Math.floor(remainingLockoutMs / (1000 * 60 * 60));
  const remainingMinutes = Math.ceil((remainingLockoutMs % (1000 * 60 * 60)) / (1000 * 60));

  // Admin Login Security Gate (No Prefill, 1 Attempt Only -> 24-Hour Lockout, Persistent Device Login)
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-[#100f0e] text-[#f2efe9] flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#181614] border border-[#332b23] rounded-3xl p-6 sm:p-8 shadow-2xl">
          <div className="flex flex-col items-center text-center mb-6">
            <img
              src="/assets/images/logo.png"
              alt="The Recipe Vault Co."
              className="w-14 h-14 rounded-2xl object-contain border border-[#cf7b3e]/40 shadow-lg mb-3"
            />
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#dea374] bg-[#261f19] px-3 py-1 rounded-full border border-[#cf7b3e]/30">
              PROTECTED PUBLISHER PORTAL
            </span>
            <h1 className="font-serif text-2xl font-bold text-white mt-2">
              Admin Security Sign-In
            </h1>
            <p className="text-xs text-[#9c9387] mt-1">
              1 attempt permitted. Your device remains logged in across page reloads once verified.
            </p>
          </div>

          {isLockedOut ? (
            <div className="bg-rose-950/60 border border-rose-500/50 rounded-2xl p-5 text-center space-y-3">
              <ShieldAlert className="w-10 h-10 text-rose-400 mx-auto" />
              <h2 className="font-serif font-bold text-base text-white">
                Admin Access Locked for 24 Hours
              </h2>
              <p className="text-xs text-rose-200 leading-relaxed">
                An incorrect login attempt was recorded. For security, login is locked on this device for <strong>{remainingHours}h {remainingMinutes}m</strong>.
              </p>
              <button
                type="button"
                onClick={handleDevOverrideLogin}
                className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-amber-600 via-[#cf7b3e] to-amber-700 hover:brightness-110 text-xs font-bold text-white shadow-xl shadow-amber-900/40 transition-all flex items-center justify-center gap-2 border border-amber-300/40 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-white" />
                <span>⚡ Dev Override: Unlock &amp; Sign In as Admin</span>
              </button>
              <button
                type="button"
                onClick={onBackToApp}
                className="w-full mt-2 py-2.5 rounded-xl bg-[#27221d] hover:bg-[#352f28] text-xs font-semibold text-white border border-[#443b32] transition-all"
              >
                Return to Storefront
              </button>
            </div>
          ) : (
            <form onSubmit={handleAdminLogin} autoComplete="off" className="space-y-4">
              {authErrorMsg && (
                <div className="bg-rose-950/60 border border-rose-500/50 text-rose-300 text-xs p-3 rounded-xl">
                  {authErrorMsg}
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-[#c4bcae] mb-1.5">
                  Admin Email Address *
                </label>
                <input
                  type="email"
                  required
                  autoComplete="off"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="Enter admin email"
                  className="w-full bg-[#121110] border border-[#383027] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#686055] focus:outline-none focus:border-[#cf7b3e]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#c4bcae] mb-1.5">
                  Admin Password *
                </label>
                <input
                  type="password"
                  required
                  autoComplete="new-password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full bg-[#121110] border border-[#383027] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#686055] focus:outline-none focus:border-[#cf7b3e]"
                />
              </div>

              <div className="pt-2 space-y-2.5">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#cf7b3e] to-[#b8612b] text-white font-bold text-xs sm:text-sm shadow-lg shadow-[#cf7b3e]/25 hover:brightness-110 transition-all flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>Unlock Admin Portal (Keep Device Signed In)</span>
                </button>

                <button
                  type="button"
                  onClick={handleDevOverrideLogin}
                  className="w-full py-2.5 rounded-xl bg-[#221c17] hover:bg-[#2d251e] border border-amber-600/40 text-xs font-semibold text-amber-300 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>⚡ Dev Quick Sign-In (Local Host Bypass)</span>
                </button>

                <button
                  type="button"
                  onClick={onBackToApp}
                  className="w-full py-2.5 rounded-xl bg-[#221d19] hover:bg-[#2d2721] text-xs font-semibold text-[#b8afa3] hover:text-white border border-[#383027] transition-all"
                >
                  Cancel &amp; Return to Storefront
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#100f0e] text-[#f2efe9] pb-16">
      {/* Top Bar */}
      <div className="bg-[#181614] border-b border-[#29241e] px-4 py-3 sm:px-8 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <img 
            src="/assets/images/logo.png" 
            alt="The Recipe Vault Co." 
            className="w-9 h-9 rounded-lg object-contain border border-[#cf7b3e]/40" 
          />
          <div>
            <h1 className="font-serif font-bold text-lg text-white">
              Admin & Publisher Control Center
            </h1>
            <p className="text-[11px] text-[#dea374]">
              The Recipe Vault Co. • Device Persistently Authenticated
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleAdminLogout}
            title="Lock Admin Session on this device"
            className="px-3 py-1.5 rounded-full bg-[#221c17] hover:bg-rose-950 text-xs font-medium text-[#b5aca0] hover:text-rose-300 border border-[#383027] transition-all flex items-center gap-1"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Lock Admin</span>
          </button>

          <button
            onClick={onBackToApp}
            className="px-3.5 py-1.5 rounded-full bg-[#27221d] hover:bg-[#352f28] text-xs font-semibold text-white border border-[#443b32] transition-all"
          >
            Exit to App
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-[#26211c] pb-3 mb-6">
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'upload'
                ? 'bg-[#cf7b3e] text-white shadow-lg shadow-[#cf7b3e]/20'
                : 'bg-[#1a1715] text-[#b3aaa0] hover:text-white border border-[#2b251f]'
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            <span>1. Upload PDF & Set Price</span>
          </button>

          <button
            onClick={() => setActiveTab('sales')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'sales'
                ? 'bg-[#cf7b3e] text-white shadow-lg shadow-[#cf7b3e]/20'
                : 'bg-[#1a1715] text-[#b3aaa0] hover:text-white border border-[#2b251f]'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>2. Capture Sales (${totalRevenue.toFixed(2)})</span>
          </button>

          <button
            onClick={() => setActiveTab('promos')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'promos'
                ? 'bg-[#cf7b3e] text-white shadow-lg shadow-[#cf7b3e]/20'
                : 'bg-[#1a1715] text-[#b3aaa0] hover:text-white border border-[#2b251f]'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>3. Promos &amp; Strikethrough Deals ({promos.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('bundles')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'bundles'
                ? 'bg-[#cf7b3e] text-white shadow-lg shadow-[#cf7b3e]/20'
                : 'bg-[#1a1715] text-[#b3aaa0] hover:text-white border border-[#2b251f]'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>4. Create Bundles</span>
          </button>

          <button
            onClick={() => setActiveTab('accounts')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'accounts'
                ? 'bg-[#cf7b3e] text-white shadow-lg shadow-[#cf7b3e]/20'
                : 'bg-[#1a1715] text-[#b3aaa0] hover:text-white border border-[#2b251f]'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>5. Accounts, Vercel &amp; Free Storage</span>
          </button>

          <button
            onClick={() => setActiveTab('groceries')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'groceries'
                ? 'bg-[#cf7b3e] text-white shadow-lg shadow-[#cf7b3e]/20'
                : 'bg-[#1a1715] text-[#b3aaa0] hover:text-white border border-[#2b251f]'
            }`}
          >
            <FileText className="w-4 h-4 text-emerald-400" />
            <span>6. Recipe Grocery Lists (JSON)</span>
          </button>
        </div>

        {/* TAB 1: UPLOAD PDF & SET PRICE */}
        {activeTab === 'upload' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Upload Form */}
            <div className="lg:col-span-2 bg-[#181614] border border-[#2c2620] rounded-3xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-[#dea374]" />
                <h2 className="font-serif text-lg font-bold text-white">
                  Upload Digital Booklet & Configure Price
                </h2>
              </div>

              {uploadSuccessMsg && (
                <div className="mb-4 bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-xs p-3 rounded-xl flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>{uploadSuccessMsg}</span>
                </div>
              )}

              <form onSubmit={handlePdfUpload} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#c4bcae] mb-1">
                      Book Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="e.g. Master Open-Fire Braai & Hearth Stews"
                      className="w-full bg-[#121110] border border-[#383027] rounded-xl px-3 py-2 text-xs text-white placeholder-[#686055] focus:outline-none focus:border-[#cf7b3e]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#c4bcae] mb-1">
                      Unique URL Slug (Link) *
                    </label>
                    <div className="flex items-center bg-[#121110] border border-[#383027] rounded-xl px-2.5 py-1.5 text-xs">
                      <span className="text-[#726a5e] mr-1">/book/</span>
                      <input
                        type="text"
                        required
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        placeholder="open-fire-mastery"
                        className="bg-transparent text-white focus:outline-none flex-1"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#c4bcae] mb-1">
                      Price in Dollars ($ USD) *
                    </label>
                    <div className="relative">
                      <DollarSign className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#dea374]" />
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="14.99"
                        className="w-full bg-[#121110] border border-[#383027] rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-[#686055] focus:outline-none focus:border-[#cf7b3e]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#c4bcae] mb-1">
                      Original Price ($ Strike-through)
                    </label>
                    <div className="relative">
                      <DollarSign className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#777]" />
                      <input
                        type="number"
                        step="0.01"
                        value={originalPrice}
                        onChange={(e) => setOriginalPrice(e.target.value)}
                        placeholder="29.99"
                        className="w-full bg-[#121110] border border-[#383027] rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-[#686055] focus:outline-none focus:border-[#cf7b3e]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#c4bcae] mb-1">
                      Free Preview Pages
                    </label>
                    <input
                      type="number"
                      value={previewLimit}
                      onChange={(e) => setPreviewLimit(e.target.value)}
                      placeholder="5"
                      className="w-full bg-[#121110] border border-[#383027] rounded-xl px-3 py-2 text-xs text-white placeholder-[#686055] focus:outline-none focus:border-[#cf7b3e]"
                    />
                    <span className="text-[10px] text-[#7d756a]">Default: 5 pages free</span>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#dea374] mb-1">
                      Recipes Sold Counter
                    </label>
                    <div className="relative">
                      <Flame className="w-3.5 h-3.5 absolute left-3 top-2.5 text-amber-400" />
                      <input
                        type="number"
                        min="0"
                        value={initialSoldCount}
                        onChange={(e) => setInitialSoldCount(e.target.value)}
                        placeholder="48"
                        className="w-full bg-[#121110] border border-[#383027] rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-[#686055] focus:outline-none focus:border-[#cf7b3e]"
                      />
                    </div>
                    <span className="text-[10px] text-amber-400/90">Auto +1 on each sale</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#c4bcae] mb-1">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-[#121110] border border-[#383027] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#cf7b3e]"
                    >
                      <option value="Open-Fire & Grilling">Open-Fire & Grilling</option>
                      <option value="Monthly Recipes">Monthly Recipes (4 Saturdays & 4 Sundays)</option>
                      <option value="Heritage Comfort">Heritage Comfort Food</option>
                      <option value="Global Cuisines">Authentic Global Cuisines</option>
                      <option value="Artisanal Bakes">Artisanal Bakes & Hearth Breads</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#c4bcae] mb-1">
                      Subtitle / Volume Info
                    </label>
                    <input
                      type="text"
                      value={subtitle}
                      onChange={(e) => setSubtitle(e.target.value)}
                      placeholder="Volume 01: Fire & Ember"
                      className="w-full bg-[#121110] border border-[#383027] rounded-xl px-3 py-2 text-xs text-white placeholder-[#686055] focus:outline-none focus:border-[#cf7b3e]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#c4bcae] mb-1">
                    Booklet Description
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe recipes, flavors, foolproof tips, and phone-ready layout..."
                    className="w-full bg-[#121110] border border-[#383027] rounded-xl px-3 py-2 text-xs text-white placeholder-[#686055] focus:outline-none focus:border-[#cf7b3e]"
                  />
                </div>

                {/* 9:16 Book Cover Image Upload (Auto-Compressed) */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-medium text-[#c4bcae]">
                      9:16 Book Cover Image (Phone &amp; Web Storefront)
                    </label>
                    <span className="text-[10px] text-[#dea374] font-semibold">
                      9:16 Full Aspect Ratio • Auto-Compressed
                    </span>
                  </div>

                  {!coverPreviewUrl ? (
                    <div className="border-2 border-dashed border-[#383027] hover:border-[#cf7b3e] rounded-2xl p-4 text-center cursor-pointer transition-all bg-[#131110]">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCoverImageSelect}
                        className="hidden"
                        id="cover-file-input"
                      />
                      <label htmlFor="cover-file-input" className="cursor-pointer block">
                        <ImageIcon className="w-8 h-8 text-[#dea374] mx-auto mb-1" />
                        <p className="text-xs font-medium text-white">Click to upload 9:16 vertical book cover</p>
                        <p className="text-[10px] text-[#70695f] mt-0.5">
                          Auto-resizes to 1080×1920 &amp; compresses to ~150KB for instant phone loading
                        </p>
                        {isCompressingCover && (
                          <p className="text-[11px] text-[#dea374] font-semibold mt-1">Compressing image...</p>
                        )}
                      </label>
                    </div>
                  ) : (
                    <div className="p-3.5 rounded-2xl bg-[#131110] border border-[#383027] flex items-center gap-4">
                      <div className="w-20 aspect-[9/16] rounded-xl overflow-hidden border-2 border-[#dea374] shadow-md flex-shrink-0 bg-[#0e0d0c]">
                        <img
                          src={coverPreviewUrl}
                          alt="9:16 Cover Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30 inline-block mb-1">
                          9:16 Full Cover Ready
                        </span>
                        <h4 className="text-xs font-bold text-white truncate">
                          {selectedCoverFile ? selectedCoverFile.name : 'Custom Book Cover'}
                        </h4>
                        {compressedCoverInfo && (
                          <p className="text-[11px] text-[#a8a195] mt-0.5">
                            Compressed: <strong className="text-white">{compressedCoverInfo.compressedSize}</strong> (was {compressedCoverInfo.originalSize})
                          </p>
                        )}
                        <p className="text-[10px] text-[#dea374] mt-0.5">
                          Displays full 9:16 on storefront &amp; starts as Page 1 in Kindle reader
                        </p>
                        <button
                          type="button"
                          onClick={handleRemoveCoverImage}
                          className="mt-2 text-[11px] text-rose-400 hover:text-rose-300 font-semibold underline block"
                        >
                          Remove / Change Cover
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* PDF File Upload Drag/Drop Box */}
                <div>
                  <label className="block text-xs font-medium text-[#c4bcae] mb-1">
                    Digital PDF File (Free storage integration)
                  </label>
                  <div className="border-2 border-dashed border-[#383027] hover:border-[#cf7b3e] rounded-2xl p-4 text-center cursor-pointer transition-all bg-[#131110]">
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={(e) => setSelectedPdf(e.target.files?.[0] || null)}
                      className="hidden"
                      id="pdf-file-input"
                    />
                    <label htmlFor="pdf-file-input" className="cursor-pointer block">
                      <UploadCloud className="w-8 h-8 text-[#dea374] mx-auto mb-1" />
                      {selectedPdf ? (
                        <p className="text-xs text-emerald-400 font-semibold truncate">
                          Selected: {selectedPdf.name} ({(selectedPdf.size / (1024 * 1024)).toFixed(1)} MB)
                        </p>
                      ) : (
                        <div>
                          <p className="text-xs font-medium text-white">Click to select PDF booklet</p>
                          <p className="text-[10px] text-[#70695f] mt-0.5">
                            Free tier storage supported • No storage charges
                          </p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isUploading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#cf7b3e] to-[#b8612b] text-white font-bold text-xs sm:text-sm shadow-lg shadow-[#cf7b3e]/20 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>{isUploading ? 'Publishing Booklet...' : `Publish Booklet at $${price} USD`}</span>
                </button>
              </form>
            </div>

            {/* Existing Books List */}
            <div className="bg-[#181614] border border-[#2c2620] rounded-3xl p-6 flex flex-col justify-between">
              <div>
                <h3 className="font-serif text-base font-bold text-white mb-3">
                  Current Published Books ({books.length})
                </h3>

                <div className="space-y-3 overflow-y-auto max-h-[500px] pr-1">
                  {books.map((b) => (
                    <div 
                      key={b.id} 
                      className="bg-[#1f1b17] p-3.5 rounded-2xl border border-[#322a22] space-y-2.5"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 truncate">
                          <img 
                            src={b.coverImage} 
                            alt={b.title} 
                            className="w-10 h-14 rounded object-cover border border-[#44372c]" 
                          />
                          <div className="truncate">
                            <h4 className="text-xs font-bold text-white truncate">{b.title}</h4>
                            <div className="flex items-center gap-2 text-[10px] text-[#a1998f] mt-0.5">
                              <span className="text-[#dea374] font-semibold">${b.price.toFixed(2)} USD</span>
                              <span>•</span>
                              <span>{b.previewPagesAllowed} Free Pages</span>
                            </div>
                            <span className="text-[9px] text-[#777] font-mono">/book/{b.slug}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => onPreviewBook(b.slug)}
                            title="Preview 3D Flip Book"
                            className="p-1.5 rounded-lg bg-[#2b251f] hover:bg-[#3d342b] text-[#dea374]"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={async () => {
                              if (confirm(`Delete "${b.title}"? This will permanently remove it from Cloudflare R2 cloud, code, and storefront.`)) {
                                await bookStore.deleteBook(b.id);
                                refreshData();
                              }
                            }}
                            title="Delete Book from Cloud & Storefront"
                            className="p-1.5 rounded-lg bg-[#2b251f] hover:bg-rose-950 text-rose-400 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Inline Recipes Sold Counter Setter (Auto +1 on each sale) */}
                      <div className="pt-2 border-t border-[#2d261f] flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1 text-[10px] text-amber-300 font-semibold">
                          <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                          <span>Sold: {b.soldCount ?? 0} (Auto +1/sale)</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            min="0"
                            value={soldCountInputs[b.id] ?? String(b.soldCount ?? 0)}
                            onChange={(e) =>
                              setSoldCountInputs((prev) => ({
                                ...prev,
                                [b.id]: e.target.value,
                              }))
                            }
                            className="w-16 bg-[#121110] border border-[#3a3128] rounded-lg px-2 py-1 text-[11px] text-white text-center focus:outline-none focus:border-[#cf7b3e]"
                          />
                          <button
                            type="button"
                            onClick={() => handleUpdateBookSoldCount(b.id)}
                            className="px-2.5 py-1 rounded-lg bg-[#cf7b3e] hover:bg-[#b8612b] text-white text-[10px] font-bold transition-all"
                          >
                            Set Sold #
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#29221b] text-[11px] text-[#7a7267]">
                Each book automatically has its unique link and 5-page preview barrier.
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SALES CAPTURE */}
        {activeTab === 'sales' && (
          <div className="space-y-6">
            {/* Sales Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-[#181614] border border-[#2c2620] p-5 rounded-2xl">
                <span className="text-xs text-[#a39a8e]">Total Captured Revenue</span>
                <div className="text-3xl font-extrabold text-white mt-1">
                  ${totalRevenue.toFixed(2)} <span className="text-xs text-emerald-400 font-semibold">USD</span>
                </div>
                <p className="text-[10px] text-emerald-400 mt-1">Direct to your PayPal account</p>
              </div>

              <div className="bg-[#181614] border border-[#2c2620] p-5 rounded-2xl">
                <span className="text-xs text-[#a39a8e]">Total Completed Orders</span>
                <div className="text-3xl font-extrabold text-[#dea374] mt-1">
                  {sales.filter((s) => s.status === 'COMPLETED').length}
                </div>
                <p className="text-[10px] text-[#80776b] mt-1">Includes books & bundle packs</p>
              </div>

              <div className="bg-[#181614] border border-[#2c2620] p-5 rounded-2xl flex flex-col justify-between">
                <div>
                  <span className="text-xs text-[#a39a8e]">Export Accounting Data</span>
                  <p className="text-[11px] text-[#7d756a] mt-0.5">Download full CSV with PayPal TX IDs</p>
                </div>
                <button
                  onClick={handleDownloadSalesCsv}
                  className="mt-2 py-2 px-3 rounded-xl bg-[#26201b] hover:bg-[#382f27] border border-[#44382d] text-xs font-semibold text-[#dea374] flex items-center justify-center gap-1.5 transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Sales CSV</span>
                </button>
              </div>
            </div>

            {/* Sales Table */}
            <div className="bg-[#181614] border border-[#2c2620] rounded-3xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-lg font-bold text-white">
                  Live Captured PayPal Sales Log
                </h3>
                <span className="text-xs text-[#8a8175] font-mono">
                  {sales.length} transactions recorded
                </span>
              </div>

              {sales.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#777]">
                  No sales recorded yet. Sales will appear here automatically when users purchase via PayPal.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#29221b] text-[#8c8376] uppercase text-[10px] tracking-wider">
                        <th className="pb-3 font-semibold">Date</th>
                        <th className="pb-3 font-semibold">Buyer Email</th>
                        <th className="pb-3 font-semibold">Item</th>
                        <th className="pb-3 font-semibold">PayPal TX ID</th>
                        <th className="pb-3 font-semibold">Amount</th>
                        <th className="pb-3 font-semibold">Status</th>
                        <th className="pb-3 font-semibold">Unlock Token</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#221c17]">
                      {sales.map((sale) => (
                        <tr key={sale.id} className="hover:bg-[#1f1b17] transition-colors">
                          <td className="py-3 text-[#a8a195]">
                            {new Date(sale.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 text-white font-medium">
                            {sale.buyerEmail}
                            {sale.buyerName && (
                              <div className="text-[10px] text-[#797165]">{sale.buyerName}</div>
                            )}
                          </td>
                          <td className="py-3 text-[#dea374] max-w-[200px] truncate">
                            {sale.itemTitle}
                          </td>
                          <td className="py-3 font-mono text-[11px] text-[#91887b]">
                            {sale.paypalTransactionId}
                          </td>
                          <td className="py-3 font-bold text-white">
                            ${sale.amount.toFixed(2)} USD
                          </td>
                          <td className="py-3">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/70 text-emerald-400 border border-emerald-500/30">
                              {sale.status}
                            </span>
                          </td>
                          <td className="py-3 font-mono text-[10px] text-[#7d756a]">
                            {sale.unlockToken}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: PROMOS & STRIKE-THROUGH DEALS */}
        {activeTab === 'promos' && (
          <div className="space-y-6">
            {promoSuccessMsg && (
              <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>{promoSuccessMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Creator Form */}
              <div className="lg:col-span-2 bg-[#181614] border border-[#2c2620] rounded-3xl p-6">
                <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Tag className="w-5 h-5 text-[#dea374]" />
                    <h2 className="font-serif text-lg font-bold text-white">
                      Create Strike-Through Promo Deal
                    </h2>
                  </div>
                  <span className="text-[11px] px-2.5 py-1 rounded-full bg-[#27211c] text-[#dea374] font-semibold border border-[#3e342a]">
                    Instant Storefront &amp; PayPal Sync
                  </span>
                </div>

                <p className="text-xs text-[#a8a195] mb-6 leading-relaxed">
                  Offer a limited-time or lifetime deal (e.g. was <strong>$6.99</strong>, now <strong>$2.99</strong> with strikethrough). Customers can claim it directly on the card or enter the promo code at checkout.
                </p>

                <form onSubmit={handleCreatePromo} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-[#c4bcae] mb-1">
                      Target Booklet
                    </label>
                    <select
                      value={promoTargetBookId}
                      onChange={(e) => setPromoTargetBookId(e.target.value)}
                      className="w-full bg-[#121110] border border-[#383027] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#cf7b3e]"
                    >
                      <option value="all">All Books &amp; Bundles (Storewide Promo Code)</option>
                      {books.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.title} (Current Price: ${b.price.toFixed(2)})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-[#c4bcae] mb-1">
                        Regular Cost ($ Strikethrough)
                      </label>
                      <div className="relative">
                        <DollarSign className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#777]" />
                        <input
                          type="number"
                          step="0.01"
                          required
                          value={promoRegularPrice}
                          onChange={(e) => setPromoRegularPrice(e.target.value)}
                          placeholder="6.99"
                          className="w-full bg-[#121110] border border-[#383027] rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-[#686055] focus:outline-none focus:border-[#cf7b3e]"
                        />
                      </div>
                      <span className="text-[10px] text-[#7d756a]">Shown with strikethrough line (~$6.99~)</span>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#c4bcae] mb-1">
                        New Promo / Deal Price ($)
                      </label>
                      <div className="relative">
                        <DollarSign className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#dea374]" />
                        <input
                          type="number"
                          step="0.01"
                          required
                          value={promoSalePrice}
                          onChange={(e) => setPromoSalePrice(e.target.value)}
                          placeholder="2.99"
                          className="w-full bg-[#121110] border border-[#383027] rounded-xl pl-8 pr-3 py-2 text-xs text-white font-bold text-emerald-400 placeholder-[#686055] focus:outline-none focus:border-[#cf7b3e]"
                        />
                      </div>
                      <span className="text-[10px] text-emerald-400">Actual price customer pays at checkout</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-medium text-[#c4bcae]">
                        Promo Code
                      </label>
                      <button
                        type="button"
                        onClick={handleGenerateRandomCode}
                        className="text-[10px] text-[#dea374] hover:text-[#ffd700] font-semibold flex items-center gap-1 transition-colors"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Generate Random Code</span>
                      </button>
                    </div>
                    <input
                      type="text"
                      required
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      placeholder="e.g. CHEF299 or FLASH50"
                      className="w-full bg-[#121110] border border-[#383027] rounded-xl px-3 py-2 text-xs text-white uppercase font-mono font-bold tracking-wider placeholder-[#686055] focus:outline-none focus:border-[#cf7b3e]"
                    />
                  </div>

                  {/* Duration Selector */}
                  <div>
                    <label className="block text-xs font-medium text-[#c4bcae] mb-1.5 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#dea374]" />
                      <span>Duration &amp; Expiry (Runs for Life or Days)</span>
                    </label>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      {[
                        { id: 'lifetime', label: 'Run for Life' },
                        { id: '25', label: '25 Days' },
                        { id: '30', label: '30 Days' },
                        { id: '50', label: '50 Days' },
                        { id: 'custom', label: 'Custom' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setPromoDurationType(item.id as any)}
                          className={`py-2 px-2 rounded-xl text-xs font-semibold transition-all border text-center ${
                            promoDurationType === item.id
                              ? 'bg-[#cf7b3e] text-white border-[#cf7b3e] shadow-md shadow-[#cf7b3e]/25'
                              : 'bg-[#121110] text-[#a8a195] border-[#383027] hover:border-[#645647]'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>

                    {promoDurationType === 'custom' && (
                      <div className="mt-2.5 flex items-center gap-2">
                        <input
                          type="number"
                          min="1"
                          max="365"
                          value={promoCustomDays}
                          onChange={(e) => setPromoCustomDays(e.target.value)}
                          placeholder="Number of days (e.g. 14, 45, 90)"
                          className="w-36 bg-[#121110] border border-[#383027] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#cf7b3e]"
                        />
                        <span className="text-xs text-[#a8a195]">Days from today</span>
                      </div>
                    )}
                  </div>

                  {/* Live Strikethrough Preview */}
                  <div className="p-4 rounded-2xl bg-[#121110] border border-[#383027] flex items-center justify-between flex-wrap gap-3">
                    <div>
                      <span className="text-[10px] text-[#dea374] font-bold uppercase tracking-wider block">
                        Customer Storefront Preview
                      </span>
                      <div className="flex items-baseline gap-2 mt-0.5">
                        <span className="text-2xl font-extrabold text-emerald-400">
                          ${(parseFloat(promoSalePrice) || 2.99).toFixed(2)}
                        </span>
                        <span className="text-sm line-through text-[#8e8578] font-bold">
                          ${(parseFloat(promoRegularPrice) || 6.99).toFixed(2)}
                        </span>
                        <span className="text-xs text-[#dea374]">USD</span>
                      </div>
                      <p className="text-[11px] text-[#8e8578] mt-0.5">
                        Code: <span className="font-mono text-white font-bold">{promoCode || 'CHEF299'}</span> •{' '}
                        {promoDurationType === 'lifetime'
                          ? 'Runs for Life (No Expiration)'
                          : `${promoDurationType === 'custom' ? promoCustomDays : promoDurationType} Days Duration`}
                      </p>
                    </div>

                    <div className="text-right">
                      {parseFloat(promoRegularPrice) > parseFloat(promoSalePrice) && (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold">
                          SAVE ${(parseFloat(promoRegularPrice) - parseFloat(promoSalePrice)).toFixed(2)} (
                          {Math.round(
                            ((parseFloat(promoRegularPrice) - parseFloat(promoSalePrice)) /
                              parseFloat(promoRegularPrice)) *
                              100
                          )}
                          % OFF)
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#cf7b3e] to-[#b8612b] hover:brightness-110 text-white font-bold text-xs tracking-wider uppercase transition-all shadow-lg shadow-[#cf7b3e]/20"
                  >
                    Launch Strikethrough Promo Deal
                  </button>
                </form>
              </div>

              {/* Quick Info & Stats */}
              <div className="space-y-6">
                <div className="bg-[#181614] border border-[#2c2620] rounded-3xl p-6">
                  <h3 className="font-serif text-sm font-bold text-white mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#dea374]" />
                    <span>How Strikethrough Promos Work</span>
                  </h3>
                  <ul className="text-xs text-[#a8a195] space-y-2.5 leading-relaxed">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#cf7b3e] mt-1.5 flex-shrink-0" />
                      <span>
                        <strong>Storefront Strikethrough:</strong> The card shows <strong>~$6.99~</strong> struck through with the deal price <strong>$2.99</strong>.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#cf7b3e] mt-1.5 flex-shrink-0" />
                      <span>
                        <strong>Expiry Timer:</strong> Shows a countdown badge (e.g. <em>30 days left</em>, <em>25 days left</em>, or <em>Runs for Life</em>).
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#cf7b3e] mt-1.5 flex-shrink-0" />
                      <span>
                        <strong>Checkout Sync:</strong> PayPal charge automatically adjusts to $2.99 with zero manual calculations.
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="bg-[#181614] border border-[#2c2620] rounded-3xl p-6 text-center">
                  <div className="text-3xl font-extrabold text-[#dea374]">{promos.length}</div>
                  <div className="text-xs text-[#a8a195] mt-1">Configured Promo Deals</div>
                </div>
              </div>
            </div>

            {/* Existing Promos Table */}
            <div className="bg-[#181614] border border-[#2c2620] rounded-3xl p-6">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <h3 className="font-serif text-base font-bold text-white">
                  Active &amp; Scheduled Promo Deals ({promos.length})
                </h3>
              </div>

              {promos.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#7d756a]">
                  No promo deals created yet. Fill out the form above to launch your first deal!
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#2b251e] text-[#8e8578]">
                        <th className="pb-3 font-semibold">Code</th>
                        <th className="pb-3 font-semibold">Target Book</th>
                        <th className="pb-3 font-semibold">Strike-Through Pricing</th>
                        <th className="pb-3 font-semibold">Duration / Validity</th>
                        <th className="pb-3 font-semibold">Status</th>
                        <th className="pb-3 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#221c17]">
                      {promos.map((p) => {
                        const isExpired = p.expiresAt && new Date(p.expiresAt).getTime() <= Date.now();
                        const daysLeft = promoStore.getDaysRemaining(p.expiresAt);

                        return (
                          <tr key={p.id} className="text-white">
                            <td className="py-3 font-mono font-bold text-[#dea374]">
                              {p.code}
                            </td>
                            <td className="py-3 text-[#c4bcae] max-w-xs truncate">
                              {p.bookTitle || 'All Books'}
                            </td>
                            <td className="py-3">
                              <div className="flex items-baseline gap-2">
                                <span className="line-through text-[#7d756a] font-semibold">
                                  ${p.regularPrice.toFixed(2)}
                                </span>
                                <span className="font-extrabold text-emerald-400">
                                  ${p.promoPrice.toFixed(2)} USD
                                </span>
                              </div>
                            </td>
                            <td className="py-3">
                              <span
                                className={`text-[11px] font-semibold ${
                                  isExpired
                                    ? 'text-rose-400'
                                    : p.expiresAt
                                    ? 'text-[#dea374]'
                                    : 'text-emerald-400'
                                }`}
                              >
                                {daysLeft}
                              </span>
                            </td>
                            <td className="py-3">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                  !p.isActive
                                    ? 'bg-[#25201b] text-[#777] border-[#383027]'
                                    : isExpired
                                    ? 'bg-rose-950/70 text-rose-300 border-rose-500/30'
                                    : 'bg-emerald-950/70 text-emerald-300 border-emerald-500/30'
                                }`}
                              >
                                {!p.isActive ? 'PAUSED' : isExpired ? 'EXPIRED' : 'ACTIVE'}
                              </span>
                            </td>
                            <td className="py-3 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleTogglePromo(p.id)}
                                  className="px-2 py-1 rounded-lg bg-[#221c17] hover:bg-[#302820] text-[#dea374] text-[11px] font-medium border border-[#382f25] transition-all"
                                >
                                  {p.isActive ? 'Pause' : 'Activate'}
                                </button>
                                <button
                                  onClick={() => handleDeletePromo(p.id)}
                                  className="p-1 rounded-lg hover:bg-rose-950/50 text-[#777] hover:text-rose-400 transition-colors"
                                  title="Delete Promo"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: CREATE BUNDLES */}
        {activeTab === 'bundles' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-[#181614] border border-[#2c2620] rounded-3xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Package className="w-5 h-5 text-[#dea374]" />
                <h2 className="font-serif text-lg font-bold text-white">
                  Create a Multi-Book Bundle
                </h2>
              </div>

              <form onSubmit={handleSaveBundle} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#c4bcae] mb-1">
                      Bundle Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={bundleTitle}
                      onChange={(e) => setBundleTitle(e.target.value)}
                      placeholder="e.g. Master Heritage & Fire Trilogy"
                      className="w-full bg-[#121110] border border-[#383027] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#cf7b3e]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#c4bcae] mb-1">
                      Badge Text
                    </label>
                    <input
                      type="text"
                      value={bundleBadge}
                      onChange={(e) => setBundleBadge(e.target.value)}
                      placeholder="SAVE 67% • BEST VALUE"
                      className="w-full bg-[#121110] border border-[#383027] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#cf7b3e]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#c4bcae] mb-1">
                      Bundle Price ($ USD) *
                    </label>
                    <div className="relative">
                      <DollarSign className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#dea374]" />
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={bundlePrice}
                        onChange={(e) => setBundlePrice(e.target.value)}
                        placeholder="29.99"
                        className="w-full bg-[#121110] border border-[#383027] rounded-xl pl-8 pr-3 py-2 text-xs text-white focus:outline-none focus:border-[#cf7b3e]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#c4bcae] mb-1">
                      Original Value ($ Strike-through)
                    </label>
                    <div className="relative">
                      <DollarSign className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#777]" />
                      <input
                        type="number"
                        step="0.01"
                        value={bundleOriginalPrice}
                        onChange={(e) => setBundleOriginalPrice(e.target.value)}
                        placeholder="89.97"
                        className="w-full bg-[#121110] border border-[#383027] rounded-xl pl-8 pr-3 py-2 text-xs text-white focus:outline-none focus:border-[#cf7b3e]"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#c4bcae] mb-2">
                    Select Books to Include in this Bundle *
                  </label>
                  <div className="space-y-2 max-h-48 overflow-y-auto bg-[#121110] p-3 rounded-2xl border border-[#383027]">
                    {books.map((b) => (
                      <label 
                        key={b.id} 
                        className="flex items-center gap-2.5 text-xs text-white hover:bg-[#1e1a16] p-2 rounded-xl cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedBookIds.includes(b.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedBookIds([...selectedBookIds, b.id]);
                            } else {
                              setSelectedBookIds(selectedBookIds.filter((id) => id !== b.id));
                            }
                          }}
                          className="rounded text-[#cf7b3e] focus:ring-0"
                        />
                        <span className="font-semibold">{b.title}</span>
                        <span className="text-[#8e8579]">(${b.price.toFixed(2)})</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#cf7b3e] hover:bg-[#b8612b] text-white font-bold text-xs sm:text-sm shadow-lg transition-all"
                >
                  Save & Publish Bundle
                </button>
              </form>
            </div>

            {/* Existing Bundles */}
            <div className="bg-[#181614] border border-[#2c2620] rounded-3xl p-6">
              <h3 className="font-serif text-base font-bold text-white mb-3">
                Active Bundles ({bundles.length})
              </h3>

              <div className="space-y-3">
                {bundles.map((bundle) => (
                  <div key={bundle.id} className="bg-[#1f1b17] p-3 rounded-2xl border border-[#332b22]">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-[#dea374] bg-[#2e261f] px-2 py-0.5 rounded">
                          {bundle.badge}
                        </span>
                        <h4 className="text-xs font-bold text-white mt-1.5">{bundle.title}</h4>
                        <div className="flex items-center gap-2 text-xs mt-1">
                          <span className="font-extrabold text-white">${bundle.price.toFixed(2)} USD</span>
                          <span className="line-through text-[10px] text-[#7a7268]">${bundle.originalPrice.toFixed(2)}</span>
                        </div>
                        <p className="text-[10px] text-[#938b7e] mt-1">
                          Includes {bundle.bookIds.length} complete digital recipe packs.
                        </p>
                      </div>

                      {bundles.length > 1 && (
                        <button
                          onClick={() => {
                            bookStore.deleteBundle(bundle.id);
                            refreshData();
                          }}
                          className="text-rose-400 p-1 hover:bg-rose-950 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ACCOUNTS, VERCEL & FREE STORAGE CONFIGURATION */}
        {activeTab === 'accounts' && (
          <div className="space-y-6">
            {storageSavedMsg && (
              <div className="bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-xs p-3 rounded-xl flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>{storageSavedMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* High-Scale Zero Egress Storage (Cloudflare R2) */}
              <div className="bg-[#181614] border border-[#2c2620] rounded-3xl p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Database className="w-5 h-5 text-[#dea374]" />
                  <h3 className="font-serif text-base font-bold text-white">
                    Cloudflare R2 (100% Free Egress Bandwidth)
                  </h3>
                </div>

                <div className="p-3 bg-[#241a12] border border-[#cf7b3e]/40 rounded-xl mb-4 text-xs text-[#d6cdbf]">
                  <p className="font-bold text-white flex items-center gap-1.5 mb-1">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    Why Cloudflare R2 Handles 1,000+ Daily Visitors for $0
                  </p>
                  <p className="text-[11px] leading-relaxed text-[#b8ada0]">
                    Unlike Supabase or AWS S3 which charge or cap bandwidth egress, <strong className="text-white">Cloudflare R2 has $0 Egress fees</strong>. You get <strong>10 GB free storage</strong> and <strong>10,000,000 free requests</strong> every month. Even if 1,000+ people open, flip, and download PDFs, your cost is literally <strong>$0.00</strong>.
                  </p>
                </div>

                {/* Storage Provider Selector */}
                <div className="flex gap-2 mb-4 text-xs">
                  <button
                    type="button"
                    onClick={() => setStorageProvider('cloudflare-r2')}
                    className={`flex-1 py-1.5 px-2 rounded-lg font-semibold border transition-all ${
                      storageProvider === 'cloudflare-r2'
                        ? 'bg-[#cf7b3e] text-white border-[#cf7b3e]'
                        : 'bg-[#141210] text-[#8e8578] border-[#2c2620]'
                    }`}
                  >
                    Cloudflare R2 (Recommended)
                  </button>
                  <button
                    type="button"
                    onClick={() => setStorageProvider('supabase')}
                    className={`flex-1 py-1.5 px-2 rounded-lg font-semibold border transition-all ${
                      storageProvider === 'supabase'
                        ? 'bg-[#cf7b3e] text-white border-[#cf7b3e]'
                        : 'bg-[#141210] text-[#8e8578] border-[#2c2620]'
                    }`}
                  >
                    Supabase
                  </button>
                  <button
                    type="button"
                    onClick={() => setStorageProvider('browser')}
                    className={`flex-1 py-1.5 px-2 rounded-lg font-semibold border transition-all ${
                      storageProvider === 'browser'
                        ? 'bg-[#cf7b3e] text-white border-[#cf7b3e]'
                        : 'bg-[#141210] text-[#8e8578] border-[#2c2620]'
                    }`}
                  >
                    Local Device Cache
                  </button>
                </div>

                {/* Cloudflare R2 Form */}
                {storageProvider === 'cloudflare-r2' && (
                  <form onSubmit={handleSaveAccounts} className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-medium text-[#c4bcae] mb-1">
                        Cloudflare Account ID
                      </label>
                      <input
                        type="text"
                        value={r2AccountId}
                        onChange={(e) => setR2AccountId(e.target.value)}
                        placeholder="e.g. 9b7a42b189c426379a0d8e4..."
                        className="w-full bg-[#121110] border border-[#383027] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#cf7b3e]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-medium text-[#c4bcae] mb-1">
                          R2 Access Key ID
                        </label>
                        <input
                          type="text"
                          value={r2AccessKeyId}
                          onChange={(e) => setR2AccessKeyId(e.target.value)}
                          placeholder="R2 API Token Key"
                          className="w-full bg-[#121110] border border-[#383027] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#cf7b3e]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-[#c4bcae] mb-1">
                          R2 Secret Access Key
                        </label>
                        <input
                          type="password"
                          value={r2SecretAccessKey}
                          onChange={(e) => setR2SecretAccessKey(e.target.value)}
                          placeholder="Secret Key"
                          className="w-full bg-[#121110] border border-[#383027] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#cf7b3e]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-medium text-[#c4bcae] mb-1">
                          Bucket Name
                        </label>
                        <input
                          type="text"
                          value={r2BucketName}
                          onChange={(e) => setR2BucketName(e.target.value)}
                          placeholder="recipe-vault-books"
                          className="w-full bg-[#121110] border border-[#383027] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#cf7b3e]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-[#c4bcae] mb-1">
                          Public Bucket URL (or r2.dev)
                        </label>
                        <input
                          type="text"
                          value={r2PublicUrl}
                          onChange={(e) => setR2PublicUrl(e.target.value)}
                          placeholder="https://pub-xxxxxx.r2.dev"
                          className="w-full bg-[#121110] border border-[#383027] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#cf7b3e]"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#cf7b3e] to-[#b8612b] text-white font-bold text-xs transition-all shadow-md mt-2"
                    >
                      Save Cloudflare R2 Credentials
                    </button>
                  </form>
                )}

                {/* Supabase Form */}
                {storageProvider === 'supabase' && (
                  <form onSubmit={handleSaveAccounts} className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-medium text-[#c4bcae] mb-1">
                        Supabase Project URL
                      </label>
                      <input
                        type="text"
                        value={supabaseUrl}
                        onChange={(e) => setSupabaseUrl(e.target.value)}
                        placeholder="https://xyzcompany.supabase.co"
                        className="w-full bg-[#121110] border border-[#383027] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#cf7b3e]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-[#c4bcae] mb-1">
                        Supabase Anon Public API Key
                      </label>
                      <input
                        type="password"
                        value={supabaseKey}
                        onChange={(e) => setSupabaseKey(e.target.value)}
                        placeholder="eyJhbGciOiJIUzI1NiIsIn..."
                        className="w-full bg-[#121110] border border-[#383027] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#cf7b3e]"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-[#29221b] hover:bg-[#382f25] border border-[#44382c] text-[#dea374] font-semibold text-xs transition-all"
                    >
                      Save Supabase Credentials
                    </button>
                  </form>
                )}

                {/* Local Cache Info */}
                {storageProvider === 'browser' && (
                  <div className="p-4 bg-[#141210] rounded-2xl border border-[#2e2720] text-xs space-y-2">
                    <p className="font-semibold text-white">Native Device Cache Active</p>
                    <p className="text-[#a1998f] text-[11px]">
                      Files are stored in the device’s local CacheStorage & IndexedDB. Zero cloud configuration required, 100% free and works fully offline.
                    </p>
                  </div>
                )}
              </div>

              {/* PayPal Credentials & Accounts Guide */}
              <div className="bg-[#181614] border border-[#2c2620] rounded-3xl p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Server className="w-5 h-5 text-[#dea374]" />
                    <h3 className="font-serif text-base font-bold text-white">
                      PayPal Live & Sandbox Configuration
                    </h3>
                  </div>

                  <p className="text-xs text-[#a8a195] leading-relaxed mb-4">
                    Connect your PayPal merchant account to collect direct dollar ($) payments into your balance.
                  </p>

                  <form onSubmit={handleSaveAccounts} className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-medium text-[#c4bcae] mb-1">
                        PayPal Client ID
                      </label>
                      <input
                        type="text"
                        value={paypalId}
                        onChange={(e) => setPaypalId(e.target.value)}
                        placeholder="Enter your PayPal Client ID (or 'test')"
                        className="w-full bg-[#121110] border border-[#383027] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#cf7b3e]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-[#c4bcae] mb-1">
                        PayPal Mode
                      </label>
                      <div className="flex gap-4 text-xs text-white pt-1">
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="radio"
                            name="paypalMode"
                            checked={paypalMode === 'sandbox'}
                            onChange={() => setPaypalMode('sandbox')}
                            className="text-[#cf7b3e]"
                          />
                          <span>Sandbox (Testing Mode)</span>
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="radio"
                            name="paypalMode"
                            checked={paypalMode === 'live'}
                            onChange={() => setPaypalMode('live')}
                            className="text-[#cf7b3e]"
                          />
                          <span>Live (Accept Real Money)</span>
                        </label>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-[#cf7b3e] hover:bg-[#b8612b] text-white font-bold text-xs transition-all shadow-md"
                    >
                      Update PayPal Credentials
                    </button>
                  </form>
                </div>

                {/* Hybrid Auto-Update & Offline Fallback (Mode A + Mode B) */}
                <div className="mt-5 pt-4 border-t border-[#29221b] text-xs space-y-3">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5 text-white font-semibold">
                      <Globe className="w-4 h-4 text-[#dea374]" />
                      <span>Hybrid Auto-Update &amp; Offline Fallback (Mode A + Mode B)</span>
                    </div>
                    {(() => {
                      const syncStatus = hybridSyncService.getStatus();
                      const isBothActive = syncStatus.isOnline && hybridUpdateMode !== 'offline-only';
                      return (
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide border ${
                            isBothActive
                              ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                              : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                          }`}
                        >
                          {isBothActive
                            ? 'MODE A + MODE B ACTIVE • ONLINE VERCEL OTA + OFFLINE APK FALLBACK'
                            : 'OFFLINE BUNDLE MODE'}
                        </span>
                      );
                    })()}
                  </div>

                  <p className="text-[11px] text-[#8a8175] leading-relaxed">
                    When online, the APK automatically syncs your latest GitHub &rarr; Vercel deployment and caches it on-device. If offline or unreachable, it seamlessly runs the bundled APK assets with zero downtime.
                  </p>

                  <form onSubmit={handleSaveAccounts} className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-medium text-[#c4bcae] mb-1">
                        Production Vercel URL (Live OTA Source)
                      </label>
                      <input
                        type="url"
                        value={vercelLiveUrl}
                        onChange={(e) => setVercelLiveUrl(e.target.value)}
                        placeholder="https://your-recipe-vault.vercel.app"
                        className="w-full bg-[#121110] border border-[#383027] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#cf7b3e]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-[#c4bcae] mb-1">
                        Mobile Sync &amp; Offline Strategy
                      </label>
                      <select
                        value={hybridUpdateMode}
                        onChange={(e) =>
                          setHybridUpdateMode(e.target.value as 'both' | 'cloud-only' | 'offline-only')
                        }
                        className="w-full bg-[#121110] border border-[#383027] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#cf7b3e]"
                      >
                        <option value="both">
                          Both: Auto-Update from Vercel + Offline APK Fallback (Recommended)
                        </option>
                        <option value="cloud-only">
                          Mode A Only: Live Vercel Cloud Sync
                        </option>
                        <option value="offline-only">
                          Mode B Only: Bundled Offline APK Assets
                        </option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2 rounded-xl bg-[#27211c] hover:bg-[#352c25] border border-[#cf7b3e]/40 text-[#dea374] font-bold text-xs transition-all"
                    >
                      Save Hybrid Sync Settings
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: RECIPE GROCERY LISTS (JSON MANAGER) */}
        {activeTab === 'groceries' && (
          <div className="space-y-6">
            <div className="bg-[#1a1715] border border-[#2b251f] rounded-3xl p-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#29221b]">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                    RECIPE GROCERY LISTS &amp; JSON SCRIPT MANAGER
                  </span>
                  <h3 className="font-serif text-xl font-bold text-white mt-1">
                    Manage Per-Recipe Shopping Lists
                  </h3>
                  <p className="text-xs text-[#a8a196] mt-0.5">
                    Easily add, edit, or import custom grocery checklists per recipe using a clean JSON script.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(groceryStore.exportRecipeGroceryJson());
                      const dlAnchor = document.createElement('a');
                      dlAnchor.setAttribute('href', dataStr);
                      dlAnchor.setAttribute('download', `Recipe_Grocery_Lists_${new Date().toISOString().slice(0, 10)}.json`);
                      dlAnchor.click();
                    }}
                    className="px-3.5 py-2 rounded-xl bg-[#28211b] hover:bg-[#382d23] border border-[#44372a] text-xs font-bold text-[#dea374] flex items-center gap-1.5 transition-all shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download JSON Template</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Reset all recipe grocery lists back to factory defaults?')) {
                        groceryStore.resetRecipeGroceryLists();
                        setAdminRecipeLists(groceryStore.getRecipeGroceryLists());
                        setGroceryImportFeedback({ text: 'Reset to default recipe grocery lists.', isError: false });
                      }
                    }}
                    className="px-3 py-2 rounded-xl bg-[#201914] hover:bg-rose-950/50 border border-[#35271d] hover:border-rose-500/40 text-xs font-semibold text-[#8e8578] hover:text-rose-300 transition-all"
                  >
                    Reset Defaults
                  </button>
                </div>
              </div>

              {/* JSON Import Section */}
              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-bold text-[#dbd5ca] flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Paste Recipe Grocery Lists JSON Script:</span>
                  </label>
                  <span className="text-[11px] text-[#8e8578]">
                    Format: Array of recipe objects with pageNumber, recipeTitle, chapter, servings, items[]
                  </span>
                </div>

                <textarea
                  rows={6}
                  value={groceryJsonInput}
                  onChange={(e) => setGroceryJsonInput(e.target.value)}
                  placeholder={`[
  {
    "pageNumber": 6,
    "recipeTitle": "Traditional Karoo Boerewors with Roasted Coriander",
    "chapter": "Chapter 01: Braai Meat & Chops",
    "category": "Meat & Chops",
    "servings": "6-8 portions",
    "items": [
      "1.5kg Minced Beef & Pork Spek",
      "2 tbsp Coriander Seeds",
      "Worcestershire Sauce & Vinegar"
    ]
  }
]`}
                  className="w-full bg-[#120f0d] border border-[#3b3126] rounded-2xl p-3.5 font-mono text-xs text-white placeholder-[#5a5247] focus:outline-none focus:border-[#cf7b3e]"
                />

                <div className="flex items-center justify-between">
                  {groceryImportFeedback ? (
                    <span
                      className={`text-xs font-semibold ${
                        groceryImportFeedback.isError ? 'text-rose-400' : 'text-emerald-400'
                      }`}
                    >
                      {groceryImportFeedback.text}
                    </span>
                  ) : (
                    <span className="text-[11px] text-[#7d756a]">
                      Currently loaded: <strong>{adminRecipeLists.length} recipes</strong>
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      if (!groceryJsonInput.trim()) {
                        setGroceryImportFeedback({ text: 'Please paste JSON into the box first.', isError: true });
                        return;
                      }
                      const res = groceryStore.importRecipeGroceryJson('vault-vol-01', groceryJsonInput);
                      if (res.success) {
                        setAdminRecipeLists(groceryStore.getRecipeGroceryLists());
                        setGroceryJsonInput('');
                        setGroceryImportFeedback({ text: `✓ Successfully imported ${res.count} recipe grocery lists!`, isError: false });
                      } else {
                        setGroceryImportFeedback({ text: `Error: ${res.error}`, isError: true });
                      }
                    }}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:brightness-110 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Validate &amp; Save JSON Script</span>
                  </button>
                </div>
              </div>

              {/* Current Loaded Recipes Grid */}
              <div className="mt-8 space-y-3">
                <h4 className="text-xs uppercase font-bold tracking-wider text-[#dea374]">
                  Active Recipe Lists in Collection ({adminRecipeLists.length}):
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {adminRecipeLists.map((rec) => (
                    <div
                      key={rec.recipeId}
                      className="bg-[#14110e] border border-[#2b231b] rounded-2xl p-3.5 space-y-2 hover:border-[#cf7b3e]/40 transition-colors"
                    >
                      <div className="flex items-center justify-between text-[10px] text-[#8e8578]">
                        <span className="text-amber-400 font-bold">Page {rec.pageNumber}</span>
                        <span>{rec.servings}</span>
                      </div>

                      <h5 className="font-serif font-bold text-white text-xs leading-snug truncate">
                        {rec.recipeTitle}
                      </h5>

                      <p className="text-[10px] text-[#a8a196] truncate">{rec.chapter}</p>

                      <div className="bg-[#1d1712] p-2 rounded-xl border border-[#2b2118] space-y-1">
                        <span className="text-[9px] uppercase font-bold text-[#dea374] block">
                          Ingredients ({rec.items.length}):
                        </span>
                        <ul className="text-[10px] text-[#c4bcae] space-y-0.5 list-disc list-inside">
                          {rec.items.slice(0, 3).map((it, idx) => (
                            <li key={idx} className="truncate">{it}</li>
                          ))}
                          {rec.items.length > 3 && (
                            <li className="text-[9px] text-[#8e8578] list-none">+{rec.items.length - 3} more items...</li>
                          )}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

