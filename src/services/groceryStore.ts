import { Book } from '../types';

export interface GroceryItem {
  id: string;
  name: string;
  category: string;
  checked: boolean;
}

export interface GroceryCategoryGroup {
  category: string;
  items: GroceryItem[];
}

export interface SavedGroceryList {
  bookId: string;
  bookTitle: string;
  bookSlug: string;
  savedAt: string;
  items: Record<string, boolean>; // itemId -> checked status
}

const CHECKED_STORAGE_PREFIX = 'rv_grocery_checked_';
const SAVED_LISTS_STORAGE_KEY = 'rv_saved_grocery_lists';

export const MASTER_BRAAI_GROCERY_CATEGORIES: { category: string; items: string[] }[] = [
  {
    category: 'Butchery & Meat Counter',
    items: [
      '1.5kg Coarse Karoo Boerewors (85% beef, 15% pork fat with roasted coriander)',
      '1kg Karoo Lamb Loin Chops (Lams-Tjoppies)',
      '4 Thick-Cut Beef T-Bone Steaks (350g each)',
      '1.2kg Center-Cut Oxtail for Potjie',
      '1 Whole Free-Range Spatchcock Chicken',
      '1kg Sticky Pork Loin Ribs',
      '4 Fresh Braai Crayfish Tails (or Tiger Prawns)',
      '1 Whole Fresh Braaied Snoek (cleaned & butterflied)'
    ]
  },
  {
    category: 'Fresh Produce & Herbs',
    items: [
      '3 large Brown Onions & 1 bunch Spring Onions',
      '2 heads Fresh Garlic & 1 large Ginger Root',
      'Fresh Rosemary sprigs, Thyme & Italian Parsley',
      '1 bunch Fresh Coriander (Dhania)',
      '4 Sweet Corn Cobs (in husks)',
      '6 Fresh Red Birdseye Chillies',
      '2kg Medium Potatoes (for potjie & creamy salad)',
      '1 head Red Cabbage & 2 crisp Green Apples',
      '1kg Sweet Carrots & 1kg Fresh Beetroot',
      '4 Vine-Ripened Tomatoes & 4 Lemons'
    ]
  },
  {
    category: 'Pantry, Spices & Basting Locker',
    items: [
      'Whole Coriander Seeds (toasted & freshly ground)',
      'Nutmeg, Ground Allspice & Smoked Paprika',
      'Cape Malay Curry Powder & Turmeric',
      'Worcestershire Sauce & Red Wine Vinegar',
      'Smooth Apricot Jam & Mrs. Ball’s Original Chutney',
      '2 cans (400g) Baked Beans in Tomato Sauce',
      '1 bottle Dry Full-Bodied Red Wine (for Oxtail Potjie)',
      'Coarse Sea Salt & Fresh Black Peppercorns',
      'Sunflower Oil & Olive Oil'
    ]
  },
  {
    category: 'Dairy, Cheese & Bakery',
    items: [
      '500g Salted Farm Butter',
      '400g Sharp Mature Cheddar Cheese (grated for braaibroodjies)',
      '200g Danish Feta Cheese',
      '1 can (385g) Sweetened Condensed Milk',
      '250ml Fresh Heavy Cream & 1L Fresh Milk',
      '1 loaf Soft White Bread (for authentic braaibroodjies)',
      '1kg Coarse Maize Meal / Braaipap',
      '1kg Stone-Ground Bread Flour & Instant Dry Yeast (for roosterkoek)'
    ]
  },
  {
    category: 'Fireside Fuel & Essentials',
    items: [
      '2 bags Indigenous Kameeldoring or Sekelbos Hardwood',
      '1 bag Lump Charcoal for ember bed',
      'Natural Firelighters & Long Braai Matches',
      'Heavy-Duty Aluminum Foil',
      'Long-Reach Stainless Steel Braai Tongs & Cast-Iron Potjie No. 3'
    ]
  }
];

class GroceryStore {
  private listeners: Set<() => void> = new Set();

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((l) => {
      try {
        l();
      } catch (err) {
        console.error('GroceryStore notify error:', err);
      }
    });
  }

  public getCheckedMap(bookId: string): Record<string, boolean> {
    try {
      const stored = localStorage.getItem(`${CHECKED_STORAGE_PREFIX}${bookId}`);
      if (stored) return JSON.parse(stored);
    } catch {}
    return {};
  }

  public isItemChecked(bookId: string, itemId: string): boolean {
    const map = this.getCheckedMap(bookId);
    return !!map[itemId];
  }

  public toggleItem(bookId: string, itemId: string): boolean {
    const map = this.getCheckedMap(bookId);
    const newStatus = !map[itemId];
    map[itemId] = newStatus;
    try {
      localStorage.setItem(`${CHECKED_STORAGE_PREFIX}${bookId}`, JSON.stringify(map));
    } catch {}
    this.notify();
    return newStatus;
  }

  public clearAllChecked(bookId: string): void {
    try {
      localStorage.removeItem(`${CHECKED_STORAGE_PREFIX}${bookId}`);
    } catch {}
    this.notify();
  }

  public selectAll(bookId: string, allItemIds: string[]): void {
    const map: Record<string, boolean> = {};
    allItemIds.forEach((id) => (map[id] = true));
    try {
      localStorage.setItem(`${CHECKED_STORAGE_PREFIX}${bookId}`, JSON.stringify(map));
    } catch {}
    this.notify();
  }

  public getSavedLists(): SavedGroceryList[] {
    try {
      const stored = localStorage.getItem(SAVED_LISTS_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return [];
  }

  public isListSavedInVault(bookId: string): boolean {
    const lists = this.getSavedLists();
    return lists.some((l) => l.bookId === bookId);
  }

  public saveListToVault(book: Book): void {
    const lists = this.getSavedLists();
    const existingIdx = lists.findIndex((l) => l.bookId === book.id);
    const checkedMap = this.getCheckedMap(book.id);

    const payload: SavedGroceryList = {
      bookId: book.id,
      bookTitle: book.title,
      bookSlug: book.slug,
      savedAt: new Date().toISOString(),
      items: checkedMap,
    };

    if (existingIdx >= 0) {
      lists[existingIdx] = payload;
    } else {
      lists.unshift(payload);
    }

    try {
      localStorage.setItem(SAVED_LISTS_STORAGE_KEY, JSON.stringify(lists));
    } catch {}
    this.notify();
  }

  public removeListFromVault(bookId: string): void {
    const lists = this.getSavedLists().filter((l) => l.bookId !== bookId);
    try {
      localStorage.setItem(SAVED_LISTS_STORAGE_KEY, JSON.stringify(lists));
    } catch {}
    this.notify();
  }

  public printList(bookTitle: string): void {
    window.print();
  }
}

export const groceryStore = new GroceryStore();
