import React, { useState, useEffect } from 'react';
import { Book } from '../../types';
import { groceryStore, MASTER_BRAAI_GROCERY_CATEGORIES } from '../../services/groceryStore';
import { RecipeGroceryList } from '../../data/recipeGroceryData';
import {
  X,
  Printer,
  CheckSquare,
  Square,
  Sparkles,
  ShoppingBag,
  RotateCcw,
  CheckCircle2,
  BookmarkCheck,
  BookOpen,
  ChevronRight,
  Search,
  Utensils
} from 'lucide-react';

interface GroceryChecklistModalProps {
  book: Book;
  isOpen: boolean;
  onClose: () => void;
  onSaveToVaultSuccess?: () => void;
  initialRecipePage?: number;
  onJumpToPage?: (pageNumber: number) => void;
}

export const GroceryChecklistModal: React.FC<GroceryChecklistModalProps> = ({
  book,
  isOpen,
  onClose,
  onSaveToVaultSuccess,
  initialRecipePage,
  onJumpToPage,
}) => {
  const [viewMode, setViewMode] = useState<'recipe' | 'master'>('recipe');
  const [recipeLists, setRecipeLists] = useState<RecipeGroceryList[]>(() =>
    groceryStore.getRecipeGroceryLists(book.id)
  );

  // Selected recipe in recipe mode
  const [selectedRecipeId, setSelectedRecipeId] = useState<string>(() => {
    if (initialRecipePage) {
      const match = groceryStore.getRecipeGroceryByPage(initialRecipePage, book.id);
      if (match) return match.recipeId;
    }
    const all = groceryStore.getRecipeGroceryLists(book.id);
    return all[0]?.recipeId || 'rec-06';
  });

  const [recipeSearch, setRecipeSearch] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Global checked state for master mode
  const [masterCheckedMap, setMasterCheckedMap] = useState<Record<string, boolean>>(() =>
    groceryStore.getCheckedMap(book.id)
  );
  // Recipe-specific checked state
  const [recipeCheckedMap, setRecipeCheckedMap] = useState<Record<number, boolean>>(() =>
    groceryStore.getRecipeCheckedMap(book.id, selectedRecipeId)
  );

  const [savedInVault, setSavedInVault] = useState<boolean>(() =>
    groceryStore.isListSavedInVault(book.id)
  );

  useEffect(() => {
    const unsub = groceryStore.subscribe(() => {
      setRecipeLists(groceryStore.getRecipeGroceryLists(book.id));
      setMasterCheckedMap(groceryStore.getCheckedMap(book.id));
      setRecipeCheckedMap(groceryStore.getRecipeCheckedMap(book.id, selectedRecipeId));
      setSavedInVault(groceryStore.isListSavedInVault(book.id));
    });
    return unsub;
  }, [book.id, selectedRecipeId]);

  useEffect(() => {
    if (initialRecipePage) {
      const match = groceryStore.getRecipeGroceryByPage(initialRecipePage, book.id);
      if (match) {
        setSelectedRecipeId(match.recipeId);
        setViewMode('recipe');
      }
    }
  }, [initialRecipePage, book.id]);

  useEffect(() => {
    setRecipeCheckedMap(groceryStore.getRecipeCheckedMap(book.id, selectedRecipeId));
  }, [selectedRecipeId, book.id]);

  if (!isOpen) return null;

  const currentRecipe = recipeLists.find((r) => r.recipeId === selectedRecipeId) || recipeLists[0];

  // Master mode counts
  const allMasterItemIds: string[] = [];
  MASTER_BRAAI_GROCERY_CATEGORIES.forEach((cat) => {
    cat.items.forEach((item) => {
      allMasterItemIds.push(`${cat.category}::${item}`);
    });
  });
  const totalMasterCount = allMasterItemIds.length;
  const checkedMasterCount = allMasterItemIds.filter((id) => masterCheckedMap[id]).length;
  const masterPercent = totalMasterCount > 0 ? Math.round((checkedMasterCount / totalMasterCount) * 100) : 0;

  // Recipe mode counts
  const recipeItemCount = currentRecipe?.items?.length || 0;
  let recipeCheckedCount = 0;
  if (currentRecipe?.items) {
    currentRecipe.items.forEach((_, idx) => {
      if (recipeCheckedMap[idx]) recipeCheckedCount++;
    });
  }
  const recipePercent = recipeItemCount > 0 ? Math.round((recipeCheckedCount / recipeItemCount) * 100) : 0;

  const handleToggleRecipeItem = (idx: number) => {
    groceryStore.toggleRecipeItem(book.id, currentRecipe.recipeId, idx);
    setRecipeCheckedMap(groceryStore.getRecipeCheckedMap(book.id, currentRecipe.recipeId));
  };

  const handleClearRecipeItems = () => {
    groceryStore.clearRecipeChecked(book.id, currentRecipe.recipeId);
    setRecipeCheckedMap({});
    showToast(`Checklist cleared for ${currentRecipe.recipeTitle}!`);
  };

  const handleToggleMasterItem = (itemKey: string) => {
    groceryStore.toggleItem(book.id, itemKey);
  };

  const handleClearMaster = () => {
    groceryStore.clearAllChecked(book.id);
    showToast('Master grocery run cleared!');
  };

  const handleSaveToVault = () => {
    groceryStore.saveListToVault(book);
    setSavedInVault(true);
    showToast('Saved to My Recipes / My Vault shopping lists!');
    if (onSaveToVaultSuccess) onSaveToVaultSuccess();
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleJumpToRecipePage = () => {
    if (onJumpToPage && currentRecipe) {
      onJumpToPage(currentRecipe.pageNumber);
      onClose();
    }
  };

  const filteredRecipes = recipeLists.filter(
    (r) =>
      r.recipeTitle.toLowerCase().includes(recipeSearch.toLowerCase()) ||
      r.chapter.toLowerCase().includes(recipeSearch.toLowerCase()) ||
      r.category.toLowerCase().includes(recipeSearch.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      {/* Printable Styling */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-grocery-list, #printable-grocery-list * {
            visibility: visible;
          }
          #printable-grocery-list {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
            color: black !important;
            padding: 24px;
            box-shadow: none !important;
            border: none !important;
          }
          .no-print {
            display: none !important;
          }
          .print-black {
            color: black !important;
          }
          .print-border {
            border-color: #ccc !important;
          }
        }
      `}</style>

      <div
        id="printable-grocery-list"
        className="bg-[#181512] border border-[#382f25] rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl relative text-[#f5f2eb]"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[#2d251e] flex items-center justify-between bg-[#1f1b16]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#cf7b3e]/20 border border-[#cf7b3e] flex items-center justify-center text-[#dea374] flex-shrink-0">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#dea374] bg-[#29221b] px-2 py-0.5 rounded-full border border-[#cf7b3e]/30">
                  IN-STORE GROCERY CHECKLISTS
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold hidden sm:inline">
                  • 30 Recipes Covered
                </span>
              </div>
              <h2 className="font-serif text-base sm:text-xl font-bold text-white mt-0.5 leading-tight print-black">
                {book.title}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#999] hover:text-white bg-[#26201a] hover:bg-[#332b23] border border-[#3b3227] transition-all no-print"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector Tabs: Per-Recipe vs Master All-Chapters */}
        <div className="px-4 py-2 bg-[#14110e] border-b border-[#2b241c] flex items-center justify-between gap-2 no-print">
          <div className="flex items-center gap-1.5 bg-[#1b1713] p-1 rounded-xl border border-[#302820]">
            <button
              type="button"
              onClick={() => setViewMode('recipe')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'recipe'
                  ? 'bg-[#cf7b3e] text-white shadow-md'
                  : 'text-[#a8a196] hover:text-white'
              }`}
            >
              <Utensils className="w-3.5 h-3.5" />
              <span>Per-Recipe Checklist</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('master')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'master'
                  ? 'bg-emerald-700 text-white shadow-md'
                  : 'text-[#a8a196] hover:text-white'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>All Recipes (Master Run)</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-[#251f1a] hover:bg-[#332a22] text-[#dea374] border border-[#3d3227] text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
              title="Print checklist"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print Card</span>
            </button>

            <button
              type="button"
              onClick={handleSaveToVault}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
                savedInVault
                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                  : 'bg-[#292018] hover:bg-[#362a20] text-[#dea374] border border-[#443628]'
              }`}
              title="Save to My Vault"
            >
              <BookmarkCheck className="w-3.5 h-3.5" />
              <span>{savedInVault ? 'Saved ✓' : 'Save in Vault'}</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {viewMode === 'recipe' ? (
            /* --- PER-RECIPE GROCERY CHECKLIST --- */
            <div className="space-y-4">
              {/* Recipe Selector Dropdown & Search */}
              <div className="bg-[#1b1713] p-3 rounded-2xl border border-[#302820] space-y-2 no-print">
                <div className="flex items-center justify-between text-xs text-[#a8a196]">
                  <span className="font-semibold flex items-center gap-1">
                    <Utensils className="w-3.5 h-3.5 text-[#dea374]" />
                    <span>Choose Recipe to Shop For:</span>
                  </span>
                  <span className="font-mono text-[11px] text-[#dea374]">
                    30 Recipes in Series 1
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <select
                    value={selectedRecipeId}
                    onChange={(e) => setSelectedRecipeId(e.target.value)}
                    className="flex-1 bg-[#120f0d] border border-[#3d3328] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#cf7b3e] font-sans"
                  >
                    {recipeLists.map((r) => (
                      <option key={r.recipeId} value={r.recipeId}>
                        P.{r.pageNumber} • {r.recipeTitle} ({r.category})
                      </option>
                    ))}
                  </select>

                  {onJumpToPage && (
                    <button
                      type="button"
                      onClick={handleJumpToRecipePage}
                      className="px-3 py-2 rounded-xl bg-[#2a221a] hover:bg-[#382d22] border border-[#443628] text-xs font-bold text-[#dea374] hover:text-white flex items-center justify-center gap-1.5 transition-all flex-shrink-0"
                      title="Open this recipe in the flip book reader"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Jump to Page {currentRecipe.pageNumber}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Active Recipe Shopping Card */}
              {currentRecipe && (
                <div className="bg-[#1f1a15] border border-[#382e23] rounded-2xl p-4 sm:p-5 space-y-4 print-border">
                  {/* Recipe Header Banner */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#2d251d] pb-3">
                    <div>
                      <div className="flex items-center gap-1.5 text-[10px] text-[#dea374] font-bold uppercase tracking-wider mb-1">
                        <span>{currentRecipe.chapter}</span>
                        <span>•</span>
                        <span>{currentRecipe.category}</span>
                      </div>
                      <h3 className="font-serif text-lg sm:text-xl font-bold text-white print-black">
                        {currentRecipe.recipeTitle}
                      </h3>
                      <p className="text-xs text-[#a8a196] mt-0.5 print-black">
                        Yield: {currentRecipe.servings} • Page {currentRecipe.pageNumber} in Collection
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-center">
                      <div className="text-right no-print">
                        <span className="text-xs font-bold text-white">
                          {recipeCheckedCount} / {recipeItemCount} Done
                        </span>
                        <div className="w-24 bg-[#14110e] h-1.5 rounded-full mt-1 overflow-hidden">
                          <div
                            className="bg-emerald-500 h-full transition-all duration-300"
                            style={{ width: `${recipePercent}%` }}
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleClearRecipeItems}
                        title="Reset checkmarks for this dish"
                        className="p-1.5 rounded-lg text-[#888] hover:text-white hover:bg-[#28211b] transition-all no-print"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Checklist Items */}
                  <div className="space-y-2">
                    <span className="text-[11px] uppercase font-bold tracking-wider text-[#dea374] block print-black">
                      Grocery Aisle Items ({currentRecipe.items.length}):
                    </span>

                    <div className="space-y-1.5">
                      {currentRecipe.items.map((item, idx) => {
                        const isChecked = !!recipeCheckedMap[idx];
                        return (
                          <div
                            key={idx}
                            onClick={() => handleToggleRecipeItem(idx)}
                            className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-3 select-none ${
                              isChecked
                                ? 'bg-emerald-950/30 border-emerald-500/40 text-[#a3d9b5]'
                                : 'bg-[#181512] hover:bg-[#241e18] border-[#2c241c] text-white'
                            }`}
                          >
                            <button
                              type="button"
                              className="focus:outline-none flex-shrink-0"
                            >
                              {isChecked ? (
                                <CheckSquare className="w-4 h-4 text-emerald-400" />
                              ) : (
                                <Square className="w-4 h-4 text-[#666]" />
                              )}
                            </button>

                            <span
                              className={`text-xs sm:text-sm leading-snug print-black ${
                                isChecked ? 'line-through opacity-75' : 'font-medium'
                              }`}
                            >
                              {item}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Card Footer Note */}
                  <div className="pt-2 border-t border-[#2d251d] flex items-center justify-between text-[11px] text-[#8e8578] print-black">
                    <span>✓ Interactive phone checkboxes save automatically</span>
                    <span>Page {currentRecipe.pageNumber}</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* --- MASTER ALL-RECIPES RUN --- */
            <div className="space-y-4">
              <div className="p-3 bg-[#1b1713] rounded-2xl border border-[#302820] flex items-center justify-between no-print">
                <div>
                  <span className="text-xs font-bold text-white">
                    Master Cart: {checkedMasterCount} of {totalMasterCount} items ({masterPercent}%)
                  </span>
                  <div className="w-48 bg-[#14110e] h-1.5 rounded-full mt-1 overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full transition-all duration-300"
                      style={{ width: `${masterPercent}%` }}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleClearMaster}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold text-[#888] hover:text-white bg-[#251e18] hover:bg-[#30271f] border border-[#382e24] flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset All</span>
                </button>
              </div>

              {MASTER_BRAAI_GROCERY_CATEGORIES.map((categoryGroup) => (
                <div
                  key={categoryGroup.category}
                  className="bg-[#1b1713] border border-[#2d251d] rounded-2xl p-4 space-y-2.5 print-border"
                >
                  <h3 className="font-serif text-sm sm:text-base font-bold text-[#dea374] border-b border-[#29221b] pb-1.5 print-black">
                    {categoryGroup.category}
                  </h3>

                  <div className="space-y-1.5">
                    {categoryGroup.items.map((item) => {
                      const itemKey = `${categoryGroup.category}::${item}`;
                      const isChecked = !!masterCheckedMap[itemKey];

                      return (
                        <div
                          key={itemKey}
                          onClick={() => handleToggleMasterItem(itemKey)}
                          className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center gap-2.5 select-none ${
                            isChecked
                              ? 'bg-emerald-950/30 border-emerald-500/40 text-[#a3d9b5]'
                              : 'bg-[#15120f] hover:bg-[#201a14] border-[#29221b] text-white'
                          }`}
                        >
                          <button
                            type="button"
                            className="focus:outline-none flex-shrink-0"
                          >
                            {isChecked ? (
                              <CheckSquare className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <Square className="w-4 h-4 text-[#666]" />
                            )}
                          </button>

                          <span
                            className={`text-xs sm:text-sm leading-snug print-black ${
                              isChecked ? 'line-through opacity-75' : 'font-medium'
                            }`}
                          >
                            {item}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Toast Feedback */}
        {toastMessage && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-emerald-900/90 text-white border border-emerald-400 text-xs font-bold px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 z-50 animate-bounce no-print">
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
};
