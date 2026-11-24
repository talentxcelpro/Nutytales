// ─── Indian Festive & Vrat Fasting Programmatic Knowledge Base ───────────────────────
// Targets 50M+ annual fasting queries in India (Navratri, Ekadashi, Shivratri, Ramadan)

export interface VratFoodItem {
  food: string
  reason: string
  role: string
  productSlug?: string
  productName?: string
}

export interface VratProhibitedItem {
  food: string
  prohibitionReason: string
}

export interface VratFestivalData {
  slug: string
  festivalName: string
  hindiName: string
  significance: string
  metaTitle: string
  metaDescription: string
  heroBadge: string
  overview: string
  allowedFoods: VratFoodItem[]
  prohibitedFoods: VratProhibitedItem[]
  fastingProtocol: {
    time: string
    phase: string
    recommendation: string
    spiritualAndDigestiveTip: string
  }[]
  curatedBox: {
    title: string
    price: number
    mrp: number
    discountPercent: number
    weight: string
    items: string[]
  }
  faq: {
    question: string
    answer: string
  }[]
}

export const VRAT_FESTIVALS: Record<string, VratFestivalData> = {
  'navratri-fasting-diet-chart': {
    slug: 'navratri-fasting-diet-chart',
    festivalName: 'Navratri 9-Day Fasting Diet & Superfood Guide',
    hindiName: 'नवरात्रि व्रत डाइट चार्ट और फलाहार नियम',
    significance: 'Celebrated twice yearly (Chaitra & Sharad Navratri) dedicated to Maa Durga',
    metaTitle: 'Navratri Fasting Diet Chart | Safe Vrat Foods & Makhana Rules | Nuty Tales',
    metaDescription:
      'Complete 9-day Navratri fasting diet chart. Why Jumbo Makhana, Sendha Namak dry fruits, and Saffron milk are the ultimate sattvic foods to sustain energy and digestion during Navratri.',
    heroBadge: 'Sattvic Spiritual & Metabolic Cleansing',
    overview:
      'Navratri fasting is an ancient seasonal detoxification period occurring during the transition of seasons (Ritu Sandhi). When wheat, rice, and allium (onion/garlic) are excluded, clean single-origin aquatic seeds like Phool Makhana and unpasteurized tree nuts provide essential amino acids, calcium, and sustained mitochondrial energy without triggering digestive lethargy (Tamas).',
    allowedFoods: [
      {
        food: 'NutyTales Jumbo Phool Makhana (6 Suta)',
        reason: 'Sacred aquatic lotus seed, 100% sattvic, non-grain, high protein and fiber.',
        role: 'Primary crunchy snack & kheer base',
        productSlug: 'makhana-grade-a-fox-nuts',
        productName: 'Jumbo 6 Suta Makhana',
      },
      {
        food: 'Kashmiri Mamra Almonds',
        reason: 'Soaked and peeled almonds provide vital magnesium and healthy fats preventing fasting headaches.',
        role: 'Morning empty-stomach energy',
        productSlug: 'mamra-almonds-kashmiri-badam',
        productName: 'Kashmiri Mamra Almonds',
      },
      {
        food: 'Pure Kashmiri Mongra Saffron',
        reason: 'Sattvic spice elevating positive mood and aiding digestive bile during fasting.',
        role: 'Golden bedtime milk & kheer aroma',
        productSlug: 'kashmiri-mongra-saffron',
        productName: 'Kashmiri Mongra Saffron',
      },
      {
        food: 'Royal Medjool & Ajwa Dates',
        reason: 'Natural glucose-fructose matrix that immediately clears fasting fatigue.',
        role: 'Instant natural energy',
        productSlug: 'medjool-dates-premium',
        productName: 'Royal Medjool Dates',
      },
      {
        food: 'Roasted Salt-Free Cashews & Walnuts',
        reason: 'Dense healthy calories maintaining body temperature during fasting.',
        role: 'Mid-afternoon satiety',
        productSlug: 'walnut-kernels-halves-pieces',
        productName: 'Snow White Walnuts',
      },
    ],
    prohibitedFoods: [
      { food: 'All Cereal Grains (Wheat, Rice, Corn, Oats)', prohibitionReason: 'Considered heavy (Rajasic/Tamasic) and prohibited in classical Vedic scripture.' },
      { food: 'Table Salt (Iodized Vacuum Salt)', prohibitionReason: 'Must strictly use unrefined Sendha Namak (Himalayan Rock Salt).' },
      { food: 'Onion, Garlic & Mustard Oil', prohibitionReason: 'Pungent foods that agitate nervous system focus and inner meditative balance.' },
    ],
    fastingProtocol: [
      {
        time: '07:30 AM',
        phase: 'Pratah Kaal (Morning Awaken)',
        recommendation: '6 Soaked Mamra Almonds + 2 Walnut halves with warm water',
        spiritualAndDigestiveTip: 'Peel almond skins to allow gentle digestive absorption on an empty stomach.',
      },
      {
        time: '12:30 PM',
        phase: 'Madhyan Falahar (Lunch)',
        recommendation: 'Kuttu/Singhara Atta Roti with Lauki sabzi + 1 bowl curd topped with roasted cumin',
        spiritualAndDigestiveTip: 'Singhara flour paired with curd maintains gut microbiome alkalinity.',
      },
      {
        time: '04:30 PM',
        phase: 'Sandhya Aarti Snack (Tea Time)',
        recommendation: '1 Giant Bowl of Ghee-Roasted Jumbo Makhana with Sendha Namak & black pepper',
        spiritualAndDigestiveTip: 'Makhana absorbs stomach acid, preventing late afternoon fasting heartburn.',
      },
      {
        time: '09:00 PM',
        phase: 'Shayan Kaal (Bedtime Milk)',
        recommendation: 'Warm A2 Cow Milk infused with 4 strands of Pure Kashmiri Saffron & pinch of cardamom',
        spiritualAndDigestiveTip: 'Calms the nervous system and induces deep restorative sleep.',
      },
    ],
    curatedBox: {
      title: 'Navratri 9-Day Akhand Vrat Superfood Hamper',
      price: 1999,
      mrp: 2799,
      discountPercent: 28,
      weight: '1.25 kg + 1g Saffron',
      items: [
        '500g NutyTales Jumbo 6 Suta Makhana',
        '250g Kashmiri Mamra Almonds (Grade A)',
        '250g Snow White Kashmiri Walnuts',
        '250g Royal Medjool Dates',
        '1g Pure Kashmiri Mongra Saffron (GI Tagged)',
      ],
    },
    faq: [
      {
        question: 'Why is Makhana the premier food for Navratri fasts?',
        answer:
          'Phool Makhana is an aquatic lotus seed grown naturally in clean wetlands with zero grain contamination. It has an exceptionally low glycemic load, high calcium, and zero sodium, making it completely sattvic and energizing for all 9 days.',
      },
    ],
  },

  'ekadashi-vrat-food-rules': {
    slug: 'ekadashi-vrat-food-rules',
    festivalName: 'Ekadashi Vrat Rules: Permissible Dry Fruits & Food Chart',
    hindiName: 'एकादशी व्रत नियम और फलाहार सूची',
    significance: 'Observed every 11th lunar day (twice a month) dedicated to Lord Vishnu',
    metaTitle: 'Ekadashi Vrat Food Rules | Can We Eat Makhana on Ekadashi? | Nuty Tales',
    metaDescription:
      'Official Ekadashi fasting food rules. Discover why grains, rice, and beans are forbidden, why Makhana and dry fruits are the gold standard sattvic falahar, and daily sample menu.',
    heroBadge: 'Bi-Monthly Lunar Bio-Rhythm Fasting',
    overview:
      'According to Vedic astronomical literature and Ayurveda, the 11th lunar day (Ekadashi) features gravitational alignments where the human digestive fire (Jatharagni) slows. Avoiding heavy starches and rice prevents metabolic congestion. Pure lotus seeds (makhana), milk, fruits, and dry fruits provide clean nutrition that supports mental clarity and prayer.',
    allowedFoods: [
      {
        food: 'NutyTales Jumbo Phool Makhana',
        reason: 'Non-grain, harvested from lotus flowers. 100% compliant with strict Vaishnava Ekadashi rules.',
        role: 'Core Ekadashi snack & kheer',
        productSlug: 'makhana-grade-a-fox-nuts',
        productName: 'Jumbo 6 Suta Makhana',
      },
      {
        food: 'Kashmiri Walnuts & Almonds',
        reason: 'Sattvic tree nuts providing essential Omega-3 fats and protein without grain contamination.',
        role: 'Morning and evening strength',
        productSlug: 'walnut-kernels-halves-pieces',
        productName: 'Snow White Walnuts',
      },
      {
        food: 'Medjool & Ajwa Dates',
        reason: 'Clean energetic fruit providing instant natural fructose.',
        role: 'Energy booster',
        productSlug: 'medjool-dates-premium',
        productName: 'Royal Medjool Dates',
      },
    ],
    prohibitedFoods: [
      { food: 'Rice (Chawal) in Any Form', prohibitionReason: 'Scriptural injunction: Rice absorbs lunar moisture and causes digestive sluggishness.' },
      { food: 'Wheat, Pulses, Legumes & Mustard Seeds', prohibitionReason: 'Grains and beans carry heavy metabolic digestive burden on Ekadashi.' },
    ],
    fastingProtocol: [
      {
        time: 'Morning',
        phase: 'Falahar Awakening',
        recommendation: 'Soaked Mamra Almonds + Glass of milk with Kashmiri Saffron',
        spiritualAndDigestiveTip: 'Maintains mental sharpness during morning prayers and meditation.',
      },
      {
        time: 'Evening',
        phase: 'Ekadashi Falahar',
        recommendation: 'Ghee-roasted Jumbo Makhana with sendha namak + fruit bowl',
        spiritualAndDigestiveTip: 'Satisfies evening hunger without causing heaviness before sleeping.',
      },
    ],
    curatedBox: {
      title: 'Ekadashi Pure Sattvic Falahar Box',
      price: 1499,
      mrp: 2199,
      discountPercent: 31,
      weight: '1 kg Complete Supply',
      items: [
        '500g NutyTales Jumbo 6 Suta Makhana',
        '250g Kashmiri Mamra Almonds',
        '250g Royal Medjool Dates',
      ],
    },
    faq: [
      {
        question: 'Can we eat makhana on Ekadashi fast?',
        answer:
          'Yes, Makhana is one of the most widely recommended and scripturally sanctioned foods for Ekadashi. Because it is an aquatic lotus seed and not a cereal grain (Anna), it is considered completely pure (Shuddh Falahar).',
      },
    ],
  },

  'mahashivratri-vrat-diet': {
    slug: 'mahashivratri-vrat-diet',
    festivalName: 'Maha Shivratri Fasting Diet & Prasad Guide',
    hindiName: 'महाशिवरात्रि व्रत फलाहार और प्रसाद',
    significance: 'The Great Night of Lord Shiva, observed with all-night vigil and fasting',
    metaTitle: 'Maha Shivratri Vrat Diet & Prasad Guide | Makhana & Saffron | Nuty Tales',
    metaDescription:
      'Scientific and spiritual Maha Shivratri fasting diet guide. Learn how to stay energized all night with roasted makhana, kesar milk, and soaked dry fruits during the Shivratri vigil.',
    heroBadge: 'All-Night Vigil & Detoxification Protocol',
    overview:
      'Maha Shivratri is an intense spiritual fast requiring sustained wakefulness throughout the night (Jagran). Consuming heavy oily meals causes sluggish drowsiness. Light, high-protein superfoods like dry-roasted makhana, saffron-infused milk (Panchamrit base), and nutrient-dense dates keep the mind alert and body energized.',
    allowedFoods: [
      {
        food: 'NutyTales Jumbo Makhana',
        reason: 'Sacred aquatic seed associated with Lord Shiva’s pure ascetic diet.',
        role: 'All-night vigil energy crunch',
        productSlug: 'makhana-grade-a-fox-nuts',
        productName: 'Jumbo 6 Suta Makhana',
      },
      {
        food: 'Pure Kashmiri Mongra Saffron',
        reason: 'The ultimate cooling, sattvic offering for Shiva Lingam abhishek and prasad milk.',
        role: 'Sacred offering & vitality',
        productSlug: 'kashmiri-mongra-saffron',
        productName: 'Kashmiri Mongra Saffron',
      },
    ],
    prohibitedFoods: [
      { food: 'All Grains, Garlic, Onions, and Refined Salts', prohibitionReason: 'Disrupts ascetic meditative clarity.' },
    ],
    fastingProtocol: [
      {
        time: 'Night Vigil (Jagran)',
        phase: 'Midnight Vigil',
        recommendation: 'Roasted Makhana with Sendha Namak + Warm Kesar Badam Doodh',
        spiritualAndDigestiveTip: 'Provides steady glucose release keeping you alert without caffeine.',
      },
    ],
    curatedBox: {
      title: 'Maha Shivratri Divine Prasad & Vrat Pack',
      price: 1699,
      mrp: 2399,
      discountPercent: 29,
      weight: '1 kg + Saffron',
      items: [
        '500g Jumbo 6 Suta Makhana',
        '250g Kashmiri Mamra Almonds',
        '250g W180 Cashews',
        '1g Pure Kashmiri Mongra Saffron',
      ],
    },
    faq: [
      {
        question: 'What is the best food to stay awake on Shivratri night?',
        answer:
          'Ghee-roasted Jumbo Makhana paired with warm Saffron Almond milk. Makhana provides slow-digesting resistant starch and protein, while saffron stimulates serotonin, preventing physical fatigue during the midnight vigil.',
      },
    ],
  },

  'karwa-chauth-sargi-dry-fruits': {
    slug: 'karwa-chauth-sargi-dry-fruits',
    festivalName: 'Karwa Chauth Sargi Thali: Essential Dry Fruits for Waterless Fasting',
    hindiName: 'करवा चौथ सरगी थाली और मेवा नियम',
    significance: 'Pre-dawn auspicious blessing meal before the Nirjala (waterless) fast',
    metaTitle: 'Karwa Chauth Sargi Thali Dry Fruits Guide | Nirjala Fasting | Nuty Tales',
    metaDescription:
      'The complete Karwa Chauth Sargi thali guide. Discover the exact dry fruits (soaked almonds, anjeer, makhana, munakka) that store cellular water and prevent dehydration during the waterless fast.',
    heroBadge: 'Nirjala (Waterless) Endurance Protocol',
    overview:
      'Karwa Chauth is an intensive Nirjala fast (no food or water from sunrise until moonrise). The pre-dawn Sargi meal eaten between 4:00 AM and 5:00 AM is critical. Eating sugary sweets causes an insulin surge that triggers severe thirst by 10:00 AM. Eating high-potassium, electrolyte-dense soaked almonds, figs, and makhana binds water into the intestinal mucosa, preventing dry mouth and headache all day.',
    allowedFoods: [
      {
        food: 'Kashmiri Mamra Almonds (Soaked Overnight)',
        reason: 'High natural oil and electrolytes release sustained hydration over 14 hours.',
        role: 'Dawn Sargi foundation',
        productSlug: 'mamra-almonds-kashmiri-badam',
        productName: 'Kashmiri Mamra Almonds',
      },
      {
        food: 'Afghan Kandahari Mala Anjeer & Munakka',
        reason: 'Soluble pectin fiber acts as a natural water reservoir in the colon.',
        role: 'Thirst prevention',
        productSlug: 'afghan-kandahari-mala-anjeer',
        productName: 'Afghan Mala Anjeer',
      },
      {
        food: 'NutyTales Jumbo Phool Makhana Kheer',
        reason: 'Light complex carbohydrates with zero thirst-inducing sodium.',
        role: 'Sargi sweet dish',
        productSlug: 'makhana-grade-a-fox-nuts',
        productName: 'Jumbo 6 Suta Makhana',
      },
    ],
    prohibitedFoods: [
      { food: 'Deep-Fried Savories & Heavy Salty Parathas in Sargi', prohibitionReason: 'High sodium pulls water out of cells into the bloodstream, causing extreme thirst within 2 hours.' },
      { food: 'Excess Refined Sugar / Mithai', prohibitionReason: 'Triggers reactive hypoglycemia and morning dizziness.' },
    ],
    fastingProtocol: [
      {
        time: '04:30 AM (Pre-Dawn Sargi)',
        phase: 'Brahma Muhurta Sargi',
        recommendation: '8 Soaked Mamra Almonds + 2 Soaked Anjeer + 4 Munakka + 1 Bowl Makhana Kheer + Coconut Water',
        spiritualAndDigestiveTip: 'The fiber-water matrix stores hydration in tissues, keeping you energized until moonrise.',
      },
    ],
    curatedBox: {
      title: 'Royal Karwa Chauth Sargi Gift Box',
      price: 2199,
      mrp: 2999,
      discountPercent: 26,
      weight: '1.25 kg Luxury Hamper',
      items: [
        '250g Kashmiri Mamra Almonds',
        '250g Afghan Mala Anjeer',
        '250g Jumbo Black Munakka',
        '250g Snow White Walnuts',
        '250g Jumbo 6 Suta Makhana',
      ],
    },
    faq: [
      {
        question: 'Which dry fruit is most important in the Karwa Chauth Sargi?',
        answer:
          'Soaked Afghan Anjeer (figs) and soaked Mamra almonds. The soluble fibers hold up to 5 times their weight in water, acting as an internal hydration reservoir that slowly releases moisture into the bloodstream during the waterless day.',
      },
    ],
  },
}
