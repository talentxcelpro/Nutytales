// ─── Nuty Tales Stays — Curated Luxury Residences & Private Estates Collection ─
// Core Operational Hubs: Kashmir · Delhi-NCR · Patna · Bengaluru · Kerala · Jaipur · Global
// Grounded in genuine inventory, inspected estates, and end-to-end hospitality.

export type StayCategory =
  | 'all'
  | 'orchards'
  | 'corporate_suites'
  | 'ski_chalets'
  | 'houseboats'
  | 'heritage'
  | 'buyouts'
  | 'global'

export type DiscoveryCollection =
  | 'guest_favourites'
  | 'mountain_escapes'
  | 'villas_private'
  | 'homestays'
  | 'farmstays'
  | 'boutique_hotels'
  | 'family_friendly'
  | 'romantic'
  | 'work_friendly'
  | 'group_trips'
  | 'destination_weddings'
  | 'accessible'
  | 'last_minute'
  | 'unique_stays'

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

export interface StayReviewItem {
  id: string
  guestName: string
  guestCity: string
  date: string
  rating: number
  title: string
  comment: string
  hostResponse?: string
}

export interface StayHostProfile {
  id: string
  name: string
  superhost: boolean
  verified: boolean
  responseRate: number
  responseTime: string
  avatar: string
  bio: string
  joinedYear: number
}

export interface StayExperienceAddon {
  id: string
  title: string
  pricePerPerson: number
  desc: string
  category?: 'culinary' | 'transfer' | 'excursion' | 'wellness'
}

export interface StayProperty {
  id: string
  slug: string
  name: string
  city: string
  state: string
  country: string
  hubZone: 'Kashmir' | 'Delhi-NCR' | 'Patna' | 'Bengaluru' | 'Kerala' | 'Jaipur' | 'Himachal' | 'Goa' | 'Global'
  propertyType: 'villa' | 'estate' | 'chalet' | 'houseboat' | 'penthouse' | 'heritage_manor' | 'farmstay'
  category: StayCategory
  secondaryCategories: StayCategory[]
  discoveryCollections: DiscoveryCollection[]
  tagline: string
  description: string
  locationNote: string
  addressLine?: string
  latitude: number
  longitude: number
  mapUrl?: string
  
  rating: number
  reviewsCount: number
  ratingsBreakdown: {
    cleanliness: number
    accuracy: number
    communication: number
    location: number
    checkIn: number
    value: number
  }
  reviews: StayReviewItem[]
  
  curatedCollection: boolean
  workFriendly: boolean
  instantBook: boolean
  freeCancellation: boolean
  cancellationPolicy: 'Flexible' | 'Moderate' | 'Strict'
  cancellationDetails: string
  wifiSpeedMbps: number
  bedrooms: number
  beds: number
  baths: number
  maxTotalGuests: number
  squareFeet?: number
  estateBuyoutPrice: number
  cleaningFee: number
  securityDeposit: number
  
  featuredImage: string
  galleryImages: string[]
  propertyAmenities: string[]
  accessibilityFeatures: string[]
  houseRules: string[]
  checkInTime?: string
  checkOutTime?: string
  
  seasonalRates: {
    peakSeasonMultiplier: number
    offPeakMultiplier: number
    peakMonths: string[]
  }
  
  host: StayHostProfile
  rooms: StayRoom[]
  experienceAddOns: StayExperienceAddon[]
}

export const STAY_CATEGORIES: { id: StayCategory; label: string; icon: string }[] = [
  { id: 'all', label: 'All Stays', icon: '✨' },
  { id: 'orchards', label: 'Walnut & Apple Orchards', icon: '🍏' },
  { id: 'corporate_suites', label: 'Executive Living', icon: '💼' },
  { id: 'ski_chalets', label: 'Alpine Ski Chalets', icon: '🏔️' },
  { id: 'houseboats', label: 'Cedar Houseboats', icon: '🛥️' },
  { id: 'heritage', label: 'Heritage Manors', icon: '🏛️' },
  { id: 'buyouts', label: 'Estate Buyouts', icon: '🏰' },
  { id: 'global', label: 'Global Gateways', icon: '🌍' },
]

export const DISCOVERY_COLLECTIONS: { id: DiscoveryCollection; title: string; subtitle: string; icon: string }[] = [
  { id: 'guest_favourites', title: 'Guest Favourites', subtitle: 'Highest guest satisfaction ratings, exceptional hosts and spotless reviews', icon: '🏆' },
  { id: 'mountain_escapes', title: 'Mountain Escapes', subtitle: 'Alpine peaks, snowy slopes, and cozy fireplaces in Gulmarg & Zabarwan', icon: '🏔️' },
  { id: 'villas_private', title: 'Villas & Private Homes', subtitle: 'Whole homes with private manicured grounds, dedicated butlers & chef kitchens', icon: '🏡' },
  { id: 'homestays', title: 'Homestays & Local Living', subtitle: 'Warm authentic hospitality hosted by local heritage custodians', icon: '🪴' },
  { id: 'farmstays', title: 'Farm Stays & Nature Retreats', subtitle: 'Harvest crisp apples, fresh walnuts, and taste farm-to-table breakfast', icon: '🍎' },
  { id: 'boutique_hotels', title: 'Boutique Residences', subtitle: 'Design-forward architecture with five-star bespoke hospitality services', icon: '🛎️' },
  { id: 'family_friendly', title: 'Family-Friendly Properties', subtitle: 'Spacious lawns, safe surroundings, kids amenities & multi-bedroom suites', icon: '👨‍👩‍👧‍👦' },
  { id: 'romantic', title: 'Romantic Getaways', subtitle: 'Intimate candlelit balconies, cedar soaking tubs & mountain vistas', icon: '🕯️' },
  { id: 'work_friendly', title: 'Long Stays & Remote Work', subtitle: 'Ergonomic Herman Miller desks, gigabit fiber & silent private study chambers', icon: '💻' },
  { id: 'group_trips', title: 'Group Trips & Large Estates', subtitle: 'Spacious estates for 10-30 guests, reunion lawns & banquet halls', icon: '👥' },
  { id: 'destination_weddings', title: 'Destination Weddings & Celebrations', subtitle: 'Orchard lawns, royal Wazwan catering pavilion & private estate takeover', icon: '💍' },
  { id: 'accessible', title: 'Accessible Stays', subtitle: 'Step-free access, wide doorways, ground-floor suites & adapted bathrooms', icon: '♿' },
  { id: 'last_minute', title: 'Last-Minute Availability', subtitle: 'Available for immediate check-in over the next 7 days with verified keys', icon: '⚡' },
  { id: 'unique_stays', title: 'Unique & Extraordinary', subtitle: 'Carved deodar cedar houseboats, high-altitude lofts & tree-level suites', icon: '✨' },
]

export const STAY_PROPERTIES: StayProperty[] = [
  // ── 1. KASHMIR ANCHOR: The Harwan Royal Walnut Orchard Estate ──────────────
  {
    id: 'prop-kashmir-harwan',
    slug: 'harwan-orchard-estate',
    name: 'The Harwan Royal Walnut Orchard Estate',
    city: 'Srinagar',
    state: 'Jammu & Kashmir',
    country: 'India',
    hubZone: 'Kashmir',
    propertyType: 'estate',
    category: 'orchards',
    secondaryCategories: ['buyouts', 'heritage', 'corporate_suites'],
    discoveryCollections: [
      'guest_favourites',
      'mountain_escapes',
      'villas_private',
      'farmstays',
      'family_friendly',
      'romantic',
      'work_friendly',
      'group_trips',
      'destination_weddings',
      'accessible',
      'unique_stays',
    ],
    tagline: 'Private 4-acre walnut & apple orchard estate beneath snow-capped Zabarwan peaks',
    description:
      'Immerse yourself in four acres of heritage walnut groves and private apple orchards in historic Harwan, Srinagar. Featuring hand-carved deodar wood Khatamband ceilings, traditional brass bukhari wood stoves, and an in-house master Wazwan chef. Perfect for private family celebrations, corporate retreats, or tranquil mountain getaways with uninterrupted views of Dachigam sanctuary ridges.',
    locationNote: 'Harwan / Dachigam Road & Arshid House, Budgam–Gojra Road, Dadna, Budgam, J&K 191111',
    addressLine: 'Arshid House, Dadna Estate, Budgam-Harwan Corridor, Srinagar, J&K 191111',
    latitude: 34.00877,
    longitude: 74.70861,
    mapUrl:
      'https://www.google.com/maps/place/Arshid+House/@34.0087558,74.7060736,17z/data=!4m6!3m5!1s0x38e191f6e26e2615:0x437d1ccd908b0d4a!8m2!3d34.0087701!4d74.7086101!16s%2Fg%2F11t2ssyygj?entry=ttu',
    rating: 4.98,
    reviewsCount: 128,
    ratingsBreakdown: {
      cleanliness: 4.99,
      accuracy: 4.98,
      communication: 5.0,
      location: 4.97,
      checkIn: 4.99,
      value: 4.95,
    },
    reviews: [
      {
        id: 'rev-ksh-01',
        guestName: 'Arjun Mehra',
        guestCity: 'Mumbai',
        date: 'October 2026',
        rating: 5,
        title: 'Unbelievable autumn harvest experience',
        comment:
          'We booked the entire Harwan Estate for our 10-person family reunion. Waking up to fresh walnuts being cracked right under the trees, hot kehwa from a copper samovar, and the master chef preparing a 7-course Wazwan was unforgettable. Spotless deodar wood suites and warm bukharis made sub-zero nights sublime.',
        hostResponse:
          'Thank you Arjun! It was an absolute honour hosting your family. We have already preserved single-origin walnut honey for your next autumn visit.',
      },
      {
        id: 'rev-ksh-02',
        guestName: 'Dr. Radhika Sen',
        guestCity: 'Bengaluru',
        date: 'September 2026',
        rating: 5,
        title: 'Productive and peaceful mountain haven',
        comment:
          'Worked remotely for 10 days from the Chinar Suite. 250 Mbps dedicated fiber with UPS backup never flickered. Mountain mist rolling down Zabarwan while drinking kehwa on the balcony is unmatched anywhere in India.',
      },
    ],
    curatedCollection: true,
    workFriendly: true,
    instantBook: true,
    freeCancellation: true,
    cancellationPolicy: 'Flexible',
    cancellationDetails: 'Full refund up to 48 hours before check-in. 50% refund thereafter minus first night.',
    wifiSpeedMbps: 250,
    bedrooms: 5,
    beds: 8,
    baths: 6,
    maxTotalGuests: 14,
    squareFeet: 6800,
    estateBuyoutPrice: 45000,
    cleaningFee: 2500,
    securityDeposit: 10000,
    featuredImage: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1600&q=85',
    ],
    propertyAmenities: [
      'Private 4-Acre Walnut & Apple Orchard Grounds',
      'Traditional Kashmiri Bukhari (Wood Fireplace) in all Chambers',
      'In-House Master Wazwan Chef & Organic Harvest Breakfast Included',
      'Dedicated Executive Workspace with 250 Mbps Dedicated Fiber & UPS',
      'Complimentary Samovar Kehwa & Single-Origin Roasted Walnuts Bar',
      'Chauffeur-Driven 4x4 Snow Convoy Airport Transfer Coordination',
      'Private Lawn Bonfire Pavilion with Stargazing Telescope',
      'Fully Equipped Farm Kitchen with Copper Dining Tramis',
      'Underfloor Heating & Heated Mattress Blankets',
      'Private Gated Parking for up to 8 Vehicles',
      'Full Estate Generator Backup (24/7 Redundant Power)',
    ],
    accessibilityFeatures: [
      'Step-free entrance and ramps to ground floor suites',
      'Wide 36-inch doorways throughout main corridors',
      'Accessible ground-floor en-suite bathroom with walk-in shower & grab bars',
      'Dedicated parking space within 15 meters of main entrance',
    ],
    houseRules: [
      'Check-in: 14:00 - 21:00 | Check-out: 11:00',
      'Quiet hours from 22:30 in outdoor lawn areas',
      'Wood bukhari stoves operated by trained estate butler for safety',
      'Smoking permitted only in designated outdoor orchard gazebos',
      'Pets welcomed upon advance host notice',
    ],
    seasonalRates: {
      peakSeasonMultiplier: 1.25,
      offPeakMultiplier: 0.85,
      peakMonths: ['October', 'November', 'December', 'January', 'February', 'May', 'June'],
    },
    host: {
      id: 'host-arshid-wani',
      name: 'Arshid Wani',
      superhost: true,
      verified: true,
      responseRate: 99,
      responseTime: 'within 10 minutes',
      avatar: '/images/logo.jpg',
      bio: 'Native of Kashmir and agricultural custodian of the Harwan & Budgam valley orchards. Passionate about authentic Kashmiri hospitality, master craftsmanship, and single-origin walnut heritage.',
      joinedYear: 2021,
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
        name: 'Deluxe Valley View Chamber',
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
      { id: 'exp-ksh-01', title: 'Guided Walnut & Apple Harvest Walk', pricePerPerson: 800, desc: 'Walk with our horticulturists, crack fresh Kagzi walnuts directly off the tree, and sample single-origin raw honey.', category: 'excursion' },
      { id: 'exp-ksh-02', title: 'Private 7-Course Wazwan Feast by Master Waza', pricePerPerson: 2500, desc: 'Authentic multi-course royal banquet prepared fresh in the orchard pavilion with copper trami service.', category: 'culinary' },
      { id: 'exp-ksh-03', title: 'Sunset Shikara on Dal Lake & Char Chinar', pricePerPerson: 1500, desc: 'Private 2-hour shikara ride with steaming saffron kehwa and fresh almond cookies served on board.', category: 'transfer' },
      { id: 'exp-ksh-04', title: 'Chauffeur 4x4 Srinagar Airport Escort (Both Ways)', pricePerPerson: 3200, desc: 'Private heated 4WD vehicle pickup and drop-off with luggage porterage.', category: 'transfer' },
    ],
  },

  // ── 2. KASHMIR: The Gulmarg Pine Ridge Ski Chalet & Spa ─────────────────────
  {
    id: 'prop-gulmarg-chalet',
    slug: 'gulmarg-ski-chalet',
    name: 'The Gulmarg Pine Ridge Ski Chalet & Spa',
    city: 'Gulmarg',
    state: 'Jammu & Kashmir',
    country: 'India',
    hubZone: 'Kashmir',
    propertyType: 'chalet',
    category: 'ski_chalets',
    secondaryCategories: ['buyouts', 'corporate_suites'],
    discoveryCollections: [
      'guest_favourites',
      'mountain_escapes',
      'villas_private',
      'romantic',
      'group_trips',
      'unique_stays',
      'last_minute',
    ],
    tagline: 'Ski-in / ski-out luxury timber chalet with heated outdoor hot tub & Apharwat mountain panorama',
    description:
      'Perched at 8,690 feet directly adjacent to Gulmarg’s legendary ski slopes and Circular Road trail. Crafted from fragrant Himalayan cedar and local granite, this ski chalet features private ski lockers, boot warmers, heated cedar hot tub overlooking snow pines, and personal ski concierge services.',
    locationNote: 'Circular Road, Gulmarg — 5 mins from Gondola Terminal & Pine Ridge Trail',
    addressLine: 'Upper Circular Road, Gulmarg, Baramulla, Jammu & Kashmir 193403',
    latitude: 34.0484,
    longitude: 74.3805,
    mapUrl: 'https://maps.google.com/?q=Gulmarg+Jammu+Kashmir',
    rating: 4.99,
    reviewsCount: 84,
    ratingsBreakdown: {
      cleanliness: 5.0,
      accuracy: 4.99,
      communication: 4.98,
      location: 5.0,
      checkIn: 4.99,
      value: 4.96,
    },
    reviews: [
      {
        id: 'rev-glm-01',
        guestName: 'Marcus Lindqvist',
        guestCity: 'Stockholm',
        date: 'January 2026',
        rating: 5,
        title: 'Best ski chalet in Asia',
        comment:
          'World-class powder snow right outside the back terrace! The outdoor cedar hot tub at -10°C while snow is falling is pure magic. The chalet butler arranged fast-track Gondola Phase 2 ski passes every morning.',
      },
    ],
    curatedCollection: true,
    workFriendly: true,
    instantBook: true,
    freeCancellation: true,
    cancellationPolicy: 'Moderate',
    cancellationDetails: 'Full refund up to 5 days before check-in. 50% refund thereafter.',
    wifiSpeedMbps: 200,
    bedrooms: 4,
    beds: 6,
    baths: 5,
    maxTotalGuests: 10,
    squareFeet: 5200,
    estateBuyoutPrice: 52000,
    cleaningFee: 3000,
    securityDeposit: 15000,
    featuredImage: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1600&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1548625361-195fe5787e74?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1517840905240-472988babdf9?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1600&q=85',
    ],
    propertyAmenities: [
      'Ski-in / Ski-out Access to Gulmarg Slopes',
      'Outdoor Heated Cedar Hot Tub with Alpine Snow Views',
      'Radiant Heated Stone Floors & Massive Central Hearth',
      'Ski Gear Drying Room & Dedicated Equipment Butler',
      'Starlink High-Speed Satellite Internet & Fireplace Lounge',
      'VIP Gondola Pass Fast-Track Coordination',
      'In-Chalet Sauna & Finnish Cold Plunge Barrel',
      'Private Chef Prepared Après-Ski Fondue & Hot Saffron Kehwa',
    ],
    accessibilityFeatures: [
      'Ground level heated entryway and lounge',
      'Wide heated ramp connecting to ski storage',
      'Ground-floor master suite with roll-in bathroom',
    ],
    houseRules: [
      'Check-in: 15:00 | Check-out: 11:00',
      'Ski boots to be stored in dedicated drying room',
      'Hot tub hours: 07:00 to 22:00',
    ],
    seasonalRates: {
      peakSeasonMultiplier: 1.35,
      offPeakMultiplier: 0.8,
      peakMonths: ['December', 'January', 'February', 'March'],
    },
    host: {
      id: 'host-gulmarg-concierge',
      name: 'Tariq Lone',
      superhost: true,
      verified: true,
      responseRate: 98,
      responseTime: 'within 15 minutes',
      avatar: '/images/crafts-artisan-hands.jpg',
      bio: 'Gulmarg mountain guide and veteran ski coach with 20 years guiding international powder expeditions across Mt. Apharwat.',
      joinedYear: 2022,
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
    ],
    experienceAddOns: [
      { id: 'exp-glm-01', title: 'Private Certified Ski Instructor & Equipment (Full Day)', pricePerPerson: 4500, desc: 'Certified level-3 mountain ski guide with fast-track Gondola Phase 2 powder snow access.', category: 'excursion' },
      { id: 'exp-glm-02', title: 'Après-Ski Fireplace Mulled Kehwa & Fondue', pricePerPerson: 1800, desc: 'Warm spices, mountain cheeses, dry fruit crisps, and artisanal saffron drinks by the crackling fire.', category: 'culinary' },
    ],
  },

  // ── 3. KASHMIR: Zest-e-Nigeen Royal Cedar Houseboat ─────────────────────────
  {
    id: 'prop-nigeen-houseboat',
    slug: 'zest-e-nigeen-houseboat',
    name: 'Zest-e-Nigeen Royal Cedar Houseboat',
    city: 'Srinagar',
    state: 'Jammu & Kashmir',
    country: 'India',
    hubZone: 'Kashmir',
    propertyType: 'houseboat',
    category: 'houseboats',
    secondaryCategories: ['heritage', 'orchards'],
    discoveryCollections: [
      'guest_favourites',
      'homestays',
      'romantic',
      'family_friendly',
      'unique_stays',
      'last_minute',
    ],
    tagline: 'Hand-carved fragrant deodar cedar palace floating on tranquil mirror waters of Nigeen Lake',
    description:
      'Floating on the secluded willow-lined western bank of Nigeen Lake, far from the commercial motorboat noise of Dal Lake. Built entirely from hand-carved fragrant Himalayan cedar, featuring antique walnut furniture, crystal chandeliers, Persian silk carpets, and a private wooden front sundeck facing lotus lagoons and Hari Parbat fort.',
    locationNote: 'West Bank, Nigeen Lake, Srinagar — Peaceful sanctuary away from commercial boat traffic',
    addressLine: 'West Ghat, Nigeen Lake, Srinagar, J&K 190006',
    latitude: 34.1167,
    longitude: 74.8333,
    mapUrl: 'https://maps.google.com/?q=Nigeen+Lake+Srinagar',
    rating: 4.97,
    reviewsCount: 156,
    ratingsBreakdown: {
      cleanliness: 4.98,
      accuracy: 4.97,
      communication: 4.99,
      location: 4.98,
      checkIn: 4.97,
      value: 4.94,
    },
    reviews: [
      {
        id: 'rev-ngn-01',
        guestName: 'Eleanor Vance',
        guestCity: 'London',
        date: 'October 2026',
        rating: 5,
        title: 'Peaceful heaven on water',
        comment:
          'Drinking morning kehwa on the cedar wood veranda while kingfishers dive into the lotus pond is a memory we will cherish for life. The butler Bashir treated us like royalty.',
      },
    ],
    curatedCollection: true,
    workFriendly: true,
    instantBook: true,
    freeCancellation: true,
    cancellationPolicy: 'Flexible',
    cancellationDetails: 'Full refund up to 48 hours before check-in.',
    wifiSpeedMbps: 150,
    bedrooms: 4,
    beds: 5,
    baths: 4,
    maxTotalGuests: 8,
    squareFeet: 3400,
    estateBuyoutPrice: 28000,
    cleaningFee: 1500,
    securityDeposit: 8000,
    featuredImage: 'https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&w=1600&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1600&q=85',
    ],
    propertyAmenities: [
      'Entire Fragrant Deodar Cedar Wood Construction',
      'Private Front Floating Veranda with Lotus Pond View',
      '24/7 Dedicated Butler & Traditional Samovar Tea Service Included',
      'Sub-Zero Winter Heating with Bukhari Stoves & Radiant Heaters',
      'Complimentary Sunrise Shikara to Floating Flower Market',
      'Silent Solar Power Generator Backup (Eco-friendly)',
      'Victorian Clawfoot Bathtubs with Hot Running Water 24/7',
      'Complimentary Wi-Fi with Floating Desk Workspace',
    ],
    accessibilityFeatures: [
      'Gentle gangway ramp from lakeshore to houseboat deck',
      'Wide main salon entry door with no floor steps',
    ],
    houseRules: [
      'Check-in: 13:00 | Check-out: 11:00',
      'Outdoor shoes removed at the cedar foyer per tradition',
      'Smoking on open sundeck only',
    ],
    seasonalRates: {
      peakSeasonMultiplier: 1.2,
      offPeakMultiplier: 0.85,
      peakMonths: ['April', 'May', 'June', 'September', 'October', 'December'],
    },
    host: {
      id: 'host-nigeen-bashir',
      name: 'Bashir Ahmed Wangnoo',
      superhost: true,
      verified: true,
      responseRate: 100,
      responseTime: 'within 5 minutes',
      avatar: '/images/crafts-artisan-hands.jpg',
      bio: 'Fourth-generation lake houseboat custodian. My family has crafted and hosted cedar residences on Nigeen Lake for over 90 years.',
      joinedYear: 2020,
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
    ],
    experienceAddOns: [
      { id: 'exp-ngn-01', title: 'Floating Candlelit Shikara Dinner with Live Rabab Musician', pricePerPerson: 3200, desc: 'Private 2-hour glide on moonlit Nigeen Lake with 10,000 floating marigolds and acoustic Kashmiri folk melodies.', category: 'culinary' },
    ],
  },

  // ── 4. KASHMIR: Lidder Pine Riverfront Villa & Meadow (Pahalgam) ────────────
  {
    id: 'prop-pahalgam-riverfront',
    slug: 'lidder-pine-riverfront-estate',
    name: 'Lidder Pine Riverfront Villa & Meadow',
    city: 'Pahalgam',
    state: 'Jammu & Kashmir',
    country: 'India',
    hubZone: 'Kashmir',
    propertyType: 'villa',
    category: 'orchards',
    secondaryCategories: ['buyouts', 'corporate_suites'],
    discoveryCollections: [
      'guest_favourites',
      'mountain_escapes',
      'villas_private',
      'farmstays',
      'family_friendly',
      'romantic',
      'group_trips',
    ],
    tagline: 'Private cedar villa with trout stream frontage, pine forest lawns & campfire Wazwan pavilion',
    description:
      'Set within a private five-acre pine meadow along the banks of the glacial Lidder River in Pahalgam. Listen to the soothing sound of rushing water from every chamber. Features a riverfront campfire barbecue deck, fly-fishing ghillies, heated cedar floors, and easy access to Betaab Valley and Aru.',
    locationNote: 'Lidder Valley Road, Pahalgam — 10 mins from Aru Valley trailhead & Betaab Valley',
    addressLine: 'Lidder Riverfront, Near Pine Forest, Pahalgam, Anantnag, J&K 192126',
    latitude: 34.0152,
    longitude: 75.3197,
    mapUrl: 'https://maps.google.com/?q=Pahalgam+Jammu+Kashmir',
    rating: 4.96,
    reviewsCount: 92,
    ratingsBreakdown: {
      cleanliness: 4.97,
      accuracy: 4.96,
      communication: 4.98,
      location: 4.99,
      checkIn: 4.96,
      value: 4.92,
    },
    reviews: [
      {
        id: 'rev-phg-01',
        guestName: 'Kunal Singhania',
        guestCity: 'Delhi',
        date: 'July 2026',
        rating: 5,
        title: 'The sound of the river is pure therapy',
        comment:
          'Absolute privacy. You literally walk 20 steps from your bedroom onto the crystal-clear Lidder River. The trout fishing was fantastic and the outdoor bonfire dinner under the stars was the highlight of our vacation.',
      },
    ],
    curatedCollection: true,
    workFriendly: true,
    instantBook: true,
    freeCancellation: true,
    cancellationPolicy: 'Flexible',
    cancellationDetails: 'Full refund up to 48 hours before arrival.',
    wifiSpeedMbps: 200,
    bedrooms: 4,
    beds: 6,
    baths: 4,
    maxTotalGuests: 12,
    squareFeet: 4800,
    estateBuyoutPrice: 38000,
    cleaningFee: 2000,
    securityDeposit: 10000,
    featuredImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1600&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85',
    ],
    propertyAmenities: [
      'Direct Private Frontage on Glacial Lidder River',
      'Extensive Pine Lawn for Bonfires & Outdoor Dining',
      'Central Heating & Radiators for Sub-Zero Winters',
      'Wild Trout Fishing Rods & Local Ghillie Guide',
      'High-Speed Satellite Starlink Internet',
      'Campfire Wazwan Barbecue by Private River Deck',
    ],
    accessibilityFeatures: [
      'Paved step-free pathway from car park to river lawn',
      'Ground floor bedroom with wide doors and walk-in shower',
    ],
    houseRules: [
      'Check-in: 14:00 | Check-out: 11:00',
      'Riverbank safety protocols apply; children must be supervised near water',
    ],
    seasonalRates: {
      peakSeasonMultiplier: 1.25,
      offPeakMultiplier: 0.85,
      peakMonths: ['May', 'June', 'July', 'August', 'December', 'January'],
    },
    host: {
      id: 'host-pahalgam-ghulam',
      name: 'Ghulam Rasool',
      superhost: true,
      verified: true,
      responseRate: 97,
      responseTime: 'within 20 minutes',
      avatar: '/images/crafts-artisan-hands.jpg',
      bio: 'Lifelong resident of Lidder Valley, licensed angler, and naturalist guide.',
      joinedYear: 2021,
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
      { id: 'exp-phg-01', title: 'Wild Brown Trout Fly Fishing (Half Day)', pricePerPerson: 2200, desc: 'Complete fishing gear, local license, and master ghillie guide along private river pools.', category: 'excursion' },
    ],
  },

  // ── 5. DELHI / NCR ANCHOR: Jaypee Wishtown Executive Penthouse ──────────────
  {
    id: 'prop-noida-executive',
    slug: 'cyber-city-executive-penthouse',
    name: 'Jaypee Wishtown Executive Penthouse & Boardroom',
    city: 'Noida',
    state: 'Delhi NCR (Uttar Pradesh)',
    country: 'India',
    hubZone: 'Delhi-NCR',
    propertyType: 'penthouse',
    category: 'corporate_suites',
    secondaryCategories: ['global', 'buyouts'],
    discoveryCollections: [
      'guest_favourites',
      'villas_private',
      'work_friendly',
      'family_friendly',
      'group_trips',
      'accessible',
      'last_minute',
    ],
    tagline: 'Executive corporate residence with 12-seat boardroom, 500 Mbps redundant fiber & skyline garden terrace',
    description:
      'Engineered specifically for business leaders, visiting founders, leadership offsites, and corporate guests. Located along the Noida-Greater Noida Expressway corridor with direct high-speed airport link. Features a 12-seat smart boardroom with 75" 4K AV display, dual redundant fiber optic connections, Herman Miller chairs, and official 18% GST input credit invoicing.',
    locationNote: 'PC-12, 003, Jaypee Wishtown, Sector 128, Noida, Uttar Pradesh 201304 — Expressway Corridor',
    addressLine: 'Tower 4, Jaypee Wishtown Klassic, Sector 128, Noida, UP 201304',
    latitude: 28.52091,
    longitude: 77.35652,
    mapUrl:
      'https://www.google.com/maps/place/Nuty+Tales+(Dry+fruits)/@28.5209169,77.3539445,17z/data=!3m1!4b1!4m6!3m5!1s0x390ce7f48d890b99:0x17d4f4be831d96c1!8m2!3d28.5209122!4d77.3565248!16s%2Fg%2F11vyp7r8k6?entry=ttu',
    rating: 4.95,
    reviewsCount: 230,
    ratingsBreakdown: {
      cleanliness: 4.98,
      accuracy: 4.97,
      communication: 4.99,
      location: 4.92,
      checkIn: 4.99,
      value: 4.91,
    },
    reviews: [
      {
        id: 'rev-noi-01',
        guestName: 'Rohit Aggarwal',
        guestCity: 'Gurugram',
        date: 'October 2026',
        rating: 5,
        title: 'Perfect corporate offsite for leadership',
        comment:
          'Our startup executive team spent 3 days strategizing here. The boardroom setup, lighting-fast dual fiber, and endless espresso & roasted almonds kept everyone energized. Seamless 18% GST invoicing made expense filing effortless.',
      },
    ],
    curatedCollection: true,
    workFriendly: true,
    instantBook: true,
    freeCancellation: true,
    cancellationPolicy: 'Flexible',
    cancellationDetails: 'Full refund up to 24 hours prior to check-in.',
    wifiSpeedMbps: 500,
    bedrooms: 3,
    beds: 4,
    baths: 4,
    maxTotalGuests: 8,
    squareFeet: 3600,
    estateBuyoutPrice: 22500,
    cleaningFee: 1800,
    securityDeposit: 8000,
    featuredImage: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=85',
    ],
    propertyAmenities: [
      '12-Seat High-Tech Executive Boardroom Table with 75" 4K AV Screen',
      'Dual Redundant 500 Mbps Commercial Fiber Internet Connection',
      'Herman Miller Ergonomic Chairs & Dual-Monitor Workstations',
      'Official 18% Corporate GST Invoicing for Business Travel & Retreats',
      'In-House Barista Espresso Machine & Complimentary Nut Bar',
      'Direct Chauffeur Transit to Delhi Airport (DEL) & Expressways',
      'Panoramic 180-Degree Skyline Terrace Garden with Evening Lighting',
      'Smart Keyless Digital Door Locks & 24/7 Gated Security',
    ],
    accessibilityFeatures: [
      'Elevator access from secure basement parking directly to penthouse floor',
      'Step-free entrance and zero-threshold shower stalls',
      'Wide corridors accommodating wheelchairs',
    ],
    houseRules: [
      'Check-in: 14:00 | Check-out: 12:00',
      'Professional meetings and offsites permitted',
      'No loud music past 23:00 on terrace',
    ],
    seasonalRates: {
      peakSeasonMultiplier: 1.1,
      offPeakMultiplier: 0.9,
      peakMonths: ['October', 'November', 'December', 'January', 'February'],
    },
    host: {
      id: 'host-noida-ops',
      name: 'Nuty Tales Executive Hospitality',
      superhost: true,
      verified: true,
      responseRate: 100,
      responseTime: 'within 5 minutes',
      avatar: '/images/logo.jpg',
      bio: 'Managed by Nuty Tales Corporate Hospitality Desk. Providing turnkey residences, meeting technology, and gourmet dining across Delhi NCR.',
      joinedYear: 2021,
    },
    rooms: [
      {
        id: 'rm-noi-01',
        name: 'The Chairman Penthouse Suite',
        type: 'Presidential Executive Suite',
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
        name: 'Deluxe Corporate Work Chamber',
        type: 'Executive Room',
        basePricePerNight: 4500,
        maxGuests: 2,
        bedConfig: '1 Queen Bed',
        sizeSqFt: 360,
        amenities: ['Ergonomic Desk', 'Fast Wi-Fi', 'Complimentary Breakfast', 'Sound-Isolated Double Glazing'],
        images: ['/images/stays/modern-apartment-interior.jpg'],
        description: 'Clean, minimalist sanctuary designed for productivity and deep sleep during Delhi NCR business visits.',
      },
    ],
    experienceAddOns: [
      { id: 'exp-noi-01', title: 'Executive Boardroom Meeting Catering & Nut Flights', pricePerPerson: 750, desc: 'Fresh roasted and seasoned nut flights with artisanal cheeses, espresso, and working lunch platter.', category: 'culinary' },
    ],
  },

  // ── 6. PATNA ANCHOR: Mithila Heritage Courtyard & Riverfront Residency ──────
  {
    id: 'prop-patna-heritage',
    slug: 'mithila-heritage-courtyard-patna',
    name: 'Mithila Heritage Courtyard & Riverfront Residency',
    city: 'Patna',
    state: 'Bihar',
    country: 'India',
    hubZone: 'Patna',
    propertyType: 'heritage_manor',
    category: 'heritage',
    secondaryCategories: ['orchards', 'corporate_suites', 'buyouts'],
    discoveryCollections: [
      'guest_favourites',
      'homestays',
      'farmstays',
      'family_friendly',
      'work_friendly',
      'group_trips',
      'unique_stays',
    ],
    tagline: 'Restored colonial manor celebrating the agricultural heritage of Mithila Makhana & Ganges River',
    description:
      'An immaculately restored heritage courtyard residence celebrating ancient Mithila culture, Madhubani art, and the rich agricultural heritage of the Ganges basin. Located in peaceful Lalbagh near the riverfront. Enjoy hand-roasted desi ghee makhana, tranquil inner courtyards with fountains, antique teak furnishings, and modern gigabit fiber.',
    locationNote: 'Nafis Colony, near Noor Plaza, Bari Path, Lalbagh, Patna, Bihar 800004 — Mithila Sourcing Corridor',
    addressLine: 'Nafis Colony, Bari Path, Lalbagh, Patna, Bihar 800004',
    latitude: 25.61632,
    longitude: 85.17041,
    mapUrl:
      'https://www.mappls.com/place-noor+plaza-bari+path-lalbagh-patna-bihar-800004-VOK1WN@zdata=MjUuNjE2MzI0Kzg1LjE3MDQxNysxNytWT0sxV04rKw==ed',
    rating: 4.93,
    reviewsCount: 78,
    ratingsBreakdown: {
      cleanliness: 4.95,
      accuracy: 4.94,
      communication: 4.97,
      location: 4.91,
      checkIn: 4.96,
      value: 4.92,
    },
    reviews: [
      {
        id: 'rev-pat-01',
        guestName: 'Ananya Roy',
        guestCity: 'Kolkata',
        date: 'September 2026',
        rating: 5,
        title: 'A cultural gem in Patna',
        comment:
          'Stunning traditional courtyard with real Madhubani paintings on the lime-plaster walls. The makhana masterclass where we saw fresh lotus seeds popped in hot sand was fascinating!',
      },
    ],
    curatedCollection: true,
    workFriendly: true,
    instantBook: true,
    freeCancellation: true,
    cancellationPolicy: 'Flexible',
    cancellationDetails: 'Full refund up to 48 hours prior to check-in.',
    wifiSpeedMbps: 200,
    bedrooms: 4,
    beds: 5,
    baths: 4,
    maxTotalGuests: 10,
    squareFeet: 4200,
    estateBuyoutPrice: 24000,
    cleaningFee: 1500,
    securityDeposit: 6000,
    featuredImage: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1600&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1600&q=85',
    ],
    propertyAmenities: [
      'Authentic Hand-Painted Madhubani Artisanal Courtyard',
      'Complimentary Roasted Desi Ghee Makhana & Herbal Tea Service',
      'Dedicated Work Desks with 200 Mbps Fiber Internet',
      'Ganges Riverfront Morning Terrace Walk with Guide',
      'Private Chauffeur Airport Transit (Patna PAT Airport)',
      '18% GST Invoicing for Agricultural & Corporate Travelers',
    ],
    accessibilityFeatures: [
      'Ground floor courtyard bedrooms with zero-step access',
      'Wide antique doorways accommodating all guests',
    ],
    houseRules: [
      'Check-in: 13:00 | Check-out: 11:30',
      'Vegetarian and traditional regional meals prepared fresh',
    ],
    seasonalRates: {
      peakSeasonMultiplier: 1.15,
      offPeakMultiplier: 0.9,
      peakMonths: ['October', 'November', 'December', 'January', 'February'],
    },
    host: {
      id: 'host-patna-mishra',
      name: 'Rameshwar Mishra',
      superhost: true,
      verified: true,
      responseRate: 96,
      responseTime: 'within 30 minutes',
      avatar: '/images/crafts-artisan-hands.jpg',
      bio: 'Historian and organic makhana farmer. Dedicated to sharing Mithila folklore, culinary heritage, and river ecology.',
      joinedYear: 2022,
    },
    rooms: [
      {
        id: 'rm-pat-01',
        name: 'The Mithila Grand Courtyard Suite',
        type: 'Heritage Master Suite',
        basePricePerNight: 5800,
        maxGuests: 3,
        bedConfig: '1 Royal Teak King Bed',
        sizeSqFt: 480,
        amenities: ['Courtyard View', 'Antique Teak Furnishings', 'Private Veranda', 'Organic Makhana Bar'],
        images: ['/images/crystal-gold-nut-bowls.webp'],
        description: 'Immaculately restored heritage suite honoring ancient Mithila culture with original high ceilings and brass detailing.',
      },
    ],
    experienceAddOns: [
      { id: 'exp-pat-01', title: 'Mithila Makhana Harvesting & Roasting Masterclass', pricePerPerson: 1200, desc: 'Visit our agricultural partner ponds in Darbhanga/Madhubani, observe traditional lava popping, and taste hot artisanal roasted makhana.', category: 'excursion' },
      { id: 'exp-pat-02', title: 'Sunset Ganges Boat Excursion with Live Classical Sitar', pricePerPerson: 1800, desc: 'Private wooden country boat glide on the holy river with tea and traditional delicacies.', category: 'excursion' },
    ],
  },

  // ── 7. BENGALURU: Silicon Grove Garden Villa & Executive Retreat ────────────
  {
    id: 'prop-bengaluru-villa',
    slug: 'silicon-grove-garden-villa-bengaluru',
    name: 'Silicon Grove Garden Villa & Executive Retreat',
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    hubZone: 'Bengaluru',
    propertyType: 'villa',
    category: 'corporate_suites',
    secondaryCategories: ['buyouts'],
    discoveryCollections: [
      'guest_favourites',
      'villas_private',
      'family_friendly',
      'work_friendly',
      'group_trips',
      'accessible',
    ],
    tagline: 'Private tropical garden villa in Indiranagar with high-speed mesh, plunge pool & executive gazebo',
    description:
      'Hidden in a quiet tree-lined lane in Indiranagar, Bengaluru. A serene private sanctuary featuring lush bougainvillea courtyards, plunge pool, outdoor coffee gazebo, 1 Gbps ultra-low latency fiber, and acoustically isolated meeting rooms for tech leaders and creative teams.',
    locationNote: '12th Main, HAL 2nd Stage, Indiranagar, Bengaluru, Karnataka 560038',
    addressLine: '12th Main Road, Indiranagar, Bengaluru, KA 560038',
    latitude: 12.9719,
    longitude: 77.6412,
    mapUrl: 'https://maps.google.com/?q=Indiranagar+Bengaluru',
    rating: 4.96,
    reviewsCount: 114,
    ratingsBreakdown: {
      cleanliness: 4.98,
      accuracy: 4.96,
      communication: 4.99,
      location: 4.98,
      checkIn: 4.97,
      value: 4.92,
    },
    reviews: [
      {
        id: 'rev-blr-01',
        guestName: 'Vikram Sundaram',
        guestCity: 'San Francisco',
        date: 'October 2026',
        rating: 5,
        title: 'Best place to stay in Bangalore',
        comment:
          'Absolute bliss. Quiet as a forest yet walking distance to 100ft road cafes. The 1 Gbps fiber handled back-to-back US video calls without a drop.',
      },
    ],
    curatedCollection: true,
    workFriendly: true,
    instantBook: true,
    freeCancellation: true,
    cancellationPolicy: 'Flexible',
    cancellationDetails: 'Full refund up to 48 hours prior to check-in.',
    wifiSpeedMbps: 1000,
    bedrooms: 4,
    beds: 5,
    baths: 4,
    maxTotalGuests: 10,
    squareFeet: 4500,
    estateBuyoutPrice: 32000,
    cleaningFee: 2000,
    securityDeposit: 10000,
    featuredImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1600&q=85',
    ],
    propertyAmenities: [
      'Private Enclosed Tropical Courtyard with Plunge Pool',
      '1 Gbps Dedicated Fiber with Mesh AP in every chamber',
      'Dedicated Ergonomic Workstations with Standing Desks',
      'South Indian Filter Coffee Bar & Cold Press Juice Bar',
      'Solar Power Inverter with 100% Zero-Downtime Backup',
      'Smart Door Lock System & Secure Gated Entry',
    ],
    accessibilityFeatures: [
      'Zero-step entrance from driveway into main villa and master suite',
      'Wide automated sliding glass doors to garden and pool patio',
    ],
    houseRules: [
      'Check-in: 14:00 | Check-out: 11:00',
      'No pool parties past 22:00',
    ],
    seasonalRates: {
      peakSeasonMultiplier: 1.1,
      offPeakMultiplier: 0.9,
      peakMonths: ['November', 'December', 'January', 'February'],
    },
    host: {
      id: 'host-blr-radha',
      name: 'Radha Krishnan',
      superhost: true,
      verified: true,
      responseRate: 99,
      responseTime: 'within 10 minutes',
      avatar: '/images/crafts-artisan-hands.jpg',
      bio: 'Architect and urban botanist. I designed this villa to bring tropical calm and productivity together in the heart of Bangalore.',
      joinedYear: 2021,
    },
    rooms: [
      {
        id: 'rm-blr-01',
        name: 'The Courtyard Garden Suite',
        type: 'Garden King Suite',
        basePricePerNight: 8000,
        maxGuests: 2,
        bedConfig: '1 King Bed',
        sizeSqFt: 500,
        amenities: ['Private Garden Patio', 'Rain Shower', 'Standing Desk', 'Espresso Machine'],
        images: ['/images/stays/bengaluru-villa.jpg'],
        description: 'Wake to singing birds and direct views of the lotus pond and plunge pool.',
      },
    ],
    experienceAddOns: [
      { id: 'exp-blr-01', title: 'Artisanal Filter Coffee & Karnataka Breakfast Tasting', pricePerPerson: 650, desc: 'Freshly roasted single-estate Chikmagalur coffee brewed to perfection with traditional breakfast.', category: 'culinary' },
    ],
  },

  // ── 8. KERALA: Backwater Heritage Nalukettu & Spice Estate ──────────────────
  {
    id: 'prop-kerala-heritage',
    slug: 'kerala-backwater-nalukettu',
    name: 'Backwater Heritage Nalukettu & Spice Estate',
    city: 'Kumarakom',
    state: 'Kerala',
    country: 'India',
    hubZone: 'Kerala',
    propertyType: 'heritage_manor',
    category: 'heritage',
    secondaryCategories: ['houseboats', 'buyouts'],
    discoveryCollections: [
      'guest_favourites',
      'homestays',
      'farmstays',
      'romantic',
      'family_friendly',
      'unique_stays',
    ],
    tagline: 'Centuries-old wooden Nalukettu manor with private backwater dock, Ayurvedic pavilion & spice garden',
    description:
      'A restored 150-year-old architectural marvel crafted from seasoned teak and anjili wood in Kumarakom, on the peaceful shores of Vembanad Lake. Features an authentic central Nadumuttam courtyard, private lotus pond, dedicated Ayurvedic wellness therapist, and private wooden country boat for backwater explorations.',
    locationNote: 'Kumarakom North, Kottayam, Kerala 686563 — Lake Vembanad Frontage',
    addressLine: 'Vembanad Waterway Road, Kumarakom, Kerala 686563',
    latitude: 9.6175,
    longitude: 76.4301,
    mapUrl: 'https://maps.google.com/?q=Kumarakom+Kerala',
    rating: 4.97,
    reviewsCount: 105,
    ratingsBreakdown: {
      cleanliness: 4.99,
      accuracy: 4.97,
      communication: 4.99,
      location: 4.98,
      checkIn: 4.98,
      value: 4.94,
    },
    reviews: [
      {
        id: 'rev-ker-01',
        guestName: 'David & Claire Dupont',
        guestCity: 'Paris',
        date: 'February 2026',
        rating: 5,
        title: 'Authentic paradise',
        comment:
          'The wooden architecture is magnificent. Eating fresh Karimeen fish cooked in banana leaf on the lakeside deck while watching traditional houseboats glide past was breathtaking.',
      },
    ],
    curatedCollection: true,
    workFriendly: true,
    instantBook: true,
    freeCancellation: true,
    cancellationPolicy: 'Moderate',
    cancellationDetails: 'Full refund up to 5 days prior to check-in.',
    wifiSpeedMbps: 200,
    bedrooms: 4,
    beds: 5,
    baths: 4,
    maxTotalGuests: 8,
    squareFeet: 4200,
    estateBuyoutPrice: 34000,
    cleaningFee: 2000,
    securityDeposit: 8000,
    featuredImage: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=1600&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1602002418082-a4443e081dd1?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=85',
    ],
    propertyAmenities: [
      'Authentic Open-to-Sky Nadumuttam Courtyard',
      'Private Jetty on Lake Vembanad with Country Canoe',
      'Organic Ayurvedic Kitchen & Master Cook Included',
      'Spice Garden with Cardamom, Pepper & Vanilla Vines',
      '200 Mbps Fiber Internet & Lakeside Veranda Desk',
      'Complimentary Sunset Backwater Canoe Cruise',
    ],
    accessibilityFeatures: [
      'Paved ramp connecting car arrival to central courtyard',
      'Ground-floor heritage suite with step-free entry',
    ],
    houseRules: [
      'Check-in: 14:00 | Check-out: 11:00',
      'Shoes removed at wooden veranda per Kerala custom',
    ],
    seasonalRates: {
      peakSeasonMultiplier: 1.3,
      offPeakMultiplier: 0.8,
      peakMonths: ['October', 'November', 'December', 'January', 'February'],
    },
    host: {
      id: 'host-ker-menon',
      name: 'Unnikrishnan Menon',
      superhost: true,
      verified: true,
      responseRate: 98,
      responseTime: 'within 15 minutes',
      avatar: '/images/crafts-artisan-hands.jpg',
      bio: 'Preserving our family’s ancestral Nalukettu estate and culinary traditions of Central Travancore.',
      joinedYear: 2020,
    },
    rooms: [
      {
        id: 'rm-ker-01',
        name: 'The Lakefront Padippura Suite',
        type: 'Heritage Suite',
        basePricePerNight: 8500,
        maxGuests: 2,
        bedConfig: '1 Antique Teak King Bed',
        sizeSqFt: 460,
        amenities: ['Direct Lake Frontage', 'Open-to-Sky Bath', 'Copper Urli', 'Veranda Daybed'],
        images: ['/images/stays/kerala-heritage.jpg'],
        description: 'Wake to mist rising over Lake Vembanad with breeze whistling through carved timber eaves.',
      },
    ],
    experienceAddOns: [
      { id: 'exp-ker-01', title: 'Traditional Karimeen Pollichathu Cooking Masterclass', pricePerPerson: 1100, desc: 'Fresh pearl spot fish marinated in shallots and ginger, wrapped in tender plantain leaf and slow-roasted on hot clay.', category: 'culinary' },
    ],
  },

  // ── 9. GLOBAL: Downtown Burj Skyline Sky Villa (Dubai) ─────────────────────
  {
    id: 'prop-dubai-skyvilla',
    slug: 'dubai-downtown-sky-villa',
    name: 'Downtown Burj Skyline Sky Villa & Boardroom',
    city: 'Dubai',
    state: 'Dubai',
    country: 'United Arab Emirates',
    hubZone: 'Global',
    propertyType: 'penthouse',
    category: 'global',
    secondaryCategories: ['corporate_suites', 'buyouts'],
    discoveryCollections: [
      'guest_favourites',
      'villas_private',
      'romantic',
      'work_friendly',
      'group_trips',
      'accessible',
      'unique_stays',
    ],
    tagline: 'Ultra-luxury penthouse with private infinity plunge pool, Burj Khalifa vista & DIFC executive boardroom',
    description:
      'Elevated penthouse living in the heart of Downtown Dubai, moments from the DIFC financial hub and Dubai Mall. Floor-to-ceiling glass reveals breathtaking panoramas of the Burj Khalifa and the Arabian Gulf. Features a private heated sky plunge pool, 10-seat executive conference boardroom, and dedicated 24/7 lifestyle concierge.',
    locationNote: 'Downtown / DIFC Corridor, Dubai — 5 mins from Dubai Mall & Trade Centre',
    addressLine: 'Sheikh Mohammed bin Rashid Blvd, Downtown Dubai, UAE',
    latitude: 25.1972,
    longitude: 55.2744,
    mapUrl: 'https://maps.google.com/?q=Downtown+Dubai',
    rating: 4.98,
    reviewsCount: 68,
    ratingsBreakdown: {
      cleanliness: 5.0,
      accuracy: 4.99,
      communication: 4.98,
      location: 5.0,
      checkIn: 4.99,
      value: 4.93,
    },
    reviews: [
      {
        id: 'rev-dxb-01',
        guestName: 'Zaid Al-Mansoor',
        guestCity: 'Riyadh',
        date: 'October 2026',
        rating: 5,
        title: 'Unrivaled view and privacy',
        comment:
          'The infinity plunge pool facing the Burj Khalifa light show at night is magnificent. Private elevator straight into the penthouse. The concierge organized Rolls Royce airport transfer without a hitch.',
      },
    ],
    curatedCollection: true,
    workFriendly: true,
    instantBook: true,
    freeCancellation: true,
    cancellationPolicy: 'Moderate',
    cancellationDetails: 'Full refund up to 7 days before check-in.',
    wifiSpeedMbps: 1000,
    bedrooms: 4,
    beds: 5,
    baths: 5,
    maxTotalGuests: 8,
    squareFeet: 5800,
    estateBuyoutPrice: 49500,
    cleaningFee: 3500,
    securityDeposit: 20000,
    featuredImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85',
    ],
    propertyAmenities: [
      'Private High-Altitude Plunge Pool Overlooking Burj Khalifa',
      '1 Gbps Ultra-High-Speed Dedicated Mesh Wi-Fi',
      '10-Seat Executive Strategy Boardroom & Smart AV Wall',
      'Corporate VAT Invoicing for UAE & International Travel',
      'Airport VIP Chauffeur Transfer (Dubai DXB)',
      '24/7 Dedicated Lifestyle Concierge',
    ],
    accessibilityFeatures: [
      'Direct private high-speed elevator into penthouse lobby',
      'Zero-threshold balconies and roll-in master bathroom',
    ],
    houseRules: [
      'Check-in: 15:00 | Check-out: 12:00',
      'Respect residential building quiet guidelines',
    ],
    seasonalRates: {
      peakSeasonMultiplier: 1.3,
      offPeakMultiplier: 0.8,
      peakMonths: ['November', 'December', 'January', 'February', 'March'],
    },
    host: {
      id: 'host-dxb-elite',
      name: 'Nuty Tales Global Concierge',
      superhost: true,
      verified: true,
      responseRate: 100,
      responseTime: 'within 5 minutes',
      avatar: '/images/logo.jpg',
      bio: 'Curating world-class luxury residences and executive suites for global travellers in Dubai and London.',
      joinedYear: 2021,
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
      { id: 'exp-dxb-01', title: 'Private Chauffeur Airport Escort (Rolls Royce / Maybach)', pricePerPerson: 4200, desc: 'Seamless VIP airport transit directly to the sky villa with luggage porterage.', category: 'transfer' },
    ],
  },

  // ── 10. GLOBAL: Kensington Heritage Mews & Residence (London) ──────────────
  {
    id: 'prop-london-mews',
    slug: 'kensington-mews-residence',
    name: 'Kensington Heritage Mews & Residence',
    city: 'London',
    state: 'Greater London',
    country: 'United Kingdom',
    hubZone: 'Global',
    propertyType: 'heritage_manor',
    category: 'global',
    secondaryCategories: ['heritage', 'corporate_suites'],
    discoveryCollections: [
      'guest_favourites',
      'villas_private',
      'romantic',
      'work_friendly',
      'family_friendly',
      'unique_stays',
    ],
    tagline: 'Quiet Victorian mews house with private garden courtyard, library study & high-speed mesh',
    description:
      'Tucked away on a tranquil private cobbled mews in South Kensington, steps from Hyde Park and London’s world-renowned museum quarter. A three-storey Victorian townhouse featuring an enclosed private garden patio with fire pit, bespoke book-lined study, cast-iron fireplace, and high-speed gigabit Wi-Fi.',
    locationNote: 'South Kensington / Knightsbridge, London — 3 mins from Gloucester Road Station',
    addressLine: 'Queen’s Gate Mews, South Kensington, London SW7 5QJ',
    latitude: 51.4988,
    longitude: -0.1789,
    mapUrl: 'https://maps.google.com/?q=Queens+Gate+Mews+London',
    rating: 4.95,
    reviewsCount: 52,
    ratingsBreakdown: {
      cleanliness: 4.98,
      accuracy: 4.96,
      communication: 4.97,
      location: 5.0,
      checkIn: 4.96,
      value: 4.91,
    },
    reviews: [
      {
        id: 'rev-ldn-01',
        guestName: 'Sarah Jenkins',
        guestCity: 'Edinburgh',
        date: 'September 2026',
        rating: 5,
        title: 'Quintessential London charm',
        comment:
          'Absolute silence in the middle of Kensington! The private courtyard garden was heavenly for morning tea, and having a dedicated study made working remotely in London a pleasure.',
      },
    ],
    curatedCollection: true,
    workFriendly: true,
    instantBook: true,
    freeCancellation: true,
    cancellationPolicy: 'Flexible',
    cancellationDetails: 'Full refund up to 48 hours prior to check-in.',
    wifiSpeedMbps: 350,
    bedrooms: 3,
    beds: 4,
    baths: 3,
    maxTotalGuests: 6,
    squareFeet: 2800,
    estateBuyoutPrice: 42000,
    cleaningFee: 2500,
    securityDeposit: 15000,
    featuredImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1502005229762-ee1b2b9ba58f?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=85',
    ],
    propertyAmenities: [
      'Private Cobblestone Mews with Dedicated Parking',
      'Book-Lined Study with High-Speed Mesh & Work Desk',
      'Private Enclosed Courtyard Garden with Outdoor Fire Pit',
      'Self Check-In Smart Keyless Entry & Security System',
      'Complimentary English Tea & Nuty Tales Gourmet Roasted Nuts',
      'Corporate VAT Invoicing for Global Business Travelers',
    ],
    accessibilityFeatures: [
      'Ground floor living, dining, and courtyard on single level',
    ],
    houseRules: [
      'Check-in: 15:00 | Check-out: 11:00',
      'Cobblestone mews quiet hours after 22:00',
    ],
    seasonalRates: {
      peakSeasonMultiplier: 1.2,
      offPeakMultiplier: 0.9,
      peakMonths: ['May', 'June', 'July', 'August', 'December'],
    },
    host: {
      id: 'host-ldn-olivia',
      name: 'Olivia Thornton',
      superhost: true,
      verified: true,
      responseRate: 98,
      responseTime: 'within 15 minutes',
      avatar: '/images/crafts-artisan-hands.jpg',
      bio: 'Interior designer and lifelong Londoner passionate about heritage restoration and bespoke stays.',
      joinedYear: 2022,
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
      { id: 'exp-ldn-01', title: 'Traditional High Tea Hamper with Kashmiri Saffron Treats', pricePerPerson: 1600, desc: 'Curated British scones, clotted cream, Kashmiri saffron shortbread, and royal single-estate teas.', category: 'culinary' },
    ],
  },

  // ── 8. HIMACHAL ANCHOR: Solang Cedar Alpine Chalet ─────────────────────────
  {
    id: 'prop-himachal-solang',
    slug: 'solang-cedar-chalet',
    name: 'Solang Cedar Alpine Chalet & Outdoor Spa',
    city: 'Manali',
    state: 'Himachal Pradesh',
    country: 'India',
    hubZone: 'Himachal',
    propertyType: 'chalet',
    category: 'ski_chalets',
    secondaryCategories: ['buyouts', 'orchards'],
    discoveryCollections: [
      'mountain_escapes',
      'guest_favourites',
      'villas_private',
      'romantic',
      'family_friendly',
      'unique_stays',
    ],
    tagline: 'High-altitude cedar ski chalet overlooking snow-capped Rohtang Pass ridges',
    description:
      'Set on private apple terraced slopes in Solang Valley, Manali. Handcrafted out of native deodar wood and mountain river rock, featuring an outdoor heated cedar soaking tub, floor-to-ceiling panoramic glass windows, and underfloor radiant heating. Dedicated mountain chef, guided ski trails, and private evening bonfires.',
    locationNote: 'Solang Valley Ski Road, Upper Manali, Himachal Pradesh 175131',
    addressLine: 'The Cedar Ridge, Solang Valley, Manali, HP 175131',
    latitude: 32.3166,
    longitude: 77.1558,
    mapUrl: 'https://maps.google.com/?q=Solang+Valley+Manali',
    rating: 4.96,
    reviewsCount: 38,
    ratingsBreakdown: {
      cleanliness: 5.0,
      accuracy: 4.9,
      communication: 5.0,
      location: 5.0,
      checkIn: 4.9,
      value: 4.8,
    },
    reviews: [
      {
        id: 'rev-solang-01',
        guestName: 'Rohan & Malini Mehra',
        guestCity: 'Chandigarh',
        date: 'October 2026',
        rating: 5,
        title: 'Unbelievable mountain views and heated cedar tub',
        comment: 'Waking up to the Rohtang snow peaks through the bedroom glass wall was breathtaking. The outdoor cedar tub with pine scent was the highlight of our trip.',
        hostResponse: 'Thank you Rohan! Delighted you enjoyed the heated cedar soak after your hike.',
      },
    ],
    curatedCollection: true,
    workFriendly: true,
    instantBook: true,
    freeCancellation: true,
    cancellationPolicy: 'Moderate',
    cancellationDetails: 'Full refund up to 5 days prior to check-in. 50% refund thereafter.',
    wifiSpeedMbps: 250,
    bedrooms: 4,
    beds: 5,
    baths: 4,
    maxTotalGuests: 10,
    squareFeet: 3400,
    estateBuyoutPrice: 28500,
    cleaningFee: 2000,
    securityDeposit: 8000,
    featuredImage: '/images/stays/gulmarg-ski-chalet.jpg',
    galleryImages: [
      '/images/stays/gulmarg-ski-chalet.jpg',
      '/images/stays/kashmir-orchard-estate.jpg',
      '/images/crafts-kashmir-landscape.jpg',
      '/images/brand-showcase-collage.jpg',
    ],
    propertyAmenities: [
      'Outdoor Heated Cedar Soaking Tub',
      'Floor-to-Ceiling Glass Mountain Panorama',
      'Underfloor Radiant Heating & Bukhari',
      'In-House Mountain Chef & Daily Breakfast',
      'High-Speed 250 Mbps Fiber Wi-Fi',
      'Private 4x4 Snow Vehicle Parking',
      'Ski Gear Drying & Storage Room',
      'Private Evening Applewood Bonfire Deck',
    ],
    accessibilityFeatures: ['Step-free ground floor suite', 'Level entry parking'],
    houseRules: [
      'No smoking inside cedar chambers',
      'Outdoor deck quiet hours after 22:30',
      'Snow gear to be kept in designated drying room',
    ],
    seasonalRates: {
      peakSeasonMultiplier: 1.3,
      offPeakMultiplier: 0.85,
      peakMonths: ['December', 'January', 'February', 'June'],
    },
    host: {
      id: 'host-solang-vikram',
      name: 'Vikram Thakur',
      superhost: true,
      verified: true,
      responseRate: 99,
      responseTime: 'within 10 minutes',
      avatar: '/images/founders-portrait-hero.jpg',
      bio: 'Lifelong Himalayan mountaineer and apple orchard custodian dedicated to authentic mountain hospitality.',
      joinedYear: 2021,
    },
    rooms: [
      {
        id: 'rm-solang-01',
        name: 'The Rohtang Ridge Master Suite',
        type: 'Alpine Master Chamber',
        basePricePerNight: 9500,
        maxGuests: 2,
        bedConfig: '1 King Bed',
        sizeSqFt: 550,
        amenities: ['Private Balcony', 'Wood-burning Fireplace', 'Soaking Tub with View'],
        images: ['/images/stays/gulmarg-ski-chalet.jpg'],
        description: 'Spectacular master suite with glass corners gazing directly at Solang mountain slopes.',
      },
    ],
    experienceAddOns: [
      { id: 'exp-solang-01', title: 'Guided Ski & Snowshoe Trail in Solang Valley', pricePerPerson: 2200, desc: 'Certified local alpine guide with equipment fitting for powder slopes.', category: 'excursion' },
      { id: 'exp-solang-02', title: 'Himachali Dham Feast Cooked Over Wood Fire', pricePerPerson: 1400, desc: 'Traditional festive mountain banquet with Madra, Babru, and local mountain greens.', category: 'culinary' },
    ],
  },

  // ── 9. GOA ANCHOR: Villa Siolim Casa Grande ─────────────────────────────────
  {
    id: 'prop-goa-siolim',
    slug: 'villa-siolim-casa-grande',
    name: 'Villa Siolim Casa Grande & Private Pool',
    city: 'Siolim',
    state: 'Goa',
    country: 'India',
    hubZone: 'Goa',
    propertyType: 'villa',
    category: 'heritage',
    secondaryCategories: ['buyouts'],
    discoveryCollections: [
      'villas_private',
      'guest_favourites',
      'romantic',
      'family_friendly',
      'group_trips',
      'unique_stays',
    ],
    tagline: 'Restored 19th-century Portuguese manor with lap pool, tropical garden & butler',
    description:
      'An exquisite five-chamber Portuguese heritage estate nestled under swaying coconut palms in serene Siolim, North Goa. High terracotta tiled ceilings, mother-of-pearl oyster shell windows, deep shade verandas, private turquoise pool, and in-house Goan-Portuguese private chef.',
    locationNote: 'Tembwaddo, Siolim, North Goa 403517 (15 mins to Morjim & Vagator)',
    addressLine: 'Casa Grande, Tembwaddo, Siolim, Goa 403517',
    latitude: 15.6267,
    longitude: 73.7667,
    mapUrl: 'https://maps.google.com/?q=Siolim+Goa',
    rating: 4.98,
    reviewsCount: 44,
    ratingsBreakdown: {
      cleanliness: 5.0,
      accuracy: 5.0,
      communication: 5.0,
      location: 4.9,
      checkIn: 5.0,
      value: 4.9,
    },
    reviews: [
      {
        id: 'rev-siolim-01',
        guestName: 'Ananya Deshmukh',
        guestCity: 'Mumbai',
        date: 'September 2026',
        rating: 5,
        title: 'The most peaceful, private villa in North Goa',
        comment: 'The estate feels completely secluded yet is close to Siolim bridge and beaches. Chef Anthony prepared the freshest coastal fish curry and poi bread every afternoon.',
        hostResponse: 'Thank you Ananya! Chef Anthony was delighted to host your family.',
      },
    ],
    curatedCollection: true,
    workFriendly: true,
    instantBook: true,
    freeCancellation: true,
    cancellationPolicy: 'Moderate',
    cancellationDetails: 'Full refund up to 5 days before check-in.',
    wifiSpeedMbps: 300,
    bedrooms: 5,
    beds: 6,
    baths: 5,
    maxTotalGuests: 12,
    squareFeet: 4500,
    estateBuyoutPrice: 38000,
    cleaningFee: 2500,
    securityDeposit: 10000,
    featuredImage: '/images/stays/kashmir-orchard-estate.jpg',
    galleryImages: [
      '/images/stays/kashmir-orchard-estate.jpg',
      '/images/stays/cedar-houseboat.jpg',
      '/images/brand-showcase-collage.jpg',
      '/images/campaign-stay-in-the-story.jpg',
    ],
    propertyAmenities: [
      'Private 40ft Turquoise Swimming Pool',
      'In-House Private Chef & Daily Breakfast',
      'Dedicated House Butler & Housekeeping',
      'Tropical Palm Garden with Outdoor Dining',
      'Gigabit 300 Mbps Fiber Wi-Fi with Power Backup',
      'Bespoke Cocktails & Barbeque Deck',
      'Ensuite Walk-in Rain Showers in All 5 Suites',
      'Gated Security & Chauffeur Parking',
    ],
    accessibilityFeatures: ['Ground floor suites with step-free pool access'],
    houseRules: [
      'Pool area quiet hours after 23:00',
      'Respectful noise levels in tranquil heritage village',
    ],
    seasonalRates: {
      peakSeasonMultiplier: 1.4,
      offPeakMultiplier: 0.8,
      peakMonths: ['November', 'December', 'January', 'February'],
    },
    host: {
      id: 'host-goa-fernandes',
      name: 'Maria Fernandes',
      superhost: true,
      verified: true,
      responseRate: 99,
      responseTime: 'within 5 minutes',
      avatar: '/images/crafts-artisan-hands.jpg',
      bio: 'Goan heritage architecture conservator and curator of boutique private residences.',
      joinedYear: 2020,
    },
    rooms: [
      {
        id: 'rm-siolim-01',
        name: 'The Balcao Master Suite',
        type: 'Heritage Garden Suite',
        basePricePerNight: 9800,
        maxGuests: 2,
        bedConfig: '1 Four-Poster King Bed',
        sizeSqFt: 600,
        amenities: ['Private Balcao Veranda', 'Garden View', 'Oyster Shell Windows'],
        images: ['/images/stays/kashmir-orchard-estate.jpg'],
        description: 'Stunning four-poster teakwood suite opening directly onto fragrant frangipani lawns.',
      },
    ],
    experienceAddOns: [
      { id: 'exp-goa-01', title: 'Private Chapora River Sunset Catamaran Cruise', pricePerPerson: 3500, desc: 'Exclusive 2-hour private boat charter with coastal appetizers and wine.', category: 'excursion' },
      { id: 'exp-goa-02', title: 'Traditional Goan Seafood & Vegetarian Masterclass', pricePerPerson: 1800, desc: 'Cooking session with Chef Anthony using hand-ground spices and clay pots.', category: 'culinary' },
    ],
  },

  // ── 10. JAIPUR ANCHOR: The Amber Courtyard Haveli ──────────────────────────
  {
    id: 'prop-jaipur-amber',
    slug: 'haveli-amber-heritage',
    name: 'The Amber Courtyard Haveli & Plunge Pool',
    city: 'Jaipur',
    state: 'Rajasthan',
    country: 'India',
    hubZone: 'Jaipur',
    propertyType: 'heritage_manor',
    category: 'heritage',
    secondaryCategories: ['buyouts', 'corporate_suites'],
    discoveryCollections: [
      'guest_favourites',
      'villas_private',
      'romantic',
      'unique_stays',
      'destination_weddings',
    ],
    tagline: '18th-century Rajput sandstone haveli with hand-carved jharokhas beneath Amber Fort',
    description:
      'Step into royal Rajputana in this meticulously restored heritage courtyard haveli beneath the ramparts of Amber Fort. Features yellow sandstone arches, central marble fountain, private rooftop sunset lounge, and discrete Rajput butler hospitality.',
    locationNote: 'Amber Fort Heritage Enclave, Jaipur, Rajasthan 302028',
    addressLine: 'Haveli Mohalla, Amber, Jaipur, Rajasthan 302028',
    latitude: 26.9855,
    longitude: 75.8513,
    mapUrl: 'https://maps.google.com/?q=Amber+Fort+Jaipur',
    rating: 4.95,
    reviewsCount: 31,
    ratingsBreakdown: {
      cleanliness: 4.9,
      accuracy: 5.0,
      communication: 5.0,
      location: 5.0,
      checkIn: 4.9,
      value: 4.8,
    },
    reviews: [
      {
        id: 'rev-amber-01',
        guestName: 'Kunal Singhania',
        guestCity: 'New Delhi',
        date: 'October 2026',
        rating: 5,
        title: 'Like living inside a royal Rajput palace',
        comment: 'The rooftop dinner overlooking the illuminated Amber Fort was an unforgettable sight. The staff treated us like royalty.',
        hostResponse: 'Khamma Ghani Kunal! It was a true pleasure hosting your family in Amber.',
      },
    ],
    curatedCollection: true,
    workFriendly: true,
    instantBook: true,
    freeCancellation: true,
    cancellationPolicy: 'Moderate',
    cancellationDetails: 'Full refund up to 5 days before arrival.',
    wifiSpeedMbps: 200,
    bedrooms: 4,
    beds: 5,
    baths: 4,
    maxTotalGuests: 10,
    squareFeet: 3800,
    estateBuyoutPrice: 32000,
    cleaningFee: 2000,
    securityDeposit: 8000,
    featuredImage: '/images/crafts-kashmir-landscape.jpg',
    galleryImages: [
      '/images/crafts-kashmir-landscape.jpg',
      '/images/brand-showcase-collage.jpg',
      '/images/stays/kashmir-orchard-estate.jpg',
      '/images/campaign-stay-in-the-story.jpg',
    ],
    propertyAmenities: [
      'Private Marble Courtyard with Plunge Pool',
      'Amber Fort Illuminated View Rooftop Terrace',
      'Rajput Royal Butler & Heritage Chef Service',
      'Hand-Carved Sandstone Jharokhas & Jali Work',
      'Fiber Wi-Fi & Dedicated Study Alcoves',
      'Daily Royal Rajasthani Breakfast Included',
      'Private Chauffeur Valet Parking',
    ],
    accessibilityFeatures: ['Ground floor courtyard suites'],
    houseRules: [
      'Heritage preservation: no loud amplification in courtyard after 22:00',
    ],
    seasonalRates: {
      peakSeasonMultiplier: 1.35,
      offPeakMultiplier: 0.8,
      peakMonths: ['October', 'November', 'December', 'January', 'February'],
    },
    host: {
      id: 'host-amber-singh',
      name: 'Rathore Gajendra Singh',
      superhost: true,
      verified: true,
      responseRate: 98,
      responseTime: 'within 15 minutes',
      avatar: '/images/crafts-artisan-hands.jpg',
      bio: 'Custodian of Amber ancestral residences and royal Rajasthan cultural historian.',
      joinedYear: 2019,
    },
    rooms: [
      {
        id: 'rm-amber-01',
        name: 'The Jharokha Fortview Suite',
        type: 'Sandstone Heritage Suite',
        basePricePerNight: 9500,
        maxGuests: 2,
        bedConfig: '1 Royal King Bed',
        sizeSqFt: 520,
        amenities: ['Private Fort View Jharokha', 'Marble Bath', 'Fountain Courtyard Access'],
        images: ['/images/crafts-kashmir-landscape.jpg'],
        description: 'Intricate sandstone carving and stained-glass alcove overlooking Amber Fort hills.',
      },
    ],
    experienceAddOns: [
      { id: 'exp-amber-01', title: 'Royal Rajput Thali Dinner Under Fort Lights', pricePerPerson: 1800, desc: 'Multi-course royal feast served on rooftop with private candlelights.', category: 'culinary' },
      { id: 'exp-amber-02', title: 'Private Heritage Walk of Amber Old Town & Baori Stepwells', pricePerPerson: 1200, desc: 'Curator walk through ancient stepwells and hidden temple courtyards.', category: 'excursion' },
    ],
  },
]

// ── Bookable Travel Services Catalogue ──────────────────────────────────────────
export interface TravelServiceItem {
  id: string
  title: string
  category: 'transfer' | 'culinary' | 'guide' | 'equipment' | 'excursion'
  categoryLabel: string
  hubZone: 'Kashmir' | 'Delhi-NCR' | 'Patna' | 'Bengaluru' | 'Kerala' | 'Jaipur' | 'Himachal' | 'Goa' | 'Global'
  tagline: string
  description: string
  price: number
  unit: string
  image: string
  duration: string
  includedFeatures: string[]
}

export const BOOKABLE_TRAVEL_SERVICES: TravelServiceItem[] = [
  {
    id: 'srv-4x4-snow-convoy',
    title: '4x4 Heated Snow Convoy & Chauffeur Airport Escort',
    category: 'transfer',
    categoryLabel: 'Chauffeured Transit',
    hubZone: 'Kashmir',
    tagline: 'Private 4WD all-wheel heated convoy from Srinagar Airport to Harwan, Gulmarg & Pahalgam',
    description: 'Travel in luxury and total security through mountain snow passes with experienced high-altitude chauffeurs, heated leather seating, snow chains, and warm spiced saffron tea served on arrival.',
    price: 3500,
    unit: 'per vehicle / trip',
    image: '/images/stays/kashmir-orchard-estate.jpg',
    duration: 'Airport to Estate (approx 50 mins)',
    includedFeatures: ['Flight tracking & gate pickup', 'Luggage assistance & porterage', 'Sub-zero heated cabin with Wi-Fi', 'Snow chain equipment & experienced mountain driver'],
  },
  {
    id: 'srv-wazwan-master-chef',
    title: 'Master Waza In-Chamber 7-Course Wazwan Experience',
    category: 'culinary',
    categoryLabel: 'Royal Private Dining',
    hubZone: 'Kashmir',
    tagline: 'Authentic Kashmiri royal banquet prepared fresh in your estate kitchen by hereditary master chefs',
    description: 'An unforgettable cultural feast served on traditional embossed copper tramis with Tash-t-Nari handwashing ritual. Includes Rista, Rogan Josh, Daniwal Korma, Tabakhmaaz, Aab Gosh, and Phirni.',
    price: 2500,
    unit: 'per guest',
    image: '/images/crafts-kashmir-landscape.jpg',
    duration: '3 hours dining ritual',
    includedFeatures: ['Authentic copper trami & samovar service', 'Master Waza culinary team and servers', 'Free-range organic ingredients', 'Choice of Wazwan or royal vegetarian options'],
  },
  {
    id: 'srv-guided-walnut-harvest',
    title: 'Guided Walnut & Saffron Harvest Walk with Horticulturist',
    category: 'excursion',
    categoryLabel: 'Agricultural Heritage',
    hubZone: 'Kashmir',
    tagline: 'Crack fresh Kagzi walnuts directly off 100-year-old trees and taste raw single-origin mountain honey',
    description: 'Explore the 4-acre Harwan orchard estate with our master botanist. Learn the art of walnut shaking, sun drying, and traditional wooden pressing while sampling wild berries and saffron.',
    price: 950,
    unit: 'per guest',
    image: '/images/brand-showcase-collage.jpg',
    duration: '2.5 hours',
    includedFeatures: ['Freshly harvested walnuts to take home', 'Raw single-origin honey tasting', 'Botanist guided storytelling', 'Freshly brewed kehwa & bakery treats'],
  },
  {
    id: 'srv-ski-butler-gondola',
    title: 'Gulmarg Ski Gear Butler & VIP Gondola Pass Concierge',
    category: 'equipment',
    categoryLabel: 'Mountain Concierge',
    hubZone: 'Kashmir',
    tagline: 'Custom fitted powder skis, boots, and fast-track Gondola pass coordination delivered to your chalet',
    description: 'Skip the freezing rental queues. Our ski butler fits world-class powder skis, poles, and heated boots in your chalet living room, and coordinates daily ski guide passes for Phase 1 & Phase 2.',
    price: 4200,
    unit: 'per skier / day',
    image: '/images/stays/gulmarg-ski-chalet.jpg',
    duration: 'Full Day (08:30 - 17:00)',
    includedFeatures: ['In-chalet precision boot fitting', 'Latest season powder skis & poles', 'Gondola pass fast-track queue support', 'Ski drying & storage after every run'],
  },
]

// ── Curated Split-Stay Itineraries ─────────────────────────────────────────────
export interface SplitStaySuggestion {
  id: string
  title: string
  tagline: string
  totalNights: number
  stays: {
    propertySlug: string
    propertyName: string
    city: string
    nights: number
    image: string
  }[]
  combinedCostEst: number
  highlight: string
}

export const CURATED_SPLIT_STAYS: SplitStaySuggestion[] = [
  {
    id: 'split-kashmir-orchard-ski',
    title: 'The Kashmir Alpine Duo: Orchard Heritage & Ski Chalet',
    tagline: '3 Nights at Harwan Walnut Orchard (Srinagar) + 2 Nights at Gulmarg Ski Chalet',
    totalNights: 5,
    stays: [
      {
        propertySlug: 'harwan-orchard-estate',
        propertyName: 'The Harwan Royal Walnut Orchard Estate',
        city: 'Srinagar',
        nights: 3,
        image: '/images/stays/kashmir-orchard-estate.jpg',
      },
      {
        propertySlug: 'gulmarg-ski-chalet',
        propertyName: 'The Gulmarg Pine Ridge Ski Chalet & Spa',
        city: 'Gulmarg',
        nights: 2,
        image: '/images/stays/gulmarg-ski-chalet.jpg',
      },
    ],
    combinedCostEst: 61500,
    highlight: 'Experience tranquil autumn harvest walks beneath Zabarwan peaks, followed by high-altitude powder skiing and outdoor hot tub soak in Gulmarg.',
  },
  {
    id: 'split-kashmir-water-valley',
    title: 'Lake & Glacial River: Cedar Houseboat + Lidder Pine Villa',
    tagline: '2 Nights on Nigeen Lake Houseboat + 3 Nights at Lidder Riverfront (Pahalgam)',
    totalNights: 5,
    stays: [
      {
        propertySlug: 'zest-e-nigeen-houseboat',
        propertyName: 'Zest-e-Nigeen Royal Cedar Houseboat',
        city: 'Srinagar',
        nights: 2,
        image: '/images/stays/cedar-houseboat.jpg',
      },
      {
        propertySlug: 'lidder-pine-riverfront-estate',
        propertyName: 'Lidder Pine Riverfront Villa & Meadow',
        city: 'Pahalgam',
        nights: 3,
        image: '/images/crafts-kashmir-landscape.jpg',
      },
    ],
    combinedCostEst: 46400,
    highlight: 'Glide silently across lotus mirrors on Nigeen Lake, then head into the deep pine valley of Pahalgam for wild trout fishing and campfire Wazwan.',
  },
]
