#!/usr/bin/env python3
"""
The Recipe Vault Co. - Pinterest Growth Optimization Script
1. Generates subtle luxury cream & gold "Click Trigger" badges on 50% of pin images.
2. Rewrites all 90 pin descriptions using the high-converting "Open-Loop" strategy.
3. Produces updated pinterest_bulk_upload.csv, pinterest_bulk_upload_immediate.csv, and pinterest_pins_master.csv.
"""

import os
import csv
import re
from PIL import Image, ImageDraw, ImageFont

# Dictionary mapping each recipe title / keyword to its specific Open-Loop Hook and Withheld Secret
RECIPE_OPEN_LOOPS = {
    "Prego Chicken": {
        "teaser": "Stop serving dry, rubbery prego chicken! The secret to the juiciest South African Prego Roll is pounding the breast thin, flash-searing over smoking embers, and drowning it in warm peri-peri garlic butter on a toasted ciabatta.",
        "withheld": "the exact 4-ingredient lemon-garlic marinade ratio and 90-second coal sear timing that locks in moisture without charring",
        "keywords": "#PregoRoll #SouthAfricanBraai #PeriPeri #ChickenBurger #BraaiRecipes #StreetFood #SummerGrilling"
    },
    "Spatchcock Anatomy": {
        "teaser": "Master poultry butchery before your meat hits the fire! 3-panel visual masterclass: shear clean along the backbone, pop the hip ball-and-socket joints, and carve on a 45° bias.",
        "withheld": "the butcher's anatomical bone-release trick and knife angle rules for zero meat shredding",
        "keywords": "#SpatchcockChicken #ButcherSkills #BraaiMasterclass #CookingHacks #FoodPrep #PoultryGuide"
    },
    "Bunny Chow": {
        "teaser": "Rich, slow-simmered Durban mutton curry with tender melting potatoes and aromatic whole spices, ladled steaming hot into a hollowed-out fresh loaf with fiery carrot sambal.",
        "withheld": "the heirloom Durban masala spice blooming order and gravy reduction ratio that gives street-vendor depth",
        "keywords": "#BunnyChow #DurbanCurry #MuttonCurry #SouthAfricanFood #StreetFood #ComfortFood #CurryLovers"
    },
    "Turkey Burger": {
        "teaser": "Never choke down a dry, chalky turkey burger again! Smoke gently indirect over aromatic fruitwood coals and baste with whipped herb butter before crowning with molten wheel-cut brie and tart cranberry chutney.",
        "withheld": "the 15% subcutaneous fat-enrichment secret and exact wood ember smoke time for total juiciness",
        "keywords": "#TurkeyBurger #GourmetBurger #BrieCheese #SmokedBurgers #BraaiTime #BBQRecipes"
    },
    "Two-Zone": {
        "teaser": "Never burn the skin while waiting for the inside to cook! The pitmaster 2-zone heat rule: gentle indirect roasting with zero flare-ups, followed by a blazing 3-minute direct ember sear.",
        "withheld": "the exact probe placement angle, horizontal temperature matrix, and juice clarity test for 100% doneness precision",
        "keywords": "#TwoZoneCooking #MeatThermometer #BraaiTips #PitmasterSecrets #GrillHacks #BBQSchool"
    },
    "Boerewors": {
        "teaser": "Juicy, coarse-ground beef and pork boerewors seasoned with roasted coriander seeds, allspice, cloves, and brown vinegar. Grilled in an unbroken coil over medium coals for maximum flavor.",
        "withheld": "the golden coal distance rule and the one mistake pitmasters make that bursts the natural casing",
        "keywords": "#Boerewors #SouthAfricanSausage #TraditionalBraai #BraaiMeat #OpenFireCooking #SausageGrill"
    },
    "Seafood Po' Boy": {
        "teaser": "Flash-sear sweet wild prawns and scored calamari tubes over screaming hot coals drenched in sizzling lemon garlic butter, loaded into a crusty baguette with crunchy slaw.",
        "withheld": "the exact 45-second high-heat seafood timing and zesty caper remoulade ratio",
        "keywords": "#SeafoodPoBoy #BraaiSeafood #Prawns #Calamari #SouthAfricanFood #SeafoodSandwich"
    },
    "Poultry Crisping": {
        "teaser": "Moisture is the absolute enemy of crispy poultry skin! 3-step masterclass: 12-hour open fridge dry-brine, subcutaneous compound butter pockets, and fine diamond fat scoring.",
        "withheld": "the butcher's exact sea salt-to-surface ratio and resting temperature threshold that guarantees parchment-crackling skin",
        "keywords": "#CrispyChickenSkin #DryBrining #FoodScience #BraaiSecrets #CookingMasterclass #BBQGrill"
    },
    "T-Bone": {
        "teaser": "Thick-cut dry-aged T-Bone steak flame-grilled over dense sekelbos embers, basted with garlic, cracked peppercorns, and fresh thyme compound butter for steakhouse perfection.",
        "withheld": "the strip-vs-fillet thermal heat shield positioning and 7-minute carryover resting curve",
        "keywords": "#TBoneSteak #SteakRecipe #FlameGrilled #BraaiSteak #CarnivoreDiet #BeefLover"
    },
    "Roosterkoek": {
        "teaser": "Roosterkoek dense or doughy? The authentic secret is double-proving and baking gently over low, ash-covered white coals until puffed airy inside with a crisp, gridded crust.",
        "withheld": "the exact hydration percentage and Karoo lamb medallion marinade that melts the crumbled feta",
        "keywords": "#Roosterkoek #TraditionalBraai #SouthAfricanHeritage #BraaiBread #KarooLamb #CampfireBaking"
    },
    "Core Temp": {
        "teaser": "Your definitive all-in-one pocket thermal matrix for chicken, duck, and turkey on the braai. Stop cutting into meat to check if it's done!",
        "withheld": "the resting carryover heat formulas and probe target table (57°C duck to 80°C dark thighs) for absolute juiciness",
        "keywords": "#CookingTemperatures #BraaiMatrix #MeatThermometer #FoodSafety #SafeCookingTemps #GrillGuide"
    },
    "Cape Snoek": {
        "teaser": "Traditional West Coast braaied Cape snoek locked in a wire grid over gentle oak coals, basted with bubbling sweet apricot jam, crushed garlic, and farm butter glaze.",
        "withheld": "the heritage 3:1 apricot-to-butter ratio and grid-turning frequency that prevents fish from sticking or drying",
        "keywords": "#BraaiSnoek #CapeSnoek #ApricotGlaze #TraditionalBraai #SeafoodBraai #SouthAfricanHeritage"
    },
    "Salmon Fish Burger": {
        "teaser": "Keep your salmon burgers succulent and intact! Sear on an oiled grid, baste with melted garlic-dill butter, and serve on toasted brioche with crunchy lemon-caper slaw.",
        "withheld": "the binderless salmon fillet chill trick and exact 4-minute searing window",
        "keywords": "#SalmonBurger #FishBurger #BraaiFish #HealthyGrilling #GourmetBurger #SeafoodLovers"
    },
    "Doneness & Safe": {
        "teaser": "Never guess when your meat is safe and succulent. Visual cross-section guide comparing pink duck breast, clear-juiced white breast meat, and tenderized dark leg quarters.",
        "withheld": "the carryover resting curve and exact pull temperatures that keep chicken breast moist at 74°C",
        "keywords": "#PoultryGuide #FoodScience #SafeCookingTemps #BraaiSchool #MeatGuide #CulinaryInfographic"
    },
    "Crayfish Tails": {
        "teaser": "Sweet, succulent West Coast rock lobster crayfish tails split down the center, basted continuously with sizzling lemon garlic herb butter over medium-hot coals.",
        "withheld": "the shell-down heat shield timing and secret paprika-brandy butter emulsion",
        "keywords": "#BraaiCrayfish #RockLobster #SeafoodBraai #GarlicButter #LuxuryBraai #SouthAfricanFood"
    },
    "Duck Breast": {
        "teaser": "Duck breast tough or fatty? Score the fat cap in fine diamond lines, render slowly skin-side down over mild coals, and pull at 57°C for a succulent, rosy-pink medium-rare finish.",
        "withheld": "the secret vinegar-acid balance in the chimichurri and slow-render coal height",
        "keywords": "#DuckBreast #Chimichurri #GourmetBraai #SteakSandwich #BraaiHeritage #DuckRecipe"
    },
    "Essential Poultry Cuts": {
        "teaser": "Visual butcher guide comparing raw prepped cuts to the finished ember sear: spatchcock chicken, scored duck breast, turkey drumsticks, and Cape Malay apricot sosaties.",
        "withheld": "the butcher trimming guidelines and skewer soaking secrets for zero burning",
        "keywords": "#PoultryCuts #ButcherGuide #BraaiMasterclass #Sosaties #PlatHoender #FoodPrep"
    },
    "Oxtail Potjie": {
        "teaser": "Slow-simmered for 4 hours in a cast-iron #3 potjie over glowing coals: gelatinous beef oxtail browned in beef tallow, stewed with bold red wine, baby root vegetables, and herbs.",
        "withheld": "the golden no-stir potjie layer rule and exact wine-to-stock reduction volume",
        "keywords": "#OxtailPotjie #Potjiekos #CastIronCooking #SlowCooked #SouthAfricanFood #WinterBraai"
    },
    "Pulled Beef Braaibroodjie": {
        "teaser": "Soggy braaibroodjies are a crime! Butter the exterior generously, load with smoky slow-cooked shredded pulled beef, sweet caramelized onions, and sharp melting cheddar.",
        "withheld": "the low-ash coal temperature rule and external butter technique that delivers the loudest golden crunch",
        "keywords": "#Braaibroodjie #GrilledCheese #BraaiSides #PulledBeef #MeltedCheese #SouthAfricanBraai"
    },
    "Venison Carving": {
        "teaser": "Venison muscle fibers are dense and stringy if sliced incorrectly! The carver's rule: rest 8 minutes, identify the grain run, and slice at 90° across the grain on a 45° bias.",
        "withheld": "the exact 3mm slice thickness rule and red wine berry reduction that melts the meat on the tongue",
        "keywords": "#VenisonBraai #GameMeat #CarvingGuide #SpringbokLoin #ButcherGuide #KnifeSkills"
    },
    "Chicken Potjie": {
        "teaser": "Tender chicken thighs browned in butter and simmered with whole button mushrooms, fresh thyme, baby leeks, and a rich velvety white wine cream sauce in a cast iron pot.",
        "withheld": "the cream tempering technique that prevents splitting over open wood embers",
        "keywords": "#ChickenPotjie #Potjiekos #CampfireCooking #CastIronPot #ComfortFood #BraaiHeritage"
    },
    "Sosatie": {
        "teaser": "Authentic Cape Malay chicken and dried apricot skewers marinated in fragrant curry spices, bay leaves, and caramelized onion vinegar, flame-seared on crusty ciabatta.",
        "withheld": "the heirloom Cape Malay curry marinade ratio and sweet glaze brush timing",
        "keywords": "#Sosaties #CapeMalay #ChickenSkewers #BraaiRecipes #SouthAfricanFood #SweetApricot"
    },
    "Ember Searing Architecture": {
        "teaser": "Reverse sear vs direct ember screaming sear: how to get a deep mahogany crust on thick Ribeye and T-Bone steaks without creating a thick gray overcooked ring.",
        "withheld": "the sekelbos coal bed depth and 60-second flip cadence for maximum edge-to-edge pink perfection",
        "keywords": "#SteakSearing #ReverseSear #RibeyeSteak #BraaiArchitecture #PitmasterHacks #BBQLife"
    },
    "Pap Tart": {
        "teaser": "The ultimate South African braai side! Fluffy coarse-ground mielie pap layered in a skillet with crispy smoked bacon bits, sweetcorn, rich tomato-onion smoor, and bubbly melted cheese.",
        "withheld": "the pap hydration ratio and 3-cheese melting blend that keeps it moist and sliceable",
        "keywords": "#PapTart #BraaiPap #BraaiSides #SouthAfricanBraai #CheeseLover #MieliePap"
    },
    "Gatsby": {
        "teaser": "The legendary Cape Town Gatsby feast! A toasted giant footlong loaf stuffed with flame-charred boerewors, spicy masala slap chips, piquant sweet mustard sauce, and crisp lettuce.",
        "withheld": "the authentic slap chips vinegar soak and house sauce blend that defines street-food culture",
        "keywords": "#GatsbySandwich #CapeTownStreetFood #Boerewors #SlapChips #SouthAfricanEats #CheatMeal"
    },
    "Karoo Lamb Chops": {
        "teaser": "Crispy rendered lamb fat and juicy pink meat! Balance your chops bone-down on the braai grid to render the fat cap into golden crackling without blackening the delicate loin.",
        "withheld": "the rosemary-infused coarse salt dry rub ratio and rosemary branch basting secret",
        "keywords": "#KarooLamb #LambChops #BraaiLamb #CrispyFat #MeatLovers #SouthAfricanBraai"
    },
    "Herb Loaf": {
        "teaser": "Warm crusty artisanal loaf scored into pull-apart diamonds, drenched in garlic herb compound butter and fresh parsley, wrapped in foil and toasted over white embers.",
        "withheld": "the compound butter melting ratio and coal bed distance that prevents the base from burning",
        "keywords": "#BraaiLoaf #GarlicBread #CampfireBread #BraaiSides #PullApartBread #ComfortFood"
    },
    "Biltong Dip Loaf": {
        "teaser": "A show-stopping cast-iron crowd pleaser! Whole wheel of Camembert nestled inside crusty sourdough, topped with shaved lean beef biltong, hot honey drizzle, and fresh rosemary.",
        "withheld": "the ember bake timing and hot honey chili ratio that turns the cheese into liquid gold",
        "keywords": "#BiltongDip #Camembert #BraaiAppetizers #CheeseLovers #Biltong #CastIronBaking"
    },
    "Potjiekos Heat": {
        "teaser": "Master the 3-tier heat architecture of the cast iron potjie! Dense root vegetables at the bottom, seared proteins in the middle, and delicate greens on top with zero stirring.",
        "withheld": "the 3-coal maintenance rule and steam seal check that guarantees tender meat without drying out",
        "keywords": "#Potjiekos #PotjieHeat #CastIronSecrets #TraditionalCooking #BraaiSchool #SouthAfricanHeritage"
    },
    "Curried Noodle Salad": {
        "teaser": "The undisputed king of traditional braai cold sides! Tender elbow macaroni coated in a glossy, sweet-and-tangy curried apricot chutney dressing with crisp peppers and onions.",
        "withheld": "the sweet-tangy chutney and white vinegar dressing ratio that gets richer as it chills overnight",
        "keywords": "#CurriedNoodleSalad #BraaiSalad #SouthAfricanRecipes #BraaiSides #PicnicFood #NoodleSalad"
    }
}

def get_open_loop_data(title):
    for key, data in RECIPE_OPEN_LOOPS.items():
        if key.lower() in title.lower():
            return data
    # Fallback default
    return {
        "teaser": f"Visual culinary guide for {title}: step-by-step masterclass technique flame-crafted over authentic open embers for unforgettable flavor.",
        "withheld": "the exact secret spice ratios, coal temperature timing, and carrying rest rules",
        "keywords": "#SouthAfricanBraai #BraaiRecipes #TraditionalFood #OpenFireCooking #RecipeCards"
    }

def create_click_trigger_badge(image_path, output_path):
    """
    Overlays a clean, luxury cream and gold badge near the bottom:
    'FULL RECIPE + PRINTABLE GROCERY LIST  →'
    """
    img = Image.open(image_path).convert('RGBA')
    W, H = img.size

    # Badge dimensions relative to image
    badge_w = int(W * 0.88)
    badge_h = int(H * 0.052)
    badge_x = (W - badge_w) // 2
    badge_y = H - badge_h - int(H * 0.042)

    overlay = Image.new('RGBA', img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)

    # 1. Soft subtle dark drop shadow
    shadow_offset = 3
    draw.rounded_rectangle(
        [badge_x + shadow_offset, badge_y + shadow_offset, badge_x + badge_w + shadow_offset, badge_y + badge_h + shadow_offset],
        radius=int(badge_h * 0.35),
        fill=(0, 0, 0, 110)
    )

    # 2. Cream luxury badge fill with warm copper-gold border
    draw.rounded_rectangle(
        [badge_x, badge_y, badge_x + badge_w, badge_y + badge_h],
        radius=int(badge_h * 0.35),
        fill=(248, 245, 238, 245),
        outline=(207, 123, 62, 235),
        width=2
    )

    # 3. Typography
    font_size = int(badge_h * 0.38)
    font_path = r'C:\Windows\Fonts\segoeuib.ttf'
    if not os.path.exists(font_path):
        font_path = r'C:\Windows\Fonts\arialbd.ttf'

    font = ImageFont.truetype(font_path, font_size)
    text = "FULL RECIPE + PRINTABLE GROCERY LIST  →"

    bbox = draw.textbbox((0, 0), text, font=font)
    text_w = bbox[2] - bbox[0]
    text_h = bbox[3] - bbox[1]
    text_x = badge_x + (badge_w - text_w) // 2
    text_y = badge_y + (badge_h - text_h) // 2 - int(font_size * 0.1)

    # Dark charcoal text with clean contrast
    draw.text((text_x, text_y), text, font=font, fill=(20, 16, 12, 255))

    final_img = Image.alpha_composite(img, overlay).convert('RGB')
    final_img.save(output_path, quality=94)

def main():
    csv_input = 'pinterest_bulk_upload.csv'
    with open(csv_input, mode='r', encoding='utf-8') as f:
        reader = csv.reader(f)
        header = next(reader)
        rows = list(reader)

    print(f"Loaded {len(rows)} pins from {csv_input}.")

    badged_count = 0
    updated_rows = []
    immediate_rows = []

    pins_dir = os.path.join('public', 'assets', 'pins')

    for idx, row in enumerate(rows):
        pin_num = idx + 1
        title = row[0]
        media_url = row[1]
        board = row[2]
        link = row[4]
        publish_date = row[5]

        # 1. Image Badging on exactly 50% of Pins (even index pins: 2, 4, 6, ...)
        raw_filename = media_url.split('/')[-1]
        image_filename = re.sub(r'(_badged)+', '', raw_filename)
        orig_image_path = os.path.join(pins_dir, image_filename)

        if pin_num % 2 == 0 and os.path.exists(orig_image_path):
            base_name, ext = os.path.splitext(image_filename)
            badged_filename = f"{base_name}_badged{ext}"
            badged_image_path = os.path.join(pins_dir, badged_filename)

            # Generate badged image cleanly from original
            create_click_trigger_badge(orig_image_path, badged_image_path)
            new_media_url = f"https://the-recipe-vault-co-six.vercel.app/assets/pins/{badged_filename}"
            badged_count += 1
        else:
            new_media_url = f"https://the-recipe-vault-co-six.vercel.app/assets/pins/{image_filename}"

        # 2. Craft Open-Loop Description
        ol = get_open_loop_data(title)
        teaser = ol["teaser"]
        withheld = ol["withheld"]
        keywords = ol["keywords"]

        # Clean up any potential 'the exact the exact'
        withheld_clean = re.sub(r'^the exact\s+', '', withheld, flags=re.IGNORECASE)

        # High-Click Open-Loop CTA
        open_loop_desc = (
            f"{teaser} "
            f"Want the exact {withheld_clean} + printable grocery checklist? "
            f"Tap Visit to get all 30 recipe cards inside The Recipe Vault Co! 👉 {link} "
            f"{keywords}"
        )

        # Build clean updated row
        updated_row = [
            title,
            new_media_url,
            board,
            open_loop_desc,
            link,
            publish_date,
            keywords.replace('#', '').replace(' ', ', ')
        ]
        updated_rows.append(updated_row)

        # Immediate row with blank publish date
        immediate_row = list(updated_row)
        immediate_row[5] = ''
        immediate_rows.append(immediate_row)

    # Save pinterest_bulk_upload.csv
    with open('pinterest_bulk_upload.csv', mode='w', encoding='utf-8', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(header)
        writer.writerows(updated_rows)

    # Save pinterest_bulk_upload_immediate.csv
    with open('pinterest_bulk_upload_immediate.csv', mode='w', encoding='utf-8', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(header)
        writer.writerows(immediate_rows)

    # Also update pinterest_pins_master.csv if it exists
    if os.path.exists('pinterest_pins_master.csv'):
        with open('pinterest_pins_master.csv', mode='r', encoding='utf-8') as f:
            m_reader = csv.reader(f)
            m_header = next(m_reader)
            m_rows = list(m_reader)

        updated_master = []
        for r in m_rows:
            m_title = r[0]
            m_link = r[2]
            m_board = r[3]
            m_alt = r[4]
            ol = get_open_loop_data(m_title)
            w_clean = re.sub(r'^the exact\s+', '', ol['withheld'], flags=re.IGNORECASE)
            m_desc = (
                f"{ol['teaser']} "
                f"Want the exact {w_clean} + printable grocery checklist? "
                f"Tap Visit to get all 30 recipe cards inside The Recipe Vault Co! 👉 {m_link} "
                f"{ol['keywords']}"
            )
            updated_master.append([m_title, m_desc, m_link, m_board, m_alt])

        with open('pinterest_pins_master.csv', mode='w', encoding='utf-8', newline='') as f:
            m_writer = csv.writer(f)
            m_writer.writerow(m_header)
            m_writer.writerows(updated_master)
        print("  ✓ Updated pinterest_pins_master.csv with Open-Loop copy")

    print(f"Successfully processed {len(rows)} pins:")
    print(f"  ✓ {badged_count} pins (50%) feature the luxury gold/cream Click Trigger Badge")
    print(f"  ✓ {len(rows) - badged_count} pins (50%) feature clean unblemished hero photography")
    print(f"  ✓ 100% of descriptions updated with the high-converting Open-Loop strategy")
    print("  ✓ Saved to pinterest_bulk_upload.csv & pinterest_bulk_upload_immediate.csv")

if __name__ == '__main__':
    main()
