// ─── Programmatic Express Metro Delivery Knowledge Base ──────────────────────────────
// Targets high-intent local commercial and retail "buy dry fruits near me / in [city]" queries

export interface CityDeliveryBestseller {
  name: string
  slug: string
  weight: string
  price: number
  mrp: number
  offer: string
  image: string
}

export interface CityDeliveryData {
  slug: string
  cityName: string
  state: string
  deliveryTimeline: string
  fulfillmentHub: string
  popularLocalities: string[]
  metaTitle: string
  metaDescription: string
  heroBadge: string
  overview: string
  expressHighlights: string[]
  coldChainProtection: string
  bestsellers: CityDeliveryBestseller[]
  faq: {
    question: string
    answer: string
  }[]
}

export const DELIVERY_CITIES: Record<string, CityDeliveryData> = {
  'delhi-ncr': {
    slug: 'delhi-ncr',
    cityName: 'Delhi NCR (Noida, Gurgaon, Delhi, Faridabad)',
    state: 'Delhi NCR',
    deliveryTimeline: 'Same-Day Dispatch & Delivery (Orders before 12:00 PM)',
    fulfillmentHub: 'Nuty Tales Central Hub, Sector 128, Noida 201304',
    popularLocalities: [
      'South Delhi (GK, Hauz Khas, Defence Colony, Vasant Vihar)',
      'Noida & Greater Noida (Sectors 128, 50, 62, Expressway, Pari Chowk)',
      'Gurgaon / Gurugram (DLF Phase 1-5, Golf Course Road, Cyber City)',
      'Central Delhi (Connaught Place, Chanakyapuri, Karol Bagh)',
      'East & West Delhi (Preet Vihar, Punjabi Bagh, Rajouri Garden)',
      'Faridabad & Ghaziabad (Indirapuram, Vaishali, Sector 15)',
    ],
    metaTitle: 'Same-Day Dry Fruits Delivery in Delhi NCR | Fresh Farm Direct | Nuty Tales',
    metaDescription:
      'Same-day dry fruit delivery in Delhi, Noida, and Gurgaon. Order fresh Kashmiri Mamra almonds, Jumbo 6 Suta makhana, and certified saffron straight from our Noida hub.',
    heroBadge: 'Local Same-Day & Next-Day Express Delivery',
    overview:
      'Operated directly from our central cold-storage fulfillment center at Jaypee Wishtown, Sector 128, Noida, Nuty Tales delivers nitrogen-sealed, single-origin Kashmiri and Bihar dry fruits across Delhi, Gurgaon, and Noida within hours. Enjoy zero retail markups with 100% FSSAI certified freshness.',
    expressHighlights: [
      'Same-day delivery across Noida, South Delhi, and East Delhi for orders placed by 12:00 PM',
      'Guaranteed next-morning express to Gurgaon, Faridabad, and North Delhi',
      'Free express doorstep delivery on all orders above ₹999',
      'Direct GST tax billing and corporate gift hamper assembly available on-demand',
    ],
    coldChainProtection:
      'All retail pouches and wooden gift boxes are nitrogen-flushed and packed in thermal barrier sleeves to protect fragile natural oils against Delhi-NCR summer heat and humidity.',
    bestsellers: [
      {
        name: 'NutyTales Jumbo Phool Makhana (6 Suta Whole)',
        slug: 'makhana-grade-a-fox-nuts',
        weight: '1 kg Saver Pack',
        price: 899,
        mrp: 1499,
        offer: '40% OFF Special Launch',
        image: '/images/promo-makhana-899.webp',
      },
      {
        name: 'Kashmiri Mamra Almonds (Grade A Seedling)',
        slug: 'mamra-almonds-kashmiri-badam',
        weight: '500g Pouch',
        price: 1650,
        mrp: 2199,
        offer: '25% OFF Fresh Harvest',
        image: '/images/hero-lifestyle-bowl.png',
      },
      {
        name: 'Pure Kashmiri Mongra Saffron (GI Tagged)',
        slug: 'kashmiri-mongra-saffron',
        weight: '2g Gold Jar',
        price: 820,
        mrp: 1100,
        offer: 'Cat-I Certified (Crocin > 240)',
        image: '/images/saffron-threads-macro.jpg',
      },
    ],
    faq: [
      {
        question: 'How fast is dry fruit delivery in Noida and South Delhi?',
        answer:
          'Orders placed before 12:00 PM on weekdays are dispatched the same afternoon via express courier, typically arriving within 4 to 8 hours. Orders placed after 12:00 PM arrive the following morning.',
      },
    ],
  },

  'mumbai': {
    slug: 'mumbai',
    cityName: 'Mumbai & Navi Mumbai',
    state: 'Maharashtra',
    deliveryTimeline: '24 – 48 Hours Express Priority Air Transit',
    fulfillmentHub: 'Direct Mumbai Linehaul Hub (Vashi & Mumbai Airport Cargo)',
    popularLocalities: [
      'South Mumbai (Nariman Point, Malabar Hill, Colaba, Marine Drive)',
      'Western Suburbs (Bandra, Juhu, Andheri, Khar, Santacruz, Powai)',
      'Navi Mumbai (Vashi, Nerul, Belapur, Seawoods, Kharghar)',
      'Central Suburbs (Ghatkopar, Mulund, Chembur, Kurla)',
      'Thane City & Ghodbunder Road Corridor',
    ],
    metaTitle: 'Express Dry Fruits Delivery in Mumbai & Bandra | Nuty Tales',
    metaDescription:
      '24-48 hr express dry fruit delivery across Mumbai, Bandra, and Navi Mumbai. Buy Kashmiri saffron, raw Mamra badam, and jumbo makhana fresh from farm origin.',
    heroBadge: '48-Hr Express Priority Linehaul Delivery',
    overview:
      'Avoid high retail markups in Bandra and Crawford Market. Nuty Tales dispatches certified single-origin Himalayan harvests and Mithila makhana directly to Mumbai residences, catering kitchens, and corporate offices with express courier tracking.',
    expressHighlights: [
      '24 to 48-hour express priority air dispatch to all Mumbai and Thane pin codes',
      'Tamper-evident vacuum packaging resisting coastal Mumbai humidity',
      'Full corporate and wedding return gift customization',
    ],
    coldChainProtection:
      'Nitrogen-sealed multilayer pouches prevent coastal ocean moisture absorption, ensuring that makhana and walnuts retain their mountain crispness.',
    bestsellers: [
      {
        name: 'NutyTales Jumbo Phool Makhana (6 Suta Whole)',
        slug: 'makhana-grade-a-fox-nuts',
        weight: '1 kg Saver Pack',
        price: 899,
        mrp: 1499,
        offer: '40% OFF Special Launch',
        image: '/images/promo-makhana-899.webp',
      },
      {
        name: 'Snow White Kashmiri Walnut Halves',
        slug: 'walnut-kernels-halves-pieces',
        weight: '500g Vacuum Pouch',
        price: 699,
        mrp: 999,
        offer: 'Extra Light Snow White',
        image: '/images/hero-lifestyle-bowl.png',
      },
    ],
    faq: [
      {
        question: 'Do you deliver to Bandra, Juhu, and South Mumbai?',
        answer:
          'Yes, we deliver to all Mumbai pincodes (400001 to 400104) via Blue Dart and Delhivery Air Express within 24 to 48 hours.',
      },
    ],
  },

  'bengaluru': {
    slug: 'bengaluru',
    cityName: 'Bengaluru (Bangalore)',
    state: 'Karnataka',
    deliveryTimeline: '48 Hours Express Air Cargo',
    fulfillmentHub: 'Bengaluru Kempegowda Cargo Terminal Hub',
    popularLocalities: [
      'East Bengaluru (Whitefield, ITPL, Marathahalli, Varthur)',
      'Central & South (Koramangala, Indiranagar, HSR Layout, JP Nagar)',
      'Tech Corridors (Electronic City, Bellandur, Sarjapur Road)',
      'North Bengaluru (Hebbal, Manyata Tech Park, Yelahanka)',
    ],
    metaTitle: 'Fresh Dry Fruits Home Delivery in Bangalore | Nuty Tales',
    metaDescription:
      'Express dry fruit delivery in Bangalore. Order fresh Kashmiri Mamra almonds, pure Pampore saffron, and Mithila makhana online. Delivered to Whitefield, Koramangala & Indiranagar.',
    heroBadge: 'Tech City 48-Hr Express Delivery',
    overview:
      'Bangalore’s health-conscious tech professionals and luxury caterers choose Nuty Tales for unadulterated, single-origin nutrition. Dispatched with express priority tracking straight to your home or office.',
    expressHighlights: [
      'Fast 48-hour delivery across all Bengaluru tech corridors and residential areas',
      'Direct farm-gate rates saving 20-30% over local luxury gourmet supermarkets',
      'Pre-portioned diabetic and gym protein health boxes available',
    ],
    coldChainProtection:
      'Oxygen-barrier packaging guarantees maximum crispness and enzyme bio-activity.',
    bestsellers: [
      {
        name: 'NutyTales Jumbo Phool Makhana (6 Suta Whole)',
        slug: 'makhana-grade-a-fox-nuts',
        weight: '1 kg Saver Pack',
        price: 899,
        mrp: 1499,
        offer: 'Special ₹899 Offer',
        image: '/images/promo-makhana-899.webp',
      },
      {
        name: 'Kashmiri Mamra Almonds (High Oil Seedling)',
        slug: 'mamra-almonds-kashmiri-badam',
        weight: '500g Pouch',
        price: 1650,
        mrp: 2199,
        offer: '100% Sweet Kernels',
        image: '/images/hero-lifestyle-bowl.png',
      },
    ],
    faq: [
      {
        question: 'Can tech companies in Bangalore order bulk corporate gift boxes?',
        answer:
          'Yes, we provide end-to-end customized corporate gifting with custom logo engraving, artisan Kashmiri boxes, and direct office deliveries for teams in Whitefield, Manyata, and Electronic City.',
      },
    ],
  },

  hyderabad: {
    slug: 'hyderabad',
    cityName: 'Hyderabad & Cyberabad',
    state: 'Telangana',
    deliveryTimeline: '48 Hours Express Direct Air Dispatch',
    fulfillmentHub: 'RGIA Shamshabad Air Cargo Express Hub',
    popularLocalities: [
      'HITEC City & Madhapur (Cyber Towers, Mindspace, Knowledge City)',
      'Gachibowli & Financial District (Nanakramguda, Kokapet)',
      'Banjara Hills & Jubilee Hills (Roads 1-45, Film Nagar)',
      'Secunderabad (Marredpally, Bowenpally, Begumpet)',
      'Kondapur, Manikonda & Miyapur',
    ],
    metaTitle: 'Fast Dry Fruits Home Delivery in Hyderabad | Nuty Tales',
    metaDescription:
      'Order fresh Kashmiri Mamra almonds, royal saffron, and jumbo makhana in Hyderabad. Express delivery to HITEC City, Gachibowli, Banjara Hills & Jubilee Hills.',
    heroBadge: 'Cyberabad 48-Hr Express Delivery',
    overview:
      'From authentic Hyderabadi biryani and shahi tukda chefs to IT wellness households in HITEC City and Gachibowli, Nuty Tales delivers direct farm-gate Kashmiri saffron, Mamra badam, and jumbo phool makhana at genuine wholesale benchmarks.',
    expressHighlights: [
      'Fast 48-hour tracked doorstep delivery across all Hyderabad and Secunderabad pincodes',
      'Original Pampore saffron tested Cat-I with Crocin > 240 for royal culinary preparations',
      'Direct GST tax invoices and custom festive corporate gift boxes for tech enterprises',
    ],
    coldChainProtection:
      'Hermetically nitrogen-flushed packaging ensures zero moisture spoilage during Deccan transit.',
    bestsellers: [
      {
        name: 'Kashmiri Mogra Saffron (Grade A1 Cat-I)',
        slug: 'kashmiri-saffron-mongra',
        weight: '1g Jar',
        price: 650,
        mrp: 850,
        offer: 'Crocin 258.4 Certified',
        image: '/images/hero-lifestyle-bowl.png',
      },
      {
        name: 'NutyTales Jumbo Phool Makhana (6 Suta Whole)',
        slug: 'makhana-grade-a-fox-nuts',
        weight: '1 kg Saver Pack',
        price: 899,
        mrp: 1499,
        offer: 'Special ₹899 Offer',
        image: '/images/promo-makhana-899.webp',
      },
    ],
    faq: [
      {
        question: 'Do you supply genuine Kashmiri saffron for Hyderabadi restaurants and caterers?',
        answer:
          'Yes, our Grade-A1 Mogra saffron is lab-certified with Crocin > 240, delivering the deep natural saffron aroma and radiant golden hue essential for authentic Dum Biryani and Shahi Tukda.',
      },
    ],
  },

  pune: {
    slug: 'pune',
    cityName: 'Pune & Pimpri-Chinchwad',
    state: 'Maharashtra',
    deliveryTimeline: '24 to 48 Hours Express Transit',
    fulfillmentHub: 'Pune Cargo & Western Logistics Corridor',
    popularLocalities: [
      'Koregaon Park & Kalyani Nagar',
      'Hinjawadi Phase 1, 2, 3 (Rajiv Gandhi Infotech Park)',
      'Baner, Balewadi & Aundh',
      'Viman Nagar, Kharadi & Magarpatta City',
      'Kothrud, Erandwane & Deccan Gymkhana',
    ],
    metaTitle: 'Fresh Dry Fruits Home Delivery in Pune | Nuty Tales',
    metaDescription:
      'Express dry fruit delivery in Pune. Buy authentic Kashmiri Mamra almonds, walnut kernels, and lotus seeds online. Same/Next-day delivery across Hinjawadi, Baner & KP.',
    heroBadge: 'Oxford of the East Express Delivery',
    overview:
      'Dispatched directly to Pune’s thriving student, fitness, and IT community, Nuty Tales provides unpasteurized, high-oil dry fruits without retail middleman margins. Guaranteed authentic Himalayan and Mithila terroir.',
    expressHighlights: [
      'Rapid 24-48 hour delivery to Hinjawadi, Baner, Koregaon Park, and Viman Nagar',
      'Free shipping on all nutrition boxes above ₹999',
      '100% lab-tested for chemical pesticide zero-residue and natural oil retention',
    ],
    coldChainProtection:
      'Multi-layer barrier pouches retain natural crunch and enzyme integrity.',
    bestsellers: [
      {
        name: 'Kashmiri Mamra Almonds (High Oil Seedling)',
        slug: 'mamra-almonds-kashmiri-badam',
        weight: '500g Pouch',
        price: 1650,
        mrp: 2199,
        offer: '100% Sweet Kernels',
        image: '/images/hero-lifestyle-bowl.png',
      },
      {
        name: 'Kashmiri Snow White Walnut Kernels',
        slug: 'kashmiri-snow-white-walnut-kernels',
        weight: '500g Pack',
        price: 1250,
        mrp: 1699,
        offer: 'Brain DHA Halves',
        image: '/images/hero-lifestyle-bowl.png',
      },
    ],
    faq: [
      {
        question: 'How fast can I get delivery in Hinjawadi IT Park?',
        answer:
          'Orders placed are dispatched via priority express cargo and delivered directly to your tech park reception or residential society within 24 to 48 hours.',
      },
    ],
  },
}
