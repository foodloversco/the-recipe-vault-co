export interface RecipeGroceryItem {
  id: string;
  name: string;
}

export interface RecipeGroceryList {
  recipeId: string;
  pageNumber: number;
  recipeTitle: string;
  chapter: string;
  servings: string;
  category: string;
  items: string[];
}

export const INITIAL_RECIPE_GROCERY_DATA: RecipeGroceryList[] = [
  // Chapter 01: Braai Meat & Chops
  {
    recipeId: 'rec-06',
    pageNumber: 6,
    recipeTitle: 'Traditional Karoo Boerewors with Roasted Coriander',
    chapter: 'Chapter 01: Braai Meat & Chops',
    category: 'Meat & Chops',
    servings: 'Makes 1.5kg / 6-8 portions',
    items: [
      '1kg Coarse Prime Beef Chuck & 500g Pork Spek (fat)',
      '2 tbsp Whole Coriander Seeds (toasted & cracked)',
      '1 tsp Ground Nutmeg & 1 tsp Allspice',
      '2 tbsp Worcestershire Sauce & 2 tbsp Brown Vinegar',
      '30g Natural Hog Casings (salted)'
    ]
  },
  {
    recipeId: 'rec-07',
    pageNumber: 7,
    recipeTitle: 'Karoo Lamb Loin Chops (Lams-Tjoppies) with Rosemary Butter',
    chapter: 'Chapter 01: Braai Meat & Chops',
    category: 'Meat & Chops',
    servings: '4-6 portions',
    items: [
      '8-10 Thick-Cut Karoo Lamb Loin Chops',
      '100g Salted Farm Butter',
      '3 sprigs Fresh Rosemary & 2 cloves Fresh Garlic',
      'Coarse Sea Salt & Cracked Black Peppercorns',
      '1 Fresh Lemon (for finishing spritz)'
    ]
  },
  {
    recipeId: 'rec-08',
    pageNumber: 8,
    recipeTitle: 'Flame-Grilled Beef T-Bone Steak with Biltong Butter',
    chapter: 'Chapter 01: Braai Meat & Chops',
    category: 'Meat & Chops',
    servings: '4 portions',
    items: [
      '4 Thick-Cut Beef T-Bone Steaks (350g each)',
      '120g Soft Butter & 50g Fine Beef Biltong Powder',
      '1 tbsp Olive Oil',
      '1 clove Minced Garlic & 1 tsp Fresh Thyme',
      'Flaky Sea Salt & Black Pepper'
    ]
  },
  {
    recipeId: 'rec-09',
    pageNumber: 9,
    recipeTitle: 'Sticky Sweet Mustard Pork Loin Ribs',
    chapter: 'Chapter 01: Braai Meat & Chops',
    category: 'Meat & Chops',
    servings: '4 portions',
    items: [
      '1.2kg Pork Loin Ribs (membranes peeled)',
      '3 tbsp Tangy Wholegrain Mustard',
      '3 tbsp Smooth Apricot Jam',
      '2 tbsp Apple Cider Vinegar & 1 tbsp Brown Sugar',
      '1 tsp Smoked Paprika & 1 tsp Garlic Salt'
    ]
  },

  // Chapter 02: Poultry & Skewers
  {
    recipeId: 'rec-10',
    pageNumber: 10,
    recipeTitle: 'Fire-Roasted Peri-Peri Spatchcock Chicken',
    chapter: 'Chapter 02: Poultry & Skewers',
    category: 'Poultry',
    servings: '4-6 portions',
    items: [
      '1 Whole Fresh Free-Range Chicken (butterflied)',
      '6 Fresh Red Birdseye Chillies',
      '4 cloves Fresh Garlic & 1 Lemon (juiced)',
      '3 tbsp Olive Oil & 1 tbsp Red Wine Vinegar',
      '1 tbsp Smoked Paprika & 1 tsp Dried Oregano'
    ]
  },
  {
    recipeId: 'rec-11',
    pageNumber: 11,
    recipeTitle: 'Cape Malay Curried Chicken Sosaties with Dried Apricots',
    chapter: 'Chapter 02: Poultry & Skewers',
    category: 'Poultry',
    servings: '6 portions',
    items: [
      '1kg Skinless Chicken Thigh Fillets (cubed)',
      '200g Soft Dried Turkish Apricots',
      '2 tbsp Cape Malay Curry Powder & 1 tsp Turmeric',
      '3 tbsp Smooth Apricot Jam & 2 tbsp Brown Vinegar',
      '1 large Onion & Bamboo Skewers (soaked in water)'
    ]
  },
  {
    recipeId: 'rec-12',
    pageNumber: 12,
    recipeTitle: 'Sticky Apricot, Peach & Chutney Braai Chicken',
    chapter: 'Chapter 02: Poultry & Skewers',
    category: 'Poultry',
    servings: '4 portions',
    items: [
      '8 Bone-In Chicken Drumsticks & Thighs',
      '4 tbsp Mrs. Ball’s Original Chutney',
      '2 tbsp Smooth Apricot Jam',
      '1 tbsp Worcestershire Sauce & 1 tbsp Butter',
      '1 tsp Ground Ginger & 1 tsp Sea Salt'
    ]
  },
  {
    recipeId: 'rec-13',
    pageNumber: 13,
    recipeTitle: 'Smoky Beer-Can Braai Chicken with Paprika Rub',
    chapter: 'Chapter 02: Poultry & Skewers',
    category: 'Poultry',
    servings: '4 portions',
    items: [
      '1 Whole Plump Chicken (approx. 1.5kg)',
      '1 can (330ml) South African Lager or Castle',
      '2 tbsp Smoked Spanish Paprika & 1 tbsp Brown Sugar',
      '1 tbsp Garlic Powder & 1 tsp Onion Powder',
      '2 tbsp Melted Butter for basting'
    ]
  },

  // Chapter 03: Coastal Seafood
  {
    recipeId: 'rec-14',
    pageNumber: 14,
    recipeTitle: 'Whole Braaied Snoek with Sweet Apricot Butter & Garlic',
    chapter: 'Chapter 03: Coastal Seafood',
    category: 'Seafood',
    servings: '4-6 portions',
    items: [
      '1 Whole Fresh Cape Snoek (butterflied & cleaned)',
      '100g Salted Farm Butter',
      '4 tbsp Smooth Apricot Jam',
      '3 cloves Crushed Garlic & 1 Lemon (juiced)',
      'Coarse Sea Salt & Braai Grid with Foil'
    ]
  },
  {
    recipeId: 'rec-15',
    pageNumber: 15,
    recipeTitle: 'Garlic & Herb Butter Braai Crayfish Tails',
    chapter: 'Chapter 03: Coastal Seafood',
    category: 'Seafood',
    servings: '4 portions',
    items: [
      '4 Fresh West Coast Crayfish (Rock Lobster) Tails',
      '120g Farm Butter',
      '4 cloves Minced Garlic & 2 tbsp Fresh Italian Parsley',
      '1 Fresh Lemon & Pinch of Smoked Paprika',
      'Flaky Sea Salt'
    ]
  },
  {
    recipeId: 'rec-16',
    pageNumber: 16,
    recipeTitle: 'Cape Point Braaied Yellowtail with Lemon Pepper',
    chapter: 'Chapter 03: Coastal Seafood',
    category: 'Seafood',
    servings: '4 portions',
    items: [
      '1 Fresh Yellowtail Fillet (skin-on, approx. 1kg)',
      '3 tbsp Olive Oil & 2 tbsp Lemon Juice',
      '1 tbsp Coarse Black Pepper & 1 tsp Sea Salt',
      'Fresh Dill or Fennel fronds',
      '1 sliced Lemon for grilling bed'
    ]
  },
  {
    recipeId: 'rec-17',
    pageNumber: 17,
    recipeTitle: 'Fire-Charred Peri-Peri Tiger Prawn Skewers',
    chapter: 'Chapter 03: Coastal Seafood',
    category: 'Seafood',
    servings: '4 portions',
    items: [
      '16-20 Jumbo Tiger Prawns (shell-on, deveined)',
      '3 tbsp Peri-Peri Sauce or Oil',
      '3 cloves Garlic (minced) & 1 Lemon',
      '2 tbsp Melted Butter',
      'Coarse Salt & Wooden Skewers'
    ]
  },

  // Chapter 04: Potjiekos Heritage
  {
    recipeId: 'rec-18',
    pageNumber: 18,
    recipeTitle: 'Traditional Slow-Simmered Oxtail Potjie with Red Wine',
    chapter: 'Chapter 04: Potjiekos Heritage',
    category: 'Potjiekos',
    servings: '6-8 portions',
    items: [
      '1.5kg Center-Cut Beef Oxtail',
      '1 bottle (750ml) Dry Full-Bodied Red Wine (Pinotage/Shiraz)',
      '500g Baby Potatoes & 300g Baby Carrots',
      '250g Button Mushrooms & 2 Onions',
      '3 tbsp Tomato Paste & 2 Beef Stock Cubes'
    ]
  },
  {
    recipeId: 'rec-19',
    pageNumber: 19,
    recipeTitle: 'Creamy Lemon-Thyme Chicken & Button Mushroom Potjie',
    chapter: 'Chapter 04: Potjiekos Heritage',
    category: 'Potjiekos',
    servings: '6 portions',
    items: [
      '1kg Bone-In Chicken Thighs & Drumsticks',
      '350g Fresh White Button Mushrooms',
      '250ml Fresh Heavy Cream & 1 Lemon',
      '4 sprigs Fresh Thyme & 2 Onions',
      '2 cloves Garlic & 200ml Chicken Stock'
    ]
  },
  {
    recipeId: 'rec-20',
    pageNumber: 20,
    recipeTitle: 'Karoo Lamb Neck & Green Bean Potjie',
    chapter: 'Chapter 04: Potjiekos Heritage',
    category: 'Potjiekos',
    servings: '6 portions',
    items: [
      '1.2kg Sliced Karoo Lamb Neck',
      '400g Fresh Green Beans (trimmed)',
      '4 Medium Potatoes (quartered)',
      '2 Brown Onions & 2 cloves Garlic',
      '1 cup Lamb or Beef Broth & 1 tsp Ground Coriander'
    ]
  },
  {
    recipeId: 'rec-21',
    pageNumber: 21,
    recipeTitle: 'Rich Beef Shin, Baby Carrot & Stout Potjie',
    chapter: 'Chapter 04: Potjiekos Heritage',
    category: 'Potjiekos',
    servings: '6 portions',
    items: [
      '1.2kg Bone-In Beef Shin (Osso Buco cut)',
      '1 bottle (340ml) Milk Stout or Dark Porter',
      '400g Baby Carrots & 8 Baby Onions / Shallots',
      '2 tbsp Flour & 2 tbsp Butter',
      '2 sprigs Fresh Rosemary & Beef Stock Cube'
    ]
  },

  // Chapter 05: Braai Breads & Bakes
  {
    recipeId: 'rec-22',
    pageNumber: 22,
    recipeTitle: 'Golden Cheese, Onion & Tomato Braaibroodjies',
    chapter: 'Chapter 05: Braai Breads & Bakes',
    category: 'Breads & Bakes',
    servings: '4 portions (8 halves)',
    items: [
      '8 slices White Sandwich Bread',
      '250g Mature Cheddar Cheese (grated or sliced)',
      '2 Ripe Tomatoes (thinly sliced)',
      '1 Medium Brown Onion (thinly sliced into rings)',
      '2 tbsp Mrs. Ball’s Chutney & Salted Butter for outsides'
    ]
  },
  {
    recipeId: 'rec-23',
    pageNumber: 23,
    recipeTitle: 'Grid-Baked Farm Roosterkoek with Salted Butter',
    chapter: 'Chapter 05: Braai Breads & Bakes',
    category: 'Breads & Bakes',
    servings: '8 roosterkoeke',
    items: [
      '500g White Bread Flour',
      '1 packet (10g) Instant Dry Yeast',
      '1 tsp Sugar & 1 tsp Salt',
      '300ml Lukewarm Water & 2 tbsp Oil',
      'Salted Farm Butter & Apricot Jam for serving'
    ]
  },
  {
    recipeId: 'rec-24',
    pageNumber: 24,
    recipeTitle: 'Cheesy Bacon, Sweetcorn & Krummelpap Tart',
    chapter: 'Chapter 05: Braai Breads & Bakes',
    category: 'Breads & Bakes',
    servings: '6-8 portions',
    items: [
      '2 cups Coarse Maize Meal (Braaipap)',
      '200g Smoked Bacon Bits (crisped)',
      '1 can (410g) Creamed Sweetcorn',
      '200g Cheddar Cheese (grated)',
      '250ml Fresh Cream & 1 can Chopped Tomatoes'
    ]
  },
  {
    recipeId: 'rec-25',
    pageNumber: 25,
    recipeTitle: 'Campfire Foil-Wrapped Garlic & Herb Braai Loaf',
    chapter: 'Chapter 05: Braai Breads & Bakes',
    category: 'Breads & Bakes',
    servings: '6 portions',
    items: [
      '1 Fresh Crusty French Loaf / Baguette',
      '120g Soft Butter',
      '4 cloves Minced Garlic',
      '2 tbsp Fresh Parsley & 1 tsp Dried Oregano',
      '100g Grated Mozzarella or Cheddar & Heavy Foil'
    ]
  },

  // Chapter 06: Salads & Sides
  {
    recipeId: 'rec-26',
    pageNumber: 26,
    recipeTitle: 'Cape Traditional Tangy Curried Noodle Salad',
    chapter: 'Chapter 06: Salads & Sides',
    category: 'Salads & Sides',
    servings: '6-8 portions',
    items: [
      '250g Elbow Macaroni or Shell Pasta',
      '1 Green Bell Pepper & 1 Red Onion (diced)',
      '1/2 cup Mayonnaise & 1/4 cup Tomato Sauce',
      '2 tbsp Cape Malay Curry Powder & 2 tbsp Chutney',
      '1/4 cup White Vinegar & 2 tbsp Sugar'
    ]
  },
  {
    recipeId: 'rec-27',
    pageNumber: 27,
    recipeTitle: 'Creamy Condensed Milk Potato Salad with Spring Onion',
    chapter: 'Chapter 06: Salads & Sides',
    category: 'Salads & Sides',
    servings: '6-8 portions',
    items: [
      '1kg Medium Potatoes (boiled, peeled & cubed)',
      '3 Hard-Boiled Eggs (chopped)',
      '1 bunch Fresh Spring Onions (sliced)',
      '1/2 cup Mayonnaise & 2 tbsp Sweetened Condensed Milk',
      '1 tbsp Wholegrain Mustard & Salt to taste'
    ]
  },
  {
    recipeId: 'rec-28',
    pageNumber: 28,
    recipeTitle: 'Traditional Pickled Spiced Beetroot Salad',
    chapter: 'Chapter 06: Salads & Sides',
    category: 'Salads & Sides',
    servings: '6 portions',
    items: [
      '1kg Fresh Beetroot (boiled, peeled & sliced/grated)',
      '1 Medium Brown Onion (finely diced)',
      '1/2 cup Brown Vinegar & 1/4 cup Sugar',
      '1/2 tsp Ground Allspice & 1/4 tsp Ground Cloves',
      'Pinch of Salt'
    ]
  },
  {
    recipeId: 'rec-29',
    pageNumber: 29,
    recipeTitle: 'Crisp Red Cabbage, Apple & Pecan Coleslaw',
    chapter: 'Chapter 06: Salads & Sides',
    category: 'Salads & Sides',
    servings: '6 portions',
    items: [
      '1/2 head Red Cabbage & 1/2 head Green Cabbage (shredded)',
      '2 Crisp Green Granny Smith Apples (julienned)',
      '80g Roasted Pecan Nuts (chopped)',
      '1/2 cup Mayonnaise & 1 tbsp Apple Cider Vinegar',
      '1 tbsp Honey & Salt to taste'
    ]
  },
  {
    recipeId: 'rec-30',
    pageNumber: 30,
    recipeTitle: 'Charred Sweetcorn, Coriander & Danish Feta Salad',
    chapter: 'Chapter 06: Salads & Sides',
    category: 'Salads & Sides',
    servings: '4 portions',
    items: [
      '4 Fresh Sweetcorn Cobs (charred on coals & cut off cob)',
      '150g Danish Feta Cheese (crumbled)',
      '1 cup Cherry Tomatoes (halved)',
      '1 bunch Fresh Coriander (chopped)',
      '2 tbsp Olive Oil & 1 Lime (juiced)'
    ]
  },

  // Chapter 07: Condiments & Relishes
  {
    recipeId: 'rec-31',
    pageNumber: 31,
    recipeTitle: 'Spicy Chakalaka with Baked Beans & Bell Peppers',
    chapter: 'Chapter 07: Condiments & Relishes',
    category: 'Condiments',
    servings: '6 portions',
    items: [
      '1 can (400g) Baked Beans in Tomato Sauce',
      '2 Carrots (coarsely grated) & 1 Onion (diced)',
      '1 Green Bell Pepper & 1 Red Bell Pepper (diced)',
      '2 Fresh Birdseye Chillies & 2 cloves Garlic',
      '1 tbsp Mild Curry Powder & 2 tbsp Oil'
    ]
  },
  {
    recipeId: 'rec-32',
    pageNumber: 32,
    recipeTitle: 'Cape Malay Apricot & Sultana Blatjang',
    chapter: 'Chapter 07: Condiments & Relishes',
    category: 'Condiments',
    servings: 'Makes 2 jars',
    items: [
      '250g Dried Apricots & 100g Sultanas',
      '2 Onions (minced) & 3 cloves Garlic',
      '1 cup Brown Vinegar & 1 cup Brown Sugar',
      '1 tsp Cayenne Pepper & 1 tsp Mustard Powder',
      '1 tsp Salt'
    ]
  },
  {
    recipeId: 'rec-33',
    pageNumber: 33,
    recipeTitle: 'Pickled Pink Radish & Cucumber Sambal',
    chapter: 'Chapter 07: Condiments & Relishes',
    category: 'Condiments',
    servings: '4 portions',
    items: [
      '1 bunch Fresh Pink Radishes (thinly sliced)',
      '1 English Cucumber (thinly sliced into half moons)',
      '1/4 cup White Vinegar & 1 tbsp Sugar',
      '1 Green Chilli (finely sliced)',
      'Pinch of Salt & Fresh Mint leaves'
    ]
  },

  // Chapter 08: Sweet Fireside Desserts
  {
    recipeId: 'rec-34',
    pageNumber: 34,
    recipeTitle: 'Traditional South African Cinnamon Melktert',
    chapter: 'Chapter 08: Sweet Fireside Desserts',
    category: 'Desserts',
    servings: '8 slices',
    items: [
      '1 roll Ready-Rolled Sweet Shortcrust Pastry (or 200g Tennis biscuits + butter)',
      '1L Fresh Whole Milk & 2 tbsp Butter',
      '1/2 cup Sugar & 3 tbsp Flour & 3 tbsp Cornstarch (Maizena)',
      '3 Eggs (separated)',
      '1 Cinnamon Stick & Ground Ceylon Cinnamon (for dusting)'
    ]
  },
  {
    recipeId: 'rec-35',
    pageNumber: 35,
    recipeTitle: 'Warm Caramelized Malva Pudding with Custard',
    chapter: 'Chapter 08: Sweet Fireside Desserts',
    category: 'Desserts',
    servings: '6-8 portions',
    items: [
      '1 cup Sugar & 2 Large Eggs',
      '1 tbsp Smooth Apricot Jam',
      '1 cup Cake Flour & 1 tsp Bicarbonate of Soda',
      'Sauce: 100g Butter, 1/2 cup Cream, 1/2 cup Sugar, 1/3 cup Water',
      'Warm Vanilla Custard (for serving)'
    ]
  }
];
