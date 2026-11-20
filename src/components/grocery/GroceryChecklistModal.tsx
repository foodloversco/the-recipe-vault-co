import React, { useState, useEffect } from 'react';
import { Book } from '../../types';
import { groceryStore, MASTER_BRAAI_GROCERY_CATEGORIES } from '../../services/groceryStore';
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
  Share2
} from 'lucide-react';

interface GroceryChecklistModalProps {
  book: Book;
  isOpen: boolean;
  onClose: () => void;
  onSaveToVaultSuccess?: () => void;
}

export const GroceryChecklistModal: React.FC<GroceryChecklistModalProps> = ({
  book,
  isOpen,
  onClose,
  onSaveToVaultSuccess,
}) => {
  const [checkedMap, setCheckedMap] = useState<Record<string, boolean>>(() =>
    groceryStore.getCheckedMap(book.id)
  );
  const [savedInVault, setSavedInVault] = useState<boolean>(() =>
    groceryStore.isListSavedInVault(book.id)
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const unsub = groceryStore.subscribe(() => {
      setCheckedMap(groceryStore.getCheckedMap(book.id));
      setSavedInVault(groceryStore.isListSavedInVault(book.id));
    });
    return unsub;
  }, [book.id]);

  if (!isOpen) return null;

  // Flatten all items to compute total & checked count
  const allItemIds: string[] = [];
  MASTER_BRAAI_GROCERY_CATEGORIES.forEach((cat) => {
    cat.items.forEach((item) => {
      allItemIds.push(`${cat.category}::${item}`);
    });
  });

  const totalCount = allItemIds.length;
  const checkedCount = allItemIds.filter((id) => checkedMap[id]).length;
  const percentComplete = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;

  const handleToggle = (itemKey: string) => {
    groceryStore.toggleItem(book.id, itemKey);
  };

  const handleClear = () => {
    groceryStore.clearAllChecked(book.id);
    showToast('Checklist cleared for next shop!');
  };

  const handleSelectAll = () => {
    groceryStore.selectAll(book.id, allItemIds);
    showToast('All items checked!');
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
            padding: 20px;
          }
          .no-print {
            display: none !important;
          }
          .print-black {
            color: black !important;
          }
        }
      `}</style>

      <div
        id="printable-grocery-list"
        className="bg-[#181512] border border-[#382f25] rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl relative"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[#2d251e] flex items-center justify-between bg-[#1f1b16]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#cf7b3e]/20 border border-[#cf7b3e] flex items-center justify-center text-[#dea374]">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#dea374] bg-[#29221b] px-2 py-0.5 rounded-full border border-[#cf7b3e]/30">
                  IN-STORE SHOPPING CHECKLIST
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold hidden sm:inline">
                  • 30 Recipes Covered
                </span>
              </div>
              <h2 className="font-serif text-lg sm:text-xl font-bold text-white mt-0.5 leading-tight print-black">
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

        {/* In-Store Progress & Actions Bar */}
        <div className="p-3.5 sm:p-4 bg-[#14110e] border-b border-[#2b241c] no-print">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#dbd5ca]">
                <span>In-Store Cart Progress:</span>
                <span className="text-[#dea374] font-bold">
                  {checkedCount} of {totalCount} items ({percentComplete}%)
                </span>
              </div>
              <div className="w-full sm:w-64 bg-[#26201a] h-2 rounded-full mt-1.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#cf7b3e] to-emerald-500 h-full transition-all duration-300"
                  style={{ width: `${percentComplete}%` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Print Button */}
              <button
                type="button"
                onClick={handlePrint}
                className="px-3 py-1.5 rounded-xl bg-[#28211b] hover:bg-[#382e25] text-[#dea374] hover:text-white border border-[#44382d] text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
                title="Print grocery checklist"
              >
                <Printer className="w-3.5 h-3.5 text-[#dea374]" />
                <span>Print List</span>
              </button>

              {/* Save to My Vault */}
              <button
                type="button"
                onClick={handleSaveToVault}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm ${
                  savedInVault
                    ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                    : 'bg-[#cf7b3e] hover:bg-[#b8612b] text-white shadow-md'
                }`}
                title="Save checklist to My Recipes / My Vault"
              >
                <BookmarkCheck className="w-3.5 h-3.5" />
                <span>{savedInVault ? 'Saved in Vault ✓' : 'Save to My Vault'}</span>
              </button>

              {/* Clear button */}
              <button
                type="button"
                onClick={handleClear}
                className="p-1.5 rounded-lg text-[#888] hover:text-rose-400 bg-[#211b16] border border-[#30271e] transition-all"
                title="Clear all checked items"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Categorized Checklist */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          <p className="text-xs text-[#a8a196] leading-relaxed no-print">
            💡 <strong>In-Store Shopping Mode:</strong> Tap any ingredient below as you place it into your shopping cart. Checked items will be saved automatically so you can resume shopping anytime on your phone.
          </p>

          {MASTER_BRAAI_GROCERY_CATEGORIES.map((cat, catIdx) => (
            <div key={catIdx} className="bg-[#1b1713] rounded-2xl p-4 border border-[#332b22] shadow-md">
              <div className="flex items-center justify-between border-b border-[#2d251d] pb-2 mb-3">
                <h3 className="font-serif text-sm sm:text-base font-bold text-[#dea374] print-black flex items-center gap-2">
                  <span>{cat.category}</span>
                </h3>
                <span className="text-[10px] text-[#7d756b] font-mono no-print">
                  {cat.items.filter((item) => checkedMap[`${cat.category}::${item}`]).length} / {cat.items.length}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {cat.items.map((item, itemIdx) => {
                  const itemKey = `${cat.category}::${item}`;
                  const isChecked = !!checkedMap[itemKey];

                  return (
                    <div
                      key={itemIdx}
                      onClick={() => handleToggle(itemKey)}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer select-none flex items-start gap-2.5 ${
                        isChecked
                          ? 'bg-emerald-950/25 border-emerald-500/40 text-[#c8d4c9]'
                          : 'bg-[#151210] hover:bg-[#201b17] border-[#29221b] text-[#dbd5cb]'
                      }`}
                    >
                      <button
                        type="button"
                        className="mt-0.5 flex-shrink-0 transition-transform active:scale-90"
                      >
                        {isChecked ? (
                          <CheckSquare className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
                        ) : (
                          <Square className="w-4 h-4 text-[#7d756a] hover:text-[#dea374]" />
                        )}
                      </button>

                      <span
                        className={`text-xs leading-snug flex-1 ${
                          isChecked ? 'line-through text-emerald-300/80 font-medium' : ''
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

        {/* Modal Footer */}
        <div className="p-3.5 sm:p-4 bg-[#14120f] border-t border-[#29221b] flex items-center justify-between text-xs text-[#8c8477] no-print">
          <div className="flex items-center gap-2">
            <button
              onClick={handleSelectAll}
              className="text-[11px] text-[#dea374] hover:underline"
            >
              Select All
            </button>
            <span>•</span>
            <button
              onClick={handleClear}
              className="text-[11px] text-[#a8a196] hover:text-white hover:underline"
            >
              Clear Checked
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#28211b] hover:bg-[#342b23] text-white font-semibold text-xs border border-[#3b3127] transition-all"
          >
            Close &amp; Keep Shopping
          </button>
        </div>

        {/* Toast Notification */}
        {toastMessage && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-[#cf7b3e] text-white text-xs font-bold px-4 py-2 rounded-full shadow-2xl flex items-center gap-1.5 animate-bounce">
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
};
