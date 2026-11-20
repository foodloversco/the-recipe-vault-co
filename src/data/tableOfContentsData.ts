export interface ChapterTOCItem {
  chapterNumber?: number;
  chapterTitle: string;
  recipeTitle: string;
  pageNumber: number;
  category: string;
  icon: string;
}

export const SOUTH_AFRICA_BRAAI_TOC: ChapterTOCItem[] = [
  { chapterTitle: 'Front Matter', recipeTitle: 'Official 9:16 Vertical Front Cover', pageNumber: 1, category: 'Cover', icon: '📖' },
  { chapterTitle: 'Introduction', recipeTitle: 'The Heritage Braai Manifesto & Single-Hand Flip Guide', pageNumber: 2, category: 'Intro', icon: '🇿🇦' },
  { chapterTitle: 'Table of Contents', recipeTitle: 'Complete Series 1 Recipe & Chapter Directory', pageNumber: 3, category: 'Directory', icon: '📋' },
  { chapterTitle: 'Master Guides', recipeTitle: 'Indigenous Hardwood, Coal & Ember Heat Chart', pageNumber: 4, category: 'Guides', icon: '🪵' },
  { chapterTitle: 'Master Guides', recipeTitle: 'Essential Braai Spices, Marinades & Basting Chemistry', pageNumber: 5, category: 'Guides', icon: '🧂' },
  { chapterTitle: 'Chapter 01: Braai Meat & Chops', recipeTitle: 'Traditional Karoo Boerewors with Roasted Coriander', pageNumber: 6, category: 'Meat & Chops', icon: '🔥' },
  { chapterTitle: 'Chapter 01: Braai Meat & Chops', recipeTitle: 'Karoo Lamb Loin Chops (Lams-Tjoppies) with Rosemary Butter', pageNumber: 7, category: 'Meat & Chops', icon: '🥩' },
  { chapterTitle: 'Chapter 01: Braai Meat & Chops', recipeTitle: 'Flame-Grilled Beef T-Bone Steak with Biltong Butter', pageNumber: 8, category: 'Meat & Chops', icon: '🥩' },
  { chapterTitle: 'Chapter 01: Braai Meat & Chops', recipeTitle: 'Sticky Sweet Mustard Pork Loin Ribs', pageNumber: 9, category: 'Meat & Chops', icon: '🍖' },
  { chapterTitle: 'Chapter 02: Poultry & Skewers', recipeTitle: 'Fire-Roasted Peri-Peri Spatchcock Chicken', pageNumber: 10, category: 'Poultry', icon: '🍗' },
  { chapterTitle: 'Chapter 02: Poultry & Skewers', recipeTitle: 'Cape Malay Curried Chicken Sosaties with Dried Apricots', pageNumber: 11, category: 'Poultry', icon: '🍢' },
  { chapterTitle: 'Chapter 02: Poultry & Skewers', recipeTitle: 'Sticky Apricot, Peach & Chutney Braai Chicken', pageNumber: 12, category: 'Poultry', icon: '🍗' },
  { chapterTitle: 'Chapter 02: Poultry & Skewers', recipeTitle: 'Smoky Beer-Can Braai Chicken with Paprika Rub', pageNumber: 13, category: 'Poultry', icon: '🍺' },
  { chapterTitle: 'Chapter 03: Coastal Seafood', recipeTitle: 'Whole Braaied Snoek with Sweet Apricot Butter & Garlic', pageNumber: 14, category: 'Seafood', icon: '🐟' },
  { chapterTitle: 'Chapter 03: Coastal Seafood', recipeTitle: 'Garlic & Herb Butter Braai Crayfish Tails', pageNumber: 15, category: 'Seafood', icon: '🦞' },
  { chapterTitle: 'Chapter 03: Coastal Seafood', recipeTitle: 'Cape Point Braaied Yellowtail with Lemon Pepper', pageNumber: 16, category: 'Seafood', icon: '🐟' },
  { chapterTitle: 'Chapter 03: Coastal Seafood', recipeTitle: 'Fire-Charred Peri-Peri Tiger Prawn Skewers', pageNumber: 17, category: 'Seafood', icon: '🦐' },
  { chapterTitle: 'Chapter 04: Potjiekos Heritage', recipeTitle: 'Traditional Slow-Simmered Oxtail Potjie with Red Wine', pageNumber: 18, category: 'Potjiekos', icon: '🍲' },
  { chapterTitle: 'Chapter 04: Potjiekos Heritage', recipeTitle: 'Creamy Lemon-Thyme Chicken & Button Mushroom Potjie', pageNumber: 19, category: 'Potjiekos', icon: '🍲' },
  { chapterTitle: 'Chapter 04: Potjiekos Heritage', recipeTitle: 'Karoo Lamb Neck & Green Bean Potjie', pageNumber: 20, category: 'Potjiekos', icon: '🍲' },
  { chapterTitle: 'Chapter 04: Potjiekos Heritage', recipeTitle: 'Rich Beef Shin, Baby Carrot & Stout Potjie', pageNumber: 21, category: 'Potjiekos', icon: '🍲' },
  { chapterTitle: 'Chapter 05: Braai Breads & Bakes', recipeTitle: 'Golden Cheese, Onion & Tomato Braaibroodjies', pageNumber: 22, category: 'Breads & Bakes', icon: '🥪' },
  { chapterTitle: 'Chapter 05: Braai Breads & Bakes', recipeTitle: 'Grid-Baked Farm Roosterkoek with Salted Butter', pageNumber: 23, category: 'Breads & Bakes', icon: '🥖' },
  { chapterTitle: 'Chapter 05: Braai Breads & Bakes', recipeTitle: 'Cheesy Bacon, Sweetcorn & Krummelpap Tart', pageNumber: 24, category: 'Breads & Bakes', icon: '🥧' },
  { chapterTitle: 'Chapter 05: Braai Breads & Bakes', recipeTitle: 'Campfire Foil-Wrapped Garlic & Herb Braai Loaf', pageNumber: 25, category: 'Breads & Bakes', icon: '🍞' },
  { chapterTitle: 'Chapter 06: Salads & Sides', recipeTitle: 'Cape Traditional Tangy Curried Noodle Salad', pageNumber: 26, category: 'Salads & Sides', icon: '🥗' },
  { chapterTitle: 'Chapter 06: Salads & Sides', recipeTitle: 'Creamy Condensed Milk Potato Salad with Spring Onion', pageNumber: 27, category: 'Salads & Sides', icon: '🥔' },
  { chapterTitle: 'Chapter 06: Salads & Sides', recipeTitle: 'Traditional Pickled Spiced Beetroot Salad', pageNumber: 28, category: 'Salads & Sides', icon: '🥗' },
  { chapterTitle: 'Chapter 06: Salads & Sides', recipeTitle: 'Crisp Red Cabbage, Apple & Pecan Coleslaw', pageNumber: 29, category: 'Salads & Sides', icon: '🥗' },
  { chapterTitle: 'Chapter 06: Salads & Sides', recipeTitle: 'Charred Sweetcorn, Coriander & Danish Feta Salad', pageNumber: 30, category: 'Salads & Sides', icon: '🌽' },
  { chapterTitle: 'Chapter 07: Condiments & Relishes', recipeTitle: 'Spicy Chakalaka with Baked Beans & Bell Peppers', pageNumber: 31, category: 'Condiments', icon: '🌶️' },
  { chapterTitle: 'Chapter 07: Condiments & Relishes', recipeTitle: 'Cape Malay Apricot & Sultana Blatjang', pageNumber: 32, category: 'Condiments', icon: '🍯' },
  { chapterTitle: 'Chapter 07: Condiments & Relishes', recipeTitle: 'Pickled Pink Radish & Cucumber Sambal', pageNumber: 33, category: 'Condiments', icon: '🥒' },
  { chapterTitle: 'Chapter 08: Sweet Fireside Desserts', recipeTitle: 'Traditional South African Cinnamon Melktert', pageNumber: 34, category: 'Desserts', icon: '🥧' },
  { chapterTitle: 'Chapter 08: Sweet Fireside Desserts', recipeTitle: 'Warm Caramelized Malva Pudding with Custard', pageNumber: 35, category: 'Desserts', icon: '🍮' },
  { chapterTitle: 'Checklists', recipeTitle: 'Complete One-Stop Braai & Heritage Grocery Run', pageNumber: 36, category: 'Grocery Checklist', icon: '🛒' },
];

export function getBookTableOfContents(slug: string): ChapterTOCItem[] {
  // If book has custom TOC, return it; otherwise return default rich TOC
  return SOUTH_AFRICA_BRAAI_TOC;
}
