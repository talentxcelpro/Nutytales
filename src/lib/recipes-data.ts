// ─── High-Volume Culinary & Ayurvedic Recipe Knowledge Base ─────────────────────────
// Rich Recipe Schema.org compliant data targeting 10M+ annual Indian culinary searches

export interface RecipeIngredient {
  name: string
  quantity: string
  productSlug?: string
  productName?: string
  priceInr?: number
  isNutyTalesProduct?: boolean
  image?: string
}

export interface RecipeStep {
  stepNumber: number
  title: string
  instruction: string
  chefTip?: string
}

export interface RecipeData {
  slug: string
  title: string
  hindiTitle: string
  shortDescription: string
  metaTitle: string
  metaDescription: string
  heroImage: string
  prepTimeMinutes: number
  cookTimeMinutes: number
  totalTimeMinutes: number
  isoTotalTime: string
  servings: number
  difficulty: 'Easy' | 'Medium'
  caloriesPerServing: number
  proteinGrams: number
  fiberGrams: number
  isVratFriendly: boolean
  dietaryTags: string[]
  ingredients: RecipeIngredient[]
  steps: RecipeStep[]
  nutritionalHighlights: string[]
  bundleCart: {
    bundleTitle: string
    bundlePrice: number
    bundleMrp: number
    discountPercent: number
    description: string
  }
  faq: {
    question: string
    answer: string
  }[]
}

export const CULINARY_RECIPES: Record<string, RecipeData> = {
  'makhana-kheer-recipe': {
    slug: 'makhana-kheer-recipe',
    title: 'Authentic Royal Makhana Kheer Recipe (Phool Makhane Ki Kheer)',
    hindiTitle: 'शाही मखाना खीर रेसिपी (व्रत स्पेशल)',
    shortDescription:
      'Creamy, rich, and fragrant Indian pudding made with puffed lotus seeds (jumbo makhana), whole milk, Kashmiri saffron, and sliced dry fruits. 100% gluten-free and ideal for Navratri & Shivratri fasting.',
    metaTitle: 'Royal Makhana Kheer Recipe | Phool Makhane Ki Kheer for Vrat | Nuty Tales',
    metaDescription:
      'Step-by-step royal Makhana Kheer recipe with pure Kashmiri saffron and jumbo 6 Suta makhana. Healthy, creamy dessert ready in 25 mins for Navratri, Shivratri, and festive celebrations.',
    heroImage: '/images/hero-lifestyle-bowl.png',
    prepTimeMinutes: 10,
    cookTimeMinutes: 20,
    totalTimeMinutes: 30,
    isoTotalTime: 'PT30M',
    servings: 4,
    difficulty: 'Easy',
    caloriesPerServing: 215,
    proteinGrams: 6.2,
    fiberGrams: 2.8,
    isVratFriendly: true,
    dietaryTags: ['Vrat Friendly', 'Gluten-Free', 'High Calcium', 'Navratri Special', 'Low Glycemic'],
    ingredients: [
      {
        name: 'NutyTales Jumbo Phool Makhana (6 Suta Whole)',
        quantity: '2 cups (approx 60 grams)',
        productSlug: 'makhana-grade-a-fox-nuts',
        productName: 'Jumbo 6 Suta Makhana',
        priceInr: 249,
        isNutyTalesProduct: true,
        image: '/images/promo-makhana-899.webp',
      },
      {
        name: 'Pure Kashmiri Mongra Saffron (GI Tagged)',
        quantity: '8 - 10 strands (infused in 2 tbsp warm milk)',
        productSlug: 'kashmiri-mongra-saffron',
        productName: 'Pure Kashmiri Mongra Saffron (1g)',
        priceInr: 420,
        isNutyTalesProduct: true,
        image: '/images/saffron-threads-macro.jpg',
      },
      {
        name: 'Kashmiri Mamra Almonds (Thinly Sliced)',
        quantity: '10 - 12 kernels (soaked & peeled)',
        productSlug: 'mamra-almonds-kashmiri-badam',
        productName: 'Kashmiri Mamra Almonds',
        priceInr: 480,
        isNutyTalesProduct: true,
        image: '/images/hero-lifestyle-bowl.png',
      },
      {
        name: 'Green Cardamom (Hari Elaichi)',
        quantity: '4 pods (freshly crushed)',
        isNutyTalesProduct: false,
      },
      {
        name: 'Full Cream Milk (or Almond Milk for vegan)',
        quantity: '1 Litre (4 cups)',
        isNutyTalesProduct: false,
      },
      {
        name: 'Pure Desi Cow Ghee',
        quantity: '1.5 tablespoons',
        isNutyTalesProduct: false,
      },
      {
        name: 'Raw Jaggery Powder or Khand / Mishri',
        quantity: '4 - 5 tablespoons (adjust to taste)',
        isNutyTalesProduct: false,
      },
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Roasting the Makhana in Ghee',
        instruction:
          'Heat 1.5 tablespoons of pure desi cow ghee in a heavy-bottomed kadai on medium-low flame. Add 2 cups of NutyTales Jumbo Makhana and roast continuously for 4-5 minutes until they turn crisp and crush easily between your fingers with an audible snap.',
        chefTip: 'Never roast on high flame as makhana scorches quickly from the outside while staying chewy inside.',
      },
      {
        stepNumber: 2,
        title: 'Coarse Grinding for Thickness',
        instruction:
          'Remove the roasted makhana from the pan. Divide into two halves. Keep one half as whole round pearls for texture. Pulse the second half coarsely in a mixer grinder for 3-4 seconds (or crush with a rolling pin) to create a natural thickening base.',
      },
      {
        stepNumber: 3,
        title: 'Simmering the Milk & Infusion',
        instruction:
          'In the same heavy pot, bring 1 litre of full-fat milk to a rolling boil. Reduce heat to low and let it simmer for 6-8 minutes until slightly reduced. Add the crushed green cardamom powder and the warm saffron milk infusion. Watch the milk turn into a glorious golden royal hue.',
      },
      {
        stepNumber: 4,
        title: 'Combining Makhana & Sliced Nuts',
        instruction:
          'Stir in both the whole roasted makhana and the coarsely crushed makhana. Simmer on low heat for 8-10 minutes, stirring occasionally so it doesn’t stick to the bottom. The makhana will absorb the milk and turn pillow-soft.',
      },
      {
        stepNumber: 5,
        title: 'Sweetening and Final Garnish',
        instruction:
          'Turn off the heat. Stir in the jaggery powder, mishri, or sweetener of choice. Garnish generously with sliced Kashmiri Mamra almonds and pistachio slivers. Serve warm or refrigerate for 2 hours for a chilled shahi dessert.',
        chefTip: 'Always turn off the heat before stirring in jaggery to prevent the milk from curdling.',
      },
    ],
    nutritionalHighlights: [
      'High in plant protein and calcium for strong bones during fasting',
      'Low Glycemic Index prevents energy crashes during long fasts',
      'Zero cholesterol and rich in natural saffron carotenoids (crocin)',
    ],
    bundleCart: {
      bundleTitle: 'Royal Shahi Makhana Kheer Ingredient Box',
      bundlePrice: 999,
      bundleMrp: 1450,
      discountPercent: 31,
      description: 'Includes 250g Jumbo 6 Suta Makhana, 1g Pure Kashmiri Mongra Saffron, and 100g Mamra Almonds.',
    },
    faq: [
      {
        question: 'Can we eat Makhana Kheer during Navratri and Shivratri fasts?',
        answer:
          'Yes, 100%! Phool Makhana is an uncultivated aquatic lotus seed, making it one of the most sacred and revered foods for Hindu fasting (Vrat/Upvas). It provides clean energy and satisfies hunger without breaking fasting rules.',
      },
      {
        question: 'How do you make Makhana Kheer without sugar for diabetics?',
        answer:
          'Replace refined sugar with organic monk fruit, stevia, or crushed fresh dates. Because makhana has a low glycemic index (~40), diabetic patients can safely enjoy this kheer when prepared without added refined sucrose.',
      },
    ],
  },

  'roasted-masala-makhana': {
    slug: 'roasted-masala-makhana',
    title: 'Crispy Roasted Masala Makhana Recipe (Healthy 5-Minute Snack)',
    hindiTitle: 'कुरकुरा मसाला मखाना रेसिपी (5 मिनट में तैयार)',
    shortDescription:
      'Ultra-crunchy, golden roasted fox nuts tossed in desi cow ghee, turmeric, chaat masala, and pink Himalayan rock salt. The ultimate guilt-free 100-calorie tea-time snack.',
    metaTitle: 'Crispy Roasted Masala Makhana Recipe at Home in Ghee | Nuty Tales',
    metaDescription:
      'Learn how to make ultra-crispy roasted masala makhana at home in just 5 minutes with desi ghee and aromatic spices. The perfect 100-calorie weight loss snack.',
    heroImage: '/images/promo-makhana-899.webp',
    prepTimeMinutes: 2,
    cookTimeMinutes: 6,
    totalTimeMinutes: 8,
    isoTotalTime: 'PT8M',
    servings: 2,
    difficulty: 'Easy',
    caloriesPerServing: 110,
    proteinGrams: 4.1,
    fiberGrams: 2.2,
    isVratFriendly: true,
    dietaryTags: ['Vegan Option', 'Weight Loss', '100 Calorie Snack', 'Zero Trans Fat', 'Keto Friendly'],
    ingredients: [
      {
        name: 'NutyTales Jumbo Phool Makhana (6 Suta)',
        quantity: '2 large bowls (60 grams)',
        productSlug: 'makhana-grade-a-fox-nuts',
        productName: 'Jumbo 6 Suta Makhana',
        priceInr: 249,
        isNutyTalesProduct: true,
        image: '/images/promo-makhana-899.webp',
      },
      {
        name: 'Desi Cow Ghee (or Cold-Pressed Mustard Oil)',
        quantity: '1 tablespoon',
        isNutyTalesProduct: false,
      },
      {
        name: 'Himalayan Pink Rock Salt (Sendha Namak)',
        quantity: '1/2 teaspoon',
        isNutyTalesProduct: false,
      },
      {
        name: 'Turmeric Powder (Haldi)',
        quantity: '1/4 teaspoon',
        isNutyTalesProduct: false,
      },
      {
        name: 'Roasted Cumin & Chaat Masala',
        quantity: '1/2 teaspoon',
        isNutyTalesProduct: false,
      },
      {
        name: 'Freshly Ground Black Pepper (Kali Mirch)',
        quantity: '1/4 teaspoon',
        isNutyTalesProduct: false,
      },
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Initial Dry Heat Warming',
        instruction:
          'Warm a wide, thick-bottomed kadai or non-stick pan on medium flame. Add 1 tablespoon of pure desi cow ghee and let it melt.',
      },
      {
        stepNumber: 2,
        title: 'Slow Roasting to Cloud Crunch',
        instruction:
          'Lower the flame to low. Add 60g of NutyTales Jumbo Makhana. Stir continuously for 5 to 6 minutes. The makhana will absorb the ghee and turn into crispy golden clouds. Test one by crushing it between your fingers — it should shatter cleanly with zero chewiness.',
      },
      {
        stepNumber: 3,
        title: 'Aromatic Spice Toss',
        instruction:
          'Turn off the flame while the pan is still hot. Immediately sprinkle turmeric, pink rock salt, chaat masala, and black pepper. Toss vigorously for 30 seconds so the spice coats every makhana evenly.',
        chefTip: 'Adding spices while the flame is on can burn the delicate turmeric and pepper. Always turn off the gas right before seasoning.',
      },
      {
        stepNumber: 4,
        title: 'Cooling & Storing',
        instruction:
          'Allow the makhana to cool to room temperature for 10 minutes to reach maximum crispness. Enjoy immediately with ginger chai, or store in an airtight glass jar for up to 3 weeks.',
      },
    ],
    nutritionalHighlights: [
      'Only 110 calories per giant bowl (fills stomach volume without calorie surplus)',
      'Rich in kaempferol flavonoid preventing cellular oxidation',
      'Zero refined palm oil or artificial MSG found in commercial packaged chips',
    ],
    bundleCart: {
      bundleTitle: '5-Minute Masala Makhana Starter Pack',
      bundlePrice: 479,
      bundleMrp: 799,
      discountPercent: 40,
      description: '500g Jumbo 6 Suta Makhana (yields 10 large snack bowls at ₹48 per bowl).',
    },
    faq: [
      {
        question: 'Why does makhana sometimes turn soft or soggy after roasting?',
        answer:
          'Makhana is highly hygroscopic (absorbs moisture from the air). If not roasted long enough on low heat or if stored before completely cooling down, trapped steam softens the puff. Always cool completely and seal in an airtight container.',
      },
    ],
  },

  'kashmiri-kahwa-tea-recipe': {
    slug: 'kashmiri-kahwa-tea-recipe',
    title: 'Authentic Kashmiri Kehwa Green Tea with Saffron & Almonds',
    hindiTitle: 'पारंपरिक कश्मीरी कहवा चाय रेसिपी',
    shortDescription:
      'The legendary soul-warming green tea of the Kashmir Valley. Brewed with green tea leaves, whole green cardamom, cinnamon, crushed Kashmiri Mamra almonds, and pure Pampore Mongra saffron.',
    metaTitle: 'Authentic Kashmiri Kahwa Tea Recipe with Saffron & Almonds | Nuty Tales',
    metaDescription:
      'Brew authentic Kashmiri Kehwa at home with pure Kashmiri Mongra Saffron, green cardamom, and Mamra badam. Traditional detox tea for immunity and digestion.',
    heroImage: '/images/saffron-threads-macro.jpg',
    prepTimeMinutes: 5,
    cookTimeMinutes: 10,
    totalTimeMinutes: 15,
    isoTotalTime: 'PT15M',
    servings: 4,
    difficulty: 'Easy',
    caloriesPerServing: 48,
    proteinGrams: 1.8,
    fiberGrams: 0.9,
    isVratFriendly: true,
    dietaryTags: ['Herbal Detox', 'Antioxidant Rich', 'Kashmir Terroir', 'Metabolic Booster', 'Immunity Drink'],
    ingredients: [
      {
        name: 'Pure Kashmiri Mongra Saffron',
        quantity: '12 - 15 strands',
        productSlug: 'kashmiri-mongra-saffron',
        productName: 'Pure Kashmiri Mongra Saffron',
        priceInr: 420,
        isNutyTalesProduct: true,
        image: '/images/saffron-threads-macro.jpg',
      },
      {
        name: 'Kashmiri Mamra Almonds (Blanched & Sliced)',
        quantity: '8 - 10 kernels (thin slivers)',
        productSlug: 'mamra-almonds-kashmiri-badam',
        productName: 'Kashmiri Mamra Almonds',
        priceInr: 480,
        isNutyTalesProduct: true,
        image: '/images/hero-lifestyle-bowl.png',
      },
      {
        name: 'Whole Kashmiri Green Tea Leaves (Kahwa Leaves)',
        quantity: '2 teaspoons',
        isNutyTalesProduct: false,
      },
      {
        name: 'Green Cardamom (Crushed)',
        quantity: '4 pods',
        isNutyTalesProduct: false,
      },
      {
        name: 'Cinnamon Stick (Dalchini)',
        quantity: '1 inch stick',
        isNutyTalesProduct: false,
      },
      {
        name: 'Pure Kashmiri Acacia Honey (or Raw Sugar)',
        quantity: '2 tablespoons',
        productSlug: 'pure-kashmiri-acacia-honey',
        productName: 'Pure Kashmiri Acacia Honey',
        priceInr: 490,
        isNutyTalesProduct: true,
        image: '/images/promo-makhana-899.webp',
      },
      {
        name: 'Fresh Filtered Water',
        quantity: '4 cups (approx 800ml)',
        isNutyTalesProduct: false,
      },
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Spice Decoction Infusion',
        instruction:
          'In a saucepan, bring 4 cups of water to a boil. Add crushed green cardamom, cinnamon stick, and half of the pure Kashmiri saffron strands (6 strands). Simmer on low flame for 4 to 5 minutes until the essential oils perfume the water and a pale golden hue emerges.',
      },
      {
        stepNumber: 2,
        title: 'Gentle Green Tea Steeping',
        instruction:
          'Turn off the flame. Add 2 teaspoons of whole Kashmiri green tea leaves. Cover the pot with a tight lid and let it steep undisturbed for 2.5 to 3 minutes.',
        chefTip: 'Never boil green tea leaves with bubbling water. Boiling burns tea polyphenols and produces a harsh, bitter astringency.',
      },
      {
        stepNumber: 3,
        title: 'Straining and Cup Preparation',
        instruction:
          'Place a teaspoon of thinly slivered Kashmiri Mamra almonds and 1-2 fresh saffron strands at the bottom of each tea cup.',
      },
      {
        stepNumber: 4,
        title: 'Pouring and Sweetening',
        instruction:
          'Strain the hot golden Kehwa into the cups over the almonds. Stir in 1/2 teaspoon of raw Kashmiri Acacia honey per cup. Sip hot and savor the crunch of the steeped almond slivers at the bottom of the cup.',
      },
    ],
    nutritionalHighlights: [
      'Crocetin in saffron elevates mood and clears mental fatigue',
      'Spiced cardamom & cinnamon soothe post-meal bloating and accelerate digestion',
      'Over 400% higher antioxidant activity than conventional bagged black tea',
    ],
    bundleCart: {
      bundleTitle: 'Authentic Kashmiri Kahwa Tea Kit',
      bundlePrice: 899,
      bundleMrp: 1299,
      discountPercent: 31,
      description: 'Includes 1g Pure Kashmiri Mongra Saffron, 100g Mamra Almonds, and 250g Raw Acacia Honey.',
    },
    faq: [
      {
        question: 'What is the best time to drink Kashmiri Kahwa?',
        answer:
          'Kahwa is traditionally served immediately after rich meals (such as Wazwan) to aid digestion, or in the chilly morning and late afternoon to provide deep cellular warmth and respiratory clarity.',
      },
    ],
  },

  'panjiri-recipe-for-new-mothers': {
    slug: 'panjiri-recipe-for-new-mothers',
    title: 'Traditional Gond Makhana Panjiri Recipe for Postpartum Healing',
    hindiTitle: 'गोंड और मखाना पंजिरी रेसिपी (प्रसूति स्वास्थ्य)',
    shortDescription:
      'The sacred Ayurvedic postpartum rejuvenation recipe. Handcrafted with edible gum (gond), roasted jumbo makhana, Kashmiri Mamra almonds, walnuts, and desi ghee to rebuild maternal strength, heal pelvic joints, and boost lactation.',
    metaTitle: 'Traditional Gond Makhana Panjiri Recipe for Postpartum | Nuty Tales',
    metaDescription:
      'Ayurvedic Gond Makhana Panjiri recipe for new mothers post delivery. Packed with calcium-rich makhana, edible gum, walnuts, and Mamra almonds for lactation and joint strength.',
    heroImage: '/images/hero-lifestyle-bowl.png',
    prepTimeMinutes: 15,
    cookTimeMinutes: 25,
    totalTimeMinutes: 40,
    isoTotalTime: 'PT40M',
    servings: 12,
    difficulty: 'Medium',
    caloriesPerServing: 285,
    proteinGrams: 5.8,
    fiberGrams: 3.4,
    isVratFriendly: false,
    dietaryTags: ['Ayurvedic Postpartum', 'Lactation Boost', 'Joint Lubrication', 'Rich in Calcium', 'Deep Vitality'],
    ingredients: [
      {
        name: 'NutyTales Jumbo Phool Makhana (Crushed)',
        quantity: '2 cups (60g)',
        productSlug: 'makhana-grade-a-fox-nuts',
        productName: 'Jumbo 6 Suta Makhana',
        priceInr: 249,
        isNutyTalesProduct: true,
        image: '/images/promo-makhana-899.webp',
      },
      {
        name: 'Edible Gum (Gond / Dink)',
        quantity: '1/2 cup (approx 80g)',
        isNutyTalesProduct: false,
      },
      {
        name: 'Kashmiri Mamra Almonds (Chopped)',
        quantity: '1 cup (120g)',
        productSlug: 'mamra-almonds-kashmiri-badam',
        productName: 'Kashmiri Mamra Almonds',
        priceInr: 480,
        isNutyTalesProduct: true,
        image: '/images/hero-lifestyle-bowl.png',
      },
      {
        name: 'Snow White Kashmiri Walnuts (Chopped)',
        quantity: '1/2 cup (70g)',
        productSlug: 'walnut-kernels-halves-pieces',
        productName: 'Snow White Kashmiri Walnuts',
        priceInr: 390,
        isNutyTalesProduct: true,
        image: '/images/saffron-threads-macro.jpg',
      },
      {
        name: 'King Jumbo W180 Cashews',
        quantity: '1/2 cup (70g)',
        productSlug: 'king-jumbo-w180-cashews',
        productName: 'King Jumbo Cashews',
        priceInr: 320,
        isNutyTalesProduct: true,
        image: '/images/hero-lifestyle-bowl.png',
      },
      {
        name: 'Pure Desi Cow Ghee',
        quantity: '1 cup (approx 200g)',
        isNutyTalesProduct: false,
      },
      {
        name: 'Whole Wheat Flour (Atta) or Kamut',
        quantity: '1.5 cups',
        isNutyTalesProduct: false,
      },
      {
        name: 'Bura Sugar or Khand / Jaggery',
        quantity: '1.25 cups',
        isNutyTalesProduct: false,
      },
      {
        name: 'Dry Ginger Powder (Sonth) & Ajwain',
        quantity: '1 teaspoon each',
        isNutyTalesProduct: false,
      },
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Popping the Edible Gum (Gond)',
        instruction:
          'Heat 3 tablespoons of ghee in a kadai on low heat. Add edible gum (gond) in small batches. It will puff up like white popcorn. Remove immediately onto a plate once puffed. When cool, crush lightly with the bottom of a steel glass.',
        chefTip: 'Keep flame low; if ghee is too hot, gond burns on the outside while staying rock-hard in the center.',
      },
      {
        stepNumber: 2,
        title: 'Roasting Nuts and Makhana',
        instruction:
          'In the remaining ghee, fry chopped Mamra almonds, cashews, and walnuts until golden and nutty (approx 3 mins). Remove. In the same pan, fry the makhana until crisp and crush coarsely.',
      },
      {
        stepNumber: 3,
        title: 'Roasting the Whole Wheat Flour (Atta)',
        instruction:
          'Add remaining ghee to the pan. Add whole wheat flour. Roast on low-medium flame continuously for 12 to 15 minutes until it turns a deep nutty golden-brown color and releases a divine roasted aroma.',
      },
      {
        stepNumber: 4,
        title: 'Blending the Panjiri Mixture',
        instruction:
          'Turn off the heat. Let the flour cool for 10 minutes until warm (not hot). Add the popped gond, roasted nuts, makhana, sonth (dry ginger), ajwain, and bura sugar. Mix thoroughly until evenly incorporated.',
      },
    ],
    nutritionalHighlights: [
      'Gond lubricates postpartum pelvic bone joints and prevents backache',
      'Makhana and Mamra badam provide dense bioavailable calcium & zinc',
      'Sonth (dry ginger) stimulates digestive fire (Agni) and eases postpartum uterine involution',
    ],
    bundleCart: {
      bundleTitle: 'Ayurvedic Postpartum Panjiri Raw Dry Fruit Box',
      bundlePrice: 1399,
      bundleMrp: 1899,
      discountPercent: 26,
      description: 'Includes 250g Makhana, 250g Mamra Badam, 250g Kashmiri Walnuts, and 250g W180 Cashews.',
    },
    faq: [
      {
        question: 'When can a new mother start eating Gond Panjiri after delivery?',
        answer:
          'Traditional Ayurvedic vaidyas recommend introducing 2-3 tablespoons of Panjiri daily with warm milk from day 7 post-normal delivery (or day 14 post-cesarean section once the initial wound healing has begun).',
      },
    ],
  },

  'sugar-free-dry-fruit-laddu': {
    slug: 'sugar-free-dry-fruit-laddu',
    title: 'Sugar-Free Healthy Dry Fruit Laddu (Energy Balls with Dates & Nuts)',
    hindiTitle: 'बिना चीनी के ड्राई फ्रूट लड्डू रेसिपी',
    shortDescription:
      'Nutrient-dense, naturally sweetened energy laddus made without a single gram of sugar or jaggery. Crafted with soft Medjool dates, figs (anjeer), roasted almonds, walnuts, pistachios, and chia seeds.',
    metaTitle: 'Sugar-Free Dry Fruit Laddu Recipe with Dates & Figs | Nuty Tales',
    metaDescription:
      'Easy 15-minute sugar-free dry fruit laddu recipe made with Medjool dates, Afghan anjeer, walnuts, and almonds. Zero added sugar, vegan, and diabetic friendly.',
    heroImage: '/images/hero-lifestyle-bowl.png',
    prepTimeMinutes: 10,
    cookTimeMinutes: 5,
    totalTimeMinutes: 15,
    isoTotalTime: 'PT15M',
    servings: 15,
    difficulty: 'Easy',
    caloriesPerServing: 145,
    proteinGrams: 3.8,
    fiberGrams: 2.9,
    isVratFriendly: true,
    dietaryTags: ['Zero Added Sugar', '100% Natural Dates', 'Diabetic Friendly', 'High Fiber', 'Vegan Clean Energy'],
    ingredients: [
      {
        name: 'Royal Medjool or Ajwa Dates (Pitted & Chopped)',
        quantity: '2 cups (approx 300g)',
        productSlug: 'medjool-dates-premium',
        productName: 'Royal Medjool Dates',
        priceInr: 490,
        isNutyTalesProduct: true,
        image: '/images/promo-makhana-899.webp',
      },
      {
        name: 'Afghan Kandahari Mala Anjeer (Chopped)',
        quantity: '1/2 cup (80g)',
        productSlug: 'afghan-kandahari-mala-anjeer',
        productName: 'Afghan Mala Anjeer',
        priceInr: 390,
        isNutyTalesProduct: true,
        image: '/images/promo-makhana-899.webp',
      },
      {
        name: 'Kashmiri Mamra Almonds (Roughly Chopped)',
        quantity: '1/2 cup (70g)',
        productSlug: 'mamra-almonds-kashmiri-badam',
        productName: 'Kashmiri Mamra Almonds',
        priceInr: 480,
        isNutyTalesProduct: true,
        image: '/images/hero-lifestyle-bowl.png',
      },
      {
        name: 'Snow White Kashmiri Walnuts (Chopped)',
        quantity: '1/2 cup (60g)',
        productSlug: 'walnut-kernels-halves-pieces',
        productName: 'Snow White Walnuts',
        priceInr: 390,
        isNutyTalesProduct: true,
        image: '/images/saffron-threads-macro.jpg',
      },
      {
        name: 'Raw Pistachios & Roasted Pumpkin Seeds',
        quantity: '1/4 cup each',
        productSlug: 'pumpkin-seeds-roasted',
        productName: 'Roasted Pumpkin Seeds',
        priceInr: 220,
        isNutyTalesProduct: true,
        image: '/images/saffron-threads-macro.jpg',
      },
      {
        name: 'Pure Desi Cow Ghee (or Coconut Oil)',
        quantity: '1 tablespoon',
        isNutyTalesProduct: false,
      },
      {
        name: 'Cardamom & Nutmeg Powder',
        quantity: '1/2 teaspoon',
        isNutyTalesProduct: false,
      },
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Toast the Crunch',
        instruction:
          'Heat 1 tablespoon of ghee in a pan. Add chopped almonds, walnuts, pistachios, and pumpkin seeds. Roast on low heat for 3-4 minutes until aromatic and crunchy. Set aside.',
      },
      {
        stepNumber: 2,
        title: 'Softening the Date & Fig Binder',
        instruction:
          'In a food processor, pulse the pitted Medjool dates and chopped figs until a sticky, paste-like dough forms. Transfer to the warm pan on low flame and cook for 2 minutes to make it malleable.',
      },
      {
        stepNumber: 3,
        title: 'Knead and Shape',
        instruction:
          'Turn off the heat. Fold in the roasted warm nuts, seeds, cardamom, and nutmeg. When comfortably warm to touch, roll tablespoon-sized balls between your palms into glossy round laddus.',
      },
    ],
    nutritionalHighlights: [
      '100% naturally sweetened by whole Medjool dates and sun-dried figs',
      'Dense with Omega-3 fatty acids, magnesium, and dietary fiber',
      'Shelf-stable for 30 days without refrigeration',
    ],
    bundleCart: {
      bundleTitle: 'Sugar-Free Laddu Raw Ingredient Hamper',
      bundlePrice: 1299,
      bundleMrp: 1750,
      discountPercent: 26,
      description: 'Includes 500g Medjool Dates, 250g Anjeer, 250g Mamra Almonds, and 250g Walnuts.',
    },
    faq: [
      {
        question: 'Are date-based dry fruit laddus safe for diabetic patients?',
        answer:
          'Yes, in moderation (1 laddu per day). Unlike processed cane sugar which causes rapid insulin spikes, the intact fiber in dates and figs combined with the healthy fats in walnuts and almonds significantly flattens glycemic absorption.',
      },
    ],
  },

  'badam-milk-recipe': {
    slug: 'badam-milk-recipe',
    title: 'Royal Kashmiri Badam Milk Recipe (Kesar Badam Doodh)',
    hindiTitle: 'शाही केसर बादाम दूध रेसिपी',
    shortDescription:
      'Traditional Ayurvedic restorative beverage made with soaked and peeled Kashmiri Mamra almonds, saffron strands, green cardamom, and rich pistachio slivers.',
    metaTitle: 'Royal Kashmiri Badam Milk Recipe (Kesar Badam Doodh) | Nuty Tales',
    metaDescription:
      'Learn how to make authentic Royal Kashmiri Kesar Badam Milk at home. Rich in Vitamin E, memory-enhancing saffron, and high-oil Mamra almonds for memory, immunity, and stamina.',
    heroImage: '/images/hero-lifestyle-bowl.png',
    prepTimeMinutes: 15,
    cookTimeMinutes: 15,
    totalTimeMinutes: 30,
    isoTotalTime: 'PT30M',
    servings: 4,
    difficulty: 'Easy',
    caloriesPerServing: 185,
    proteinGrams: 7.2,
    fiberGrams: 2.1,
    isVratFriendly: true,
    dietaryTags: ['Vegetarian', 'Gluten-Free', 'Ayurvedic', 'Vrat Friendly', 'High Protein', 'Kid Friendly'],
    ingredients: [
      {
        name: 'Kashmiri Mamra Almonds (Soaked & Peeled)',
        quantity: '25 kernels (approx. 50g)',
        productSlug: 'mamra-almonds-kashmiri-badam',
        productName: 'Kashmiri Mamra Almonds',
        priceInr: 1650,
        isNutyTalesProduct: true,
      },
      {
        name: 'Pure Kashmiri Mogra Saffron (Kesar)',
        quantity: '10 to 12 strands',
        productSlug: 'kashmiri-saffron-mongra',
        productName: 'Kashmiri Mogra Saffron',
        priceInr: 650,
        isNutyTalesProduct: true,
      },
      {
        name: 'Whole Milk (Full Cream Cow or Buffalo Milk)',
        quantity: '1 liter (4 cups)',
      },
      {
        name: 'Green Cardamom (Elaichi) Pods',
        quantity: '4 pods (freshly crushed)',
      },
      {
        name: 'Unrefined Mishri (Rock Sugar) or Honey',
        quantity: '2 to 3 tablespoons',
      },
      {
        name: 'Roasted Pistachios (Finely Slivered for Garnish)',
        quantity: '10 pistachios',
        productSlug: 'iranian-roasted-salted-pistachios',
        productName: 'Jumbo Pistachios',
        priceInr: 1150,
        isNutyTalesProduct: true,
      },
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Soak & Peel Mamra Almonds',
        instruction:
          'Soak 25 Kashmiri Mamra almonds in warm water for 4 hours (or overnight). Pinch off the brown skins; the kernels will be creamy white and swollen with natural oil.',
        chefTip: 'Never discard the soaked almond water outside; use it to water plants as it holds natural minerals.',
      },
      {
        stepNumber: 2,
        title: 'Grind Almond Paste',
        instruction:
          'Transfer the peeled almonds to a blender with 4 tablespoons of warm milk. Blend on high speed until you achieve a silky, lump-free almond paste.',
      },
      {
        stepNumber: 3,
        title: 'Steep Saffron Strands',
        instruction:
          'Place 10-12 Kashmiri Mogra saffron threads into 2 tablespoons of warm milk. Let steep for 15 minutes until it blooms into a vibrant royal golden-orange hue.',
      },
      {
        stepNumber: 4,
        title: 'Simmer Milk with Almond Paste',
        instruction:
          'In a heavy-bottomed brass or stainless steel pan, bring 1 liter of whole milk to a gentle boil. Lower the flame and stir in the smooth almond paste thoroughly.',
      },
      {
        stepNumber: 5,
        title: 'Infuse Saffron, Cardamom & Sweetener',
        instruction:
          'Add the golden saffron infusion, crushed green cardamom powder, and unrefined mishri. Simmer on low heat for 8 to 10 minutes, stirring continuously so the milk does not stick.',
      },
      {
        stepNumber: 6,
        title: 'Garnish & Serve',
        instruction:
          'Pour into traditional earthen kulhads or glasses. Garnish lavishly with slivered pistachios and extra saffron strands. Serve piping hot in winter or chilled during summer.',
      },
    ],
    nutritionalHighlights: [
      'Delivers bio-available Vitamin E from 50% natural oil Kashmiri Mamra almonds',
      'Neuro-protective mood enhancement from lab-certified Mogra saffron crocin',
      'Rich in complete dairy and nut proteins supporting growing children and athlete stamina',
    ],
    bundleCart: {
      bundleTitle: 'Royal Kesar Badam Milk Ingredient Bundle',
      bundlePrice: 1899,
      bundleMrp: 2500,
      discountPercent: 24,
      description: 'Includes 500g Kashmiri Mamra Almonds, 1g Mogra Saffron, and 250g Pista slivers.',
    },
    faq: [
      {
        question: 'Can badam milk be given to young children every day?',
        answer:
          'Yes, homemade Kesar Badam milk is one of the most celebrated pediatric tonics in India. It delivers riboflavin, calcium, and L-carnitine, supporting cognitive learning, memory retention, and bone density.',
      },
      {
        question: 'Should badam milk be consumed hot or cold?',
        answer:
          'Both are delicious! In autumn and winter, hot badam milk warms the chest and induces restful sleep. In summer, chilling it in the refrigerator turns it into a luxurious, refreshing traditional kulfi-style beverage.',
      },
    ],
  },
}
