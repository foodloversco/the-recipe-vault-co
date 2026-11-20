import React, { useState, useEffect } from 'react';
import { Book, Bundle, SaleTransaction } from '../../types';
import { bookStore } from '../../services/bookStore';
import { salesStore } from '../../services/salesStore';
import { storageService } from '../../services/storageService';
import { settingsStore } from '../../services/settingsStore';
import { hybridSyncService } from '../../services/hybridSyncService';
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
  Globe 
} from 'lucide-react';

interface AdminPortalProps {
  onBackToApp: () => void;
  onPreviewBook: (slug: string) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ onBackToApp, onPreviewBook }) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'sales' | 'bundles' | 'accounts'>('upload');
  const [books, setBooks] = useState<Book[]>([]);
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [sales, setSales] = useState<SaleTransaction[]>([]);
  
  // Book Upload & Price State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('14.99');
  const [originalPrice, setOriginalPrice] = useState('29.99');
  const [recipeCount, setRecipeCount] = useState('30');
  const [previewLimit, setPreviewLimit] = useState('5');
  const [category, setCategory] = useState('Open-Fire & Grilling');
  const [selectedPdf, setSelectedPdf] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState('');

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
    setBooks(bookStore.getBooks());
    setBundles(bookStore.getBundles());
    setSales(salesStore.getSales());
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!slug) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
    }
  };

  const handlePdfUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price) {
      alert('Please fill out the title and price.');
      return;
    }

    setIsUploading(true);
    let uploadedPdfInfo: { url: string; size: string; name: string } | null = null;

    try {
      if (selectedPdf) {
        uploadedPdfInfo = await storageService.uploadPdfFile(selectedPdf, 'books');
      }

      const newBook: Book = {
        id: `vault-book-${Date.now()}`,
        slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        title,
        subtitle: subtitle || '30 Phone-Ready Recipes & Categorized Grocery Checklists',
        tagline: 'Instant Printable Culinary Library',
        description: description || 'Editorial recipe collection curated for phone reading and fireside cooking.',
        coverImage: '/assets/images/recipe-card-sample.png',
        price: parseFloat(price) || 14.99,
        originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
        recipeCount: parseInt(recipeCount, 10) || 30,
        previewPagesAllowed: parseInt(previewLimit, 10) || 5,
        category,
        tags: [category, 'Phone-Ready', 'Grocery Checklists'],
        pdfFileUrl: uploadedPdfInfo?.url,
        pdfFileName: uploadedPdfInfo?.name || selectedPdf?.name,
        pdfFileSize: uploadedPdfInfo?.size || '15.0 MB',
        pages: [], // Will generate placeholder cards or render from PDF
        createdAt: new Date().toISOString(),
      };

      bookStore.saveBook(newBook);
      refreshData();
      setIsUploading(false);
      setUploadSuccessMsg(`Successfully created book "${title}" with price $${price} USD!`);
      // Reset form
      setTitle('');
      setSlug('');
      setSubtitle('');
      setDescription('');
      setSelectedPdf(null);
      setTimeout(() => setUploadSuccessMsg(''), 4000);
    } catch (err) {
      console.error(err);
      setIsUploading(false);
      alert('Upload failed: ' + err);
    }
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
              The Recipe Vault Co. • Mobile & Web Digital Management
            </p>
          </div>
        </div>

        <button
          onClick={onBackToApp}
          className="px-3.5 py-1.5 rounded-full bg-[#27221d] hover:bg-[#352f28] text-xs font-semibold text-white border border-[#443b32] transition-all"
        >
          Exit to App
        </button>
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
            onClick={() => setActiveTab('bundles')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'bundles'
                ? 'bg-[#cf7b3e] text-white shadow-lg shadow-[#cf7b3e]/20'
                : 'bg-[#1a1715] text-[#b3aaa0] hover:text-white border border-[#2b251f]'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>3. Create Bundles</span>
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
            <span>4. Accounts, Vercel & Free Storage</span>
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

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                      className="bg-[#1f1b17] p-3 rounded-2xl border border-[#322a22] flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 truncate">
                        <img 
                          src={b.coverImage} 
                          alt={b.title} 
                          className="w-10 h-12 rounded object-cover border border-[#44372c]" 
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
                          title="Preview in Kindle Reader"
                          className="p-1.5 rounded-lg bg-[#2b251f] hover:bg-[#3d342b] text-[#dea374]"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {books.length > 1 && (
                          <button
                            onClick={() => {
                              if (confirm(`Delete "${b.title}"?`)) {
                                bookStore.deleteBook(b.id);
                                refreshData();
                              }
                            }}
                            title="Delete"
                            className="p-1.5 rounded-lg bg-[#2b251f] hover:bg-rose-950 text-rose-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
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

        {/* TAB 3: CREATE BUNDLES */}
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
      </div>
    </div>
  );
};

