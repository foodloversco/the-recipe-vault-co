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
  }
];

// Combos/bundles are created strictly through the Admin Portal
export const INITIAL_BUNDLES: Bundle[] = [];
