import { Book, Bundle } from '../types';

export const APP_SUBHEADING = `The Recipe Vault Co. curates collectible, phone-ready digital recipe card packs and categorized grocery checklists spanning authentic global cuisines, open-fire grilling, and timeless heritage comfort food. Designed for home cooks who want foolproof, step-by-step flavor without the clutter, each 30-recipe series unlocks an instant, printable culinary library.`;

export const INITIAL_BOOKS: Book[] = [
  {
    id: 'vault-vol-01',
    slug: 'authentic-heritage-braai-masterclass',
    title: 'The Authentic Heritage Braai & Open-Flame Collection',
    subtitle: 'Volume 01: Fire, Ember & Heritage',
    tagline: '30 Phone-Ready Recipe Cards + Categorized Grocery Checklists',
    description: 'An editorial, phone-first master collection of South Africa’s most iconic open-flame recipes. Built for effortless one-handed kitchen and fireside cooking with step-by-step foolproof instructions, heat management guides, and categorized grocery checklists.',
    coverImage: '/assets/images/recipe-card-sample.png',
    price: 14.99,
    originalPrice: 29.99,
    recipeCount: 30,
    previewPagesAllowed: 5,
    category: 'Open-Fire & Grilling',
    tags: ['Braai', 'Open Fire', 'Heritage', 'Phone-Ready', 'Grocery Checklist'],
    isFeatured: true,
    pdfFileName: 'The_Recipe_Vault_Vol1_Heritage_Braai.pdf',
    pdfFileSize: '18.4 MB',
    createdAt: '2026-11-20T00:00:00.000Z',
    pages: [
      {
        id: 'p1',
        pageNumber: 1,
        title: 'The Recipe Vault Co.',
        subtitle: 'Volume 01 • Heritage Braai & Open-Flame Mastery',
        category: 'Cover',
        isCover: true,
        image: '/assets/images/recipe-card-sample.png',
        chefTip: 'Designed for effortless single-hand reading at 360x600 phone scale. Flip horizontally like a Kindle or print any recipe card with one tap.',
      },
      {
        id: 'p2',
        pageNumber: 2,
        title: 'Curated Fireside Master Checklist',
        subtitle: 'Categorized One-Stop Grocery & Wood Run',
        category: 'Checklist',
        isChecklist: true,
        groceryChecklist: [
          {
            category: 'Butcher Counter',
            items: ['Coarse Boerewors (85% beef, 15% pork fat)', 'Thick-cut Beef Rump (dry-aged)', 'Karoo Lamb Loin Chops', 'Free-range Spatchcock Chicken', 'Oxtail (center cuts)']
          },
          {
            category: 'Pantry & Spice Locker',
            items: ['Ground Coriander Seeds (toasted)', 'Nutmeg & Ground Allspice', 'Smoked Spanish Paprika', 'Worcestershire Sauce', 'Red Wine Vinegar & Apricot Jam']
          },
          {
            category: 'Fresh Produce & Herbs',
            items: ['Fresh Garlic & Ginger Root', 'Rosemary sprigs & Thyme', 'Sweet Corn in Husks', 'Birdseye Red Chillies', 'White Onions & Vine Tomatoes']
          },
          {
            category: 'Fuel & Fireside Essentials',
            items: ['Dense Indigenous Hardwood (Kameeldoring/Sekelbos)', 'Lump Charcoal for hot coals', 'Long-reach Braai Tongs', 'Cast Iron Potjie No. 3']
          }
        ],
        chefTip: 'Tip: Always light hardwood coals 45 minutes before grilling to achieve clean white glowing embers without acrid resin smoke.'
      },
      {
        id: 'p3',
        pageNumber: 3,
        title: 'Authentic Durban Bunny Chow',
        subtitle: 'Slow-Simmered Mutton Curry in Crusty Loaf',
        category: 'Heritage Mains',
        prepTime: '25 mins',
        cookTime: '65 mins',
        servings: '4 Servings',
        heatLevel: 'Medium-Hot 🔥🔥',
        image: '/assets/images/realistic_culinary_food_photography_of_an_authentic_south_african_durban_bunny.png',
        ingredients: [
          '800g bone-in mutton or lamb shoulder, cubed',
          '1 crusty unsliced white bread loaf (quartered)',
          '2 large brown onions, finely diced',
          '3 tbsp fragrant Durban curry powder + 1 tsp turmeric',
          '2 tbsp ginger-garlic paste',
          '3 cinnamon sticks, 4 green cardamom pods, 1 star anise',
          '3 medium potatoes, halved lengthwise',
          'Fresh coriander and homemade carrot-chilli sambal'
        ],
        instructions: [
          'Temper whole spices in hot oil until fragrant. Brown diced onions with curry powder to form a rich aromatic base.',
          'Add mutton cubes and ginger-garlic paste; sear thoroughly until meat absorbs the dark masala.',
          'Add potatoes, 1 cup water, cover and simmer on gentle coals for 50 minutes until meat is spoon-tender.',
          'Hollow out quarters of crusty loaf, ladle hot curry generously into the cavity, top with pulled bread "virgin" top, and serve with carrot sambal.'
        ],
        chefTip: 'Never use cutlery! Tear off bread from the top and sides to scoop the rich, spiced gravy.'
      },
      {
        id: 'p4',
        pageNumber: 4,
        title: 'Traditional Karoo Boerewors & Chakalaka',
        subtitle: 'Coarse Hand-Ground Sausage with Coriander & Cloves',
        category: 'Open-Flame Beef',
        prepTime: '15 mins',
        cookTime: '20 mins',
        servings: '6 Servings',
        heatLevel: 'Mild-Medium 🔥',
        image: '/assets/images/boerewors.png',
        ingredients: [
          '1kg artisanal coarse-cut beef & pork boerewors coil',
          '2 tbsp toasted whole coriander seeds, roughly crushed',
          '1 tsp ground cloves & allspice',
          '1 can baked beans in rich tomato sauce',
          '2 grated carrots, 1 green pepper sliced, 1 red onion',
          '1 tbsp mild curry powder and 2 grated garlic cloves'
        ],
        instructions: [
          'Prepare gentle white embers—never place boerewors over raging open flames as casings will burst.',
          'Place whole coil on clean, lightly oiled grid. Grill slowly for 8-10 minutes per side, turning with flat tongs.',
          'Simmer onions, peppers, carrots, curry powder, and beans in a cast iron skillet fireside for 15 minutes for spicy chakalaka.',
          'Rest sausage for 4 minutes before carving into generous 10cm links alongside steaming pap or roosterkoek.'
        ],
        chefTip: 'Never pierce the casing with a fork. Puncturing leaks the natural fat and leaves the sausage dry.'
      },
      {
        id: 'p5',
        pageNumber: 5,
        title: 'Cape Malay Spiced Lamb Sosaties',
        subtitle: 'Tender Skewers with Apricot & Bay Leaf Glaze',
        category: 'Heritage Mains',
        prepTime: '30 mins (+ overnight)',
        cookTime: '15 mins',
        servings: '6 Skewers',
        heatLevel: 'Sweet & Spiced 🔥',
        image: '/assets/images/realistic_culinary_food_photography_of_grilled_cape_malay_lamb_sosaties.png',
        ingredients: [
          '900g leg of lamb, trimmed and cut into 2.5cm cubes',
          '15 dried Turkish apricots, soaked in warm water',
          '12 fresh lemon or bay leaves',
          '2 large brown onions, cut into squares',
          'For marinade: 1/3 cup smooth apricot jam, 1/4 cup red wine vinegar, 2 tbsp curry powder, 1 tbsp brown sugar, 2 crushed garlic cloves'
        ],
        instructions: [
          'Simmer marinade ingredients in saucepan for 5 minutes until glossy and smooth; allow to cool.',
          'Coat lamb cubes with marinade and refrigerate overnight (minimum 12 hours) to tenderize.',
          'Thread skewers alternately: lamb cube, onion square, dried apricot, fresh bay leaf, repeating.',
          'Grill over medium coals for 12-14 minutes, basting continuously with residual marinade until edges caramelize.'
        ],
        chefTip: 'Soak wooden bamboo skewers in water for 1 hour beforehand to prevent them scorching over the fire.'
      },
      {
        id: 'p6',
        pageNumber: 6,
        title: 'Three-Legged Cast Iron Oxtail Potjie',
        subtitle: 'Fireside Slow-Braised Oxtail with Red Wine & Root Veg',
        category: 'Fire Potjie',
        prepTime: '30 mins',
        cookTime: '4 hrs',
        servings: '8 Servings',
        heatLevel: 'Rich & Savory 🔥',
        image: '/assets/images/realistic_culinary_food_photography_of_an_authentic_south_african_black_three.png',
        ingredients: [
          '1.8kg oxtail chunks, well trimmed',
          '1 bottle robust dry Pinotage or Cabernet Sauvignon',
          '250g smoked bacon lardons, diced',
          '500g baby potatoes, whole button mushrooms, and baby carrots',
          'Beef bone broth, tomato paste, fresh rosemary, thyme, bay leaves'
        ],
        instructions: [
          'Set cast iron potjie over low coals. Crisp bacon lardons, remove, and brown oxtail in rendered bacon fat until deeply caramelized.',
          'Add red wine, beef stock, garlic, and herbs. Bring to gentle simmer.',
          'Carefully layer root vegetables on top of meat. Crucial rule of Potjie: NEVER stir once layered!',
          'Cover with heavy lid, arrange 3 hot coals underneath and 2 on the lid. Simmer undisturbed for 3.5 hours until meat melts off bone.'
        ],
        chefTip: 'Keep the fire very gentle; a potjie should only emit a slow, rhythmic "plop-plop" bubble sound.'
      },
      {
        id: 'p7',
        pageNumber: 7,
        title: 'Flame-Kissed Spatchcock Peri-Peri Chicken',
        subtitle: 'Charred Crispy Skin with Crushed Birdseye Fire Butter',
        category: 'Heritage Mains',
        prepTime: '20 mins',
        cookTime: '35 mins',
        servings: '4 Servings',
        heatLevel: 'Hot 🔥🔥🔥',
        image: '/assets/images/overhead_flat_lay_realistic_culinary_food_photography_of_a_whole_spatchcock.png',
        ingredients: [
          '1 whole 1.4kg free-range chicken, backbone removed and flattened',
          '6 African Birdseye chillies, finely minced',
          '1/2 cup salted butter, melted with 4 cloves garlic',
          'Juice of 2 fresh lemons + zest',
          '1 tbsp smoked paprika, 1 tsp oregano, sea salt flakes'
        ],
        instructions: [
          'Blend chillies, melted butter, lemon juice, garlic, and paprika into a vibrant marinade.',
          'Score thighs and breast lightly, massage with half the peri-peri marinade.',
          'Clamp chicken in a hinged braai grid. Grill over moderate embers skin-side down first for crispness.',
          'Turn every 5 minutes, basting generously until internal temperature reaches 75°C (165°F).'
        ],
        chefTip: 'Baste only during the first 25 minutes so the outer butter and spice caramelize into a crisp glaze rather than a wet sauce.'
      },
      {
        id: 'p8',
        pageNumber: 8,
        title: 'Farmhouse Charcoal Roosterkoek & Potbrood',
        subtitle: 'Puffy Yeast Bread Baked Directly over Glowing Embers',
        category: 'Artisanal Bakes',
        prepTime: '45 mins (+ rise)',
        cookTime: '20 mins',
        servings: '12 Rolls',
        heatLevel: 'Mild',
        image: '/assets/images/overhead_flat_lay_realistic_culinary_food_photography_of_freshly_baked_and.png',
        ingredients: [
          '1kg unbleached white bread flour',
          '1 packet (10g) instant dry yeast + 1 tbsp sugar',
          '2 tsp sea salt + 2 tbsp melted farm butter',
          '650ml lukewarm water',
          'Finely grated mature sharp cheddar and salted butter for serving'
        ],
        instructions: [
          'Knead flour, yeast, sugar, salt, and water until soft and elastic (10 mins). Proof 45 mins until doubled.',
          'Knock down dough, divide into 12 rectangular pillows, dust heavily with extra flour.',
          'Place directly onto medium-low braai grid. Bake 7-8 minutes per side until hollow when tapped.',
          'Split open steaming hot, slather with farm butter, cheese, or homemade apricot preserve.'
        ],
        chefTip: 'The embers must have a light layer of grey ash; too much heat will char the exterior before the center rises.'
      },
      {
        id: 'p9',
        pageNumber: 9,
        title: 'Braai-Roasted Sweet Corn with Smoked Chilli Butter',
        subtitle: 'Charred In-Husk Corn with Zesty Lime Salt',
        category: 'Sides & Sauces',
        prepTime: '10 mins',
        cookTime: '18 mins',
        servings: '4 Servings',
        heatLevel: 'Mild 🔥',
        image: '/assets/images/close_up_realistic_culinary_food_photography_of_braai_roasted_golden_sweet_corn.png',
        ingredients: [
          '4 fresh whole sweet corn cobs in their green husks',
          '100g butter, softened at room temperature',
          '1 tsp smoked chipotle or paprika',
          '1 fresh lime, cut into wedges',
          'Maldon flaky sea salt'
        ],
        instructions: [
          'Soak whole corn in water for 15 minutes with husks intact to steam the kernels.',
          'Place directly onto hot coals for 12 minutes, rotating frequently until husks are black.',
          'Peel back blackened husks, brush with smoked chilli butter, and grill bare kernels for 3 minutes for blistered caramelization.',
          'Sprinkle flaky sea salt, squeeze fresh lime juice, and serve piping hot.'
        ],
        chefTip: 'Steaming in the wet husk first locks in moisture so the kernels remain plump and juicy.'
      },
      {
        id: 'p10',
        pageNumber: 10,
        title: 'Karoo Rosemary Lamb Loin Chops',
        subtitle: 'Crisp Fat Cap with Crushed Garlic & Fresh Herbs',
        category: 'Heritage Mains',
        prepTime: '10 mins',
        cookTime: '12 mins',
        servings: '4 Servings',
        heatLevel: 'Savory Herb',
        image: '/assets/images/karoo_lamb_chops.png',
        ingredients: [
          '8 thick-cut Karoo lamb loin chops (at least 2.5cm thick)',
          '2 tbsp olive oil',
          '3 cloves garlic, crushed',
          '2 tbsp finely chopped fresh rosemary and thyme',
          'Coarse sea salt and cracked black peppercorns'
        ],
        instructions: [
          'Pat chops dry, rub with oil, garlic, chopped herbs, and generous sea salt.',
          'Stand chops upright on their fat edges over direct medium coals for 4-5 minutes to render the fat cap into a golden crisp.',
          'Lay flat and grill 3-4 minutes per side for a perfect juicy medium-rare pink center.',
          'Rest chops on a warm wooden board for 5 minutes before serving.'
        ],
        chefTip: 'Rendering the fat strip first transforms chewy rind into crunchy, savory crackling.'
      }
    ]
  },
  {
    id: 'vault-vol-02',
    slug: 'timeless-heritage-comfort-food',
    title: 'Timeless Heritage Comfort Food & Hearth Stews',
    subtitle: 'Volume 02: Heirloom Soups, Bakes & Slow Pots',
    tagline: '30 Phone-Ready Recipe Cards + Categorized Grocery Checklists',
    description: 'Generational comfort food crafted for everyday home cooking. Handcrafted curries, slow-braised comforting casseroles, heirloom dumplings, and family dinner party feasts designed for quick one-handed kitchen reading.',
    coverImage: '/assets/images/overhead_flat_lay_realistic_culinary_food_photography_of_authentic_traditional.png',
    price: 14.99,
    originalPrice: 29.99,
    recipeCount: 30,
    previewPagesAllowed: 5,
    category: 'Heritage Comfort',
    tags: ['Heritage', 'Comfort Food', 'Winter Warmers', 'One-Pot Meals'],
    isFeatured: false,
    pdfFileName: 'The_Recipe_Vault_Vol2_Heritage_Comfort.pdf',
    pdfFileSize: '21.2 MB',
    createdAt: '2026-11-20T00:00:00.000Z',
    pages: []
  },
  {
    id: 'vault-vol-03',
    slug: 'authentic-global-street-cuisines',
    title: 'Authentic Global Street & Fire Cuisines',
    subtitle: 'Volume 03: Night Markets, Skewers & Spice Trails',
    tagline: '30 Phone-Ready Recipe Cards + Categorized Grocery Checklists',
    description: 'Bold culinary street food classics from Bangkok night markets, Tokyo yakitori stalls, Oaxaca taco cantinas, and Mediterranean wood ovens adapted for effortless home prep.',
    coverImage: '/assets/images/close_up_realistic_culinary_food_photography_of_crispy_caramelized_grilled_pork.png',
    price: 14.99,
    originalPrice: 29.99,
    recipeCount: 30,
    previewPagesAllowed: 5,
    category: 'Global Cuisines',
    tags: ['Street Food', 'Global Flavors', 'Quick Prep', 'Spices'],
    isFeatured: false,
    pdfFileName: 'The_Recipe_Vault_Vol3_Global_Street.pdf',
    pdfFileSize: '19.8 MB',
    createdAt: '2026-11-20T00:00:00.000Z',
    pages: []
  }
];

export const INITIAL_BUNDLES: Bundle[] = [
  {
    id: 'bundle-master-culinary-library',
    slug: 'complete-culinary-vault-bundle',
    title: 'The Master Culinary Vault Library (All 3 Volumes)',
    description: 'Get instant, lifetime access to all 3 flagship series: Heritage Braai, Timeless Comfort Food, and Global Street Cuisines. Includes 90 phone-ready recipes and all categorized grocery checklists.',
    bookIds: ['vault-vol-01', 'vault-vol-02', 'vault-vol-03'],
    price: 29.99,
    originalPrice: 89.97,
    badge: 'SAVE 67% • BEST VALUE',
    coverImage: '/assets/images/recipe-card-sample.png',
    includesChecklists: true,
    createdAt: '2026-11-20T00:00:00.000Z'
  }
];
