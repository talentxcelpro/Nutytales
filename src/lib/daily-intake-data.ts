// ─── Programmatic Daily Intake, Timing & Ayurvedic Soaking Knowledge Base ─────────
// Targets 15M+ annual searches: "how many [commodity] to eat per day", "soaked vs raw", "best time to eat"

export interface IntakeGuidelineByAge {
  group: string
  ageRange: string
  recommendedCount: string
  recommendedGrams: string
  optimalTiming: string
  clinicalReason: string
}

export interface IntakeCommodityData {
  slug: string
  commodityName: string
  hindiName: string
  botanicalName: string
  heroBadge: string
  metaTitle: string
  metaDescription: string
  headline: string
  subheadline: string
  productSlug: string
  productName: string
  productPrice: number
  productImage: string
  monthlyPackTitle: string
  monthlyPackPrice: number
  monthlyPackMrp: number
  monthlyPackWeight: string
  dailyCalorieAverage: number
  keyNutrientsPerDailyDose: {
    nutrient: string
    amount: string
    dailyValuePercent: string
  }[]
  ageGuidelines: IntakeGuidelineByAge[]
  soakingProtocol: {
    recommended: boolean
    soakingDurationHours: number
    waterType: string
    peelSkin: boolean
    biochemicalReason: string
    stepByStep: {
      step: number
      title: string
      desc: string
    }[]
  }
  idealTimingClock: {
    timeOfDay: string
    ayurvedicPhase: string
    bestFor: string
    howToConsume: string
  }[]
  whoShouldAvoidOrLimit: {
    condition: string
    safeLimit: string
    caution: string
  }[]
  faq: {
    question: string
    answer: string
  }[]
}

export const DAILY_INTAKE_DATA: Record<string, IntakeCommodityData> = {
  almonds: {
    slug: 'almonds',
    commodityName: 'Almonds (Badam)',
    hindiName: 'बादाम',
    botanicalName: 'Prunus dulcis (Kashmiri Seedling Mamra)',
    heroBadge: 'ICMR & Ayurvedic Daily Intake Protocol',
    metaTitle: 'How Many Almonds to Eat Per Day? Daily Intake by Age, Soaking Rules & Timing | Nuty Tales',
    metaDescription:
      'Discover the exact scientific number of almonds to eat per day for adults, kids, and pregnancy. Learn why soaking Mamra badam removes phytic acid for 100% nutrient absorption.',
    headline: 'How Many Almonds Should You Eat Per Day?',
    subheadline:
      'Clinical serving sizes, overnight water soaking protocols, and Ayurvedic timing to unlock 100% bio-available Vitamin E, natural oils, and memory enhancement.',
    productSlug: 'mamra-almonds-kashmiri-badam',
    productName: 'Kashmiri Mamra Almonds (High Oil Seedling)',
    productPrice: 1650,
    productImage: '/images/hero-lifestyle-bowl.png',
    monthlyPackTitle: '30-Day Daily Brain & Heart Portion Box (500g Mamra)',
    monthlyPackPrice: 1599,
    monthlyPackMrp: 2199,
    monthlyPackWeight: '500g (Approx. 30 Daily Servings of 8–10 Kernels)',
    dailyCalorieAverage: 110,
    keyNutrientsPerDailyDose: [
      { nutrient: 'Natural Vitamin E (alpha-tocopherol)', amount: '6.2 mg', dailyValuePercent: '41% RDA' },
      { nutrient: 'Plant Protein', amount: '4.8 g', dailyValuePercent: '10% RDA' },
      { nutrient: 'Monounsaturated Healthy Fats', amount: '9.4 g', dailyValuePercent: '18% RDA' },
      { nutrient: 'Dietary Fiber', amount: '2.5 g', dailyValuePercent: '9% RDA' },
      { nutrient: 'Magnesium', amount: '54 mg', dailyValuePercent: '13% RDA' },
    ],
    ageGuidelines: [
      {
        group: 'Toddlers & Young Children',
        ageRange: '2 – 8 Years',
        recommendedCount: '2 to 4 Almonds',
        recommendedGrams: '5 – 8 grams',
        optimalTiming: 'Morning breakfast (peeled & finely ground/paste)',
        clinicalReason:
          'Prevents choking hazards; delivers critical L-carnitine and riboflavin for developing neurological synapses and ocular health.',
      },
      {
        group: 'Adolescents & Growing Teens',
        ageRange: '9 – 18 Years',
        recommendedCount: '6 to 8 Almonds',
        recommendedGrams: '12 – 16 grams',
        optimalTiming: 'Morning empty stomach with warm water or milk',
        clinicalReason:
          'Supports rapid pubertal growth spurts, academic cognitive concentration, and skin sebum balancing during hormonal changes.',
      },
      {
        group: 'Healthy Adults',
        ageRange: '19 – 59 Years',
        recommendedCount: '8 to 12 Almonds (Mamra) or 15–20 (California)',
        recommendedGrams: '20 – 28 grams (1 Handful)',
        optimalTiming: 'Morning empty stomach or 4:00 PM tea substitute',
        clinicalReason:
          'Mamra contains up to 50% monounsaturated oils, meaning 8 Mamra kernels deliver equivalent lipid nourishment to 18 pasteurized California kernels.',
      },
      {
        group: 'Pregnant & Nursing Mothers',
        ageRange: 'Any (Post-Doctoral Clearance)',
        recommendedCount: '8 to 10 Soaked Almonds',
        recommendedGrams: '16 – 20 grams',
        optimalTiming: 'Morning breakfast alongside soaked walnuts',
        clinicalReason:
          'Supplies bio-available dietary folates, calcium, and essential fatty acids for fetal spinal cord formation and lactation volume.',
      },
      {
        group: 'Senior Citizens',
        ageRange: '60+ Years',
        recommendedCount: '5 to 7 Soaked & Peeled Almonds',
        recommendedGrams: '10 – 14 grams',
        optimalTiming: 'Praatah Kaal (Early morning with warm cumin/fennel water)',
        clinicalReason:
          'Gentle on slowing peristalsis; anti-inflammatory polyphenols defend against age-related cognitive decline (Alzheimer’s biomarkers).',
      },
    ],
    soakingProtocol: {
      recommended: true,
      soakingDurationHours: 8,
      waterType: 'Clean room-temperature filtered water (or earthen clay pot)',
      peelSkin: true,
      biochemicalReason:
        'Almond skins contain high concentrations of tannin and phytic acid, which act as plant self-defense enzyme inhibitors. When consumed raw, phytic acid binds to zinc, iron, and calcium in your intestines, inhibiting absorption. Soaking for 8 hours triggers seed germination, breaking down phytic acid and activating lipase enzymes for effortless digestion.',
      stepByStep: [
        {
          step: 1,
          title: 'Measure Daily Dose',
          desc: 'Count 8 to 10 Kashmiri Mamra almonds per adult into a glass or earthenware bowl.',
        },
        {
          step: 2,
          title: 'Submerge in Filtered Water',
          desc: 'Pour fresh filtered water to submerge kernels by at least 2 inches. Cover with a breathable muslin cloth or lid.',
        },
        {
          step: 3,
          title: '8-Hour Overnight Rest',
          desc: 'Allow the almonds to soak overnight (6 to 8 hours). The kernels will visibly plump up as the cell walls hydrate.',
        },
        {
          step: 4,
          title: 'Drain & Gently Peel',
          desc: 'Discard the brownish soaking water (which now holds the leached tannins). Pinch each almond between your thumb and forefinger; the brown skin slips off effortlessly.',
        },
      ],
    },
    idealTimingClock: [
      {
        timeOfDay: '06:30 AM – 08:00 AM (Praatah Kaal)',
        ayurvedicPhase: 'Kapha Balancing / Morning Empty Stomach',
        bestFor: 'Mental clarity, metabolic kickstart, and sustained energy',
        howToConsume: 'Chew soaked and peeled almonds thoroughly on an empty stomach with a cup of warm water.',
      },
      {
        timeOfDay: '04:00 PM – 05:00 PM (Aparahna)',
        ayurvedicPhase: 'Vata Soothing / Evening Slump',
        bestFor: 'Curbs sugar and junk food cravings; prevents blood glucose crashes',
        howToConsume: 'Dry-roasted unpeeled Mamra with a pinch of rock salt and Kashmiri kahwa.',
      },
      {
        timeOfDay: '09:30 PM (Raatri)',
        ayurvedicPhase: 'Nidra / Bedtime',
        bestFor: 'Deep restorative REM sleep and melatonin production',
        howToConsume: 'Crush 4 soaked almonds into warm milk infused with 2 strands of pure Kashmiri saffron.',
      },
    ],
    whoShouldAvoidOrLimit: [
      {
        condition: 'Kidney Stones (Calcium Oxalate)',
        safeLimit: 'Maximum 4 to 5 almonds daily',
        caution: 'Almonds have moderate oxalate levels. Always soak and peel, and drink 3 liters of water daily.',
      },
      {
        condition: 'Severe Nut Allergy',
        safeLimit: '0 (Strictly Avoid)',
        caution: 'Individuals with confirmed tree-nut anaphylaxis must avoid all Prunus species.',
      },
    ],
    faq: [
      {
        question: 'Should you eat soaked almonds with or without the peel?',
        answer:
          'Always peel soaked almonds. The brown skin contains tannin and phytic acid, which inhibit nutrient absorption and irritate sensitive stomach linings. Once soaked, the skin slips off in seconds, leaving pure, bio-available nutrition.',
      },
      {
        question: 'Why do you need fewer Mamra almonds than California almonds?',
        answer:
          'Kashmiri Mamra almonds are non-hybrid, 100% natural seedlings with 45–50% natural oil content, whereas mass-cultivated California almonds are pasteurized and have only 20–25% oil. Thus, 8 Mamra almonds deliver more pure nutrition than 18 California almonds without stomach heaviness.',
      },
      {
        question: 'Can eating too many almonds cause heat or pimples in the body?',
        answer:
          'In Ayurveda, raw unsoaked almonds have an Ushna (heating) virya. Eating more than 15 unsoaked almonds in hot weather can cause pitta flare-ups (mouth ulcers, acne). Soaking them in water neutralizes this heat completely, making them cooling (Sheetal) and safe year-round.',
      },
    ],
  },

  walnuts: {
    slug: 'walnuts',
    commodityName: 'Walnuts (Akhrot Giri)',
    hindiName: 'अखरोट',
    botanicalName: 'Juglans regia (Kashmiri Snow White Akhrot)',
    heroBadge: 'Brain DHA & Omega-3 Daily Guide',
    metaTitle: 'How Many Walnuts to Eat Per Day? Daily Akhrot Dosage, Soaking & Brain Benefits | Nuty Tales',
    metaDescription:
      'Learn how many walnuts to eat per day for brain health, cholesterol, and fertility. Discover why soaking Kashmiri Snow White Akhrot overnight unlocks active plant Omega-3 ALA.',
    headline: 'How Many Walnuts Should You Eat Per Day?',
    subheadline:
      'Exact medical dosage of Kashmiri Snow White Akhrot halves to lower LDL cholesterol, boost memory, and balance hormones without excessive calorie load.',
    productSlug: 'kashmiri-snow-white-walnut-kernels',
    productName: 'Kashmiri Snow White Walnut Kernels (Light Halves)',
    productPrice: 1250,
    productImage: '/images/hero-lifestyle-bowl.png',
    monthlyPackTitle: '30-Day Executive Brain Power Walnut Pack (500g)',
    monthlyPackPrice: 1199,
    monthlyPackMrp: 1699,
    monthlyPackWeight: '500g (Approx. 60 Halves / 30 Daily Portions)',
    dailyCalorieAverage: 130,
    keyNutrientsPerDailyDose: [
      { nutrient: 'Plant Omega-3 (Alpha-Linolenic Acid / ALA)', amount: '2.5 g', dailyValuePercent: '160% RDA' },
      { nutrient: 'Polyphenol Antioxidants', amount: '69 µmol', dailyValuePercent: 'Top Rank Among All Nuts' },
      { nutrient: 'Copper', amount: '0.45 mg', dailyValuePercent: '50% RDA' },
      { nutrient: 'Manganese', amount: '1.0 mg', dailyValuePercent: '43% RDA' },
      { nutrient: 'Dietary Melatonin', amount: '3.5 ng', dailyValuePercent: 'Natural Sleep Hormone' },
    ],
    ageGuidelines: [
      {
        group: 'Children & Students',
        ageRange: '4 – 16 Years',
        recommendedCount: '1 to 2 Halves (1 whole kernel)',
        recommendedGrams: '7 – 10 grams',
        optimalTiming: 'Morning study hours with a teaspoon of pure honey',
        clinicalReason:
          'Contains neuro-protective compounds, including vitamin E, folate, and melatonin, which accelerate brain information processing speed.',
      },
      {
        group: 'Adults & Working Professionals',
        ageRange: '17 – 55 Years',
        recommendedCount: '2 to 4 Halves (1 to 2 whole kernels)',
        recommendedGrams: '14 – 20 grams',
        optimalTiming: 'Morning empty stomach or with midday salad',
        clinicalReason:
          '2.5g of ALA omega-3 daily actively prevents vascular arterial plaque deposition, lowers total serum cholesterol, and reduces office mental fatigue.',
      },
      {
        group: 'Men Seeking Fertility & Sperm Motility',
        ageRange: 'Adult Men',
        recommendedCount: '4 to 6 Halves',
        recommendedGrams: '25 – 30 grams',
        optimalTiming: 'Daily evening snack',
        clinicalReason:
          'A landmark UCLA clinical trial showed that consuming 75g of walnuts daily significantly improved sperm vitality, motility, and normal morphology.',
      },
      {
        group: 'Senior Citizens',
        ageRange: '56+ Years',
        recommendedCount: '2 Halves (Soaked)',
        recommendedGrams: '10 – 14 grams',
        optimalTiming: 'Early morning soaked in warm water',
        clinicalReason:
          'Decreases markers of systemic neuro-inflammation and supports endothelial micro-circulation in the cardiovascular system.',
      },
    ],
    soakingProtocol: {
      recommended: true,
      soakingDurationHours: 6,
      waterType: 'Lukewarm or room-temperature filtered water',
      peelSkin: false,
      biochemicalReason:
        'Walnuts have fragile papery skins rich in ellagitannins. Unlike almonds, walnut skin should NOT be peeled because 90% of walnut antioxidants reside within this thin membrane! Soaking walnuts in water merely softens the bitter tannins, leaches out phytic acid, and makes the kernel buttery-soft and easily digestible.',
      stepByStep: [
        {
          step: 1,
          title: 'Select 2 to 4 Halves',
          desc: 'Take 2 to 4 Kashmiri Snow White walnut halves for your daily serving.',
        },
        {
          step: 2,
          title: 'Submerge in Water',
          desc: 'Place in a cup of filtered water and leave overnight (6 to 8 hours).',
        },
        {
          step: 3,
          title: 'Consume Directly (Do Not Peel)',
          desc: 'Drain the water in the morning and eat the softened walnut kernel directly with its skin intact.',
        },
      ],
    },
    idealTimingClock: [
      {
        timeOfDay: '07:00 AM – 08:30 AM',
        ayurvedicPhase: 'Morning Empty Stomach',
        bestFor: 'Maximum cellular omega-3 uptake and mental alertness',
        howToConsume: 'Chew soaked walnut halves with 2 dates or a teaspoon of wild forest honey.',
      },
      {
        timeOfDay: '08:30 PM – 09:30 PM',
        ayurvedicPhase: 'Pre-Bedtime Rest',
        bestFor: 'Insomnia relief and sleep regulation',
        howToConsume: 'Walnuts contain bio-available melatonin; consume 2 dry halves 45 minutes before turning off lights.',
      },
    ],
    whoShouldAvoidOrLimit: [
      {
        condition: 'Active IBS Diarrhea Flare-up',
        safeLimit: '1 half or temporarily pause',
        caution: 'High walnut oil content can stimulate intestinal motility during acute gut spasms.',
      },
    ],
    faq: [
      {
        question: 'Can you eat walnuts without soaking?',
        answer:
          'Yes, raw dry walnuts are completely safe and nutritious. However, soaking them overnight reduces the slightly astringent taste caused by tannins and makes the omega-3 fats easier for the liver and gut to absorb.',
      },
      {
        question: 'How do you know if walnuts have gone bad or rancid?',
        answer:
          'Walnuts are rich in polyunsaturated fatty acids, which oxidize when exposed to air and warmth. Fresh Kashmiri walnuts are creamy white and taste sweet. If a walnut turns dark brown, smells like paint/oil, or tastes sharp and bitter, it has oxidized and should be discarded.',
      },
    ],
  },

  makhana: {
    slug: 'makhana',
    commodityName: 'Phool Makhana (Fox Nuts / Lotus Seeds)',
    hindiName: 'फूल मखाना',
    botanicalName: 'Euryale ferox (Mithila GI Grade-A)',
    heroBadge: 'Weight Loss & Diabetes Portion Guide',
    metaTitle: 'How Much Makhana to Eat Daily? Safe Portion for Weight Loss, Diabetes & Vrat | Nuty Tales',
    metaDescription:
      'How much makhana can you eat in a day? Discover the optimal daily makhana serving size in grams and bowls for fast fat loss, kidney health, and diabetic glucose control.',
    headline: 'How Much Makhana Should You Eat Per Day?',
    subheadline:
      'Scientifically calculated portion sizes in grams and cups: the zero-fat, low-GI superfood for sustained weight loss, gut satiety, and bone strengthening.',
    productSlug: 'makhana-grade-a-fox-nuts',
    productName: 'Jumbo Phool Makhana (6 Suta Whole Kernels)',
    productPrice: 899,
    productImage: '/images/promo-makhana-899.webp',
    monthlyPackTitle: '30-Day Family Snacking Hamper (1kg Jumbo Makhana)',
    monthlyPackPrice: 899,
    monthlyPackMrp: 1499,
    monthlyPackWeight: '1 kg (Giant Economy Pack / 33 Daily 30g Servings)',
    dailyCalorieAverage: 105,
    keyNutrientsPerDailyDose: [
      { nutrient: 'Plant-Based Protein', amount: '3.1 g', dailyValuePercent: '6% RDA' },
      { nutrient: 'Dietary Fiber', amount: '2.4 g', dailyValuePercent: '10% RDA' },
      { nutrient: 'Calcium', amount: '60 mg', dailyValuePercent: '6% RDA' },
      { nutrient: 'Magnesium', amount: '63 mg', dailyValuePercent: '15% RDA' },
      { nutrient: 'Fat & Saturated Fat', amount: '0.1 g', dailyValuePercent: '< 0.5% RDA' },
    ],
    ageGuidelines: [
      {
        group: 'Toddlers & Weaning Babies',
        ageRange: '8 Months – 3 Years',
        recommendedCount: '10 to 15 grams (Dry powder / Kheer)',
        recommendedGrams: '10 – 15 grams',
        optimalTiming: 'Mid-morning porridge',
        clinicalReason:
          '100% gluten-free and hypo-allergenic; provides easily absorbable calcium and phosphorus for early bone ossification.',
      },
      {
        group: 'Weight Loss & Calorie-Deficit Dieters',
        ageRange: 'Adults',
        recommendedCount: '1 Large Cereal Bowl (30 grams)',
        recommendedGrams: '30 – 35 grams',
        optimalTiming: '04:30 PM evening snack (substituting fried samosas or biscuits)',
        clinicalReason:
          'Delivers 2.4g of resistant starch and 3.1g of protein with only 105 calories, keeping you full until dinner without triggering insulin spikes.',
      },
      {
        group: 'Type 2 Diabetics & Insulin Resistant',
        ageRange: 'Adults',
        recommendedCount: '25 to 30 grams',
        recommendedGrams: '25 – 30 grams',
        optimalTiming: 'Between breakfast and lunch (11:00 AM)',
        clinicalReason:
          'Low Glycemic Index (~40) and high magnesium content improve insulin sensitivity and stabilize post-prandial glucose curves.',
      },
      {
        group: 'Pregnant Women & Lactating Mothers',
        ageRange: 'All Stages',
        recommendedCount: '30 to 40 grams (Roasted in 1 tsp pure cow ghee)',
        recommendedGrams: '30 – 40 grams',
        optimalTiming: 'Daily evening snack or breakfast porridge',
        clinicalReason:
          'High calcium and iron density without gestational bloating or high sodium load.',
      },
    ],
    soakingProtocol: {
      recommended: false,
      soakingDurationHours: 0,
      waterType: 'Do NOT soak for snacking! Only boil for kheer or curries.',
      peelSkin: false,
      biochemicalReason:
        'Phool makhana is already popped and puffed from raw lotus seeds through wood-fire roasting and hand-threshing. It has zero phytic acid or enzyme inhibitors in its puffed state. To consume, always slow-roast in an iron skillet with 1/2 tsp of pure cow ghee until shatteringly crisp.',
      stepByStep: [
        {
          step: 1,
          title: 'Measure 30g Serving',
          desc: 'Take 1 large bowl (about 30 grams or 2 cups) of Nuty Tales 6 Suta whole makhana.',
        },
        {
          step: 2,
          title: 'Heat Heavy Pan on Low Flame',
          desc: 'Warm a skillet with 1/2 teaspoon of pure A2 cow ghee or olive oil.',
        },
        {
          step: 3,
          title: 'Roast for 4 to 5 Minutes',
          desc: 'Toss constantly on low heat until kernels turn pale golden and crush into fine powder between two fingers.',
        },
        {
          step: 4,
          title: 'Season with Rock Salt',
          desc: 'Dust with pink Himalayan rock salt, roasted cumin powder, or black pepper while warm.',
        },
      ],
    },
    idealTimingClock: [
      {
        timeOfDay: '11:00 AM (Mid-Morning)',
        ayurvedicPhase: 'Pitta Balancing',
        bestFor: 'Diabetic glucose stabilization between meals',
        howToConsume: 'Roasted plain with a pinch of black salt.',
      },
      {
        timeOfDay: '04:30 PM – 06:00 PM (Evening)',
        ayurvedicPhase: 'Vata Calming',
        bestFor: 'Weight loss snack replacement for fried snacks or biscuits',
        howToConsume: 'Lightly roasted in cow ghee with turmeric and black pepper.',
      },
    ],
    whoShouldAvoidOrLimit: [
      {
        condition: 'Severe Chronic Constipation',
        safeLimit: 'Maximum 20g daily, always accompanied by ample water',
        caution: 'Makhana has astringent (Kashaya) properties that absorb intestinal moisture; drink at least 2 glasses of water with it.',
      },
    ],
    faq: [
      {
        question: 'Can you eat makhana every day?',
        answer:
          'Yes, consuming 30 grams of dry-roasted makhana daily is entirely safe, healthy, and recommended by nutritionists for blood pressure, bone strength, and weight maintenance.',
      },
      {
        question: 'Can eating too much makhana cause side effects?',
        answer:
          'Consuming excessive amounts (more than 70–80 grams in a single sitting) without enough water can cause temporary constipation, bloating, or stomach dryness due to its high fiber and astringent nature.',
      },
    ],
  },

  'anjeer-figs': {
    slug: 'anjeer-figs',
    commodityName: 'Dried Figs (Anjeer)',
    hindiName: 'अंजीर',
    botanicalName: 'Ficus carica (Grade-A Sun-Dried Whole Figs)',
    heroBadge: 'Gut Motility, Hemoglobin & Fertility Guide',
    metaTitle: 'How Many Anjeer to Eat Per Day? Daily Figs Dosage, Soaked Water & Constipation | Nuty Tales',
    metaDescription:
      'Learn how many dried figs (anjeer) to eat per day. Discover the exact morning soaked anjeer water routine for instant constipation relief, iron boost, and hormonal balance.',
    headline: 'How Many Dried Figs (Anjeer) Should You Eat Per Day?',
    subheadline:
      'The definitive guide to daily dried fig portions: why drinking overnight soaked anjeer water cures stubborn constipation, boosts hemoglobin, and regulates blood pressure.',
    productSlug: 'dried-figs-anjeer',
    productName: 'Grade-A Sun-Dried Whole Kashmiri Anjeer',
    productPrice: 990,
    productImage: '/images/hero-lifestyle-bowl.png',
    monthlyPackTitle: '30-Day Gut Health & Vitality Anjeer Pack (500g)',
    monthlyPackPrice: 990,
    monthlyPackMrp: 1399,
    monthlyPackWeight: '500g (Approx. 30–35 Large Whole Sun-Dried Figs)',
    dailyCalorieAverage: 95,
    keyNutrientsPerDailyDose: [
      { nutrient: 'Dietary Soluble & Insoluble Fiber', amount: '3.8 g', dailyValuePercent: '15% RDA' },
      { nutrient: 'Natural Potassium', amount: '280 mg', dailyValuePercent: '8% RDA' },
      { nutrient: 'Plant Calcium', amount: '65 mg', dailyValuePercent: '7% RDA' },
      { nutrient: 'Non-Heme Iron', amount: '0.9 mg', dailyValuePercent: '5% RDA' },
      { nutrient: 'Natural Fruit Sugar (Fructose/Glucose)', amount: '18 g', dailyValuePercent: 'Zero Refined Sugar' },
    ],
    ageGuidelines: [
      {
        group: 'Children with Irregular Bowels',
        ageRange: '3 – 12 Years',
        recommendedCount: '1 Fig (Soaked)',
        recommendedGrams: '12 – 15 grams',
        optimalTiming: 'Morning empty stomach with the soaking water',
        clinicalReason:
          'Gentle, non-irritant natural laxative mucilage that softens pediatric stool without chemical laxative dependency.',
      },
      {
        group: 'Adults Seeking General Wellness & Digestion',
        ageRange: '13 – 59 Years',
        recommendedCount: '2 to 3 Figs',
        recommendedGrams: '25 – 40 grams',
        optimalTiming: 'Morning empty stomach (soaked overnight)',
        clinicalReason:
          'Soluble pectin fiber feeds Bifidobacteria in the colon, while insoluble fiber adds bulk for effortless daily morning elimination.',
      },
      {
        group: 'Chronic Constipation & Hemorrhoid Sufferers',
        ageRange: 'Adults',
        recommendedCount: '3 to 4 Figs (Soaked in warm water)',
        recommendedGrams: '40 – 50 grams',
        optimalTiming: 'First thing in morning + last thing before sleep',
        clinicalReason:
          'Significantly reduces colonic transit time and eliminates painful rectal straining.',
      },
      {
        group: 'Pregnant Women (Mild Anemia & Constipation)',
        ageRange: '2nd & 3rd Trimester',
        recommendedCount: '2 Figs Daily',
        recommendedGrams: '25 – 30 grams',
        optimalTiming: 'Morning breakfast alongside soaked almonds',
        clinicalReason:
          'Safely relieves pregnancy-induced progesterone constipation while boosting hemoglobin and fetal skeletal calcium reserves.',
      },
    ],
    soakingProtocol: {
      recommended: true,
      soakingDurationHours: 8,
      waterType: '1/2 glass of warm or room-temperature filtered water',
      peelSkin: false,
      biochemicalReason:
        'Sun-dried figs are chewy and fibrous. Soaking rehydrates the fruit matrix, converting insoluble fibers into an emollient gel-like mucilage. The natural sugars and minerals leach into the water, turning it into a therapeutic prebiotic tonic that lubricates the gastrointestinal tract.',
      stepByStep: [
        {
          step: 1,
          title: 'Wash 2 to 3 Figs',
          desc: 'Rinse whole dried anjeer under running water to remove any surface dust from sun-drying.',
        },
        {
          step: 2,
          title: 'Place in 1/2 Glass of Water',
          desc: 'Drop the figs into 100ml of fresh filtered water in a glass cup.',
        },
        {
          step: 3,
          title: 'Soak Overnight (8 Hours)',
          desc: 'Let it rest at room temperature overnight. In the morning, the figs will swell up soft and succulent.',
        },
        {
          step: 4,
          title: 'Drink the Water & Eat the Figs',
          desc: 'Drink the sweet amber soaking water first, then chew the tender figs thoroughly on an empty stomach.',
        },
      ],
    },
    idealTimingClock: [
      {
        timeOfDay: '06:00 AM – 07:30 AM',
        ayurvedicPhase: 'Praatah Kaal / Empty Stomach',
        bestFor: 'Curing constipation, flushing toxins, and balancing digestive fire (Agni)',
        howToConsume: 'Drink the soaked anjeer water followed by eating the plump figs.',
      },
      {
        timeOfDay: '09:00 PM – 10:00 PM',
        ayurvedicPhase: 'Bedtime',
        bestFor: 'Deep bowel cleansing by morning',
        howToConsume: 'Simmer 2 figs in warm milk with a pinch of cardamom and drink before sleep.',
      },
    ],
    whoShouldAvoidOrLimit: [
      {
        condition: 'Severe Uncontrolled Diabetes (HbA1c > 8.5%)',
        safeLimit: 'Maximum 1 fig daily (under medical guidance)',
        caution: 'Dried figs have high natural concentrated fructose; monitor fasting glucose closely.',
      },
    ],
    faq: [
      {
        question: 'Is it better to eat anjeer soaked or dry?',
        answer:
          'Soaked anjeer is vastly superior for digestion, constipation relief, and nutrient absorption. Soaking softens the fiber and releases water-soluble antioxidants. Dry anjeer is fine for quick energy during hiking or gym workouts, but soaked anjeer is medicinal.',
      },
      {
        question: 'Should you drink the water that anjeer was soaked in?',
        answer:
          'Yes, absolutely! The soaking water absorbs soluble fiber, potassium, and plant polyphenols. Drinking the water on an empty stomach activates peristalsis and multiplies the digestive benefits.',
      },
    ],
  },

  saffron: {
    slug: 'saffron',
    commodityName: 'Pure Saffron (Kesar / Zafran)',
    hindiName: 'केसर',
    botanicalName: 'Crocus sativus (Kashmiri Pampore Mogra)',
    heroBadge: 'Pregnancy, Skin Radiance & Mood Protocol',
    metaTitle: 'How Many Saffron Strands Per Day? Daily Kesar Dosage by Trimester & Mood | Nuty Tales',
    metaDescription:
      'How much saffron (kesar) should you take daily? Discover safe strand counts for pregnancy, skin glow, and depression. Learn why 3-4 strands of Kashmiri Mogra are sufficient.',
    headline: 'How Much Saffron (Kesar) Should You Take Per Day?',
    subheadline:
      'Medical dosage, pregnancy trimester safety rules, and warm milk infusion secrets of certified Kashmiri Pampore Grade-A Mogra saffron.',
    productSlug: 'kashmiri-saffron-mongra',
    productName: 'Kashmiri Mogra Saffron (Grade A1 Lab Certified)',
    productPrice: 650,
    productImage: '/images/hero-lifestyle-bowl.png',
    monthlyPackTitle: '30-Day Royal Saffron Wellness Pack (1g Kashmiri Mogra)',
    monthlyPackPrice: 650,
    monthlyPackMrp: 850,
    monthlyPackWeight: '1g (Approx. 350–400 Premium Stigmas / 90 Servings)',
    dailyCalorieAverage: 2,
    keyNutrientsPerDailyDose: [
      { nutrient: 'Crocin (Water-Soluble Carotenoid Pigment)', amount: 'High Grade (> 240 Absorbance)', dailyValuePercent: 'Potent Neuro-Protective' },
      { nutrient: 'Safranal (Essential Aroma Terpene)', amount: 'Active Bio-Marker', dailyValuePercent: 'Mood Elevating & GABA Enhancer' },
      { nutrient: 'Picrocrocin (Natural Flavor Glucoside)', amount: 'Authentic Kashmiri Terroir', dailyValuePercent: 'Digestive Bitter' },
    ],
    ageGuidelines: [
      {
        group: 'Infants & Toddlers (Traditional Ghutti)',
        ageRange: '6 Months – 3 Years',
        recommendedCount: '1 Strand (Steeped in mother’s milk or cow milk)',
        recommendedGrams: '< 2 milligrams',
        optimalTiming: 'Winter mornings or evenings',
        clinicalReason:
          'Ayurvedic immunity tonic to guard against cold chills and bronchial congestion.',
      },
      {
        group: 'Adults (Mood, Stress & Glowing Skin)',
        ageRange: '14 – 60 Years',
        recommendedCount: '3 to 5 Strands (approx. 10–15 mg)',
        recommendedGrams: '10 – 15 milligrams',
        optimalTiming: 'Night before bedtime with warm milk',
        clinicalReason:
          'Multiple double-blind placebo clinical trials demonstrate that 30mg of saffron extract daily matches the efficacy of fluoxetine for mild-to-moderate depression without sexual side effects.',
      },
      {
        group: 'Pregnant Women (First Trimester: Weeks 1 – 12)',
        ageRange: '1st Trimester',
        recommendedCount: 'ZERO (Strictly Avoid)',
        recommendedGrams: '0 mg',
        optimalTiming: 'Do NOT consume in the first trimester',
        clinicalReason:
          'High doses of saffron can stimulate mild uterine smooth muscle contractions (emmenagogue effect). Medical obstetricians uniformly advise waiting until the second trimester.',
      },
      {
        group: 'Pregnant Women (Second & Third Trimesters: Month 5 Onwards)',
        ageRange: 'Week 20 Onwards',
        recommendedCount: '2 to 3 Strands Only (Once Daily)',
        recommendedGrams: '8 – 10 milligrams',
        optimalTiming: 'Night with warm milk after dinner',
        clinicalReason:
          'Relieves pregnancy mood swings, morning sickness, and heartburn, while relaxing pelvic muscles and promoting restful sleep.',
      },
    ],
    soakingProtocol: {
      recommended: true,
      soakingDurationHours: 0.33,
      waterType: '2 tablespoons of lukewarm water or milk (15 to 20 minutes)',
      peelSkin: false,
      biochemicalReason:
        'Real saffron threads must NEVER be boiled directly over flame! Extreme boiling heat denatures safranal and crocin. Saffron must be steeped in lukewarm liquid (water or milk) for 15 to 20 minutes to slowly diffuse its therapeutic golden-yellow carotenoids.',
      stepByStep: [
        {
          step: 1,
          title: 'Count 3 to 4 Strands',
          desc: 'Take 3 to 4 vivid crimson Kashmiri Mogra saffron threads.',
        },
        {
          step: 2,
          title: 'Lightly Crush (Optional)',
          desc: 'Crush the dry brittle strands between your fingers into a small cup.',
        },
        {
          step: 3,
          title: 'Add 2 Tbsp Lukewarm Liquid',
          desc: 'Pour 2 tablespoons of warm milk or water over the threads.',
        },
        {
          step: 4,
          title: 'Steep for 15 Minutes',
          desc: 'Watch the liquid transform into a royal deep golden-orange hue with a rich floral honey aroma. Stir into your glass and drink.',
        },
      ],
    },
    idealTimingClock: [
      {
        timeOfDay: '09:30 PM (Bedtime)',
        ayurvedicPhase: 'Soma / Restorative Night Phase',
        bestFor: 'Deep restful sleep, nervous system relaxation, and skin cellular repair',
        howToConsume: 'Infused into a cup of warm milk with crushed green cardamom.',
      },
    ],
    whoShouldAvoidOrLimit: [
      {
        condition: 'First Trimester of Pregnancy',
        safeLimit: '0 Strands',
        caution: 'Avoid until week 16–20 and only resume after consulting your gynecologist.',
      },
      {
        condition: 'Excessive Consumption (> 5 Grams)',
        safeLimit: 'Never exceed 30 milligrams (10-12 strands) daily',
        caution: 'Extremely high doses of saffron (> 5 grams) are toxic. Saffron is a potent medicine, not a bulky snack.',
      },
    ],
    faq: [
      {
        question: 'Can you drink kesar milk every day?',
        answer:
          'Yes, drinking warm milk infused with 3 to 4 strands of pure Kashmiri saffron daily is safe, highly rejuvenating for the skin and mind, and deeply grounding for the nervous system.',
      },
      {
        question: 'Does saffron milk make the baby fairer during pregnancy?',
        answer:
          'No. A baby’s skin complexion is determined entirely by parental genetics, not dietary pigments. Saffron is consumed during pregnancy for its proven clinical benefits: reducing mood swings, lowering blood pressure, easing digestive cramps, and improving sleep.',
      },
    ],
  },

  pistachios: {
    slug: 'pistachios',
    commodityName: 'Pistachios (Pista)',
    hindiName: 'पिस्ता',
    botanicalName: 'Pistacia vera (Himalayan & Persian Jumbo Pista)',
    heroBadge: 'Heart, Eye Health & Low-Calorie Nut Guide',
    metaTitle: 'How Many Pistachios to Eat Per Day? Daily Pista Quantity, Calories & Eye Health | Nuty Tales',
    metaDescription:
      'How many pistachios (pista) can you eat in a day? Learn the healthy daily serving size (49 kernels = 30g), lutein eye benefits, and unsalted vs salted rules.',
    headline: 'How Many Pistachios Should You Eat Per Day?',
    subheadline:
      'Discover the "Pistachio Principle": 49 whole kernels per day to protect retinal eye health, lower LDL cholesterol, and provide guilt-free low-calorie satisfaction.',
    productSlug: 'iranian-roasted-salted-pistachios',
    productName: 'Jumbo Roasted & Lightly Salted Pistachios',
    productPrice: 1150,
    productImage: '/images/hero-lifestyle-bowl.png',
    monthlyPackTitle: '30-Day Cardio & Vision Pistachio Tub (500g)',
    monthlyPackPrice: 1099,
    monthlyPackMrp: 1499,
    monthlyPackWeight: '500g (Approx. 16 Daily Portions of 30g)',
    dailyCalorieAverage: 160,
    keyNutrientsPerDailyDose: [
      { nutrient: 'Lutein & Zeaxanthin (Macular Eye Pigments)', amount: '1.2 mg', dailyValuePercent: 'Highest Among All Tree Nuts' },
      { nutrient: 'Plant Protein', amount: '6.0 g', dailyValuePercent: '12% RDA' },
      { nutrient: 'Vitamin B6 (Pyridoxine)', amount: '0.4 mg', dailyValuePercent: '28% RDA' },
      { nutrient: 'Potassium', amount: '290 mg', dailyValuePercent: '8% RDA' },
      { nutrient: 'Dietary Fiber', amount: '3.0 g', dailyValuePercent: '12% RDA' },
    ],
    ageGuidelines: [
      {
        group: 'Children & Screen-Time Teens',
        ageRange: '5 – 17 Years',
        recommendedCount: '15 to 20 Kernels',
        recommendedGrams: '12 – 15 grams',
        optimalTiming: 'Afternoon study break',
        clinicalReason:
          'Protects photoreceptor retina cells from computer and mobile blue-light damage via concentrated lutein and zeaxanthin carotenoids.',
      },
      {
        group: 'Adults Seeking Weight Management',
        ageRange: '18 – 65 Years',
        recommendedCount: '40 to 49 Kernels (1 Ounce / 30g)',
        recommendedGrams: '28 – 30 grams',
        optimalTiming: '05:00 PM evening office snack',
        clinicalReason:
          'Known as the "Skinny Nut" because you get 49 kernels per 160 calories (compared to only 18 cashews or 14 walnut halves for the same calories).',
      },
      {
        group: 'Diabetics & Cardiac Patients',
        ageRange: 'Adults',
        recommendedCount: '30 Kernels (Unsalted or Raw)',
        recommendedGrams: '20 grams',
        optimalTiming: 'Mid-morning snack',
        clinicalReason:
          'Significantly improves total cholesterol to HDL ratio and lowers systolic blood pressure.',
      },
    ],
    soakingProtocol: {
      recommended: false,
      soakingDurationHours: 0,
      waterType: 'Eat raw or dry-roasted in shell',
      peelSkin: false,
      biochemicalReason:
        'Pistachios are uniquely low in anti-nutrients and have naturally splitting shells. The purple and green skin contains the highest concentration of anthocyanin and chlorophyll antioxidants. Never peel pistachios; consume them roasted or raw in their whole state.',
      stepByStep: [
        {
          step: 1,
          title: 'Measure 1 Handful (approx. 40-49 in shell)',
          desc: 'Choose in-shell pistachios; the tactile action of cracking shells slows eating down, naturally reducing over-snacking.',
        },
        {
          step: 2,
          title: 'Crack and Enjoy Slowly',
          desc: 'Keep the empty shells visible on your desk as a psychological visual cue of portion control.',
        },
      ],
    },
    idealTimingClock: [
      {
        timeOfDay: '04:30 PM – 06:00 PM',
        ayurvedicPhase: 'Evening Teatime',
        bestFor: 'Combating post-lunch fatigue without sugary biscuits',
        howToConsume: 'Slowly cracked and eaten with green tea or Kashmiri kahwa.',
      },
    ],
    whoShouldAvoidOrLimit: [
      {
        condition: 'Hypertension (High Blood Pressure)',
        safeLimit: 'Consume only RAW or UNSALTED pistachios',
        caution: 'Commercial salted pistachios carry excessive sodium. Always choose unsalted or low-sodium varieties.',
      },
    ],
    faq: [
      {
        question: 'Why are pistachios green and purple?',
        answer:
          'The vivid green color comes from chlorophyll, and the purplish hue on the skin comes from anthocyanins — the identical super-antioxidants present in blueberries and red wine.',
      },
      {
        question: 'Will eating pistachios make me fat?',
        answer:
          'No! In fact, clinical trials have shown that participants who added 30g of pistachios daily to their diet experienced greater reductions in BMI and triglycerides than those who consumed carbohydrate-based pretzels.',
      },
    ],
  },
}
