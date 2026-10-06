// ─── Nutty Tales Dynamic Kashmir Travel & Tour Packages ─────────────────────────
// Connecting boutique stays, transfers, local guides, and orchard experiences

export interface TravelPackage {
  id: string
  slug: string
  title: string
  duration: string // e.g. '5 Days / 4 Nights'
  days: number
  nights: number
  tagline: string
  bestSeason: string
  basePricePerAdult: number
  featuredImage: string
  itinerary: { day: number; title: string; desc: string; stay: string }[]
  inclusions: string[]
  exclusions: string[]
}

export const KASHMIR_TRAVEL_PACKAGES: TravelPackage[] = [
  {
    id: 'trv-ksh-01',
    slug: 'kashmir-winter-wonderland',
    title: 'Kashmir Winter Wonderland & Snow Safari',
    duration: '5 Days / 4 Nights',
    days: 5,
    nights: 4,
    tagline: 'Snow-covered Gulmarg Gondola, frozen Dal Lake Shikara, and fireside bukhari warmth',
    bestSeason: 'December to March (Winter Snow Season)',
    basePricePerAdult: 24500,
    featuredImage: '/images/crafts-winter-hero.jpg',
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Srinagar & Dal Lake Shikara Sunset',
        desc: 'Private 4x4 airport pickup. Check-in to Nutty Tales Orchard Villa. Traditional Samovar kehwa reception. Sunset shikara cruise past snow-dusted houseboats.',
        stay: 'Nutty Tales Orchard Retreat & Villa, Harwan',
      },
      {
        day: 2,
        title: 'Gulmarg Alpine Snow & Gondola Heights (13,780 ft)',
        desc: 'Scenic drive to Gulmarg through pine forests draped in white. Gondola Phase 1 & 2 tickets to Mt. Apharwat. Optional skiing & snowmobiling with certified guide.',
        stay: 'Nutty Tales Orchard Retreat & Villa, Harwan',
      },
      {
        day: 3,
        title: 'Pahalgam Valley of Shepherds & Betaab Valley',
        desc: 'Day excursion along the Lidder River. Snow walks through Betaab Valley and Aru. Warm lunch of Kashmiri haakh, rajma & steaming rice.',
        stay: 'Nutty Tales Orchard Retreat & Villa, Harwan',
      },
      {
        day: 4,
        title: 'Shehr-e-Khaas Artisan Guilds & Saffron Fields',
        desc: 'Exclusive access to Kanihama Kani pashmina looms and woodcarving workshops in Downtown Srinagar. Walk the dormant saffron terraces of Pampore. Evening Wazwan dinner.',
        stay: 'Nutty Tales Orchard Retreat & Villa, Harwan',
      },
      {
        day: 5,
        title: 'Souvenir Hampers & Airport Farewell',
        desc: 'Breakfast in the walnut grove. Receive your complimentary Nutty Tales Kashmir Travel Hamper (Kagzi Walnuts, Saffron & Kehwa). Private airport transfer.',
        stay: 'Departure',
      },
    ],
    inclusions: [
      '4 Nights stay at Nutty Tales Orchard Retreat (Deluxe Room with Bukhari heating)',
      'Dedicated 4x4 Snow-Equipped SUV with professional driver for all 5 days',
      'Daily authentic Kashmiri breakfasts and evening artisanal kehwa with almond cookies',
      'Gulmarg Gondola Phase 1 priority reservation assistance',
      'Private 2-hour Dal Lake Shikara ride with blankets and kehwa',
      'Complimentary Nutty Tales Travel Hamper (Value ₹2,500)',
      'Airport pick-up and drop-off',
    ],
    exclusions: ['Airfare to Srinagar', 'Personal skiing gear rentals', 'Lunches & extra dinners'],
  },
  {
    id: 'trv-ksh-02',
    slug: 'autumn-chinar-harvest-trail',
    title: 'Autumn Chinar & Saffron Harvest Trail',
    duration: '4 Days / 3 Nights',
    days: 4,
    nights: 3,
    tagline: 'Golden Chinar leaves, purple blooming saffron fields, and fresh walnut harvest',
    bestSeason: 'October to November (Harvest & Golden Leaf Season)',
    basePricePerAdult: 18500,
    featuredImage: '/images/crafts-kashmir-landscape.jpg',
    itinerary: [
      {
        day: 1,
        title: 'Golden Srinagar & Mughal Gardens',
        desc: 'Arrive in Srinagar. Visit Nishat & Shalimar gardens ablaze in crimson chinar foliage. Sunset tea at Char Chinar.',
        stay: 'Nutty Tales Orchard Retreat, Srinagar',
      },
      {
        day: 2,
        title: 'Pampore Saffron Harvest & Floral Terrace Picking',
        desc: 'Visit Pampore during the once-a-year saffron bloom. Walk with farmers, hand-pick purple flowers, and learn stigma separating.',
        stay: 'Nutty Tales Orchard Retreat, Srinagar',
      },
      {
        day: 3,
        title: 'Nutty Tales Walnut Harvest & Local Craft Workshop',
        desc: 'Join our estate team cracking fresh in-shell walnuts. Visit master papier-mâché and woodcarving studios.',
        stay: 'Nutty Tales Orchard Retreat, Srinagar',
      },
      {
        day: 4,
        title: 'Orchard Farewell & Departure',
        desc: 'Leisurely orchard breakfast and private transfer to Sheikh ul-Alam International Airport.',
        stay: 'Departure',
      },
    ],
    inclusions: [
      '3 Nights luxury orchard villa accommodation',
      'Dedicated private vehicle with chauffeur throughout',
      'Hands-on saffron picking experience with local farmer family',
      'All breakfasts and traditional dinners',
      'Nutty Tales Single-Origin Harvest Gift Hamper',
    ],
    exclusions: ['Flights', 'Monument entry fees'],
  },
]

export interface TravelCustomizationOptions {
  hotelTier: 'Boutique Deluxe' | 'Royal Heritage Suite (+₹4,500/night)'
  vehicleTier: 'Comfort Sedan' | 'Dedicated 4x4 Snow SUV (+₹3,500/day)'
  includeWazwanDinner: boolean
  includeGondolaTickets: boolean
  welcomeHamperTier: 'Signature Hamper (Included)' | 'Royal Kashmir Luxury Chest (+₹4,000)'
}

export function calculateCustomTravelPrice(
  pkg: TravelPackage,
  adults: number,
  children: number,
  customization: TravelCustomizationOptions
) {
  let adultBase = pkg.basePricePerAdult
  let childBase = Math.round(pkg.basePricePerAdult * 0.6)

  // Hotel tier add-on
  if (customization.hotelTier.includes('Royal Heritage')) {
    adultBase += 4500 * (pkg.nights / 2)
  }

  // Vehicle tier add-on
  let vehicleAddon = 0
  if (customization.vehicleTier.includes('4x4')) {
    vehicleAddon = 3500 * pkg.days
  }

  // Activities
  let activitiesAddon = 0
  if (customization.includeWazwanDinner) {
    activitiesAddon += 1800 * adults + 1000 * children
  }
  if (customization.includeGondolaTickets) {
    activitiesAddon += 2200 * adults + 1500 * children
  }
  if (customization.welcomeHamperTier.includes('Luxury Chest')) {
    activitiesAddon += 4000
  }

  const subtotal = adultBase * adults + childBase * children + vehicleAddon + activitiesAddon
  const gst = Math.round(subtotal * 0.05) // 5% Travel Tour Package GST
  const grandTotal = subtotal + gst

  return {
    adultsTotal: adultBase * adults,
    childrenTotal: childBase * children,
    vehicleAddon,
    activitiesAddon,
    subtotal,
    gst,
    grandTotal,
    perPersonEst: Math.round(grandTotal / (adults + (children > 0 ? children * 0.5 : 0))),
  }
}
