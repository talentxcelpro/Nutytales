// ─── Nutty Tales Global Stays & Airbnb Business Platform ────────────────────────
// Global boutique estates, high-altitude orchards, corporate housing & buyouts

export type StayCategory =
  | 'all'
  | 'orchards'
  | 'work_stays'
  | 'ski_chalets'
  | 'houseboats'
  | 'buyouts'
  | 'heritage'
  | 'global'

export interface StayRoom {
  id: string
  name: string
  type: string
  basePricePerNight: number
  maxGuests: number
  bedConfig: string
  sizeSqFt: number
  amenities: string[]
  images: string[]
  description: string
}

export interface StayProperty {
  id: string
  slug: string
  name: string
  city: string
  state: string
  country: string
  category: StayCategory
  secondaryCategories: StayCategory[]
  tagline: string
  locationNote: string
  rating: number
  reviewsCount: number
  superhost: boolean
  workFriendly: boolean
  wifiSpeedMbps: number
  bedrooms: number
  baths: number
  maxTotalGuests: number
  estateBuyoutPrice: number
  featuredImage: string
  galleryImages: string[]
  propertyAmenities: string[]
  seasonalRates: {
    peakSeasonMultiplier: number
    offPeakMultiplier: number
    peakMonths: string[]
  }
  rooms: StayRoom[]
  experienceAddOns: {
    id: string
    title: string
    pricePerPerson: number
    desc: string
  }[]
}

export const STAY_CATEGORIES: { id: StayCategory; label: string; icon: string }[] = [
  { id: 'all', label: 'All Stays', icon: '✨' },
  { id: 'orchards', label: 'Walnut & Apple Orchards', icon: '🍏' },
  { id: 'work_stays', label: 'Airbnb for Work & Teams', icon: '💼' },
  { id: 'ski_chalets', label: 'Alpine Ski Chalets', icon: '🏔️' },
  { id: 'houseboats', label: 'Lakefront & Houseboats', icon: '🛥️' },
  { id: 'buyouts', label: 'Private Estate Buyouts', icon: '🏰' },
  { id: 'heritage', label: 'Heritage & Colonial', icon: '🏛️' },
  { id: 'global', label: 'Global Cities (Dubai, London)', icon: '🌍' },
]

export const STAY_PROPERTIES: StayProperty[] = [
  {
    id: 'prop-kashmir-harwan',
    slug: 'harwan-orchard-estate',
    name: 'The Harwan Royal Walnut Orchard Estate',
    city: 'Srinagar',
    state: 'Jammu & Kashmir',
    country: 'India',
    category: 'orchards',
    secondaryCategories: ['buyouts', 'heritage', 'work_stays'],
    tagline: 'Private 4-acre walnut & apple orchard estate beneath snow-capped Zabarwan peaks',
    locationNote: 'Harwan / Dachigam Road, 15 mins from Dal Lake & Shalimar Bagh',
    rating: 4.98,
    reviewsCount: 128,
    superhost: true,
    workFriendly: true,
    wifiSpeedMbps: 250,
    bedrooms: 5,
    baths: 6,
    maxTotalGuests: 14,
    estateBuyoutPrice: 45000,
    featuredImage: '/images/stays/kashmir-orchard-estate.jpg',
    galleryImages: [
      '/images/stays/kashmir-orchard-estate.jpg',
      '/images/crafts-kashmir-landscape.jpg',
      '/images/brand-showcase-collage.jpg',
    ],
    propertyAmenities: [
      'Private 4-Acre Walnut & Apple Orchard',
      'Traditional Kashmiri Bukhari (Fireplace) in all Suites',
      'In-House Master Wazwan Chef & Organic Harvest Breakfast',
      'Dedicated High-Speed Workspace with 250 Mbps Fiber',
      'Complimentary Samovar Kehwa & Roasted Walnuts on Arrival',
      'Chauffeur-Driven 4x4 Snow Convoy Airport Service',
    ],
    seasonalRates: {
      peakSeasonMultiplier: 1.25,
      offPeakMultiplier: 0.85,
      peakMonths: ['October', 'November', 'December', 'January', 'February', 'May', 'June'],
    },
    rooms: [
      {
        id: 'rm-ksh-01',
        name: 'The Chinar Royal Suite',
        type: 'Heritage King Suite',
        basePricePerNight: 9500,
        maxGuests: 3,
        bedConfig: '1 Royal King Bed + Daybed',
        sizeSqFt: 520,
        amenities: ['Mountain View Balcony', 'Wood-burning Bukhari', 'Hand-knotted Kashmiri Silk Rug', 'Heated Bathroom', 'Nuty Tales Gourmet Nut Bar'],
        images: ['/images/stays/kashmir-orchard-estate.jpg'],
        description: 'Paneled in aged deodar cedar with handcrafted Khatamband wood ceilings. Panoramic morning views of mist rolling down the Zabarwan peaks.',
      },
      {
        id: 'rm-ksh-02',
        name: 'The Walnut Grove Cottage',
        type: 'Private Garden Cottage',
        basePricePerNight: 13500,
        maxGuests: 4,
        bedConfig: '2 Queen Beds',
        sizeSqFt: 750,
        amenities: ['Private Orchard Lawn', 'Kitchenette with Samovar', 'Deep Soaking Tub', 'Pashmina Throw Blankets', 'Radiant Heating'],
        images: ['/images/crafts-kashmir-landscape.jpg'],
        description: 'Stand-alone cedar wood cottage nestled directly beneath century-old walnut trees. Perfect for families, artists, and winter retreats.',
      },
      {
        id: 'rm-ksh-03',
        name: 'Deluxe Valley View Room',
        type: 'Boutique Deluxe',
        basePricePerNight: 6800,
        maxGuests: 2,
        bedConfig: '1 King Bed',
        sizeSqFt: 380,
        amenities: ['Balcony with Orchard View', 'Ensuite Rain Shower', 'Heated Mattress Pad', 'Espresso & Kehwa Maker'],
        images: ['/images/brand-showcase-collage.jpg'],
        description: 'Intimate retreat with warm wool furnishings, modern bath fittings, and uninterrupted views of snow-dusted ridges.',
      },
    ],
    experienceAddOns: [
      { id: 'exp-ksh-01', title: 'Guided Walnut & Apple Harvest Walk', pricePerPerson: 800, desc: 'Walk with our horticulturists, crack fresh Kagzi walnuts directly off the tree, and sample single-origin raw honey.' },
      { id: 'exp-ksh-02', title: 'Private 7-Course Wazwan Feast by Master Waza', pricePerPerson: 2500, desc: 'Authentic multi-course royal banquet prepared fresh in the orchard pavilion with copper trami service.' },
      { id: 'exp-ksh-03', title: 'Sunset Shikara on Dal Lake & Char Chinar', pricePerPerson: 1500, desc: 'Private 2-hour shikara ride with steaming saffron kehwa and fresh almond cookies served on board.' },
    ],
  },
  {
    id: 'prop-gulmarg-chalet',
    slug: 'gulmarg-ski-chalet',
    name: 'The Gulmarg Pine Ridge Ski Chalet & Spa',
    city: 'Gulmarg',
    state: 'Jammu & Kashmir',
    country: 'India',
    category: 'ski_chalets',
    secondaryCategories: ['buyouts', 'work_stays'],
    tagline: 'Ski-in / ski-out luxury timber chalet with heated hot tub & Apharwat mountain panorama',
    locationNote: 'Circular Road, Gulmarg — 5 mins from Gondola Terminal & Pine Ridge Trail',
    rating: 4.99,
    reviewsCount: 84,
    superhost: true,
    workFriendly: true,
    wifiSpeedMbps: 200,
    bedrooms: 4,
    baths: 5,
    maxTotalGuests: 10,
    estateBuyoutPrice: 52000,
    featuredImage: '/images/stays/gulmarg-ski-chalet.jpg',
    galleryImages: [
      '/images/stays/gulmarg-ski-chalet.jpg',
      '/images/crafts-kashmir-landscape.jpg',
    ],
    propertyAmenities: [
      'Ski-in / Ski-out Access to Gulmarg Slopes',
      'Outdoor Heated Cedar Hot Tub with Snow Views',
      'Radiant Heated Stone Floors & Massive Central Hearth',
      'Ski Gear Drying Room & Dedicated Equipment Butler',
      'Starlink High-Speed Internet & Boardroom Setup',
      'VIP Gondola Pass Fast-Track Coordination',
    ],
    seasonalRates: {
      peakSeasonMultiplier: 1.35,
      offPeakMultiplier: 0.8,
      peakMonths: ['December', 'January', 'February', 'March'],
    },
    rooms: [
      {
        id: 'rm-glm-01',
        name: 'The Apharwat Penthouse Chalet',
        type: 'Ski Penthouse Suite',
        basePricePerNight: 16500,
        maxGuests: 4,
        bedConfig: '1 Super King + 2 Loft Twins',
        sizeSqFt: 680,
        amenities: ['Private Fireplace', 'Direct Slopes Balcony', 'Hot Tub Access', 'Nespresso Bar', 'Heated Boot Rack'],
        images: ['/images/stays/gulmarg-ski-chalet.jpg'],
        description: 'Vaulted timber ceilings overlooking fresh snow slopes. Complete winter luxury with personal ski concierge.',
      },
      {
        id: 'rm-glm-02',
        name: 'Pine Ridge Deluxe Chalet Room',
        type: 'Alpine Deluxe Room',
        basePricePerNight: 11500,
        maxGuests: 2,
        bedConfig: '1 King Bed',
        sizeSqFt: 420,
        amenities: ['Floor-to-Ceiling Forest View', 'Rain Shower with Steam', 'Heated Flooring', 'Kashmir Wool Throws'],
        images: ['/images/stays/gulmarg-ski-chalet.jpg'],
        description: 'Warm cedar timber sanctuary nestled within pine woods. Cozy fireplace corner and heated bathroom.',
      },
    ],
    experienceAddOns: [
      { id: 'exp-glm-01', title: 'Private Certified Ski Instructor & Equipment (Full Day)', pricePerPerson: 4500, desc: 'Certified level-3 mountain ski guide with fast-track Gondola Phase 2 powder snow access.' },
      { id: 'exp-glm-02', title: 'Après-Ski Fireplace Mulled Kehwa & Fondue', pricePerPerson: 1800, desc: 'Warm spices, mountain cheeses, dry fruit crisps, and artisanal saffron drinks by the crackling fire.' },
    ],
  },
  {
    id: 'prop-nigeen-houseboat',
    slug: 'zest-e-nigeen-houseboat',
    name: 'Zest-e-Nigeen Royal Cedar Houseboat',
    city: 'Srinagar',
    state: 'Jammu & Kashmir',
    country: 'India',
    category: 'houseboats',
    secondaryCategories: ['heritage', 'orchards'],
    tagline: 'Hand-carved fragrant deodar cedar palace floating on tranquil mirror waters of Nigeen Lake',
    locationNote: 'West Bank, Nigeen Lake, Srinagar — Peaceful sanctuary away from commercial boat traffic',
    rating: 4.97,
    reviewsCount: 156,
    superhost: true,
    workFriendly: true,
    wifiSpeedMbps: 150,
    bedrooms: 4,
    baths: 4,
    maxTotalGuests: 8,
    estateBuyoutPrice: 28000,
    featuredImage: '/images/stays/cedar-houseboat.jpg',
    galleryImages: [
      '/images/stays/cedar-houseboat.jpg',
      '/images/crafts-kashmir-landscape.jpg',
    ],
    propertyAmenities: [
      'Entire Fragrant Deodar Cedar Wood Construction',
      'Private Front Floating Veranda with Lotus Pond View',
      '24/7 Dedicated Butler & Traditional Tea Service',
      'Sub-Zero Winter Heating with Bukhari Stoves',
      'Complimentary Sunrise Shikara to Floating Flower Market',
      'Silent Solar Power Generator Backup',
    ],
    seasonalRates: {
      peakSeasonMultiplier: 1.2,
      offPeakMultiplier: 0.85,
      peakMonths: ['April', 'May', 'June', 'September', 'October', 'December'],
    },
    rooms: [
      {
        id: 'rm-ngn-01',
        name: 'The Royal Viceroy Suite',
        type: 'Master Lakefront Suite',
        basePricePerNight: 8500,
        maxGuests: 2,
        bedConfig: '1 Carved Walnut King Bed',
        sizeSqFt: 460,
        amenities: ['Direct Lake Front View', 'Intricate Pinjrakari Lattice', 'Victorian Clawfoot Bathtub', 'Traditional Bukhari'],
        images: ['/images/stays/cedar-houseboat.jpg'],
        description: 'The master chamber featuring century-old walnut wood carvings, Persian silk carpets, and uninterrupted water views.',
      },
      {
        id: 'rm-ngn-02',
        name: 'The Lotus View Deluxe Suite',
        type: 'Deluxe Lake Suite',
        basePricePerNight: 6500,
        maxGuests: 2,
        bedConfig: '1 Queen Bed',
        sizeSqFt: 380,
        amenities: ['Water Balcony Access', 'Heated Ensuite Bathroom', 'Kehwa Service', 'Handmade Silk Quilts'],
        images: ['/images/stays/cedar-houseboat.jpg'],
        description: 'Peaceful lakeside room paneled in rich cedar with warm lantern chandeliers and floating garden vistas.',
      },
    ],
    experienceAddOns: [
      { id: 'exp-ngn-01', title: 'Floating Candlelit Shikara Dinner with Live Rabab Musician', pricePerPerson: 3200, desc: 'Private 2-hour glide on moonlit Nigeen Lake with 10,000 floating marigolds and acoustic Kashmiri folk melodies.' },
      { id: 'exp-ngn-02', title: 'Dawn Floating Vegetable & Artisan Market Tour', pricePerPerson: 900, desc: 'Early morning shikara excursion through silent waterways to experience the 200-year-old floating bazaar.' },
    ],
  },
  {
    id: 'prop-noida-executive',
    slug: 'cyber-city-executive-penthouse',
    name: 'Airbnb for Work: Cyber City Penthouse & Boardroom',
    city: 'Noida',
    state: 'Uttar Pradesh (Delhi NCR)',
    country: 'India',
    category: 'work_stays',
    secondaryCategories: ['global'],
    tagline: 'Airbnb for Work verified executive residence with 12-seat boardroom, 500 Mbps fiber & skyline terrace',
    locationNote: 'Sector 62/63 Corporate Corridor, Noida — 5 mins from Electronic City Metro & Expressway',
    rating: 4.94,
    reviewsCount: 230,
    superhost: true,
    workFriendly: true,
    wifiSpeedMbps: 500,
    bedrooms: 3,
    baths: 4,
    maxTotalGuests: 8,
    estateBuyoutPrice: 22500,
    featuredImage: '/images/stays/corporate-work-villa.jpg',
    galleryImages: [
      '/images/stays/corporate-work-villa.jpg',
      '/images/brand-showcase-collage.jpg',
    ],
    propertyAmenities: [
      '12-Seat High-Tech Boardroom Table with 75" 4K AV Screen',
      'Dual Redundant 500 Mbps Commercial Fiber Internet',
      'Herman Miller Ergonomic Chairs & Dual-Monitor Workdesks',
      'Official 18% Corporate GST Invoicing for Business Travel',
      'In-House Barista Espresso Machine & Organic Nut Bar',
      'Airport Taxi & Delhi Metro Corporate Chauffeur Access',
    ],
    seasonalRates: {
      peakSeasonMultiplier: 1.1,
      offPeakMultiplier: 0.9,
      peakMonths: ['October', 'November', 'December', 'January', 'February'],
    },
    rooms: [
      {
        id: 'rm-noi-01',
        name: 'The Executive Chairman Penthouse Suite',
        type: 'Presidential Work Suite',
        basePricePerNight: 7500,
        maxGuests: 2,
        bedConfig: '1 King Bed + Private Study',
        sizeSqFt: 620,
        amenities: ['Private Office Corner', 'Dual 4K Monitors', 'Skyline Terrace Balcony', 'Rain Shower', 'Espresso Bar'],
        images: ['/images/stays/corporate-work-villa.jpg'],
        description: 'Tailored for CXOs, visiting founders, and corporate leadership teams requiring absolute silence, speed, and privacy.',
      },
      {
        id: 'rm-noi-02',
        name: 'Deluxe Corporate Work Room',
        type: 'Executive Room',
        basePricePerNight: 4500,
        maxGuests: 2,
        bedConfig: '1 Queen Bed',
        sizeSqFt: 360,
        amenities: ['Ergonomic Desk', 'Fast Wi-Fi', 'Complimentary Breakfast', 'Sound-Isolated Double Glazing'],
        images: ['/images/stays/corporate-work-villa.jpg'],
        description: 'Clean, minimalist sanctuary designed for productivity and deep sleep during Delhi NCR business visits.',
      },
    ],
    experienceAddOns: [
      { id: 'exp-noi-01', title: 'Executive Boardroom Meeting Catering & Nut Flights', pricePerPerson: 750, desc: 'Fresh roasted and seasoned nut flights with artisanal cheeses, espresso, and working lunch platter.' },
    ],
  },
  {
    id: 'prop-pahalgam-riverfront',
    slug: 'lidder-pine-riverfront-estate',
    name: 'Lidder Pine Riverfront Villa & Meadow',
    city: 'Pahalgam',
    state: 'Jammu & Kashmir',
    country: 'India',
    category: 'orchards',
    secondaryCategories: ['buyouts', 'work_stays'],
    tagline: 'Private cedar villa with trout stream frontage, pine forest lawns & bonfire pavilion',
    locationNote: 'Lidder Valley Road, Pahalgam — 10 mins from Aru Valley trailhead & Betaab Valley',
    rating: 4.96,
    reviewsCount: 92,
    superhost: true,
    workFriendly: true,
    wifiSpeedMbps: 200,
    bedrooms: 4,
    baths: 4,
    maxTotalGuests: 12,
    estateBuyoutPrice: 38000,
    featuredImage: '/images/crafts-kashmir-landscape.jpg',
    galleryImages: [
      '/images/crafts-kashmir-landscape.jpg',
      '/images/brand-showcase-collage.jpg',
    ],
    propertyAmenities: [
      'Direct Private Frontage on Glacial Lidder River',
      'Extensive Pine Lawn for Bonfires & Outdoor Dining',
      'Central Heating & Radiators for Sub-Zero Winters',
      'Wild Trout Fishing Rods & Local Ghillie Guide',
      'High-Speed Satellite Starlink Internet',
      'Campfire Wazwan Barbecue by Private River Deck',
    ],
    seasonalRates: {
      peakSeasonMultiplier: 1.25,
      offPeakMultiplier: 0.85,
      peakMonths: ['May', 'June', 'July', 'August', 'December', 'January'],
    },
    rooms: [
      {
        id: 'rm-phg-01',
        name: 'The Riverfront Cedar Cottage Suite',
        type: 'Riverfront King Suite',
        basePricePerNight: 9800,
        maxGuests: 3,
        bedConfig: '1 King Bed + Bay Window Daybed',
        sizeSqFt: 540,
        amenities: ['Lidder River Balcony', 'Stone Fireplace', 'Radiant Heating', 'Samovar Tea Set'],
        images: ['/images/crafts-kashmir-landscape.jpg'],
        description: 'Wake to the rushing music of the glacial Lidder River. Warm cedar woodwork, deep wool rugs, and mountain views.',
      },
    ],
    experienceAddOns: [
      { id: 'exp-phg-01', title: 'Wild Brown Trout Fly Fishing (Half Day)', pricePerPerson: 2200, desc: 'Complete fishing gear, local license, and master ghillie guide along private river pools.' },
    ],
  },
  {
    id: 'prop-dubai-skyvilla',
    slug: 'dubai-downtown-sky-villa',
    name: 'Downtown Burj Skyline Villa & Boardroom',
    city: 'Dubai',
    state: 'Dubai',
    country: 'United Arab Emirates',
    category: 'global',
    secondaryCategories: ['work_stays', 'buyouts'],
    tagline: 'Ultra-luxury penthouse with private infinity plunge pool, Burj Khalifa vista & DIFC boardroom',
    locationNote: 'Downtown / DIFC Corridor, Dubai — 5 mins from Dubai Mall & Trade Centre',
    rating: 4.98,
    reviewsCount: 68,
    superhost: true,
    workFriendly: true,
    wifiSpeedMbps: 1000,
    bedrooms: 4,
    baths: 5,
    maxTotalGuests: 8,
    estateBuyoutPrice: 49500,
    featuredImage: '/images/campaign-travel-further.jpg',
    galleryImages: [
      '/images/campaign-travel-further.jpg',
      '/images/brand-showcase-collage.jpg',
    ],
    propertyAmenities: [
      'Private High-Altitude Plunge Pool Overlooking Burj Khalifa',
      '1 Gbps Ultra-High-Speed Dedicated Mesh Wi-Fi',
      '10-Seat Executive Strategy Boardroom & Smart AV Wall',
      'Corporate VAT Invoicing for UAE & International Travel',
      'Airport VIP Chauffeur Transfer (Dubai DXB)',
      '24/7 Dedicated Lifestyle Concierge',
    ],
    seasonalRates: {
      peakSeasonMultiplier: 1.3,
      offPeakMultiplier: 0.8,
      peakMonths: ['November', 'December', 'January', 'February', 'March'],
    },
    rooms: [
      {
        id: 'rm-dxb-01',
        name: 'The Skyline Master Penthouse Suite',
        type: 'Presidential Penthouse',
        basePricePerNight: 18500,
        maxGuests: 2,
        bedConfig: '1 Royal King Bed',
        sizeSqFt: 780,
        amenities: ['Floor-to-Ceiling Skyline Glass', 'Marble Bath with Burj View', 'Private Study', 'Terrace Access'],
        images: ['/images/campaign-travel-further.jpg'],
        description: 'Spectacular elevated residence designed for global corporate travelers and discerning high-net-worth visitors.',
      },
    ],
    experienceAddOns: [
      { id: 'exp-dxb-01', title: 'Private Chauffeur Airport Escort (Rolls Royce / Maybach)', pricePerPerson: 4200, desc: 'Seamless VIP airport transit directly to the sky villa with luggage porterage.' },
    ],
  },
  {
    id: 'prop-london-mews',
    slug: 'kensington-mews-residence',
    name: 'Kensington Heritage Mews & Study Residence',
    city: 'London',
    state: 'Greater London',
    country: 'United Kingdom',
    category: 'global',
    secondaryCategories: ['heritage', 'work_stays'],
    tagline: 'Quiet Victorian mews house with private garden courtyard, library study & high-speed mesh',
    locationNote: 'South Kensington / Knightsbridge, London — 3 mins from Gloucester Road Station',
    rating: 4.95,
    reviewsCount: 52,
    superhost: true,
    workFriendly: true,
    wifiSpeedMbps: 350,
    bedrooms: 3,
    baths: 3,
    maxTotalGuests: 6,
    estateBuyoutPrice: 42000,
    featuredImage: '/images/campaign-stay-in-the-story.jpg',
    galleryImages: [
      '/images/campaign-stay-in-the-story.jpg',
      '/images/brand-showcase-collage.jpg',
    ],
    propertyAmenities: [
      'Private Cobblestone Mews with Dedicated Parking',
      'Book-Lined Study with High-Speed Mesh & Work Desk',
      'Private Enclosed Courtyard Garden with Outdoor Fire Pit',
      'Self Check-In Smart Keyless Entry & Security System',
      'Complimentary English Tea & Nuty Tales Gourmet Roasted Nuts',
      'Corporate VAT Invoicing for Global Business Travelers',
    ],
    seasonalRates: {
      peakSeasonMultiplier: 1.2,
      offPeakMultiplier: 0.9,
      peakMonths: ['May', 'June', 'July', 'August', 'December'],
    },
    rooms: [
      {
        id: 'rm-ldn-01',
        name: 'The Victorian Library Suite',
        type: 'Mews Master Suite',
        basePricePerNight: 15500,
        maxGuests: 2,
        bedConfig: '1 Super King Bed',
        sizeSqFt: 480,
        amenities: ['Cobblestone Mews Balcony', 'Integrated Workstation', 'Cast Iron Fireplace', 'Ensuite Rainfall Shower'],
        images: ['/images/campaign-stay-in-the-story.jpg'],
        description: 'Elegant London townhouse living on a tranquil, private cobbled lane steps away from museums and Hyde Park.',
      },
    ],
    experienceAddOns: [
      { id: 'exp-ldn-01', title: 'Traditional High Tea Hamper with Kashmiri Saffron Treats', pricePerPerson: 1600, desc: 'Curated British scones, clotted cream, Kashmiri saffron shortbread, and royal single-estate teas.' },
    ],
  },
  {
    id: 'prop-goa-moira',
    slug: 'moira-portuguese-orchard-estate',
    name: 'Moira Heritage Portuguese Orchard Villa',
    city: 'Moira',
    state: 'Goa',
    country: 'India',
    category: 'heritage',
    secondaryCategories: ['buyouts', 'work_stays', 'orchards'],
    tagline: '200-year-old restored Portuguese villa with tropical orchard, private pool & high-speed mesh',
    locationNote: 'Moira Village, North Goa — 20 mins from Ashwem Beach & Mapusa Market',
    rating: 4.97,
    reviewsCount: 114,
    superhost: true,
    workFriendly: true,
    wifiSpeedMbps: 300,
    bedrooms: 5,
    baths: 5,
    maxTotalGuests: 14,
    estateBuyoutPrice: 32000,
    featuredImage: '/images/brand-showcase-collage.jpg',
    galleryImages: [
      '/images/brand-showcase-collage.jpg',
      '/images/crystal-gold-nut-bowls.jpg',
    ],
    propertyAmenities: [
      'Private 15m Chlorophyll Stone Swimming Pool',
      'Tropical 2-Acre Mango, Coconut & Chikoo Orchard',
      'In-House Goan Saraswat Cook & Breakfast Service',
      'High-Speed Wi-Fi for Workations & Distributed Teams',
      'High-Ceilinged Verandas with Antique Reclining Chairs',
      'Airport Chauffeur Transfer (Mopa & Dabolim)',
    ],
    seasonalRates: {
      peakSeasonMultiplier: 1.35,
      offPeakMultiplier: 0.8,
      peakMonths: ['November', 'December', 'January', 'February'],
    },
    rooms: [
      {
        id: 'rm-goa-01',
        name: 'The Balcao Master Suite',
        type: 'Portuguese Master Suite',
        basePricePerNight: 7800,
        maxGuests: 3,
        bedConfig: '1 Four-Poster King Bed',
        sizeSqFt: 580,
        amenities: ['Private Balcao Veranda', 'High Timber Ceilings', 'Pool View', 'Outdoor Shower'],
        images: ['/images/brand-showcase-collage.jpg'],
        description: 'Immaculately restored heritage suite with original red oxide floors, brass four-poster bed, and lush orchard views.',
      },
    ],
    experienceAddOns: [
      { id: 'exp-goa-01', title: 'Traditional Goan Spice Plantation & Toddy Walk', pricePerPerson: 1200, desc: 'Guided walk through Moira village spice gardens followed by fresh coconut water and local delicacies.' },
    ],
  },
]
