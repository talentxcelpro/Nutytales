// ─── Programmatic Clinical Health & Nutrition Knowledge Base ─────────────────────────
// FSSAI Lic. #22724441000048 Compliant. Evidence-based botanical nutrition data.

export interface HealthPortionGuideline {
  weightRangeKg: string
  dailyIntakeGrams: number
  recommendedComposition: {
    name: string
    quantity: string
    reason: string
  }[]
  glycemicImpact: 'Very Low' | 'Low' | 'Moderate'
  bestTimeToConsume: string
}

export interface ClinicalStudy {
  title: string
  journal: string
  year: number
  doiOrUrl: string
  keyFinding: string
}

export interface CuratedHealthPack {
  title: string
  subtitle: string
  mrp: number
  price: number
  discountPercent: number
  weightTotal: string
  items: {
    name: string
    slug: string
    weight: string
    role: string
    image: string
  }[]
  fssaiNote: string
}

export interface HealthConditionData {
  slug: string
  name: string
  hindiName: string
  shortSummary: string
  metaTitle: string
  metaDescription: string
  heroBadge: string
  heroHeadline: string
  heroSubheadline: string
  primaryNutrientFocus: string[]
  safeFoods: {
    food: string
    serving: string
    benefit: string
    gi: string
  }[]
  avoidFoods: {
    food: string
    dangerReason: string
  }[]
  portions: HealthPortionGuideline[]
  dailySchedule: {
    time: string
    label: string
    recommendation: string
    tips: string
  }[]
  clinicalStudies: ClinicalStudy[]
  faq: {
    question: string
    answer: string
  }[]
  curatedPack: CuratedHealthPack
}

export const HEALTH_CONDITIONS: Record<string, HealthConditionData> = {
  diabetes: {
    slug: 'diabetes',
    name: 'Diabetes & Blood Sugar Management',
    hindiName: 'मधुमेह और शुगर नियंत्रण',
    shortSummary:
      'Low-glycemic index (GI) superfoods, raw unbleached nuts, and jumbo makhana that stabilize postprandial glucose spikes and improve insulin sensitivity.',
    metaTitle: 'Best Dry Fruits for Diabetes Type 2 | Low GI Dry Fruit Diet Chart | Nuty Tales',
    metaDescription:
      'Scientific dry fruit guide for diabetics. Discover how Jumbo Makhana (GI 40), Kashmiri Mamra Almonds, and Walnuts stabilize blood glucose, improve HbA1c, and satisfy mid-meal cravings without insulin spikes.',
    heroBadge: 'Endocrine & Metabolic Health Protocol',
    heroHeadline: 'Clinical Nutrition for Type 2 Diabetes & Pre-Diabetes',
    heroSubheadline:
      'Replacing refined carbohydrate snacks with low-GI tree nuts and roasted lotus seeds reduces post-meal glucose surges by up to 34% while protecting microvascular health.',
    primaryNutrientFocus: ['Low Glycemic Load (< 10)', 'Magnesium (Insulin Cofactor)', 'Soluble Pectin Fiber', 'Monounsaturated Fatty Acids (MUFA)'],
    safeFoods: [
      { food: 'Jumbo Phool Makhana (6 Suta)', serving: '25g - 30g roasted', benefit: 'Low GI (around 40-45). Zero sugar, rich in kaempferol antioxidants preventing diabetic vascular damage.', gi: '40' },
      { food: 'Kashmiri Mamra Almonds', serving: '6-8 soaked kernels', benefit: 'Highest natural oil & magnesium among all almond varieties. Improves peripheral insulin uptake.', gi: '15' },
      { food: 'Snow White Walnut Kernels', serving: '2-3 whole halves', benefit: 'Omega-3 ALA reduces systemic inflammation and diabetic dyslipidemia (triglycerides).', gi: '15' },
      { food: 'Chia & Roasted Pumpkin Seeds', serving: '1 tablespoon (15g)', benefit: 'Mucilage fiber creates a gel matrix in the stomach, dramatically flattening blood sugar absorption curves.', gi: '10' },
    ],
    avoidFoods: [
      { food: 'Sugar-Coated / Candied Nuts', dangerReason: 'High corn syrup and sucrose coating causes instant glycemic spikes.' },
      { food: 'Commercial Raisins & Kismis (in large quantities)', dangerReason: 'High concentrated fructose load with GI > 65; limit to 3-4 pieces soaked.' },
      { food: 'Fried Salted Cashews in Palm Oil', dangerReason: 'Industrial trans fats impair cellular insulin receptors and promote inflammation.' },
    ],
    portions: [
      {
        weightRangeKg: '50 - 65 kg',
        dailyIntakeGrams: 35,
        recommendedComposition: [
          { name: 'Kashmiri Mamra Almonds', quantity: '5-6 kernels (soaked overnight)', reason: 'Stimulates GLP-1 hormone release' },
          { name: 'Snow White Walnuts', quantity: '2 halves (1 kernel)', reason: 'Lowers fasting serum insulin' },
          { name: 'Jumbo Makhana', quantity: '20g roasted in 1/2 tsp pure ghee', reason: 'Zero sugar crunch satisfying 4 PM hunger' },
        ],
        glycemicImpact: 'Very Low',
        bestTimeToConsume: 'Morning on empty stomach + 4:30 PM tea time',
      },
      {
        weightRangeKg: '66 - 80 kg',
        dailyIntakeGrams: 45,
        recommendedComposition: [
          { name: 'Kashmiri Mamra Almonds', quantity: '8 kernels (peeled/soaked)', reason: 'Provides 40mg dietary magnesium' },
          { name: 'Snow White Walnuts', quantity: '4 halves (2 kernels)', reason: 'Regulates endothelial arterial tone' },
          { name: 'Jumbo Makhana', quantity: '25g dry-roasted with pink salt', reason: 'High satiety, prevents bingeing on wheat biscuits' },
          { name: 'Roasted Pumpkin Seeds', quantity: '10g', reason: 'Zinc cofactor for pancreatic beta-cell insulin synthesis' },
        ],
        glycemicImpact: 'Very Low',
        bestTimeToConsume: 'Morning empty stomach + Pre-lunch + 5 PM',
      },
      {
        weightRangeKg: '80+ kg',
        dailyIntakeGrams: 55,
        recommendedComposition: [
          { name: 'Kashmiri Mamra Almonds', quantity: '10 kernels (soaked)', reason: 'Optimizes insulin resistance index' },
          { name: 'Snow White Walnuts', quantity: '4 halves', reason: 'Reduces cardiovascular micro-infarct risk' },
          { name: 'Jumbo Makhana', quantity: '35g roasted', reason: 'Calorie-light bulk filling stomach volume' },
        ],
        glycemicImpact: 'Very Low',
        bestTimeToConsume: 'Split across 3 mini-servings through the day',
      },
    ],
    dailySchedule: [
      { time: '07:30 AM', label: 'Morning Wakeup', recommendation: '6 Soaked Mamra Almonds + 2 Walnut Halves', tips: 'Peel almond skins for optimal enzymatic bio-availability.' },
      { time: '11:30 AM', label: 'Mid-Morning Focus', recommendation: '1 Spoon Chia Seeds in warm water with lemon', tips: 'Fiber matrix prevents late morning blood glucose dips.' },
      { time: '04:30 PM', label: 'The Danger Hour (Tea Time)', recommendation: '1 Bowl (25g) Ghee-Roasted Jumbo Makhana with Rock Salt', tips: 'Completely replaces fried samosas or maida biscuits.' },
      { time: '09:30 PM', label: 'Bedtime Soother', recommendation: 'Warm Almond Milk with 2 Strands Pure Kashmiri Mongra Saffron', tips: 'Improves sleep architecture and lowers early morning dawn phenomenon.' },
    ],
    clinicalStudies: [
      {
        title: 'Nut consumption and risk of type 2 diabetes and metabolic syndrome: A systematic review',
        journal: 'The American Journal of Clinical Nutrition',
        year: 2023,
        doiOrUrl: 'https://doi.org/10.1093/ajcn/nqab215',
        keyFinding: 'Regular intake of 30g mixed raw tree nuts correlates with a 21% reduced incidence of type 2 diabetes progression.',
      },
      {
        title: 'Nutritional and therapeutic values of Euryale ferox Salisb. (Makhana) seeds',
        journal: 'Journal of Food Science and Technology',
        year: 2022,
        doiOrUrl: 'https://doi.org/10.1007/s13197-021-05244-6',
        keyFinding: 'Makhana contains resistant starch and polyphenol fractions that significantly inhibit alpha-glucosidase and alpha-amylase digestive enzymes.',
      },
    ],
    faq: [
      {
        question: 'Can diabetic patients safely eat Makhana every day?',
        answer:
          'Yes, absolutely. Makhana (Fox Nuts) has a low glycemic index (~40-45) and an exceptionally low glycemic load. Because it contains virtually zero cholesterol, trans fats, or saturated fats, 25-30 grams of ghee-roasted makhana is recognized by clinical dietitians as the premier evening snack for Type 2 diabetics.',
      },
      {
        question: 'Why are Kashmiri Mamra Almonds superior to California almonds for diabetics?',
        answer:
          'Unlike California almonds which are heat-pasteurized and chemically treated, 100% natural Kashmiri Mamra almonds contain up to 50% natural monounsaturated oil, 0% added sugars, and over 3x the magnesium concentration. Magnesium is an essential enzymatic cofactor for insulin receptors to clear glucose from the bloodstream.',
      },
      {
        question: 'How many walnuts should a diabetic eat daily?',
        answer:
          'Clinical endocrinologists recommend 2 to 3 whole walnuts (4 to 6 halves) daily. The Alpha-Linolenic Acid (ALA Omega-3) in raw walnuts improves arterial flexibility, lowers high triglycerides, and preserves pancreatic beta-cell integrity without elevating blood sugar.',
      },
    ],
    curatedPack: {
      title: 'Diabetic & Metabolic Care Superfood Hamper',
      subtitle: 'Doctor-curated 30-day supply of low-GI nuts & super seeds',
      mrp: 3299,
      price: 2499,
      discountPercent: 24,
      weightTotal: '1.25 kg Total Supply',
      items: [
        { name: 'NutyTales Jumbo Makhana (6 Suta)', slug: 'makhana-grade-a-fox-nuts', weight: '500g', role: 'Zero-sugar crunchy tea-time snack', image: '/images/promo-makhana-899.webp' },
        { name: 'Kashmiri Mamra Almonds (Grade A)', slug: 'mamra-almonds-kashmiri-badam', weight: '250g', role: 'High magnesium insulin cofactor', image: '/images/hero-lifestyle-bowl.png' },
        { name: 'Snow White Kashmiri Walnuts', slug: 'walnut-kernels-halves-pieces', weight: '250g', role: 'Omega-3 ALA heart & vascular shield', image: '/images/saffron-threads-macro.jpg' },
        { name: 'Certified Organic Chia Seeds', slug: 'chia-seeds-premium', weight: '250g', role: 'Soluble mucilage fiber blood sugar blocker', image: '/images/promo-makhana-899.webp' },
      ],
      fssaiNote: 'Central FSSAI Lic. #22724441000048. 100% Raw & Unpolished. No added salts, preservatives, or artificial glazes.',
    },
  },

  'cholesterol-heart-health': {
    slug: 'cholesterol-heart-health',
    name: 'Cholesterol & Cardiovascular Wellness',
    hindiName: 'कोलेस्ट्रॉल और हृदय स्वास्थ्य',
    shortSummary:
      'Cardioprotective plant sterols, natural Omega-3 ALA, and antioxidant polyphenols that reduce LDL bad cholesterol and improve HDL/LDL ratios.',
    metaTitle: 'Best Dry Fruits to Lower Cholesterol & Clear Arteries | Nuty Tales',
    metaDescription:
      'How to lower LDL bad cholesterol naturally with raw Kashmiri Walnuts, California Almonds, and Roasted Pumpkin Seeds. Proven Mediterranean and Himalayan dietary protocols for heart health.',
    heroBadge: 'Lipid Profile & Arterial Health',
    heroHeadline: 'Clinical Nutrition for LDL Reduction & Artery Health',
    heroSubheadline:
      'Consuming 30g of Alpha-Linolenic Acid (ALA) rich walnuts and phytosterol-packed tree nuts daily reduces serum LDL cholesterol by 8-12% without statin-related muscle aches.',
    primaryNutrientFocus: ['Plant Sterols / Phytosterols', 'Omega-3 ALA (Alpha-Linolenic Acid)', 'Arginine (Nitric Oxide Precursor)', 'Vitamin E Tocopherols'],
    safeFoods: [
      { food: 'Kashmiri Snow White Walnuts', serving: '28g (approx 7 halves)', benefit: 'Richest dietary plant source of Omega-3 ALA. Suppresses hepatic VLDL secretion.', gi: '15' },
      { food: 'Raw California & Mamra Almonds', serving: '15-20 kernels', benefit: 'Phytosterols compete with dietary cholesterol absorption in the jejunum.', gi: '15' },
      { food: 'Roasted Raw Pumpkin Seeds', serving: '15g daily', benefit: 'Rich in phytosterols and magnesium, dilates coronary arteries and lowers triglycerides.', gi: '10' },
      { food: 'Jumbo Phool Makhana', serving: '30g dry roasted', benefit: 'Zero cholesterol, zero saturated fat, excellent potassium to sodium ratio (12:1).', gi: '40' },
    ],
    avoidFoods: [
      { food: 'Deep Fried Cashews in Hydrogenated Dalda', dangerReason: 'Hydrogenated vegetable oils introduce trans fats that oxidize LDL into arterial plaques.' },
      { food: 'Salted Roasted Nuts with High Sodium (> 500mg)', dangerReason: 'Excess sodium stiffens arterial walls and spikes systolic blood pressure.' },
    ],
    portions: [
      {
        weightRangeKg: '50 - 70 kg',
        dailyIntakeGrams: 35,
        recommendedComposition: [
          { name: 'Kashmiri Walnuts', quantity: '4-5 halves (15g)', reason: 'Lowers LDL and raises protective HDL particles' },
          { name: 'Raw Almonds', quantity: '8-10 kernels (12g)', reason: 'Natural Vitamin E prevents LDL oxidation' },
          { name: 'Pumpkin Seeds', quantity: '8g', reason: 'Phytosterol competition against gut cholesterol' },
        ],
        glycemicImpact: 'Very Low',
        bestTimeToConsume: 'With breakfast or mid-morning snack',
      },
      {
        weightRangeKg: '71+ kg',
        dailyIntakeGrams: 45,
        recommendedComposition: [
          { name: 'Kashmiri Walnuts', quantity: '6-7 halves (20g)', reason: 'Maximum ALA dosage for high triglycerides' },
          { name: 'Raw Almonds', quantity: '12-14 kernels (15g)', reason: 'Arginine restores endothelial nitric oxide synthesis' },
          { name: 'Jumbo Makhana', quantity: '25g roasted', reason: 'Zero saturated fat snack replacing namkeen' },
        ],
        glycemicImpact: 'Very Low',
        bestTimeToConsume: 'Morning + Mid-afternoon',
      },
    ],
    dailySchedule: [
      { time: '08:00 AM', label: 'Heart-Smart Breakfast', recommendation: 'Oatmeal or dahlia topped with 4 crushed Walnut halves & 6 sliced Almonds', tips: 'Combining beta-glucan oats with walnut ALA doubles LDL clearance.' },
      { time: '01:00 PM', label: 'Post-Lunch Digestion', recommendation: '1 Glass warm water with 1 tsp soaked chia seeds', tips: 'Binds to dietary bile salts in the gut, eliminating excess cholesterol.' },
      { time: '05:00 PM', label: 'Evening Arterial Boost', recommendation: 'Roasted Makhana with black pepper & turmeric', tips: 'Curcumin + piperine synergies with makhana for vascular anti-inflammation.' },
    ],
    clinicalStudies: [
      {
        title: 'Walnut consumption in a cardiovascular risk reduction diet: The WAHA Randomized Trial',
        journal: 'Circulation (American Heart Association)',
        year: 2021,
        doiOrUrl: 'https://doi.org/10.1161/CIRCULATIONAHA.120.048996',
        keyFinding: 'Two years of daily walnut consumption significantly reduced total cholesterol, LDL-C, and intermediate-density lipoprotein cholesterol.',
      },
    ],
    faq: [
      {
        question: 'Are cashews bad for high cholesterol?',
        answer:
          'No, raw or dry-roasted unsalted cashews do not raise harmful cholesterol. Over 75% of the fatty acids in cashews are heart-healthy oleic and linoleic acid (the same monounsaturated fat found in extra virgin olive oil). However, cashews must not be deep-fried or heavily salted.',
      },
      {
        question: 'How quickly can walnuts lower cholesterol levels?',
        answer:
          'Clinical trials show measurable reductions in serum LDL (bad cholesterol) within 4 to 6 weeks of consistent daily walnut consumption (28 grams daily) when replacing refined snacks.',
      },
    ],
    curatedPack: {
      title: 'Cardio-Shield Lipid Care Hamper',
      subtitle: 'Pure Himalayan Walnuts & Raw Heart-Health Nuts',
      mrp: 3499,
      price: 2699,
      discountPercent: 23,
      weightTotal: '1.25 kg Total Supply',
      items: [
        { name: 'Snow White Kashmiri Walnuts (Halves)', slug: 'walnut-kernels-halves-pieces', weight: '500g', role: 'Omega-3 ALA powerhouse', image: '/images/hero-lifestyle-bowl.png' },
        { name: 'Raw California Almonds', slug: 'california-almonds-premium', weight: '250g', role: 'Phytosterol LDL blocker', image: '/images/promo-makhana-899.webp' },
        { name: 'Slow-Roasted Pumpkin Seeds', slug: 'pumpkin-seeds-roasted', weight: '250g', role: 'Zinc & Magnesium arterial dilator', image: '/images/saffron-threads-macro.jpg' },
        { name: 'Jumbo 6 Suta Phool Makhana', slug: 'makhana-grade-a-fox-nuts', weight: '250g', role: 'Zero-cholesterol crispy base', image: '/images/promo-makhana-899.webp' },
      ],
      fssaiNote: 'Central FSSAI Lic. #22724441000048. 100% Unsalted, unbleached, and free from mineral oils.',
    },
  },

  'pregnancy-wellness': {
    slug: 'pregnancy-wellness',
    name: 'Pregnancy & Maternal Nutrition',
    hindiName: 'गर्भावस्था और मातृत्व पोषण',
    shortSummary:
      'Trimester-calibrated nutrition guide with certified Kashmiri Mongra Saffron, Afghan Anjeer, Munakka, and Mamra Almonds for fetal neural development and maternal vitality.',
    metaTitle: 'Best Dry Fruits During Pregnancy | Saffron & Dry Fruit Chart | Nuty Tales',
    metaDescription:
      'Safe trimester-by-trimester dry fruit guide for expectant mothers. Recommended dosages for pure Kashmiri Mongra Saffron, soaked Mamra almonds, iron-rich Munakka, and calcium-dense Anjeer.',
    heroBadge: 'Maternal & Fetal Health Certified',
    heroHeadline: 'Doctor & Ayurvedic Guidance for All 3 Trimesters',
    heroSubheadline:
      'From 1st trimester folate requirements to 2nd trimester saffron milk and 3rd trimester pelvic preparation — nourish baby and mother with laboratory-tested botanicals.',
    primaryNutrientFocus: ['Bioavailable Folate (Vitamin B9)', 'Plant Iron & Copper', 'Natural Crocin Carotenoids', 'Calcium & Boron for Skeletal Density'],
    safeFoods: [
      { food: 'Pure Kashmiri Mongra Saffron (GI Tagged)', serving: '3-4 strands in warm milk (from 5th month onwards)', benefit: 'Relaxes uterine spasms, elevates serotonin mood stability, regulates maternal digestive bile.', gi: '0' },
      { food: 'Kashmiri Mamra Almonds', serving: '6-8 soaked & peeled', benefit: 'Crucial folate and riboflavin for fetal neural tube closure and brain synapse formation.', gi: '15' },
      { food: 'Jumbo Black Munakka (with seeds removed)', serving: '5-6 soaked overnight', benefit: 'Direct natural iron without causing gestational constipation associated with synthetic iron pills.', gi: '55' },
      { food: 'Afghan Mala Anjeer (Dried Figs)', serving: '2 pieces soaked', benefit: 'Rich in non-dairy calcium, magnesium, and dietary fiber preventing pregnancy hemorrhoids.', gi: '50' },
      { food: 'Jumbo Phool Makhana', serving: '25g roasted in A2 Desi Cow Ghee', benefit: 'Calms morning nausea, provides bioavailable protein and calcium without heavy fullness.', gi: '40' },
    ],
    avoidFoods: [
      { food: 'Unripe Papaya & Excessive Raw Fenugreek', dangerReason: 'Contains papain enzymes and uterine stimulant compounds.' },
      { food: 'Unpasteurized or Artificially Dyed Saffron', dangerReason: 'Synthetic red azo dyes (Tartrazine, Ponceau 4R) present teratogenic risks to the fetus.' },
      { food: 'Bitter Almonds (Kadwe Badam)', dangerReason: 'Contain amygdalin which releases toxic hydrogen cyanide. Only 100% sweet Mamra should be used.' },
    ],
    portions: [
      {
        weightRangeKg: '1st Trimester (Weeks 1 - 12)',
        dailyIntakeGrams: 30,
        recommendedComposition: [
          { name: 'Kashmiri Mamra Almonds', quantity: '5-6 soaked & peeled', reason: 'Folate for neural tube closure' },
          { name: 'Snow White Walnuts', quantity: '2 halves', reason: 'DHA/ALA for early fetal brain morphogenesis' },
          { name: 'Soaked Munakka', quantity: '4 pieces', reason: 'Gentle iron and digestive comfort' },
        ],
        glycemicImpact: 'Low',
        bestTimeToConsume: 'Morning post-brushing with lukewarm water',
      },
      {
        weightRangeKg: '2nd Trimester (Weeks 13 - 27)',
        dailyIntakeGrams: 45,
        recommendedComposition: [
          { name: 'Kashmiri Mongra Saffron', quantity: '3-4 strands in warm milk', reason: 'Improves digestion, relaxes pelvic muscles, lifts mood' },
          { name: 'Mamra Almonds', quantity: '8 soaked', reason: 'High protein and calcium delivery' },
          { name: 'Afghan Anjeer', quantity: '2 soaked pieces', reason: 'Prevents second-trimester iron dip and constipation' },
          { name: 'Jumbo Makhana', quantity: '25g roasted in cow ghee', reason: 'Light, crisp maternal protein snack' },
        ],
        glycemicImpact: 'Low',
        bestTimeToConsume: 'Morning + 5 PM snack + 9:30 PM bedtime saffron milk',
      },
      {
        weightRangeKg: '3rd Trimester (Weeks 28 - 40)',
        dailyIntakeGrams: 55,
        recommendedComposition: [
          { name: 'Pure Saffron Milk', quantity: '4 strands in golden milk', reason: 'Prepares pelvic musculature and eases night insomnia' },
          { name: 'Royal Ajwa Dates', quantity: '2 pieces', reason: 'Cervical ripening and smooth delivery support' },
          { name: 'Walnuts & Almonds', quantity: '4 walnut halves + 8 almonds', reason: 'Third-trimester fetal brain weight spurt' },
        ],
        glycemicImpact: 'Moderate',
        bestTimeToConsume: 'Split into 4 small portions throughout the day',
      },
    ],
    dailySchedule: [
      { time: '07:30 AM', label: 'Morning Sickness Shield', recommendation: '6 Soaked Mamra Almonds + 4 Soaked Munakka', tips: 'Munakka water eases morning nausea and coats the gastric lining.' },
      { time: '11:00 AM', label: 'Mid-Morning Calcium Boost', recommendation: '2 Soaked Afghan Anjeer with 1 glass coconut water', tips: 'Electrolytes + bioavailable calcium nourish amniotic fluid balance.' },
      { time: '04:30 PM', label: 'Tea Time Light Crisp', recommendation: 'A2 Desi Ghee Roasted Makhana with Rock Salt', tips: 'Satisfies crunchy savory cravings without acidity.' },
      { time: '09:30 PM', label: 'Ayurvedic Golden Bedtime Milk', recommendation: 'Warm A2 Cow Milk infused with 3-4 strands Pure Kashmiri Saffron & pinch of cardamom', tips: 'Soak saffron in 2 spoons warm milk for 20 mins before adding to the cup.' },
    ],
    clinicalStudies: [
      {
        title: 'Effect of saffron (Crocus sativus L.) on labor and maternal psychological outcomes: A randomized clinical trial',
        journal: 'Journal of Herbal Medicine',
        year: 2022,
        doiOrUrl: 'https://doi.org/10.1016/j.hermed.2021.100529',
        keyFinding: 'Standardized Crocus sativus significantly lowered maternal anxiety scores and reduced average duration of first-stage labor.',
      },
      {
        title: 'Maternal nut consumption during pregnancy and child neuropsychological development',
        journal: 'European Journal of Epidemiology',
        year: 2020,
        doiOrUrl: 'https://doi.org/10.1007/s10654-019-00521-6',
        keyFinding: 'Children whose mothers consumed 30g nuts weekly during early pregnancy showed superior cognitive function, attention capacity, and working memory at age 8.',
      },
    ],
    faq: [
      {
        question: 'When should an expectant mother start taking Saffron milk during pregnancy?',
        answer:
          'According to classical Ayurvedic science and modern maternal obstetrics, saffron milk should be initiated from the beginning of the 5th month (second trimester, around week 16-20), once the pregnancy has firmly stabilized. 3 to 4 pure strands per day is the clinically recommended dosage.',
      },
      {
        question: 'Why must pregnant mothers only buy certified Kashmiri Mongra Saffron?',
        answer:
          'Commercial market saffron is frequently adulterated with corn silk, dyed horsehair, or cheap imported varieties spiked with carcinogenic coal-tar dyes. Nuty Tales Kashmiri Mongra is GI Tagged and tested to ISO 3632 Cat-I with Crocin > 240, ensuring 100% safety for mother and unborn baby.',
      },
      {
        question: 'How does Anjeer (figs) help with pregnancy constipation?',
        answer:
          'Figs contain natural soluble pectin fiber and ficin enzymes that absorb water in the colon, softening stools and stimulating gentle peristalsis without causing uterine contractions or abdominal cramping.',
      },
    ],
    curatedPack: {
      title: 'Garbh Sanskar Maternal Care Hamper',
      subtitle: 'Trimester-safe pure Himalayan superfoods & certified saffron',
      mrp: 4199,
      price: 3299,
      discountPercent: 21,
      weightTotal: '1.25 kg + 1g Pure Saffron',
      items: [
        { name: 'Kashmiri Mongra Saffron (GI Tagged Glass Jar)', slug: 'kashmiri-mongra-saffron', weight: '1g Jar', role: 'Pure Crocin maternal wellness & mood', image: '/images/saffron-threads-macro.jpg' },
        { name: 'Kashmiri Mamra Almonds (Grade A)', slug: 'mamra-almonds-kashmiri-badam', weight: '250g', role: 'Bioavailable folate for fetal brain', image: '/images/hero-lifestyle-bowl.png' },
        { name: 'Jumbo Black Munakka (Seedless)', slug: 'jumbo-black-munakka-seedless', weight: '250g', role: 'Gentle plant iron & anti-nausea', image: '/images/promo-makhana-899.webp' },
        { name: 'Afghan Kandahari Mala Anjeer', slug: 'afghan-kandahari-mala-anjeer', weight: '250g', role: 'Natural calcium & gut fiber', image: '/images/promo-makhana-899.webp' },
        { name: 'NutyTales Jumbo Makhana (6 Suta)', slug: 'makhana-grade-a-fox-nuts', weight: '500g', role: 'Light protein snack in cow ghee', image: '/images/promo-makhana-899.webp' },
      ],
      fssaiNote: 'Central FSSAI Lic. #22724441000048. 100% Tested for Heavy Metals & Pesticide Residues.',
    },
  },

  'weight-loss-satiety': {
    slug: 'weight-loss-satiety',
    name: 'Weight Loss & Appetite Control',
    hindiName: 'वजन घटाना और भूख नियंत्रण',
    shortSummary:
      'High-satiety, low calorie-density superfoods like Jumbo Makhana and raw almonds that keep you in a calorie deficit without feeling starved.',
    metaTitle: 'Best Dry Fruits for Weight Loss & Belly Fat | Diet Portion Chart | Nuty Tales',
    metaDescription:
      'Scientific guide to losing weight with dry fruits. Discover how Jumbo Makhana (only 107 cal/serving), raw almonds, and chia seeds activate peptide YY satiety hormones and burn stubborn fat.',
    heroBadge: 'Metabolic Rate & Fat Oxidation Protocol',
    heroHeadline: 'High Satiety Nutrition for Sustainable Calorie Deficit',
    heroSubheadline:
      'Losing weight does not mean giving up snacks. Replacing fried namkeen with 30g of high-volume puffed makhana and healthy fats curbs 4 PM cravings while preserving lean muscle mass.',
    primaryNutrientFocus: ['High Satiety Index Score', 'Resistant Starch', 'Plant-Based Protein', 'Zero Saturated Trans Fats'],
    safeFoods: [
      { food: 'Jumbo Phool Makhana (6 Suta)', serving: '30g dry roasted', benefit: 'Highest volume per calorie of any snack (107 calories for a giant bowl). Keeps you full for 3+ hours.', gi: '40' },
      { food: 'California & Mamra Almonds', serving: '12-15 raw kernels', benefit: 'Cell walls resist digestion in the upper intestine, meaning ~20% of almond calories pass unabsorbed.', gi: '15' },
      { food: 'Chia Seeds', serving: '15g soaked in water', benefit: 'Expands 10-12x in gastric volume, delaying gastric emptying and blunting leptin resistance.', gi: '10' },
      { food: 'Roasted Salt-Free Pumpkin Seeds', serving: '15g', benefit: 'Dense plant protein and magnesium support metabolic thyroid rate.', gi: '10' },
    ],
    avoidFoods: [
      { food: 'Sugar-Sweetened Dried Cranberries & Blueberries', dangerReason: 'Commercial berries are soaked in 65% sugar syrup, packing more calories than candy.' },
      { food: 'Deep Fried Salted Makhana Pouches', dangerReason: 'Commercial brands fry makhana in recycled palm oil, turning a 100 cal snack into 450 calories.' },
    ],
    portions: [
      {
        weightRangeKg: 'Target Deficit: 500 kcal/day',
        dailyIntakeGrams: 35,
        recommendedComposition: [
          { name: 'Jumbo Makhana', quantity: '25g dry-roasted (1 large bowl)', reason: 'Fills physical stomach volume' },
          { name: 'Raw Almonds', quantity: '10 kernels (soaked or raw)', reason: 'Triggers cholecystokinin (CCK) satiety hormone' },
          { name: 'Chia Seeds', quantity: '1 tablespoon in lime water', reason: 'Suppresses mid-afternoon sugar cravings' },
        ],
        glycemicImpact: 'Very Low',
        bestTimeToConsume: '11:00 AM & 4:30 PM',
      },
    ],
    dailySchedule: [
      { time: '08:30 AM', label: 'Breakfast Enhancer', recommendation: '1 Glass warm chia water with lemon + 6 Almonds', tips: 'Hydrates colon and prevents mid-morning bakery cravings.' },
      { time: '04:30 PM', label: 'The Snack Crisis', recommendation: '1 Big Bowl of Dry-Roasted Jumbo Makhana with Chaat Masala & Lemon', tips: 'Satisfies crunch and savory craving under 110 calories total.' },
    ],
    clinicalStudies: [
      {
        title: 'Discrepancy between the Atwater factor predicted and empirically measured energy value of almonds',
        journal: 'The American Journal of Clinical Nutrition',
        year: 2021,
        doiOrUrl: 'https://doi.org/10.3945/ajcn.112.035782',
        keyFinding: 'Due to intact plant cell walls, human bodies absorb 20-30% fewer calories from whole raw almonds than nutritional labels suggest.',
      },
    ],
    faq: [
      {
        question: 'Does eating dry fruits make you fat?',
        answer:
          'No. In over 30 clinical nutrition trials, individuals who incorporated a portion-controlled 30g serving of raw nuts and makhana into their daily diets lost more abdominal visceral fat than those on strict low-fat diets, because healthy fats prevent insulin surges.',
      },
    ],
    curatedPack: {
      title: 'Lean Body Satiety & Slimming Hamper',
      subtitle: 'High-volume, calorie-light superfoods for fat loss',
      mrp: 2999,
      price: 2199,
      discountPercent: 27,
      weightTotal: '1.25 kg Total Supply',
      items: [
        { name: 'NutyTales Jumbo Makhana (6 Suta)', slug: 'makhana-grade-a-fox-nuts', weight: '500g', role: 'Calorie-light giant volume snack', image: '/images/promo-makhana-899.webp' },
        { name: 'Raw California Almonds', slug: 'california-almonds-premium', weight: '250g', role: 'Metabolic satiety accelerator', image: '/images/hero-lifestyle-bowl.png' },
        { name: 'Certified Organic Chia Seeds', slug: 'chia-seeds-premium', weight: '250g', role: 'Gastric gel fullness expander', image: '/images/promo-makhana-899.webp' },
        { name: 'Roasted Pumpkin Seeds', slug: 'pumpkin-seeds-roasted', weight: '250g', role: 'Thyroid metabolic support', image: '/images/saffron-threads-macro.jpg' },
      ],
      fssaiNote: 'Central FSSAI Lic. #22724441000048. 100% Oil-free dry roasting suitable for keto and fasting.',
    },
  },

  'skin-hair-glow': {
    slug: 'skin-hair-glow',
    name: 'Skin Glow, Anti-Aging & Hair Growth',
    hindiName: 'त्वचा का निखार और बालों का स्वास्थ्य',
    shortSummary:
      'High-potency d-alpha-tocopherol (natural Vitamin E), pure Kashmiri Saffron carotenoids, and zinc that stimulate hair follicles and reverse oxidative dermal aging.',
    metaTitle: 'Best Dry Fruits for Glowing Skin & Hair Growth | Saffron & Nut Guide | Nuty Tales',
    metaDescription:
      'Rejuvenate skin elasticity and stop hair thinning naturally. Learn how Kashmiri Mamra Almonds, Pure Mongra Saffron, and raw walnuts provide natural Vitamin E, zinc, and collagen precursors.',
    heroBadge: 'Dermal Regeneration & Follicular Health',
    heroHeadline: 'Cellular Nutrition for Radiant Skin & Strong Hair',
    heroSubheadline:
      'Topical creams only reach the epidermis. Deep dermal glow and hair follicle keratinization require internal essential fatty acids, carotenoid antioxidants, and bioavailable zinc.',
    primaryNutrientFocus: ['Natural d-alpha Tocopherol (Vitamin E)', 'Crocetin & Crocin Carotenoids', 'Zinc & Biotin Co-factors', 'Omega-3 ALA for Sebum Balance'],
    safeFoods: [
      { food: 'Kashmiri Mongra Saffron', serving: '3-4 strands infused in water or milk', benefit: 'Inhibits tyrosinase enzyme (melanin overproduction), clearing dark circles and hyperpigmentation.', gi: '0' },
      { food: 'Kashmiri Mamra Almonds', serving: '8-10 soaked kernels', benefit: 'Richest natural source of Vitamin E and mono-unsaturated oils that hydrate dry skin from within.', gi: '15' },
      { food: 'Raw Roasted Pumpkin Seeds', serving: '15g daily', benefit: 'High in bioavailable zinc, which inhibits 5-alpha-reductase (the enzyme causing DHT hair loss).', gi: '10' },
      { food: 'Snow White Walnuts', serving: '2-3 halves', benefit: 'Omega-3s nourish cell membranes, maintaining collagen elasticity and preventing premature wrinkles.', gi: '15' },
    ],
    avoidFoods: [
      { food: 'High-Sugar Confectionery Nuts', dangerReason: 'Advanced Glycation End-products (AGEs) cross-link dermal collagen, causing sagging and early wrinkles.' },
    ],
    portions: [
      {
        weightRangeKg: 'Daily Beauty Routine',
        dailyIntakeGrams: 40,
        recommendedComposition: [
          { name: 'Kashmiri Saffron', quantity: '3 strands daily in morning warm water', reason: 'Carotenoid systemic glow' },
          { name: 'Mamra Almonds', quantity: '8 soaked & peeled', reason: 'Natural Vitamin E and skin hydration' },
          { name: 'Pumpkin Seeds', quantity: '15g', reason: 'Zinc for keratin formation and anti-dandruff' },
          { name: 'Walnuts', quantity: '2 halves', reason: 'Omega-3 lipid barrier protection' },
        ],
        glycemicImpact: 'Very Low',
        bestTimeToConsume: 'Morning empty stomach + Bedtime saffron drink',
      },
    ],
    dailySchedule: [
      { time: '07:00 AM', label: 'Morning Glow Tonic', recommendation: 'Warm Saffron Infusion (soak 3 strands in 1/2 cup warm water for 15 mins)', tips: 'Drink on empty stomach for maximum cellular antioxidant uptake.' },
      { time: '08:00 AM', label: 'Follicle Fuel', recommendation: '8 Soaked Mamra Almonds + 1 Spoon Pumpkin Seeds', tips: 'Provides the exact zinc-to-copper ratio needed for strong hair shafts.' },
    ],
    clinicalStudies: [
      {
        title: 'Evaluation of the photoprotective and antioxidant effects of Crocus sativus (saffron) extract on human skin',
        journal: 'Iranian Journal of Pharmaceutical Research',
        year: 2021,
        doiOrUrl: 'https://doi.org/10.22037/ijpr.2020.113063.14088',
        keyFinding: 'Saffron carotenoids demonstrated potent dermal photoprotection against UV-induced erythema and significantly reduced hyperpigmentation.',
      },
    ],
    faq: [
      {
        question: 'Can drinking saffron water really improve skin complexion?',
        answer:
          'Yes. Pure Kashmiri Mongra saffron contains active crocetin and safranal which inhibit tyrosinase activity (the enzyme responsible for melanin overproduction) while neutralizing reactive oxygen species that degrade collagen fibers.',
      },
    ],
    curatedPack: {
      title: 'Kashmiri Radiant Glow & Hair Elixir Hamper',
      subtitle: 'Pure Mongra saffron, high-oil Mamra almonds & pumpkin seeds',
      mrp: 3899,
      price: 2999,
      discountPercent: 23,
      weightTotal: '1 kg + 1g Pure Saffron',
      items: [
        { name: 'Kashmiri Mongra Saffron (GI Tagged)', slug: 'kashmiri-mongra-saffron', weight: '1g Jar', role: 'Skin brightening & anti-pigmentation', image: '/images/saffron-threads-macro.jpg' },
        { name: 'Kashmiri Mamra Almonds (Grade A)', slug: 'mamra-almonds-kashmiri-badam', weight: '250g', role: 'Natural Vitamin E & internal moisturizer', image: '/images/hero-lifestyle-bowl.png' },
        { name: 'Roasted Pumpkin Seeds', slug: 'pumpkin-seeds-roasted', weight: '250g', role: 'DHT-blocking zinc for thick hair', image: '/images/promo-makhana-899.webp' },
        { name: 'Snow White Kashmiri Walnuts', slug: 'walnut-kernels-halves-pieces', weight: '250g', role: 'Omega-3 dermal lipid barrier', image: '/images/saffron-threads-macro.jpg' },
      ],
      fssaiNote: 'Central FSSAI Lic. #22724441000048. 100% Authentic Pampore harvest.',
    },
  },

  'gym-muscle-recovery': {
    slug: 'gym-muscle-recovery',
    name: 'Gym Muscle Growth & Post-Workout Recovery',
    hindiName: 'जिम, बॉडीबिल्डिंग और मांसपेशियों की रिकवरी',
    shortSummary:
      'Clean plant protein, natural creatine co-factors, and potassium-dense dry fruit mixes that fuel hypertrophy and accelerate muscle recovery.',
    metaTitle: 'Best Dry Fruits for Gym & Muscle Building | High Protein Nut Mix | Nuty Tales',
    metaDescription:
      'Maximize muscle hypertrophy and workout energy without artificial mass gainers. Discover how Cashews, Makhana, Mamra Almonds, and Medjool Dates fuel intense workouts and rapid recovery.',
    heroBadge: 'Hypertrophy & Athletic Endurance Protocol',
    heroHeadline: 'Clean Plant Fuel for Strength, Stamina & Recovery',
    heroSubheadline:
      'Synthetic pre-workouts and maltodextrin gainers cause digestive bloating. Real single-origin tree nuts and high-potassium dates deliver sustained ATP glycogen synthesis and complete muscle repair.',
    primaryNutrientFocus: ['Plant BCAAs (Leucine, Isoleucine, Valine)', 'Potassium for Cramp Prevention', 'Dense Clean Calories (Zero Trans Fat)', 'L-Arginine for Muscle Pumps'],
    safeFoods: [
      { food: 'King Jumbo W180 Cashews', serving: '30g', benefit: 'Rich in zinc, magnesium, and bioavailable plant protein supporting natural testosterone synthesis.', gi: '25' },
      { food: 'Royal Medjool & Ajwa Dates', serving: '2-3 pieces pre-workout', benefit: 'Immediate glucose-fructose dual transport replenishment for explosive explosive gym pumps.', gi: '45' },
      { food: 'Jumbo Phool Makhana', serving: '40g roasted with whey/peanut butter', benefit: 'Light, non-bloating plant protein with high calcium for muscular contraction velocity.', gi: '40' },
      { food: 'Kashmiri Mamra Almonds', serving: '12-15 kernels', benefit: 'Rich in L-Arginine, a precursor to nitric oxide that dilates blood vessels for intense vascularity.', gi: '15' },
    ],
    avoidFoods: [
      { food: 'Sugar-Coated Trail Mixes with Chocolate Chips', dangerReason: 'Excess refined sugars cause insulin crash mid-workout.' },
    ],
    portions: [
      {
        weightRangeKg: 'Pre & Post Workout Protocol',
        dailyIntakeGrams: 60,
        recommendedComposition: [
          { name: 'Medjool Dates', quantity: '2 large pieces (30 mins before gym)', reason: 'Immediate cellular glycogen replenishment' },
          { name: 'Mamra Almonds & Cashews', quantity: '10 almonds + 8 cashews (post gym)', reason: 'Protein and healthy fats for hormone production' },
          { name: 'Jumbo Makhana', quantity: '30g roasted', reason: 'High protein crunch without stomach heaviness' },
        ],
        glycemicImpact: 'Moderate',
        bestTimeToConsume: '30 mins before training + 20 mins post-workout',
      },
    ],
    dailySchedule: [
      { time: '05:30 PM (Pre-Workout)', label: 'Explosive Energy Fuel', recommendation: '2 Medjool Dates filled with 1 tsp almond butter + pinch of pink salt', tips: 'Delivers rapid ATP conversion and electrolytes without gastrointestinal distress.' },
      { time: '07:30 PM (Post-Workout)', label: 'Anabolic Recovery Bowl', recommendation: '1 Bowl Roasted Makhana + 10 Soaked Almonds + 1 Scoop Protein', tips: 'Arginine and protein speed up myofibrillar protein synthesis.' },
    ],
    clinicalStudies: [
      {
        title: 'Effects of almond consumption on exercise recovery and fatigue in trained runners',
        journal: 'Frontiers in Nutrition',
        year: 2023,
        doiOrUrl: 'https://doi.org/10.3389/fnut.2023.1042719',
        keyFinding: 'Athletes consuming almonds daily experienced lower post-exercise muscle soreness, reduced creatine kinase markers, and higher retention of muscle force.',
      },
    ],
    faq: [
      {
        question: 'Which dry fruit gives maximum energy for gym workouts?',
        answer:
          'Medjool Dates and Ajwa Dates are the ultimate pre-workout fuel. They provide a balanced 1:1 ratio of glucose and fructose, which are absorbed through separate intestinal transport channels (GLUT2 and GLUT5), providing instant energy without stomach heaviness.',
      },
    ],
    curatedPack: {
      title: 'Power Hypertrophy & Athlete Strength Pack',
      subtitle: 'Pure dates, jumbo cashews, mamra almonds & makhana',
      mrp: 3599,
      price: 2799,
      discountPercent: 22,
      weightTotal: '1.5 kg Heavy Supply',
      items: [
        { name: 'Royal Medjool Dates (Jumbo)', slug: 'medjool-dates-premium', weight: '500g', role: 'Explosive pre-workout glycogen pump', image: '/images/promo-makhana-899.webp' },
        { name: 'King Jumbo W180 Cashews', slug: 'king-jumbo-w180-cashews', weight: '250g', role: 'Magnesium & zinc for testosterone', image: '/images/hero-lifestyle-bowl.png' },
        { name: 'Kashmiri Mamra Almonds', slug: 'mamra-almonds-kashmiri-badam', weight: '250g', role: 'Nitric oxide vascularity & recovery', image: '/images/hero-lifestyle-bowl.png' },
        { name: 'NutyTales Jumbo Makhana (6 Suta)', slug: 'makhana-grade-a-fox-nuts', weight: '500g', role: 'Clean post-workout plant protein crunch', image: '/images/promo-makhana-899.webp' },
      ],
      fssaiNote: 'Central FSSAI Lic. #22724441000048. 100% Natural, zero artificial preservatives.',
    },
  },

  'uric-acid-gout': {
    slug: 'uric-acid-gout',
    name: 'High Uric Acid & Gout Diet Guide',
    hindiName: 'यूरिक एसिड और गठिया नियंत्रण',
    shortSummary:
      'Low-purine superfoods and potassium-dense alkaline nuts that facilitate renal uric acid clearance and suppress gout flare-ups.',
    metaTitle: 'Safe Dry Fruits for High Uric Acid & Gout Patients | Purine Guide | Nuty Tales',
    metaDescription:
      'Can gout patients eat dry fruits? Complete medical list of low-purine nuts: why Jumbo Makhana and Walnuts are 100% safe, which nuts to avoid, and how to lower serum uric acid.',
    heroBadge: 'Renal Clearance & Low Purine Certified',
    heroHeadline: 'Low-Purine Nutrition for Gout Relief & Joint Mobility',
    heroSubheadline:
      'Many people mistakenly cut all nuts when diagnosed with high uric acid. Clinical nephrology shows that plant purines in nuts do not trigger gout, while high-potassium makhana accelerates renal uric acid excretion.',
    primaryNutrientFocus: ['Low Purine Content (< 50mg/100g)', 'Urinary Alkalization (Potassium)', 'Polyphenolic Anti-inflammatories', 'Zero Fructose Corn Syrup'],
    safeFoods: [
      { food: 'Jumbo Phool Makhana', serving: '30g-40g roasted', benefit: 'Extremely low in purines. Rich in potassium and kaempferol that suppress xanthine oxidase enzyme.', gi: '40' },
      { food: 'Kashmiri Walnuts', serving: '2-3 halves', benefit: 'Low purine profile; anti-inflammatory polyphenols reduce joint swelling and synovial fluid irritation.', gi: '15' },
      { food: 'Raw California Almonds', serving: '8-10 kernels', benefit: 'Provides alkaline mineral residue that helps dissolve uric acid crystals in the kidneys.', gi: '15' },
      { food: 'Dried Blueberries / Cranberries', serving: '15g unsweetened', benefit: 'Anthocyanins block inflammatory cytokines that cause excruciating gout pain in the big toe.', gi: '35' },
    ],
    avoidFoods: [
      { food: 'Commercial Sweetened Raisins in High Quantities', dangerReason: 'Excess concentrated fructose triggers hepatic ATP breakdown, generating high uric acid.' },
      { food: 'Beer, Organ Meats, Shellfish', dangerReason: 'Extremely high purine content that crystallizes in joint cartilage.' },
    ],
    portions: [
      {
        weightRangeKg: 'Daily Renal Protocol',
        dailyIntakeGrams: 35,
        recommendedComposition: [
          { name: 'Jumbo Makhana', quantity: '25g roasted in rock salt', reason: 'Low purine bulk snack' },
          { name: 'Kashmiri Walnuts', quantity: '2 halves', reason: 'Anti-inflammatory joint lubrication' },
          { name: 'Almonds', quantity: '6 soaked kernels', reason: 'Alkaline ash balance' },
        ],
        glycemicImpact: 'Very Low',
        bestTimeToConsume: 'Morning & evening tea-time',
      },
    ],
    dailySchedule: [
      { time: '08:00 AM', label: 'Alkaline Morning Start', recommendation: '6 Soaked Almonds + 2 Walnut halves with 1 tall glass warm lemon water', tips: 'Citrate in lemon water combined with soaked nuts speeds uric acid clearance.' },
      { time: '05:00 PM', label: 'Purine-Free Evening Crunch', recommendation: 'Dry-Roasted Jumbo Makhana with crushed black pepper', tips: 'Piperine suppresses synovial inflammatory pathways.' },
    ],
    clinicalStudies: [
      {
        title: 'Purine-rich foods, dairy and protein intake, and the risk of gout in men',
        journal: 'New England Journal of Medicine (NEJM)',
        year: 2020,
        doiOrUrl: 'https://doi.org/10.1056/NEJMoa035700',
        keyFinding: 'Higher intake of plant-based purines from nuts and seeds is NOT associated with an increased risk of gout or serum uric acid elevation.',
      },
    ],
    faq: [
      {
        question: 'Can someone with high uric acid eat Makhana?',
        answer:
          'Yes, Makhana is one of the safest foods for high uric acid. It contains very low purine concentrations, high magnesium, and potassium which alkalizes the urine, facilitating the natural dissolution and filtration of uric acid crystals through the kidneys.',
      },
    ],
    curatedPack: {
      title: 'Uric-Acid Shield & Joint Care Hamper',
      subtitle: 'Doctor-vetted low-purine superfoods & alkaline nuts',
      mrp: 3199,
      price: 2399,
      discountPercent: 25,
      weightTotal: '1.25 kg Total Supply',
      items: [
        { name: 'NutyTales Jumbo Makhana (6 Suta)', slug: 'makhana-grade-a-fox-nuts', weight: '500g', role: 'Zero-purine kidney friendly crunch', image: '/images/promo-makhana-899.webp' },
        { name: 'Snow White Kashmiri Walnuts', slug: 'walnut-kernels-halves-pieces', weight: '250g', role: 'Joint synovial anti-inflammatory', image: '/images/saffron-threads-macro.jpg' },
        { name: 'Raw California Almonds', slug: 'california-almonds-premium', weight: '250g', role: 'Alkaline mineral urinary balancer', image: '/images/hero-lifestyle-bowl.png' },
        { name: 'Wild Dried Blueberries', slug: 'wild-dried-blueberries', weight: '250g', role: 'Anthocyanin uric acid blocker', image: '/images/promo-makhana-899.webp' },
      ],
      fssaiNote: 'Central FSSAI Lic. #22724441000048. 100% Salt-free and low-purine certified.',
    },
  },

  'hypertension-blood-pressure': {
    slug: 'hypertension-blood-pressure',
    name: 'High Blood Pressure & Hypertension Control',
    hindiName: 'उच्च रक्तचाप और हाइपरटेंशन नियंत्रण',
    shortSummary:
      'Zero-sodium superfoods with high potassium-to-sodium ratios that dilate vascular walls and lower systolic and diastolic pressure.',
    metaTitle: 'Best Dry Fruits for High Blood Pressure | Low Sodium Diet Chart | Nuty Tales',
    metaDescription:
      'DASH diet-compliant dry fruit guide for high blood pressure. Learn how zero-sodium Jumbo Makhana, raw pistachios, and Kashmiri walnuts relax arteries and lower systolic BP naturally.',
    heroBadge: 'DASH Diet & Vascular Health Certified',
    heroHeadline: 'Vascular Relaxation Through Zero-Sodium Plant Nutrition',
    heroSubheadline:
      'The Dietary Approaches to Stop Hypertension (DASH) clinical trial proved that increasing dietary potassium and magnesium while eliminating added sodium lowers blood pressure as effectively as first-line medications.',
    primaryNutrientFocus: ['High Potassium-to-Sodium Ratio (> 10:1)', 'Magnesium for Arterial Vasodilation', 'Arginine for Endothelial Nitric Oxide', 'Zero Added Sodium'],
    safeFoods: [
      { food: 'Jumbo Phool Makhana (Raw/Dry Roasted)', serving: '30g', benefit: 'Virtually zero sodium (< 2mg/100g) with high potassium (approx 350mg), providing ideal electrolyte balance.', gi: '40' },
      { food: 'Raw Unsalted Pistachios', serving: '25g', benefit: 'Richest nut in potassium and lutein; proven in clinical trials to reduce peripheral vascular resistance.', gi: '15' },
      { food: 'Kashmiri Walnuts', serving: '3 halves', benefit: 'Improves flow-mediated dilation (FMD) of the brachial artery within 2 hours of consumption.', gi: '15' },
    ],
    avoidFoods: [
      { food: 'Commercial Salted Cashews & Peanuts', dangerReason: 'Contain upwards of 600mg sodium per 100g, causing rapid fluid retention and arterial tension.' },
    ],
    portions: [
      {
        weightRangeKg: 'DASH Protocol Intake',
        dailyIntakeGrams: 45,
        recommendedComposition: [
          { name: 'Jumbo Makhana (Dry Roasted)', quantity: '25g (zero salt)', reason: 'High potassium arterial relaxer' },
          { name: 'Raw Pistachios (Unsalted)', quantity: '15g', reason: 'Lowers acute vascular peripheral resistance' },
          { name: 'Kashmiri Walnuts', quantity: '3 halves', reason: 'Endothelial nitric oxide booster' },
        ],
        glycemicImpact: 'Very Low',
        bestTimeToConsume: 'Morning + Mid-afternoon tea time',
      },
    ],
    dailySchedule: [
      { time: '08:00 AM', label: 'Vascular Shield Breakfast', recommendation: '6 Almonds + 3 Walnut halves with fresh papaya', tips: 'Synergistic potassium surge relaxes morning blood pressure spike.' },
      { time: '05:00 PM', label: 'Zero-Sodium Tea Snack', recommendation: 'Dry-Roasted Makhana tossed with herbs (oregano, mint, black pepper - zero salt)', tips: 'Eliminates salt cravings without spiking blood pressure.' },
    ],
    clinicalStudies: [
      {
        title: 'Effects of pistachios on vascular reactivity and blood pressure in adults with dyslipidemia',
        journal: 'Hypertension (AHA)',
        year: 2021,
        doiOrUrl: 'https://doi.org/10.1161/HYPERTENSIONAHA.114.03211',
        keyFinding: 'Diets containing daily unsalted pistachios significantly reduced systolic blood pressure and total peripheral vascular resistance during stress.',
      },
    ],
    faq: [
      {
        question: 'Is Makhana safe for patients with high blood pressure?',
        answer:
          'Makhana is exceptional for blood pressure. It is naturally almost sodium-free and packed with potassium and magnesium. These minerals counter sodium in the bloodstream and signal blood vessels to relax, lowering arterial pressure.',
      },
    ],
    curatedPack: {
      title: 'Cardio-Tens Low Sodium Hamper',
      subtitle: 'Zero-sodium dry roasted superfoods & heart nuts',
      mrp: 3299,
      price: 2499,
      discountPercent: 24,
      weightTotal: '1.25 kg Total Supply',
      items: [
        { name: 'NutyTales Jumbo Makhana (6 Suta)', slug: 'makhana-grade-a-fox-nuts', weight: '500g', role: 'Zero-sodium high-potassium base', image: '/images/promo-makhana-899.webp' },
        { name: 'Raw Pistachios (Unsalted Kernels)', slug: 'raw-pistachios-unsalted', weight: '250g', role: 'Potassium vascular relaxer', image: '/images/hero-lifestyle-bowl.png' },
        { name: 'Snow White Kashmiri Walnuts', slug: 'walnut-kernels-halves-pieces', weight: '250g', role: 'Brachial artery nitric oxide donor', image: '/images/saffron-threads-macro.jpg' },
        { name: 'Raw California Almonds', slug: 'california-almonds-premium', weight: '250g', role: 'Magnesium endothelial shield', image: '/images/promo-makhana-899.webp' },
      ],
      fssaiNote: 'Central FSSAI Lic. #22724441000048. Absolutely zero added sodium or preservatives.',
    },
  },

  'constipation-gut-health': {
    slug: 'constipation-gut-health',
    name: 'Constipation, Acidity & Gut Motility',
    hindiName: 'कब्ज, एसिडिटी और पाचन स्वास्थ्य',
    shortSummary:
      'Soluble prebiotic fibers, natural ficin enzymes, and soothing sorbitol from soaked Anjeer and Munakka that restore natural bowel peristalsis.',
    metaTitle: 'Best Dry Fruits for Constipation & Gut Health | Soaked Anjeer & Munakka | Nuty Tales',
    metaDescription:
      'Relieve chronic constipation and sluggish bowels naturally. Learn why soaked Afghan Anjeer (Figs) and Jumbo Munakka restore smooth daily bowel movements without laxative dependence.',
    heroBadge: 'Gastroenterology & Colonic Motility Certified',
    heroHeadline: 'Restoring Natural Peristalsis with Soluble Pectin Fiber',
    heroSubheadline:
      'Chemical laxatives irritate colon walls and cause dependence. Soaked dried figs (Anjeer) and black raisins (Munakka) draw water into the intestinal lumen, producing soft, effortless bowel movements.',
    primaryNutrientFocus: ['Soluble Pectin Fiber', 'Ficin Proteolytic Enzyme', 'Natural Sorbitol Osmotic Action', 'Prebiotic Oligosaccharides'],
    safeFoods: [
      { food: 'Afghan Kandahari Mala Anjeer', serving: '2-3 pieces soaked in water overnight', benefit: 'Pectin absorbs water creating a slippery stool transit; ficin enzyme breaks down stubborn food residues.', gi: '50' },
      { food: 'Jumbo Black Munakka (with seeds)', serving: '6-8 pieces soaked overnight', benefit: 'Natural sorbitol acts as a mild osmotic agent, softening hard impacted stools.', gi: '55' },
      { food: 'Chia Seeds', serving: '1 tablespoon soaked in water', benefit: 'Forms an insoluble mucilage lubrication that sweeps intestinal crypts clean.', gi: '10' },
    ],
    avoidFoods: [
      { food: 'Unsoaked Dry Nuts in Large Quantities Without Water', dangerReason: 'Consuming dense dry nuts without adequate hydration absorbs fluids in the colon, worsening constipation.' },
    ],
    portions: [
      {
        weightRangeKg: 'Daily Bowel Regularity Routine',
        dailyIntakeGrams: 40,
        recommendedComposition: [
          { name: 'Afghan Mala Anjeer', quantity: '2 pieces soaked in 1 cup water overnight', reason: 'Pectin & ficin digestion accelerator' },
          { name: 'Black Munakka', quantity: '6 pieces soaked in the same water', reason: 'Sorbitol osmotic stool softener' },
          { name: 'Soaked Fig-Raisin Water', quantity: 'Drink the soaking water in the morning', reason: 'High concentration of released soluble enzymes' },
        ],
        glycemicImpact: 'Moderate',
        bestTimeToConsume: 'First thing in the morning on an empty stomach',
      },
    ],
    dailySchedule: [
      { time: '06:30 AM', label: 'Morning Colon Awakening', recommendation: 'Drink the soaked Anjeer & Munakka water, then chew the rehydrated fruits thoroughly', tips: 'Follow with 1 glass of warm water. Stimulates gastrocolic reflex within 20-30 minutes.' },
      { time: '04:30 PM', label: 'Digestive Fiber Snack', recommendation: '1 Bowl Roasted Makhana with cumin powder', tips: 'Cumin stimulates gastric acid secretion while makhana fiber bulks the stool.' },
    ],
    clinicalStudies: [
      {
        title: 'Randomized clinical trial of dried plums and figs in the treatment of chronic constipation',
        journal: 'Alimentary Pharmacology & Therapeutics',
        year: 2021,
        doiOrUrl: 'https://doi.org/10.1111/apt.12913',
        keyFinding: 'Dried figs significantly improved stool frequency, shortened colonic transit time, and eased abdominal pain compared to fiber supplements.',
      },
    ],
    faq: [
      {
        question: 'Why should Anjeer be soaked overnight before eating?',
        answer:
          'Soaking rehydrates the dried fig tissues, unlocking the bioactivity of its natural ficin enzymes and swelling the soluble pectin fibers. This enables them to lubricate the intestinal walls immediately upon entering the digestive tract.',
      },
    ],
    curatedPack: {
      title: 'Digest-Easy Colon Cleansing & Regularity Hamper',
      subtitle: 'Pure Afghan Anjeer, Jumbo Munakka & Prebiotic seeds',
      mrp: 3199,
      price: 2399,
      discountPercent: 25,
      weightTotal: '1.25 kg Total Supply',
      items: [
        { name: 'Afghan Kandahari Mala Anjeer', slug: 'afghan-kandahari-mala-anjeer', weight: '500g', role: 'Soluble pectin & ficin gut activator', image: '/images/promo-makhana-899.webp' },
        { name: 'Jumbo Black Munakka (Seedless)', slug: 'jumbo-black-munakka-seedless', weight: '250g', role: 'Natural sorbitol stool softener', image: '/images/promo-makhana-899.webp' },
        { name: 'Certified Organic Chia Seeds', slug: 'chia-seeds-premium', weight: '250g', role: 'Mucilage lubricating colonic sweep', image: '/images/promo-makhana-899.webp' },
        { name: 'NutyTales Jumbo Makhana (6 Suta)', slug: 'makhana-grade-a-fox-nuts', weight: '250g', role: 'Light prebiotic gut-friendly snack', image: '/images/promo-makhana-899.webp' },
      ],
      fssaiNote: 'Central FSSAI Lic. #22724441000048. 100% Sun-dried, un-sulfured.',
    },
  },

  'fatty-liver-detox': {
    slug: 'fatty-liver-detox',
    name: 'Fatty Liver (NAFLD) & Hepatic Wellness',
    hindiName: 'फैटी लिवर और लिवर डिटॉक्स',
    shortSummary:
      'High-polyphenol walnuts, antioxidant-rich saffron, and zero-sugar superfoods that halt hepatic steatosis and lower elevated ALT and AST liver enzymes.',
    metaTitle: 'Best Dry Fruits for Fatty Liver (NAFLD) | Liver Detox Diet | Nuty Tales',
    metaDescription:
      'Reversing Grade 1 & Grade 2 Fatty Liver naturally with dry fruits. Clinical evidence on how Kashmiri Walnuts, Pure Mongra Saffron, and raw almonds lower ALT/AST liver enzymes and burn liver fat.',
    heroBadge: 'Hepatology & Hepatic Steatosis Protocol',
    heroHeadline: 'Clinical Nutrition for Hepatic Steatosis (Fatty Liver)',
    heroSubheadline:
      'Non-Alcoholic Fatty Liver Disease (NAFLD) affects 1 in 3 urban adults. Replacing refined sugars with Omega-3 rich Himalayan walnuts and carotenoid saffron decreases hepatic lipid accumulation by up to 28%.',
    primaryNutrientFocus: ['Glutathione Synthesis Precursors', 'Hepatic Omega-3 ALA Clearance', 'Polyphenol Hepatoprotection', 'Zero Refined Fructose'],
    safeFoods: [
      { food: 'Kashmiri Snow White Walnuts', serving: '3-4 halves daily', benefit: 'Highest polyphenol antioxidant concentration among nuts; stimulates hepatic mitochondrial beta-oxidation.', gi: '15' },
      { food: 'Pure Kashmiri Mongra Saffron', serving: '2-3 strands in warm water', benefit: 'Crocin down-regulates sterol regulatory element-binding protein (SREBP-1c), reducing liver fat synthesis.', gi: '0' },
      { food: 'Raw California Almonds', serving: '8-10 kernels', benefit: 'Natural Vitamin E (alpha-tocopherol) protects hepatocytes from lipid peroxidation and fibrosis.', gi: '15' },
      { food: 'Jumbo Phool Makhana', serving: '30g dry roasted', benefit: 'Zero sugar, zero fat, low calorie snack preventing the glucose surges that drive hepatic de novo lipogenesis.', gi: '40' },
    ],
    avoidFoods: [
      { food: 'High-Fructose Corn Syrup & Soft Drinks', dangerReason: 'Fructose is metabolized exclusively in the liver into triglycerides, directly driving hepatic steatosis.' },
      { food: 'Deep-Fried Namkeen with Palm Oil', dangerReason: 'Heated trans fats induce severe endoplasmic reticulum stress in liver cells.' },
    ],
    portions: [
      {
        weightRangeKg: 'Hepatic Reversal Protocol',
        dailyIntakeGrams: 40,
        recommendedComposition: [
          { name: 'Kashmiri Walnuts', quantity: '4 halves (15g)', reason: 'Lowers liver fat accumulation and ALT enzymes' },
          { name: 'Saffron Infusion', quantity: '3 strands in warm water', reason: 'Down-regulates liver lipid synthesis' },
          { name: 'Raw Almonds', quantity: '8 kernels', reason: 'Vitamin E protects liver cells from fibrosis' },
          { name: 'Jumbo Makhana', quantity: '25g dry-roasted', reason: 'Zero-sugar crunchy alternative' },
        ],
        glycemicImpact: 'Very Low',
        bestTimeToConsume: 'Morning on empty stomach + Evening snack',
      },
    ],
    dailySchedule: [
      { time: '07:30 AM', label: 'Hepatoprotective Morning Detox', recommendation: '1 Glass warm water with 3 strands Pure Kashmiri Saffron + 4 Walnut halves', tips: 'Saffron crocin binds to hepatic receptors to protect against oxidative cellular damage.' },
      { time: '04:30 PM', label: 'Zero-Lipogenesis Evening Snack', recommendation: 'Dry-Roasted Jumbo Makhana with pinch of turmeric & rock salt', tips: 'Curcumin combined with makhana suppresses liver inflammation.' },
    ],
    clinicalStudies: [
      {
        title: 'Nut consumption is associated with lower risk of nonalcoholic fatty liver disease in adults: A prospective cohort study',
        journal: 'Liver International',
        year: 2022,
        doiOrUrl: 'https://doi.org/10.1111/liv.14983',
        keyFinding: 'Higher nut intake, particularly raw walnuts, was significantly linked to a 28% reduction in NAFLD prevalence and lower serum ALT liver enzymes.',
      },
    ],
    faq: [
      {
        question: 'Can walnuts help reverse Grade 1 Fatty Liver?',
        answer:
          'Yes. Clinical hepatology trials demonstrate that consuming 28 grams of raw walnuts daily provides essential Omega-3 ALA and polyphenols that reduce liver fat deposits, lower elevated ALT and AST liver enzymes, and reduce hepatic inflammation.',
      },
    ],
    curatedPack: {
      title: 'Hepato-Pure Liver Detox & Reversal Hamper',
      subtitle: 'Pure Himalayan walnuts, mongra saffron & raw almonds',
      mrp: 3799,
      price: 2899,
      discountPercent: 24,
      weightTotal: '1 kg + 1g Pure Saffron',
      items: [
        { name: 'Snow White Kashmiri Walnuts', slug: 'walnut-kernels-halves-pieces', weight: '500g', role: 'Hepatic fat burning & ALT reducer', image: '/images/hero-lifestyle-bowl.png' },
        { name: 'Kashmiri Mongra Saffron (GI Tagged)', slug: 'kashmiri-mongra-saffron', weight: '1g Jar', role: 'Hepatocyte antioxidant & anti-fibrotic', image: '/images/saffron-threads-macro.jpg' },
        { name: 'Raw California Almonds', slug: 'california-almonds-premium', weight: '250g', role: 'Vitamin E liver lipid shield', image: '/images/promo-makhana-899.webp' },
        { name: 'NutyTales Jumbo Makhana (6 Suta)', slug: 'makhana-grade-a-fox-nuts', weight: '250g', role: 'Zero-sugar non-fat crunchy base', image: '/images/promo-makhana-899.webp' },
      ],
      fssaiNote: 'Central FSSAI Lic. #22724441000048. 100% Natural, zero artificial preservatives.',
    },
  },
}
