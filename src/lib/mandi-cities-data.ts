// ─── Programmatic City Mandi Benchmark Knowledge Base ─────────────────────────────
// Real wholesale trading data across India's premier dry fruit & spice terminal markets

export interface CityMandiCommodity {
  name: string
  category: string
  grade: string
  localMandiPriceKg: number
  nutytalesDirectPriceKg: number
  savingsPercent: number
  moq: string
  packaging: string
  taxGst: string
  slug: string
}

export interface CityMandiData {
  slug: string
  cityName: string
  mandiName: string
  hindiName: string
  state: string
  address: string
  pincode: string
  tradingHours: string
  weeklyHoliday: string
  apmcCessRate: string
  freightPerKgFromOrigin: {
    kashmirToCity: number
    biharToCity: number
    transitDays: string
  }
  metaTitle: string
  metaDescription: string
  heroBadge: string
  marketHighlights: string[]
  marketOverview: string
  commodities: CityMandiCommodity[]
  faq: {
    question: string
    answer: string
  }[]
}

export const MANDI_CITIES: Record<string, CityMandiData> = {
  'delhi-khari-baoli': {
    slug: 'delhi-khari-baoli',
    cityName: 'Delhi NCR',
    mandiName: 'Khari Baoli & Katra Ishwar Bhawan Mandi',
    hindiName: 'खारी बावली दिल्ली थोक भाव',
    state: 'Delhi',
    address: 'Katra Ishwar Bhawan, Gali Batashan, Khari Baoli, Old Delhi',
    pincode: '110006',
    tradingHours: '10:30 AM – 07:00 PM',
    weeklyHoliday: 'Sunday (Closed)',
    apmcCessRate: '1.0% APMC Cess + 1.0% Delhi Agricultural Marketing Board',
    freightPerKgFromOrigin: {
      kashmirToCity: 14,
      biharToCity: 12,
      transitDays: '24 – 36 Hours (Overnight Delhi-NCR Delivery via Noida Hub)',
    },
    metaTitle: 'Khari Baoli Dry Fruit Rate Today Delhi Wholesale Price List | Nuty Tales',
    metaDescription:
      'Live Khari Baoli dry fruit wholesale prices today in Old Delhi. Compare Katra Ishwar Bhawan mandi rates for Mamra almonds, Kashmiri saffron, Makhana, and walnuts vs direct farm-gate dispatch.',
    heroBadge: 'Asia’s Largest Spice & Dry Fruit Trading Terminal',
    marketHighlights: [
      'Over 500 wholesale shops in Katra Ishwar Bhawan and Fatehpuri',
      'Daily benchmark pricing hub for North India retail and sweet manufacturers',
      'Save 8-14% by bypassing traditional 2-tier commission brokers (Dalals)',
      'Same-day express dispatch across Delhi-NCR from Nuty Tales Noida central hub',
    ],
    marketOverview:
      'Khari Baoli in Old Delhi is Asia’s largest dry fruit and spice market, operating continuously since the 17th century. While it offers immense variety, local wholesale prices carry multi-tiered broker margins (3-5%), APMC marketing fees, and high central Delhi unloading charges. Nuty Tales supplies direct farm-gate dispatches to Delhi, Gurgaon, Noida, and Faridabad businesses with zero intermediate brokerage.',
    commodities: [
      {
        name: 'Kashmiri Mamra Almonds (Seedling Grade A)',
        category: 'Almonds',
        grade: '100% Oil Rich / No Bitter Kernels',
        localMandiPriceKg: 3450,
        nutytalesDirectPriceKg: 3150,
        savingsPercent: 9,
        moq: '10 kg Carton',
        packaging: 'Vacuum Box with Nitrogen Flush',
        taxGst: '12% GST',
        slug: 'mamra-almonds-kashmiri-badam',
      },
      {
        name: 'Pure Kashmiri Mongra Saffron (GI Tagged)',
        category: 'Saffron',
        grade: 'ISO 3632 Cat-I (Crocin > 240)',
        localMandiPriceKg: 260000,
        nutytalesDirectPriceKg: 230000,
        savingsPercent: 12,
        moq: '50 Grams',
        packaging: 'Airtight Sealed Glass Jars',
        taxGst: '5% GST',
        slug: 'kashmiri-mongra-saffron',
      },
      {
        name: 'NutyTales Jumbo Phool Makhana (6 Suta)',
        category: 'Makhana',
        grade: 'Jumbo 6 Suta Whole (Mithila Origin)',
        localMandiPriceKg: 980,
        nutytalesDirectPriceKg: 690,
        savingsPercent: 30,
        moq: '10 kg Bag',
        packaging: '5-Ply Moisture-Barrier Gunny Bag',
        taxGst: '0% / 5% GST',
        slug: 'makhana-grade-a-fox-nuts',
      },
      {
        name: 'Snow White Kashmiri Walnut Kernels (Halves)',
        category: 'Walnuts',
        grade: 'Extra Light Halves (> 85% Halves)',
        localMandiPriceKg: 1350,
        nutytalesDirectPriceKg: 1180,
        savingsPercent: 13,
        moq: '10 kg Box',
        packaging: 'Nitrogen Vacuum Pouch',
        taxGst: '12% GST',
        slug: 'walnut-kernels-halves-pieces',
      },
      {
        name: 'King Jumbo W180 Cashews',
        category: 'Cashews',
        grade: 'White Wholes 180 Count',
        localMandiPriceKg: 1080,
        nutytalesDirectPriceKg: 960,
        savingsPercent: 11,
        moq: '20 kg Tin (2x10kg)',
        packaging: 'Airtight Vacuum Tin',
        taxGst: '5% GST',
        slug: 'king-jumbo-w180-cashews',
      },
    ],
    faq: [
      {
        question: 'How do Nuty Tales wholesale rates compare to Khari Baoli Delhi?',
        answer:
          'Because Nuty Tales operates direct harvesting centers in Budgam/Pampore (Kashmir) and Darbhanga (Bihar), we eliminate Delhi commission agents (arhatiyas) and Katra Ishwar Bhawan storage premiums, delivering genuine 8% to 30% savings with standardized NABL lab test reports.',
      },
      {
        question: 'Can Delhi-NCR businesses get same-day wholesale delivery?',
        answer:
          'Yes. We maintain a centralized cold-chain fulfillment center at Sector 128, Noida. Wholesale orders placed before 12:00 PM for Delhi, Gurgaon, Noida, and Greater Noida are dispatched the same day with GST tax invoices.',
      },
    ],
  },

  'mumbai-apmc-vashi': {
    slug: 'mumbai-apmc-vashi',
    cityName: 'Mumbai & Navi Mumbai',
    mandiName: 'Vashi APMC Market I & II (Turbhe)',
    hindiName: 'वाशी एपीएमसी मार्केट मुंबई थोक भाव',
    state: 'Maharashtra',
    address: 'APMC Market II, Sector 19, Turbhe, Vashi, Navi Mumbai',
    pincode: '400703',
    tradingHours: '10:00 AM – 06:30 PM',
    weeklyHoliday: 'Sunday (Closed)',
    apmcCessRate: '0.80% APMC Cess + 1.05% Mathadi Labour Welfare Levy',
    freightPerKgFromOrigin: {
      kashmirToCity: 22,
      biharToCity: 18,
      transitDays: '48 – 72 Hours Express Container Surface Cargo',
    },
    metaTitle: 'Vashi APMC Dry Fruit Rate Today Mumbai Wholesale Price List | Nuty Tales',
    metaDescription:
      'Live Vashi APMC dry fruit rates today in Navi Mumbai. Compare wholesale prices for Mamra badam, Kashmiri saffron, Makhana, and cashew kernels vs direct origin dispatch.',
    heroBadge: 'West India’s Premier Maritime & Wholesale Terminal',
    marketHighlights: [
      'Central terminal receiving direct sea containers from California, Iran, and Africa',
      'Primary supply hub for Mumbai luxury hotels, catering federations, and Gujarat sweet makers',
      'Avoid high Turbhe Mathadi handling charges and APMC cess with direct door delivery',
    ],
    marketOverview:
      'The APMC Market at Vashi, Navi Mumbai, is the commercial dry fruit nerve center for Maharashtra, Goa, and coastal Gujarat. Handling hundreds of container trucks daily, wholesale transactions are subject to APMC cess, unloading Mathadi labor charges, and local transport octroi. Nuty Tales supplies direct container and LTL shipments directly to Mumbai corporate caterers and sweet chains with full GST input credit.',
    commodities: [
      {
        name: 'Kashmiri Mamra Almonds (Grade A)',
        category: 'Almonds',
        grade: '100% Sweet / Highest Oil Concentration',
        localMandiPriceKg: 3550,
        nutytalesDirectPriceKg: 3150,
        savingsPercent: 11,
        moq: '10 kg Carton',
        packaging: 'Moisture-Proof Box',
        taxGst: '12% GST',
        slug: 'mamra-almonds-kashmiri-badam',
      },
      {
        name: 'Pure Kashmiri Mongra Saffron (Cat-I)',
        category: 'Saffron',
        grade: 'Crocin > 240 / GI Certified',
        localMandiPriceKg: 275000,
        nutytalesDirectPriceKg: 230000,
        savingsPercent: 16,
        moq: '50 Grams',
        packaging: 'Gold Glass Jars',
        taxGst: '5% GST',
        slug: 'kashmiri-mongra-saffron',
      },
      {
        name: 'NutyTales Jumbo Phool Makhana (6 Suta)',
        category: 'Makhana',
        grade: 'Jumbo 6 Suta Whole',
        localMandiPriceKg: 1040,
        nutytalesDirectPriceKg: 690,
        savingsPercent: 34,
        moq: '10 kg Bag',
        packaging: 'Heavy Gunny Bag with Liner',
        taxGst: '0% / 5% GST',
        slug: 'makhana-grade-a-fox-nuts',
      },
      {
        name: 'King Jumbo W180 Cashews (Goa/Mangalore Origin)',
        category: 'Cashews',
        grade: 'Jumbo Whole 180 Count',
        localMandiPriceKg: 1120,
        nutytalesDirectPriceKg: 960,
        savingsPercent: 14,
        moq: '20 kg Tin',
        packaging: 'Vacuum Sealed Tin',
        taxGst: '5% GST',
        slug: 'king-jumbo-w180-cashews',
      },
    ],
    faq: [
      {
        question: 'How do you handle delivery across Mumbai and Thane?',
        answer:
          'We partner with express linehaul logistics (Blue Dart, Safechem, and V-Trans) providing doorstep delivery to commercial addresses across South Mumbai, Western Suburbs, Navi Mumbai, and Thane within 48 to 72 hours from dispatch.',
      },
    ],
  },

  'kashmir-srinagar': {
    slug: 'kashmir-srinagar',
    cityName: 'Srinagar & Pampore',
    mandiName: 'Parimpora Fruit Mandi & Pampore Saffron Center',
    hindiName: 'श्रीनगर परिमपोरा मंडी कश्मीरी मेवा भाव',
    state: 'Jammu & Kashmir',
    address: 'Parimpora Fruit Complex, National Highway 1A, Srinagar',
    pincode: '190017',
    tradingHours: '08:00 AM – 05:00 PM',
    weeklyHoliday: 'Friday (Half Day / Prayer Timing)',
    apmcCessRate: 'Zero APMC Cess at Direct Farm Gate',
    freightPerKgFromOrigin: {
      kashmirToCity: 0,
      biharToCity: 25,
      transitDays: 'Local Farm Gate Pickups & Air Cargo Terminal',
    },
    metaTitle: 'Srinagar Mandi Dry Fruit Rates Today Kashmir Farm Gate Price | Nuty Tales',
    metaDescription:
      'Direct farm gate dry fruit prices in Srinagar and Pampore today. Buy 100% authentic Kashmiri Mamra badam, Kagzi walnuts, and Mongra saffron straight from growers with GI tag certificate.',
    heroBadge: 'Direct Himalayan Origin & Farm Gate Epicenter',
    marketHighlights: [
      'Primary source market where Kashmir walnuts, almonds, and saffron are harvested',
      'Zero intermediaries: direct grower-to-buyer transactions',
      'Air-cargo dispatch directly from Srinagar Airport (SXR) to major Indian metros',
    ],
    marketOverview:
      'Parimpora Fruit Mandi and the historic Karewas of Pampore form the world capital for Kashmiri saffron and temperate tree nuts. By sourcing through Nuty Tales’ Arshid House processing center in Budgam, buyers access direct tree-shaken Kagzi walnuts, hand-cracked Mamra almonds, and fresh autumn saffron stigmas with zero adulteration.',
    commodities: [
      {
        name: 'Kashmiri Mamra Almonds (Seedling Grade A)',
        category: 'Almonds',
        grade: 'Tree-Shaken / 100% Kashmiri Seedling',
        localMandiPriceKg: 3200,
        nutytalesDirectPriceKg: 3150,
        savingsPercent: 2,
        moq: '10 kg Carton',
        packaging: 'Nitrogen-Sealed Bag',
        taxGst: '12% GST',
        slug: 'mamra-almonds-kashmiri-badam',
      },
      {
        name: 'Kashmiri Mongra Saffron (Pampore Harvest)',
        category: 'Saffron',
        grade: 'ISO 3632 Cat-I Pure Top Stigmas',
        localMandiPriceKg: 235000,
        nutytalesDirectPriceKg: 230000,
        savingsPercent: 2,
        moq: '25 Grams',
        packaging: 'Sealed Glass Bottles',
        taxGst: '5% GST',
        slug: 'kashmiri-mongra-saffron',
      },
      {
        name: 'Snow White Kashmiri Walnut Kernels (Halves)',
        category: 'Walnuts',
        grade: 'Extra Light Halves',
        localMandiPriceKg: 1220,
        nutytalesDirectPriceKg: 1180,
        savingsPercent: 3,
        moq: '10 kg Box',
        packaging: 'Airtight Nitrogen Pouch',
        taxGst: '12% GST',
        slug: 'walnut-kernels-halves-pieces',
      },
    ],
    faq: [
      {
        question: 'Can buyers visit the Budgam processing facility?',
        answer:
          'Yes, genuine wholesale and institutional buyers can schedule a visit to Arshid House, Budgam-Gojra Road, Budgam, J&K to inspect lot gradings, moisture testing, and NABL certified lab reports in person.',
      },
    ],
  },

  'bihar-gulabbagh': {
    slug: 'bihar-gulabbagh',
    cityName: 'Gulabbagh & Purnea',
    mandiName: 'Gulabbagh Mandi (National Makhana Hub)',
    hindiName: 'गुलाबबाग मंडी पूर्णिया मखाना थोक भाव',
    state: 'Bihar',
    address: 'Gulabbagh Krishi Utpadan Bazar Samiti, Purnea',
    pincode: '854326',
    tradingHours: '09:00 AM – 06:00 PM',
    weeklyHoliday: 'Open 7 Days during Peak Harvest',
    apmcCessRate: '1.0% Bihar State Agricultural Cess',
    freightPerKgFromOrigin: {
      kashmirToCity: 26,
      biharToCity: 0,
      transitDays: 'Direct Pond & Wetland Origin Gate',
    },
    metaTitle: 'Gulabbagh Mandi Makhana Rate Today Bihar Wholesale Price | Nuty Tales',
    metaDescription:
      'Live Gulabbagh mandi makhana rates today in Purnea & Darbhanga, Bihar. Wholesale prices for Jumbo 6 Suta, 5 Suta, and 4 Suta Phool Makhana direct from processors.',
    heroBadge: 'World Epicenter of Phool Makhana (Fox Nut) Production',
    marketHighlights: [
      'Over 85% of the world’s Phool Makhana is traded through Gulabbagh and Mithila',
      'Daily live auctions for raw Makhana seeds (Gauri) and popped Phool Makhana',
      'Nuty Tales offers factory-graded Jumbo 6 Suta Whole at disruptive ₹690/kg B2B prices',
    ],
    marketOverview:
      'Gulabbagh in Purnea, Bihar, is India’s largest primary trading center for fox nuts (makhana). Raw farmers bring pond harvests here to be auctioned to processors and national dry fruit traders. Nuty Tales sources direct from Darbhanga and Mithila wetlands, grading by sieve size (6 Suta Jumbo) and nitrogen sealing each batch for 12 months crispness.',
    commodities: [
      {
        name: 'NutyTales Jumbo Phool Makhana (6 Suta)',
        category: 'Makhana',
        grade: 'Jumbo 6 Suta Whole (Hand Picked)',
        localMandiPriceKg: 780,
        nutytalesDirectPriceKg: 690,
        savingsPercent: 12,
        moq: '10 kg Bag',
        packaging: 'Heavy Gunny with Moisture Liner',
        taxGst: '0% / 5% GST',
        slug: 'makhana-grade-a-fox-nuts',
      },
      {
        name: 'NutyTales Standard Makhana (5 Suta)',
        category: 'Makhana',
        grade: '5 Suta Commercial Whole',
        localMandiPriceKg: 720,
        nutytalesDirectPriceKg: 640,
        savingsPercent: 11,
        moq: '10 kg Bag',
        packaging: '5-Ply Moisture Bag',
        taxGst: '0% / 5% GST',
        slug: 'makhana-grade-b-fox-nuts-economy',
      },
    ],
    faq: [
      {
        question: 'What is the difference between 5 Suta and 6 Suta Makhana?',
        answer:
          'Suta refers to the traditional Indian mesh diameter grading scale (1 Suta = 1/8 inch). 6 Suta (approx 19mm+ diameter) represents the largest, fluffiest jumbo whole fox nuts with superior crunch and zero black seed residue, ideal for premium consumer packaging.',
      },
    ],
  },

  'ahmedabad-kalupur': {
    slug: 'ahmedabad-kalupur',
    cityName: 'Ahmedabad',
    mandiName: 'Kalupur Chokha Bazar & Madhupura Market',
    hindiName: 'कालूपुर चोखा बाजार अहमदाबाद थोक भाव',
    state: 'Gujarat',
    address: 'Kalupur Chokha Bazar & Madhupura Commercial Market, Ahmedabad',
    pincode: '380001',
    tradingHours: '10:30 AM – 07:00 PM',
    weeklyHoliday: 'Sunday (Closed)',
    apmcCessRate: '1.25% Gujarat APMC Cess',
    freightPerKgFromOrigin: {
      kashmirToCity: 20,
      biharToCity: 18,
      transitDays: '36 – 48 Hours Express Transit',
    },
    metaTitle: 'Kalupur Market Dry Fruit Rate Today Ahmedabad Wholesale Price | Nuty Tales',
    metaDescription:
      'Live wholesale dry fruit rates today in Kalupur and Madhupura, Ahmedabad. Daily prices for Mamra badam, Kashmiri saffron, cashews, and makhana for Gujarat sweet & snack makers.',
    heroBadge: 'Gujarat’s Central Confectionery & Dry Fruit Trading Hub',
    marketHighlights: [
      'Prime supplier to Gujarat’s world-famous Mithai, Farsan, and Gifting industries',
      'High seasonal spikes during Navratri, Diwali, and Wedding lagan seasons',
      'Direct GST billing with transparent HSN codes (0802, 0801, 0910)',
    ],
    marketOverview:
      'Kalupur and Madhupura markets in Ahmedabad dominate the dry fruit distribution for Gujarat, Saurashtra, and Kutch. Gujarat businesses consume the highest volume of premium Mamra badam, cashew slivers, and pure saffron for luxury sweets. Nuty Tales provides direct farm-gate dispatches to Ahmedabad, Surat, Vadodara, and Rajkot with certified purity.',
    commodities: [
      {
        name: 'Kashmiri Mamra Almonds (Grade A)',
        category: 'Almonds',
        grade: 'High Oil Seedling Grade',
        localMandiPriceKg: 3500,
        nutytalesDirectPriceKg: 3150,
        savingsPercent: 10,
        moq: '10 kg Carton',
        packaging: 'Nitrogen Flush Pack',
        taxGst: '12% GST',
        slug: 'mamra-almonds-kashmiri-badam',
      },
      {
        name: 'Pure Kashmiri Mongra Saffron (GI Tagged)',
        category: 'Saffron',
        grade: 'ISO 3632 Cat-I',
        localMandiPriceKg: 265000,
        nutytalesDirectPriceKg: 230000,
        savingsPercent: 13,
        moq: '50 Grams',
        packaging: 'Glass Jars',
        taxGst: '5% GST',
        slug: 'kashmiri-mongra-saffron',
      },
      {
        name: 'NutyTales Jumbo Phool Makhana (6 Suta)',
        category: 'Makhana',
        grade: 'Jumbo 6 Suta Whole',
        localMandiPriceKg: 1020,
        nutytalesDirectPriceKg: 690,
        savingsPercent: 32,
        moq: '10 kg Bag',
        packaging: 'Moisture Barrier Bag',
        taxGst: '0% / 5% GST',
        slug: 'makhana-grade-a-fox-nuts',
      },
    ],
    faq: [
      {
        question: 'Do you offer bulk billing for Gujarat GST holders?',
        answer:
          'Yes, all shipments come with formal GST e-invoices, e-way bills, and NABL batch test certificates, allowing complete input tax credit (ITC) reconciliation.',
      },
    ],
  },

  'bangalore-yeshwanthpur': {
    slug: 'bangalore-yeshwanthpur',
    cityName: 'Bengaluru',
    mandiName: 'Yeshwanthpur APMC Yard & Gandhi Bazar',
    hindiName: 'यशवंतपुर एपीएमसी यार्ड बेंगलुरु थोक भाव',
    state: 'Karnataka',
    address: 'APMC Market Yard, Yeshwanthpur, Bengaluru',
    pincode: '560022',
    tradingHours: '10:00 AM – 06:30 PM',
    weeklyHoliday: 'Sunday (Closed)',
    apmcCessRate: '1.0% Karnataka APMC Market Fee',
    freightPerKgFromOrigin: {
      kashmirToCity: 26,
      biharToCity: 22,
      transitDays: '48 – 72 Hours Express Surface & Air Options',
    },
    metaTitle: 'Yeshwanthpur APMC Dry Fruit Rate Today Bangalore Wholesale Price | Nuty Tales',
    metaDescription:
      'Daily wholesale dry fruit price list today at Yeshwanthpur APMC Yard, Bangalore. Direct origin supply for IT corporate gifting, luxury caterers, and organic retailers.',
    heroBadge: 'South India’s Premier Corporate & Tech Wholesale Market',
    marketHighlights: [
      'Hub for corporate festive gifting and Karnataka cashew & almond distribution',
      'Direct cold-chain linehauls to Whitefield, Electronic City, and Koramangala',
      'Specialized customized gifting box packaging available for IT enterprises',
    ],
    marketOverview:
      'The Yeshwanthpur APMC Yard is the primary receiving terminal for commercial dry fruits in Karnataka. Catering to Bengaluru’s massive tech corporate gifting demand and upscale bakeries, traditional APMC channels add high handling and warehouse fees. Nuty Tales provides seamless direct-from-Kashmir dispatches to Bangalore businesses.',
    commodities: [
      {
        name: 'Kashmiri Mamra Almonds (Grade A)',
        category: 'Almonds',
        grade: '100% Sweet / High Natural Oil',
        localMandiPriceKg: 3600,
        nutytalesDirectPriceKg: 3150,
        savingsPercent: 13,
        moq: '10 kg Carton',
        packaging: 'Vacuum Box',
        taxGst: '12% GST',
        slug: 'mamra-almonds-kashmiri-badam',
      },
      {
        name: 'Pure Kashmiri Mongra Saffron (GI Tagged)',
        category: 'Saffron',
        grade: 'Crocin > 240 / Cat-I',
        localMandiPriceKg: 280000,
        nutytalesDirectPriceKg: 230000,
        savingsPercent: 18,
        moq: '50 Grams',
        packaging: 'Gold Glass Jars',
        taxGst: '5% GST',
        slug: 'kashmiri-mongra-saffron',
      },
      {
        name: 'NutyTales Jumbo Phool Makhana (6 Suta)',
        category: 'Makhana',
        grade: 'Jumbo 6 Suta Whole',
        localMandiPriceKg: 1060,
        nutytalesDirectPriceKg: 690,
        savingsPercent: 35,
        moq: '10 kg Bag',
        packaging: 'Heavy Gunny with Liner',
        taxGst: '0% / 5% GST',
        slug: 'makhana-grade-a-fox-nuts',
      },
    ],
    faq: [
      {
        question: 'Can Bangalore companies order custom branded corporate gift boxes?',
        answer:
          'Yes. We provide end-to-end custom branded corporate gifting with laser-engraved walnut wood boxes, artisan Kashmiri paper-mache containers, and customized corporate greeting cards for tech firms and luxury hotels.',
      },
    ],
  },

  'kolkata-posta': {
    slug: 'kolkata-posta',
    cityName: 'Kolkata',
    mandiName: 'Posta Mandi & Barabazar Trading Yard',
    hindiName: 'पोस्ता बाजार बड़ाबाजार कोलकाता थोक भाव',
    state: 'West Bengal',
    address: 'Posta Bazar, Kalakar Street, Barabazar, Kolkata',
    pincode: '700007',
    tradingHours: '10:30 AM – 07:00 PM',
    weeklyHoliday: 'Sunday (Closed)',
    apmcCessRate: 'West Bengal Market Cess Regulated',
    freightPerKgFromOrigin: {
      kashmirToCity: 24,
      biharToCity: 14,
      transitDays: '36 – 48 Hours Express Transit',
    },
    metaTitle: 'Posta Bazar Dry Fruit Rate Today Kolkata Wholesale Price List | Nuty Tales',
    metaDescription:
      'Live wholesale dry fruit prices today in Posta Mandi and Barabazar, Kolkata. Wholesale rates for Kashmiri saffron, Mamra almonds, Makhana, and cashew kernels.',
    heroBadge: 'Eastern India & North-East Gateway Terminal',
    marketHighlights: [
      'Historic 200-year-old commercial trading artery of Eastern India',
      'Distributes dry fruits across West Bengal, Assam, Odisha, and North East states',
      'Direct freight connection with Bihar Makhana wetland belt (less than 36 hrs)',
    ],
    marketOverview:
      'Posta Mandi in Barabazar is the historic commercial wholesale center for dry fruits and spices in Eastern India. Given its proximity to Bihar’s Makhana belt and direct trunk lines from North India, Posta traders supply major sweet manufacturers (Mishti producers) and Durga Puja corporate gifting. Nuty Tales supplies direct origin shipments with zero Barabazar brokerage.',
    commodities: [
      {
        name: 'NutyTales Jumbo Phool Makhana (6 Suta)',
        category: 'Makhana',
        grade: 'Jumbo 6 Suta Whole (Bihar Origin)',
        localMandiPriceKg: 990,
        nutytalesDirectPriceKg: 690,
        savingsPercent: 30,
        moq: '10 kg Bag',
        packaging: '5-Ply Moisture Bag',
        taxGst: '0% / 5% GST',
        slug: 'makhana-grade-a-fox-nuts',
      },
      {
        name: 'Pure Kashmiri Mongra Saffron (GI Tagged)',
        category: 'Saffron',
        grade: 'ISO 3632 Cat-I Pure Stigmas',
        localMandiPriceKg: 270000,
        nutytalesDirectPriceKg: 230000,
        savingsPercent: 15,
        moq: '50 Grams',
        packaging: 'Airtight Glass Jars',
        taxGst: '5% GST',
        slug: 'kashmiri-mongra-saffron',
      },
      {
        name: 'Kashmiri Mamra Almonds (Seedling Grade A)',
        category: 'Almonds',
        grade: '100% Sweet / High Oil',
        localMandiPriceKg: 3500,
        nutytalesDirectPriceKg: 3150,
        savingsPercent: 10,
        moq: '10 kg Carton',
        packaging: 'Nitrogen Pack',
        taxGst: '12% GST',
        slug: 'mamra-almonds-kashmiri-badam',
      },
    ],
    faq: [
      {
        question: 'How fast can Makhana be delivered to Kolkata from Bihar?',
        answer:
          'Because our Makhana processing and grading center is in Darbhanga/Mithila, truckloads and LTL dispatches to Kolkata and Howrah arrive within 24 to 36 hours of booking.',
      },
    ],
  },
}
