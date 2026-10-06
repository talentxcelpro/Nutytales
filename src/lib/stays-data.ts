// ─── Nutty Tales Boutique Stays & Hospitality Engine ─────────────────────────
// Properties in Srinagar (Kashmir), Noida (Delhi NCR), and Patna (Bihar)

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
  tagline: string
  locationNote: string
  featuredImage: string
  galleryImages: string[]
  rooms: StayRoom[]
  propertyAmenities: string[]
  seasonalRates: {
    peakSeasonMultiplier: number // 1.25 for Autumn/Winter in Kashmir
    offPeakMultiplier: number
    peakMonths: string[]
  }
  experienceAddOns: {
    id: string
    title: string
    pricePerPerson: number
    desc: string
  }[]
}

export const STAY_PROPERTIES: StayProperty[] = [
  {
    id: 'prop-kashmir',
    slug: 'kashmir',
    name: 'Nutty Tales Orchard Retreat & Villa',
    city: 'Srinagar',
    state: 'Jammu & Kashmir',
    tagline: 'Private walnut & apple orchard beneath the Zabarwan range',
    locationNote: 'Harwan / Dachigam Road, 15 mins from Dal Lake & Shalimar Bagh',
    featuredImage: '/images/campaign-stay-in-the-story.jpg',
    galleryImages: [
      '/images/campaign-stay-in-the-story.jpg',
      '/images/crafts-kashmir-landscape.jpg',
      '/images/brand-showcase-collage.jpg',
    ],
    propertyAmenities: [
      'Private 4-Acre Walnut Orchard',
      'Traditional Kashmiri Bukhari (Fireplace)',
      'Complimentary Samovar Kehwa on Arrival',
      'Orchard-to-Table Traditional Wazwan & Vegetarian Dining',
      'Under-Floor Radiant Heating (Sub-Zero Winter Ready)',
      'High-Speed Wi-Fi & Workstation in All Cottages',
      'Shikara & Airport 4x4 Snow Transfer Concierge',
    ],
    seasonalRates: {
      peakSeasonMultiplier: 1.25,
      offPeakMultiplier: 0.85,
      peakMonths: ['October', 'November', 'December', 'January', 'February', 'May', 'June'],
    },
    rooms: [
      {
        id: 'rm-ksh-01',
        name: 'The Chinar Heritage Suite',
        type: 'Heritage King Suite',
        basePricePerNight: 8500,
        maxGuests: 3,
        bedConfig: '1 Royal King Bed + Daybed',
        sizeSqFt: 520,
        amenities: ['Mountain View Balcony', 'Wood-burning Fireplace', 'Hand-knotted Kashmiri Silk Rug', 'Heated Bathroom', 'Nutty Tales Gourmet Nut Minibar'],
        images: ['/images/crafts-kashmir-landscape.jpg'],
        description: 'Paneled in aged deodar cedar with handcrafted Khatamband wood ceilings. Panoramic morning views of mist rolling down the Zabarwan peaks.',
      },
      {
        id: 'rm-ksh-02',
        name: 'The Walnut Grove Cottage',
        type: 'Private Garden Cottage',
        basePricePerNight: 12500,
        maxGuests: 4,
        bedConfig: '2 Queen Beds',
        sizeSqFt: 750,
        amenities: ['Private Orchard Lawn', 'Kitchenette with Samovar', 'Deep Soaking Tub', 'Pashmina Throw Blankets', 'Radiant Heating'],
        images: ['/images/brand-showcase-collage.jpg'],
        description: 'Stand-alone cedar wood cottage nestled directly beneath century-old walnut trees. Perfect for families, artists, and winter retreats.',
      },
      {
        id: 'rm-ksh-03',
        name: 'Deluxe Valley View Room',
        type: 'Boutique Deluxe',
        basePricePerNight: 5800,
        maxGuests: 2,
        bedConfig: '1 King Bed',
        sizeSqFt: 380,
        amenities: ['Balcony with Orchard View', 'Ensuite Rain Shower', 'Heated Mattress Pad', 'Espresso & Kehwa Maker'],
        images: ['/images/crafts-winter-hero.jpg'],
        description: 'Intimate retreat with warm wool furnishings, modern bath fittings, and uninterrupted views of snow-dusted ridges.',
      },
    ],
    experienceAddOns: [
      { id: 'exp-ksh-01', title: 'Guided Walnut & Apple Harvest Walk', pricePerPerson: 800, desc: 'Walk with our horticulturists, crack fresh Kagzi walnuts directly off the tree, and sample single-origin raw honey.' },
      { id: 'exp-ksh-02', title: 'Pampore Saffron Field Excursion', pricePerPerson: 1800, desc: 'Half-day trip to the purple saffron terraces of Pampore with private tea tasting and farmer introduction.' },
      { id: 'exp-ksh-03', title: 'Sunset Shikara on Dal Lake & Char Chinar', pricePerPerson: 1500, desc: 'Private 2-hour shikara ride with steaming saffron kehwa and fresh almond cookies served on board.' },
    ],
  },
  {
    id: 'prop-noida',
    slug: 'noida',
    name: 'Nutty Tales Executive Suites',
    city: 'Noida',
    state: 'Uttar Pradesh (Delhi NCR)',
    tagline: 'Refined comfort & corporate tranquility in the heart of Sector 62',
    locationNote: 'Sector 62, Noida — 5 mins from Electronic City Metro & Corporate Hubs',
    featuredImage: '/images/hero-banner.png',
    galleryImages: ['/images/hero-banner.png', '/images/corporate-diwali-gifting.jpg'],
    propertyAmenities: [
      'Ergonomic Workstation & 300 Mbps Dedicated Fibre',
      'Complimentary Artisanal Breakfast & Cold Pressed Juices',
      'Healthy In-Room Nutty Tales Nut Bar (Almonds, Cashews, Makhana)',
      'Executive Boardroom Access (On Booking)',
      'Airport Taxi & Delhi Metro Concierge',
      '24/7 Power Backup & Sound-Isolated Glazing',
    ],
    seasonalRates: {
      peakSeasonMultiplier: 1.1,
      offPeakMultiplier: 0.9,
      peakMonths: ['October', 'November', 'December', 'January', 'February'],
    },
    rooms: [
      {
        id: 'rm-noi-01',
        name: 'The Executive Studio Suite',
        type: 'Studio Suite',
        basePricePerNight: 4200,
        maxGuests: 2,
        bedConfig: '1 King Bed',
        sizeSqFt: 420,
        amenities: ['Dual-Monitor Workdesk', 'Smart TV with Streaming', 'Soundproof Windows', 'Nutty Tales Snack Basket', 'Rain Shower'],
        images: ['/images/hero-banner.png'],
        description: 'Tailored for senior executives, visiting founders, and corporate travelers requiring silence, speed, and premium wellness.',
      },
      {
        id: 'rm-noi-02',
        name: 'Deluxe Corporate Room',
        type: 'Deluxe Room',
        basePricePerNight: 3200,
        maxGuests: 2,
        bedConfig: '1 Queen Bed',
        sizeSqFt: 320,
        amenities: ['Workstation', 'High-speed Wi-Fi', 'Complimentary Breakfast', 'Tea & Coffee Bar'],
        images: ['/images/corporate-diwali-gifting.jpg'],
        description: 'Clean, minimalist sanctuary designed for productivity and restful sleep during Delhi NCR business visits.',
      },
    ],
    experienceAddOns: [
      { id: 'exp-noi-01', title: 'Corporate Tasting Platter for Meetings', pricePerPerson: 500, desc: 'Fresh roasted and seasoned nut flights with artisanal cheeses and cold brews served in your suite.' },
    ],
  },
  {
    id: 'prop-patna',
    slug: 'patna',
    name: 'Nutty Tales Heritage Riverfront Stay',
    city: 'Patna',
    state: 'Bihar',
    tagline: 'Artisanal courtyard retreat celebrating the heritage of Mithila',
    locationNote: 'Patliputra / Riverfront Promenade, 20 mins from Patna Airport',
    featuredImage: '/images/crystal-gold-nut-bowls.jpg',
    galleryImages: ['/images/crystal-gold-nut-bowls.jpg', '/images/dark-wood-gourmet-tray.jpg'],
    propertyAmenities: [
      'Authentic Madhubani Hand-Painted Courtyard',
      'Complimentary Roasted Desi Ghee Makhana & Herbal Tea Service',
      'Ganga Riverfront Morning Walking Access',
      'High-Speed Wi-Fi & Air Conditioning',
      'Patna Airport Pick-up & Railway Transfers',
    ],
    seasonalRates: {
      peakSeasonMultiplier: 1.15,
      offPeakMultiplier: 0.9,
      peakMonths: ['October', 'November', 'December', 'January', 'March'],
    },
    rooms: [
      {
        id: 'rm-pat-01',
        name: 'Mithila Courtyard Suite',
        type: 'Heritage Suite',
        basePricePerNight: 4500,
        maxGuests: 3,
        bedConfig: '1 King Bed + Lounge Divan',
        sizeSqFt: 480,
        amenities: ['Private Verandah', 'Original Madhubani Wall Murals', 'Teak Wood Furniture', 'Artisan Brass Fittings'],
        images: ['/images/crystal-gold-nut-bowls.jpg'],
        description: 'Immersed in Bihar folklore with hand-painted murals, brass lanterns, and daily tasting bowls of roasted jumbo makhana.',
      },
      {
        id: 'rm-pat-02',
        name: 'Deluxe Heritage Room',
        type: 'Deluxe Room',
        basePricePerNight: 3000,
        maxGuests: 2,
        bedConfig: '1 Queen Bed',
        sizeSqFt: 300,
        amenities: ['Courtyard View', 'Fast Wi-Fi', 'Organic Breakfast', 'Herbal Tea Station'],
        images: ['/images/dark-wood-gourmet-tray.jpg'],
        description: 'Peaceful garden-facing room offering modern comfort with touches of traditional eastern Indian design.',
      },
    ],
    experienceAddOns: [
      { id: 'exp-pat-01', title: 'Mithila Wetland Makhana Roasting Experience', pricePerPerson: 750, desc: 'Learn the ancient art of harvesting and hand-roasting fox nuts in iron kadhais with local master artisans.' },
    ],
  },
]

export function getStayPropertyBySlug(slug: string): StayProperty | undefined {
  return STAY_PROPERTIES.find((p) => p.slug === slug)
}

export function getAllStayProperties(): StayProperty[] {
  return STAY_PROPERTIES
}

// ── Dynamic Rate & Availability Calculation ────────────────────────────────────
export function calculateStayPrice(
  property: StayProperty,
  room: StayRoom,
  checkInDate: Date,
  checkOutDate: Date,
  guestCount: number,
  selectedAddOns: string[] = []
) {
  const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime())
  const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)))

  // Check if check-in month is peak season
  const monthName = checkInDate.toLocaleString('default', { month: 'long' })
  const isPeak = property.seasonalRates.peakMonths.includes(monthName)
  const multiplier = isPeak ? property.seasonalRates.peakSeasonMultiplier : 1.0

  const roomTotal = Math.round(room.basePricePerNight * multiplier * nights)

  // Calculate add-ons
  const addOnsTotal = selectedAddOns.reduce((acc, addOnId) => {
    const addOn = property.experienceAddOns.find((a) => a.id === addOnId)
    return acc + (addOn ? addOn.pricePerPerson * guestCount : 0)
  }, 0)

  const subtotal = roomTotal + addOnsTotal
  const gst = Math.round(subtotal * 0.12) // 12% Hospitality GST
  const grandTotal = subtotal + gst

  return {
    nights,
    isPeak,
    seasonNote: isPeak ? `Peak Season Rate (+${Math.round((multiplier - 1) * 100)}%)` : 'Standard Season Rate',
    roomPricePerNight: Math.round(room.basePricePerNight * multiplier),
    roomTotal,
    addOnsTotal,
    gst,
    grandTotal,
  }
}
