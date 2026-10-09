import re

with open('src/lib/products-data.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add Gurbandi Badam under Almonds
gurbandi_product = """  {
    id: 'alm-005',
    name: 'Gurbandi Badam (High-Oil Afghan Almonds)',
    slug: 'gurbandi-badam-afghan-almonds',
    category: 'Almonds',
    categorySlug: 'almonds',
    origin: 'Gurband Valley, Afghanistan',
    grade: 'Grade A Chhoti Giri',
    shortDesc: 'Small, unpolished high-oil Afghan almonds with intense therapeutic nutrients and rich bittersweet undertone.',
    longDesc: `Gurbandi Almonds (also known as Chhoti Giri Badam) originate from the rugged high-altitude valleys of Afghanistan. While physically smaller than California almonds, Gurbandi badam contains extraordinarily high concentrations of natural cold-pressed oils and antioxidants.\\n\\nPrized in Ayurvedic and Unani traditions for brain tonic memory enhancement, eyesight, and joint health. 100% raw, unpasteurized, unbleached, and non-GMO.`,
    retailPrice: 1850,
    b2bPricePerKg: 1620,
    mrp: 2250,
    variants: buildVariants(1850),
    b2bTiers: buildTiers(1620),
    stockStatus: 'IN_STOCK',
    image: '/images/gurbandi-almonds-pouch-250g.jpg',
    sensory: {
      tastingNotes: ['Deep Cold-Pressed Oil', 'Subtle Herbal Bittersweet', 'Dense Firm Snap'],
      altitude: 'Gurband Highlands (2,100m)',
      harvestSeason: 'Autumn 2025 Reserve',
      oilIndex: '54% Rare High Medicinal Oils',
      crunchScore: 5,
      secondaryImage: '/images/mamra-kernels-macro.jpg',
    },
    isFeatured: true,
    shelfLifeMonths: 18,
    storage: 'Store in an airtight jar in a cool, shaded environment.',
    allergens: 'Tree Nuts (Almonds).',
    nutrition: { servingSize: '30g', calories: 188, protein: 6.8, carbs: 4.8, fat: 17.5, fiber: 3.2, sodium: 0 },
    tags: ['almonds', 'gurbandi', 'afghanistan', 'chhoti-giri', 'high-oil', 'ayurvedic'],
  },
"""

# 2. Add King Jumbo W180 Cashews under Cashews
w180_product = """  {
    id: 'csw-004',
    name: 'King Jumbo W180 Cashews (Royal Reserve)',
    slug: 'king-jumbo-w180-cashews',
    category: 'Cashews',
    categorySlug: 'cashews',
    origin: 'Goan Coastal Groves, India',
    grade: 'Grade W180 (King Grade)',
    shortDesc: 'The prized King of Cashews — massive whole ivory white crescents with rich buttery sweetness.',
    longDesc: `Grade W180 represents the undisputed royalty of the cashew world — indicating fewer than 180 cashews per pound. These colossal, pristine white whole kernels are hand-selected from the finest mature coastal groves of Goa and Mangalore.\\n\\nSmooth, silky, and naturally sweet without any chemical processing or bleaching. An opulent centerpiece for luxury dry fruit gifting, royal festive platters, and connoisseur snacking. Vacuum packed in nitrogen-flushed multi-barrier pouches for maximum crunch.`,
    retailPrice: 1850,
    b2bPricePerKg: 1620,
    mrp: 2299,
    variants: buildVariants(1850),
    b2bTiers: buildTiers(1620),
    stockStatus: 'IN_STOCK',
    image: '/images/cashews-w180-pouch-250g.jpg',
    sensory: {
      tastingNotes: ['Velvety Clotted Cream', 'Natural Raw Sweetness', 'Buttery Soft Snap'],
      altitude: 'Goan Coastal Plateau',
      harvestSeason: 'Spring 2025 Reserve',
      oilIndex: '49% Natural Plant Fats',
      crunchScore: 5,
      secondaryImage: '/images/cashews-w180-macro.jpg',
    },
    isFeatured: true,
    shelfLifeMonths: 12,
    storage: 'Keep in an airtight container in a cool, dry place away from heat.',
    allergens: 'Tree Nuts (Cashews).',
    nutrition: { servingSize: '30g', calories: 165, protein: 5.2, carbs: 8.8, fat: 13.5, fiber: 1, sodium: 2 },
    tags: ['cashews', 'w180', 'king-jumbo', 'royal-reserve', 'luxury', 'goa'],
  },
"""

# 3. Add Green Peeled Pista Slivers under Pistachios
pista_slivers_product = """  {
    id: 'pst-003',
    name: 'Green Peeled Pista Slivers (Peshawari Slivers)',
    slug: 'green-peeled-pista-slivers',
    category: 'Pistachios',
    categorySlug: 'pistachios',
    origin: 'Peshawar & Kashmir Valley',
    grade: 'Grade AAA Emerald Slivers',
    shortDesc: 'Vibrant jade-green peeled pistachio slivers — freshly cut for luxury royal sweets, kheer, and confectionery.',
    longDesc: `Blanched and peeled from select cold-climate pistachios, our Emerald Green Pista Slivers are sliced wafer-thin to provide the ultimate garnish for royal Indian desserts, Persian saffron rice, kheer, halwas, and gourmet pastries.\\n\\nVivid naturally green without artificial food dyes, sulfur, or preservatives. 100% pure raw kernels sealed in airtight oxygen-barrier stand-up pouches.`,
    retailPrice: 3850,
    b2bPricePerKg: 3350,
    mrp: 4600,
    variants: buildVariants(3850),
    b2bTiers: buildTiers(3350),
    stockStatus: 'IN_STOCK',
    image: '/images/pista-slivers-pouch-250g.jpg',
    sensory: {
      tastingNotes: ['Fresh Pine Nut Meadow', 'Delicate Sweet Cream', 'Silky Crisp Shavings'],
      altitude: 'Northwest Mountain Valleys',
      harvestSeason: 'Autumn 2025 Reserve',
      oilIndex: '52% Heart-Healthy Lipids',
      crunchScore: 4,
      secondaryImage: '/images/pista-slivers-macro.jpg',
    },
    isFeatured: true,
    shelfLifeMonths: 9,
    storage: 'Refrigerate immediately in an airtight container to preserve radiant emerald color.',
    allergens: 'Tree Nuts (Pistachios).',
    nutrition: { servingSize: '30g', calories: 175, protein: 6.2, carbs: 7.8, fat: 14.5, fiber: 3, sodium: 0 },
    tags: ['pistachios', 'pista-slivers', 'peshawari', 'emerald-green', 'baking', 'garnish'],
  },
"""

# 4. Add Jumbo Black Munakka under Raisins
black_munakka_product = """  {
    id: 'rsn-003',
    name: 'Jumbo Black Munakka (Seedless Antioxidant Raisins)',
    slug: 'jumbo-black-munakka-seedless',
    category: 'Raisins',
    categorySlug: 'raisins',
    origin: 'Afghanistan & Nashik, India',
    grade: 'Grade A+ Jumbo Seedless',
    shortDesc: 'Large sun-dried black munakka raisins — plump, naturally sweet, and loaded with iron and polyphenols.',
    longDesc: `Our Jumbo Black Munakka are carefully cured in the sun from ripe black seedless grapes. Packed with bioavailable iron, potassium, and protective anthocyanin antioxidants.\\n\\nTraditionally soaked overnight in water and consumed in the morning for gut regularity, hemoglobin support, and sustained natural energy. 100% chemical-free and zero added sugar.`,
    retailPrice: 950,
    b2bPricePerKg: 820,
    mrp: 1250,
    variants: buildVariants(950),
    b2bTiers: buildTiers(820),
    stockStatus: 'IN_STOCK',
    image: '/images/black-raisins-pouch-250g.jpg',
    sensory: {
      tastingNotes: ['Dark Berry Molasses', 'Mellow Wine Fruit', 'Soft Succulent Chew'],
      altitude: 'Sun-Drenched Deccan & Afghan Hills',
      harvestSeason: 'Winter 2025 Cure',
      oilIndex: '0.4% Naturally Lean',
      crunchScore: 2,
      secondaryImage: '/images/black-munakka-macro.jpg',
    },
    isFeatured: true,
    shelfLifeMonths: 18,
    storage: 'Store in an airtight jar in a cool, dry pantry.',
    allergens: 'Natural Dried Fruit. Sulphite free.',
    nutrition: { servingSize: '40g', calories: 126, protein: 1.3, carbs: 33, fat: 0.2, fiber: 2.2, sodium: 4 },
    tags: ['raisins', 'black-raisins', 'munakka', 'iron-rich', 'ayurvedic', 'natural'],
  },
"""

# 5. Add Afghan Mala Anjeer under Anjeer
afghan_mala_product = """  {
    id: 'anj-003',
    name: 'Afghan Kandahari Mala Anjeer (String Wreath Figs)',
    slug: 'afghan-kandahari-mala-anjeer',
    category: 'Anjeer',
    categorySlug: 'anjeer',
    origin: 'Kandahar Mountains, Afghanistan',
    grade: 'Grade A+ Garland Wreath',
    shortDesc: 'Prized Afghan string-threaded garland figs — sun-dried mountain figs with dense golden honeyed sweetness.',
    longDesc: `Threaded onto traditional organic cotton strings into decorative garlands (Mala), these authentic Kandahari figs are cured under intense mountain sun. Naturally chewy with a concentrated, fig-honey jam interior and satisfying seed crunch.\\n\\nRenowned across South Asia as an elite tonic for bone density, dietary fiber, and restorative vitality. Zero sulfur, zero artificial sweeteners, and zero moisture additives.`,
    retailPrice: 2450,
    b2bPricePerKg: 2150,
    mrp: 2999,
    variants: buildVariants(2450),
    b2bTiers: buildTiers(2150),
    stockStatus: 'IN_STOCK',
    image: '/images/anjeer-mala-pouch-250g.jpg',
    sensory: {
      tastingNotes: ['Caramelized Wild Honey', 'Nutty Seed Crunch', 'Rich Molasses Fig'],
      altitude: 'Kandahar Foothills (1,800m)',
      harvestSeason: 'Autumn 2025 Reserve',
      oilIndex: 'Natural Fruit Fiber & Seeds',
      crunchScore: 4,
      secondaryImage: '/images/anjeer-macro.jpg',
    },
    isFeatured: true,
    shelfLifeMonths: 18,
    storage: 'Store in an airtight container. Refrigerate in summer.',
    allergens: 'None.',
    nutrition: { servingSize: '40g', calories: 115, protein: 1.6, carbs: 29.5, fat: 0.5, fiber: 4.8, sodium: 3 },
    tags: ['anjeer', 'afghan-anjeer', 'mala-anjeer', 'garland-figs', 'figs', 'kandahar'],
  },
"""

# 6. Add Royal Ajwa Dates under Dates
ajwa_product = """  {
    id: 'dat-003',
    name: 'Royal Ajwa Dates (Madinah Al-Aliya)',
    slug: 'royal-ajwa-dates-madinah',
    category: 'Dates',
    categorySlug: 'dates',
    origin: 'Madinah Al-Munawwarah, Saudi Arabia',
    grade: 'Grade A VIP Reserve',
    shortDesc: 'Revered soft black Ajwa dates from the sacred groves of Madinah — velvety, mildly sweet with fine white fissures.',
    longDesc: `Ajwa is the most celebrated date variety in the world, cultivated exclusively in the historic Al-Aliya region of Madinah Al-Munawwarah. Distinctive for its rounded midnight-black appearance, fine delicate white striations, and delightfully soft, prune-like texture.\\n\\nPrized for thousands of years for its potent cardioprotective antioxidants, natural iron, and digestive benefits. Direct certified import from Saudi date orchards.`,
    retailPrice: 2450,
    b2bPricePerKg: 2150,
    mrp: 2999,
    variants: buildVariants(2450),
    b2bTiers: buildTiers(2150),
    stockStatus: 'IN_STOCK',
    image: '/images/ajwa-dates-pouch-250g.jpg',
    sensory: {
      tastingNotes: ['Silky Black Caramel', 'Mellow Brown Sugar', 'Soft Melting Pulp'],
      altitude: 'Madinah Date Oases',
      harvestSeason: 'Late Summer 2025 Crop',
      oilIndex: 'Zero Fat • High Polyphenol Matrix',
      crunchScore: 1,
      secondaryImage: '/images/ajwa-dates-macro.jpg',
    },
    isFeatured: true,
    shelfLifeMonths: 24,
    storage: 'Store in a cool, dry place below 22°C. Refrigerate for long storage.',
    allergens: 'None.',
    nutrition: { servingSize: '40g', calories: 125, protein: 1, carbs: 34, fat: 0.1, fiber: 3.5, sodium: 1 },
    tags: ['dates', 'ajwa', 'madinah', 'saudi-arabia', 'superfood', 'spiritual', 'healing'],
  },
"""

# 7. Add Ladakh Halman Wild Apricots
apricot_product = """  {
    id: 'apr-001',
    name: 'Ladakh Halman Organic Wild Apricots (Khubani)',
    slug: 'ladakh-halman-wild-apricots',
    category: 'Apricots & Berries',
    categorySlug: 'apricots',
    origin: 'Nubra Valley, Ladakh, India',
    grade: 'Grade A+ Sun-Dried Halman',
    shortDesc: 'Organic sun-dried Halman apricots from high-altitude Ladakh — velvety golden flesh with sweet edible inner kernel.',
    longDesc: `Cultivated at elevations exceeding 10,000 feet in the glacial meltwater of Ladakh's Nubra and Kargil valleys, Halman is India's most extraordinary indigenous apricot variety. Sun-dried naturally on rooftop stone beds beneath pristine Himalayan sun.\\n\\nIntensely fragrant, plump, and deeply sweet with zero sulfur dioxide preservation. Bonus: crack open the inner pit to enjoy the rare sweet, non-bitter apricot kernel inside! Rich in vitamin A, beta-carotene, and potassium.`,
    retailPrice: 1250,
    b2bPricePerKg: 1080,
    mrp: 1550,
    variants: buildVariants(1250),
    b2bTiers: buildTiers(1080),
    stockStatus: 'IN_STOCK',
    image: '/images/apricots-pouch-250g.jpg',
    sensory: {
      tastingNotes: ['Floral Honey Glaze', 'Velvety Sun-Dried Stonefruit', 'Sweet Edible Nut Interior'],
      altitude: 'Ladakh High Valleys (3,100m)',
      harvestSeason: 'Late Autumn 2025',
      oilIndex: 'Rich in Essential Kernel Oils',
      crunchScore: 2,
      secondaryImage: '/images/apricot-halman-macro.jpg',
    },
    isFeatured: true,
    shelfLifeMonths: 18,
    storage: 'Store in an airtight container in a cool, dry pantry.',
    allergens: 'Contains inner edible apricot kernel.',
    nutrition: { servingSize: '40g', calories: 118, protein: 1.8, carbs: 28, fat: 0.3, fiber: 3.8, sodium: 2 },
    tags: ['apricots', 'khubani', 'ladakh', 'halman', 'organic', 'wild-harvest'],
  },
"""

# Insert alm-005 after alm-004
if 'alm-005' not in content:
    content = content.replace("tags: ['almonds', 'kashmiri-badam', 'kagzi', 'kashmir', 'soft-shell', 'natural'],\n  },", "tags: ['almonds', 'kashmiri-badam', 'kagzi', 'kashmir', 'soft-shell', 'natural'],\n  },\n" + gurbandi_product)

# Insert csw-004 after csw-003
if 'csw-004' not in content:
    content = content.replace("tags: ['cashews', 'roasted', 'unsalted', 'health', 'keto'],\n  },", "tags: ['cashews', 'roasted', 'unsalted', 'health', 'keto'],\n  },\n" + w180_product)

# Insert pst-003 after pst-002
if 'pst-003' not in content:
    content = content.replace("tags: ['pistachios', 'raw', 'unsalted', 'health', 'afghanistan'],\n  },", "tags: ['pistachios', 'raw', 'unsalted', 'health', 'afghanistan'],\n  },\n" + pista_slivers_product)

# Insert rsn-003 after rsn-002
if 'rsn-003' not in content:
    content = content.replace("tags: ['raisins', 'munakka', 'black', 'ayurvedic', 'seeded'],\n  },", "tags: ['raisins', 'munakka', 'black', 'ayurvedic', 'seeded'],\n  },\n" + black_munakka_product)

# Insert dat-003 after dat-002
if 'dat-003' not in content:
    content = content.replace("tags: ['dates', 'safawi', 'saudi', 'ramadan', 'natural'],\n  },", "tags: ['dates', 'safawi', 'saudi', 'ramadan', 'natural'],\n  },\n" + ajwa_product)

# Insert anj-003 after anj-002
if 'anj-003' not in content:
    content = content.replace("tags: ['anjeer', 'figs', 'afghanistan', 'wild', 'rare'],\n  },", "tags: ['anjeer', 'figs', 'afghanistan', 'wild', 'rare'],\n  },\n" + afghan_mala_product + "\n" + apricot_product)

# Update California almonds and Cashews W240 images and prices
content = content.replace("image: '/images/almonds-pouch-250g.jpg'", "image: '/images/almonds-pouch-250g.jpg'")
content = content.replace("image: '/images/cashews-pouch-250g.jpg'", "image: '/images/cashews-pouch-250g.jpg'")
content = content.replace("image: '/images/raisins-pouch-250g.jpg',\n    isFeatured: false,\n    shelfLifeMonths: 18,\n    storage: 'Store in a cool, dry place in an airtight container.',\n    allergens: 'May contain traces of tree nuts from shared facility.',\n    nutrition: { servingSize: '40g', calories: 128, protein: 1.2, carbs: 34, fat: 0.2, fiber: 1.8, sodium: 5 },\n    tags: ['raisins', 'munakka', 'black', 'ayurvedic', 'seeded'],", "image: '/images/black-raisins-pouch-250g.jpg',\n    sensory: {\n      secondaryImage: '/images/black-munakka-macro.jpg',\n    },\n    isFeatured: false,\n    shelfLifeMonths: 18,\n    storage: 'Store in a cool, dry place in an airtight container.',\n    allergens: 'May contain traces of tree nuts from shared facility.',\n    nutrition: { servingSize: '40g', calories: 128, protein: 1.2, carbs: 34, fat: 0.2, fiber: 1.8, sodium: 5 },\n    tags: ['raisins', 'munakka', 'black', 'ayurvedic', 'seeded'],")

# Update Turkish Anjeer secondaryImage
content = content.replace("image: '/images/anjeer-pouch-250g.jpg',\n    isFeatured: false,\n    shelfLifeMonths: 12,", "image: '/images/anjeer-pouch-250g.jpg',\n    sensory: {\n      secondaryImage: '/images/anjeer-macro.jpg',\n    },\n    isFeatured: true,\n    shelfLifeMonths: 12,")

# Update getProductDynamicGallery implementation
gallery_func_pattern = r"export function getProductDynamicGallery\(product: Product\): string\[\] \{[\s\S]*?\n\}"
new_gallery_func = """export function getProductDynamicGallery(product: Product): string[] {
  if (product.images && product.images.length >= 6) {
    return Array.from(new Set(product.images))
  }

  const list: string[] = []

  // 1. Primary branded packshot (standing pouch or jar with official cursive Nutytales logo)
  if (product.image) {
    list.push(product.image)
  }

  const cat = (product.categorySlug || '').toLowerCase()
  const slug = (product.slug || '').toLowerCase()

  // 2. Product-specific authentic raw harvest macro
  if (product.sensory?.secondaryImage) {
    list.push(product.sensory.secondaryImage)
  } else if (cat.includes('almond') || slug.includes('almond') || slug.includes('badam')) {
    list.push('/images/mamra-kernels-macro.jpg')
  } else if (slug.includes('w180') || (cat.includes('cashew') && !slug.includes('piece'))) {
    list.push('/images/cashews-w180-macro.jpg')
  } else if (cat.includes('cashew') || slug.includes('cashew')) {
    list.push('/images/cashews-walnuts-macro.jpg')
  } else if (cat.includes('walnut') || slug.includes('walnut') || slug.includes('akhrot')) {
    list.push('/images/cashews-walnuts-macro.jpg')
  } else if (slug.includes('sliver') || slug.includes('peeled') || cat.includes('pista')) {
    list.push('/images/pista-slivers-macro.jpg')
  } else if (cat.includes('anjeer') || cat.includes('fig') || slug.includes('anjeer') || slug.includes('fig')) {
    list.push('/images/anjeer-macro.jpg')
  } else if (slug.includes('black') || slug.includes('munakka')) {
    list.push('/images/black-munakka-macro.jpg')
  } else if (cat.includes('raisin') || slug.includes('kishmish')) {
    list.push('/images/raisins-pouch-250g.jpg')
  } else if (cat.includes('apricot') || slug.includes('apricot') || slug.includes('khubani')) {
    list.push('/images/apricot-halman-macro.jpg')
  } else if (slug.includes('ajwa') || cat.includes('date') || slug.includes('date')) {
    list.push('/images/ajwa-dates-macro.jpg')
  } else if (cat.includes('saffron') || slug.includes('saffron')) {
    list.push('/images/saffron-threads-macro.jpg')
  } else if (cat.includes('honey') || slug.includes('honey')) {
    list.push('/images/kashmir-honey-jar-500g.jpg')
  } else if (cat.includes('makhana') || slug.includes('makhana')) {
    list.push('/images/makhana-pouch-250g.jpg')
  } else {
    list.push('/images/seeds-mix-pouch-250g.jpg')
  }

  // 3. Culinary lifestyle presentation in artisan ceramic bowl
  list.push('/images/hero-lifestyle-bowl.png')

  // 4. Fine dining luxury table display
  if (cat === 'saffron' || cat === 'honey') {
    list.push('/images/crystal-gold-nut-bowls.jpg')
  } else {
    list.push('/images/dark-wood-gourmet-tray.jpg')
  }

  // 5. Nutytales Certified Purity & FSSAI Seal (Official Brand Badge)
  list.push('/images/nutytales-seal-quality.jpg')

  // 6. Nutytales Hermetic Freshness Lock & Resealable Zip Lock (Official Brand Badge)
  list.push('/images/nutytales-freshness-lock.jpg')

  // 7. Nutytales Nutritional Excellence Whole Foods Seal (Official Brand Badge)
  list.push('/images/nutytales-nutrition-seal.jpg')

  // 8. Luxury Festive Hamper Presentation Context
  if (cat === 'gifting' || slug.includes('box') || slug.includes('hamper')) {
    list.push('/images/luxury-hamper-jars.png')
    list.push('/images/long-festive-gift-box.jpg')
  } else {
    list.push('/images/luxury-teal-gift-box.jpg')
  }

  return Array.from(new Set(list))
}"""

content = re.sub(gallery_func_pattern, new_gallery_func, content)

with open('src/lib/products-data.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated src/lib/products-data.ts successfully!")
