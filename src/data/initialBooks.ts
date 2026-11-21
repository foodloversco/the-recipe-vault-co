import { Book, Bundle } from '../types';

export const APP_SUBHEADING = `The Recipe Vault Co. curates collectible, phone-ready digital recipe card packs and categorized grocery checklists spanning authentic global cuisines, open-fire grilling, and timeless heritage comfort food. Designed for home cooks who want foolproof, step-by-step flavor without the clutter, each 30-recipe series unlocks an instant, printable culinary library.`;

export const INITIAL_BOOKS: Book[] = [
  {
    id: 'vault-vol-01',
    slug: 'south-africa-braai-heritage',
    title: 'South African Braai & Heritage Series 1',
    subtitle: 'Volume 01: Fire, Ember & Heritage',
    tagline: 'Unlock the Complete 108-Page South African Braai & Heritage: Series 1 Digital Collection for Just $1!',
    description: `Stop losing recipes in your saved videos or guessing measurements at the coals. Get all 30 iconic South African braai & heritage recipes, 30 aisle-by-aisle grocery checklists, 30 full-page dish photos, and 5 essential wood, coal, spice & temperature guides in one phone-ready vertical PDF.

Inside Series 1 (Chapters 01–08):
• 🔥 Braai Meat & Chops: Traditional Boerewors, Karoo Lamb Chops (Lams-Tjoppies), Flame-Grilled Beef T-Bone Steak, Sticky Sweet Mustard Pork Ribs
• 🍗 Poultry & Skewers: Peri-Peri Spatchcock Chicken, Cape Malay Curried Chicken Sosaties, Sticky Apricot & Chutney Chicken, Smoky Beer-Can Braai Chicken
• 🦞 Seafood Classics: Whole Braaied Snoek with Apricot Butter, Garlic Butter Braai Crayfish Tails, Braaied Cape Yellowtail, Fire-Roasted Peri-Peri Tiger Prawns
• 🍲 Potjiekos Heritage: Traditional Oxtail Potjie, Creamy Chicken & Mushroom Potjie, Karoo Lamb Potjie, Rich Beef & Red Wine Potjie
• 🍞 Braai Breads, Salads & Condiments: Cheese & Onion Braaibroodjies, Grid Roosterkoek, Cheesy Bacon & Sweetcorn Pap Tart, Campfire Garlic Braai Loaf, Curried Noodle Salad, Creamy Potato Salad, Beetroot Salad, Apple & Pecan Coleslaw, Charred Sweetcorn & Feta Salad, Spicy Chakalaka, Cape Malay Apricot Blatjang, Pickled Radish Sambal
• 🍮 Sweet Desserts: Traditional South African Melktert & Warm Caramelized Malva Pudding

Tap below to unlock all 30 recipes + grocery lists instantly for $1!`,
    coverImage: '/assets/images/south-africa-braai-cover.jpg',
    price: 1.00,
    originalPrice: 12.99,
    soldCount: 0,
    likesCount: 0,
    recipeCount: 30,
    previewPagesAllowed: 5,
    category: 'Open-Fire & Grilling',
    tags: ['Braai', 'Open Fire', 'Heritage', 'Phone-Ready', 'Grocery Checklist'],
    isFeatured: true,
    pdfFileUrl: '/assets/books/South_African_Braai_Heritage_Series_1.pdf',
    pdfFileName: 'South_African_Braai_Heritage_Series_1.pdf',
    pdfFileSize: '14.4 MB',
    createdAt: '2026-11-20T00:00:00.000Z',
    pages: [
      {
        id: 'p1',
        pageNumber: 1,
        title: 'South African Braai & Heritage Series 1',
        subtitle: '30 Iconic Traditional Recipes • From the Coals to the Table',
        category: 'Cover',
        isCover: true,
        image: '/assets/images/south-africa-braai-cover.jpg',
        chefTip: 'Designed for effortless single-hand reading at 9:16 phone scale. Flip horizontally like a Kindle or print any recipe card with one tap.',
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
        image: '/assets/images/culinary_photography_of_traditional_south_african_boerewors_coiled_on_a_braa.png',
        ingredients: [
          '1kg coarse Karoo boerewors (beef and pork with roasted coriander and allspice)',
          '2 medium onions, sliced',
          '2 medium carrots, grated coarsely',
          '1 green bell pepper, diced',
          '1 can (400g) baked beans in tomato sauce',
          '2 fresh red chillies, finely chopped',
          '2 tbsp mild curry paste + 1 tsp ground thyme',
          '2 tbsp sunflower oil for sauteing'
        ],
        instructions: [
          'Prepare hot white coals. Place boerewors coil onto clean grill grid 10cm above coals. Braai for 10-12 mins per side; do not pierce casing to preserve rich juices.',
          'In a medium skillet or potjie, heat oil and sauté sliced onions, green pepper, and chillies with curry paste until softened and golden.',
          'Fold in grated carrots and cook for 3 minutes. Stir in baked beans, season with salt and black pepper, and simmer gently for 8-10 minutes until thick and glossy.',
          'Serve boerewors piping hot straight from the embers accompanied by warm chakalaka and pap or crusty farm bread.'
        ],
        chefTip: 'Never pierce boerewors skin with a fork while grilling! Let the rich spiced juices stay inside the casing for tender succulence.'
      }
    ]
  },
  {
    id: 'vault-vol-02-series-2',
    slug: 'south-african-braai-heritage-series-2',
    title: 'South African Braai & Heritage Series 2',
    subtitle: 'Volume 02: Fireside Feasts, Potjiekos & Coastal Smoke',
    tagline: 'Unlock the Complete 105-Page South African Braai & Heritage: Series 2 Digital Collection for Just $1.99!',
    description: `Level up your fireside hosting with Volume 2 of the definitive South African culinary collection. 30 brand-new iconic recipes, master butcher guides, and fireside grocery runs tailored for effortless phone reading.

Inside Series 2 (Chapters 01–08):
• 🔥 Master Fire & Smoked Meats: Smoked Pork Belly with Rooibos Glaze, Dry-Rubbed Beef Brisket, Herb Butter Ribeye Steak, Spiced Lamb Ribs (Skaapribbetjie)
• 🍗 Skewers & Savory Birds: Karoo Game & Venison Skewers, Lemon-Herb Charcoal Chicken Wings, Spiced Duck Breast on the Coals, Sticky Sweet-Chilli Drumsticks
• 🦞 Coastal Catches & Shellfish: Butterflied Garlic Butter Langoustines, Cast Iron Mussel Pot with White Wine & Cream, Charred Calamari Steaks, Smoked Snoek Pate
• 🍲 Slow-Simmered Potjies: Biltong & Blue Cheese Potjie, Slow-Cooked Lamb Shank & Rosemary Potjie, Hearty Venison & Prune Potjie, Spicy Seafood Potjie
• 🍞 Artisan Breads, Pot Bakes & Sides: Biltong & Cheddar Potbrood, Sweetcorn Fritters with Hot Honey, Charred Asparagus & Pancetta Salad, Three-Bean Sambal, Tangy Mustard Basting Glaze
• 🍮 Fireside Sweets: Braaied Marshmallow & Peppermint Crisp Tart, Amarula Cast-Iron Pudding, Golden Koeksister Bites

Tap below to unlock all 30 recipes + grocery lists instantly for $1.99!`,
    coverImage: '/assets/images/south-africa-braai-series-2-cover.jpg',
    price: 1.99,
    originalPrice: 14.99,
    soldCount: 48,
    likesCount: 0,
    recipeCount: 30,
    previewPagesAllowed: 5,
    category: 'Open-Fire & Grilling',
    tags: ['Braai', 'Series 2', 'Open Fire', 'Heritage', 'Phone-Ready', 'Grocery Checklist'],
    isFeatured: false,
    pdfFileUrl: '/assets/books/South_African_Braai_Heritage_Series_2.pdf',
    pdfFileName: 'South_African_Braai_Heritage_Series_2.pdf',
    pdfFileSize: '15.4 MB',
    createdAt: '2026-11-20T18:00:00.000Z',
    pages: [
      {
        id: 'p2-1',
        pageNumber: 1,
        title: 'South African Braai & Heritage Series 2',
        subtitle: '30 Brand-New Iconic Recipes • From the Coals to the Table',
        category: 'Cover',
        isCover: true,
        image: '/assets/images/south-africa-braai-series-2-cover.jpg',
        chefTip: 'Designed for effortless single-hand reading at 9:16 phone scale. Flip horizontally like a Kindle or print any recipe card with one tap.',
      },
      {
        id: 'p2-2',
        pageNumber: 2,
        title: 'Curated Fireside Master Checklist Vol. 2',
        subtitle: 'Categorized One-Stop Grocery & Wood Run',
        category: 'Checklist',
        isChecklist: true,
        groceryChecklist: [
          {
            category: 'Butcher Counter',
            items: ['Crispy Pork Belly strips', 'Free-range Lamb Shanks', 'Dry-rubbed Beef Brisket', 'Butterflied Tiger Prawns / Langoustines']
          },
          {
            category: 'Pantry & Spice Locker',
            items: ['Rooibos Tea Bags for glaze', 'Coarse Sea Salt & Smoked Paprika', 'Amarula Cream Liqueur', 'Biltong slices & Blue Cheese wheel']
          },
          {
            category: 'Fresh Produce & Herbs',
            items: ['Fresh Rosemary & Thyme bunches', 'Sweet Baby Leeks & Red Onions', 'Garlic cloves & Green Limes', 'Fresh Coriander & Peppermint herbs']
          },
          {
            category: 'Fuel & Fireside Essentials',
            items: ['Dense Indigenous Sekelbos Hardwood', 'Cast Iron Potjie Flat-Bottom', 'Heavy-duty Grill Brush & Tongs']
          }
        ],
        chefTip: 'Tip: Slow coals with sekelbos hardwood create deep caramelization and lasting embers for slow-cooked potjies and roasts.'
      },
      {
        id: 'p2-3',
        pageNumber: 3,
        title: 'Rooibos Glazed Pork Belly on the Coals',
        subtitle: 'Slow-Smoked Crispy Crackling with Herbal Honey Sweetness',
        category: 'Heritage Mains',
        prepTime: '20 mins',
        cookTime: '90 mins',
        servings: '6 Servings',
        heatLevel: 'Mild 🔥',
        image: '/assets/images/close_up_realistic_culinary_food_photography_of_crispy_caramelized_grilled_pork.png',
        ingredients: [
          '1.5kg bone-in pork belly, skin scored in diamond grid',
          '3 bags strong rooibos tea brewed in 1 cup hot water',
          '3 tbsp pure wild honey',
          '2 tbsp Dijon mustard',
          '1 tbsp apple cider vinegar',
          'Coarse sea salt flakes'
        ],
        instructions: [
          'Dry the scored pork skin thoroughly and rub generously with coarse sea salt flakes.',
          'Set up indirect medium coals. Place pork belly skin-side up and braai slowly for 70 minutes.',
          'Simmer rooibos tea, honey, Dijon mustard, and apple cider vinegar until reduced to a glossy basting syrup.',
          'Baste meat sides generously during the final 20 minutes while pushing embers closer to crisp the crackling.'
        ],
        chefTip: 'Ensure pork skin is bone-dry before salting to guarantee shatteringly crisp crackling!'
      },
      {
        id: 'p2-4',
        pageNumber: 4,
        title: 'Cast-Iron Biltong & Blue Cheese Potjie',
        subtitle: 'Rich Creamy Slow-Simmered Comfort Food',
        category: 'Fire Potjie',
        prepTime: '15 mins',
        cookTime: '45 mins',
        servings: '6 Servings',
        heatLevel: 'Mild 🔥',
        image: '/assets/images/realistic_culinary_food_photography_of_an_authentic_south_african_black_three.png',
        ingredients: [
          '250g moist beef biltong, thinly sliced',
          '150g mature blue cheese, crumbled',
          '250g button mushrooms, sliced',
          '1 large onion & 3 cloves garlic, minced',
          '250ml fresh double thick cream',
          'Fresh tagliatelle or warm potbrood to serve'
        ],
        instructions: [
          'In a heated cast iron potjie over gentle coals, sauté onion and garlic in butter until soft.',
          'Add sliced mushrooms and cook until golden brown.',
          'Pour in double cream, fold in crumbled blue cheese, and simmer gently until sauce is velvety and smooth.',
          'Remove from direct coals and fold in thin biltong slices right before serving so biltong stays tender and juicy.'
        ],
        chefTip: 'Never boil the biltong! Fold it into the hot cream sauce just before serving to preserve its texture and spice.'
      }
    ]
  }
];

// Combos/bundles are created strictly through the Admin Portal
export const INITIAL_BUNDLES: Bundle[] = [];
