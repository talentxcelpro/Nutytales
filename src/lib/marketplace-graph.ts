// ─── Nuty Tales — Shared Marketplace Entity Graph & Orchestration Layer ─────
// Connects all 6 verticals into one intelligent commercial graph.
// Powered by SI (System Intelligence).

import { PRODUCTS, Product } from '@/lib/products-data'
import { CRAFT_PRODUCTS, CraftProduct } from '@/lib/crafts-data'
import { STAY_PROPERTIES, StayProperty } from '@/lib/stays-data'
import { KASHMIR_TRAVEL_PACKAGES, TravelPackage } from '@/lib/travel-data'
import { B2B_COMMODITIES, B2BCommodity } from '@/lib/b2b-data'
import { WEDDING_OCCASIONS } from '@/lib/weddings-data'
import { PlatformVertical } from '@/lib/platform-core'
import { formatGlobalPrice, CurrencyCode } from '@/lib/global-config'

export type MarketplaceEntityType =
  | 'product'
  | 'stay'
  | 'package'
  | 'craft'
  | 'wedding_service'
  | 'b2b_commodity'
  | 'destination'
  | 'vendor'

export interface MarketplaceItem {
  id: string
  vertical: PlatformVertical
  type: MarketplaceEntityType
  title: string
  subtitle: string
  slug: string
  href: string
  priceINR: number
  currency: string
  image: string
  location?: string
  badges: string[]
  relevanceScore?: number
  crossSellReason?: string
}

export interface IntentResolution {
  parsedVerticals: PlatformVertical[]
  primaryCategory?: string
  location?: string
  budgetMaxINR?: number
  guestCountOrQuantity?: number
  recommendedItems: MarketplaceItem[]
  suggestedAction: {
    label: string
    href: string
    vertical: PlatformVertical
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. CROSS-VERTICAL GRAPH RECOMMENDATION ENGINE
// ─────────────────────────────────────────────────────────────────────────────

export interface CrossVerticalContext {
  fromVertical: PlatformVertical
  currentId?: string
  location?: string
  userType?: 'consumer' | 'corporate' | 'wedding_couple' | 'traveler'
}

/**
 * Given user activity in one vertical, returns complementary high-intent items
 * from other verticals in the Nuty Tales ecosystem.
 */
export function getCrossVerticalRecommendations(
  context: CrossVerticalContext,
  limit = 4
): MarketplaceItem[] {
  const { fromVertical, location } = context
  const recs: MarketplaceItem[] = []

  // Case 1: User looking at Weddings (weddings.nutytales.com)
  if (fromVertical === 'weddings') {
    // 1. Stays for Wedding Party
    const stay = STAY_PROPERTIES[0]
    if (stay) {
      recs.push({
        id: stay.id,
        vertical: 'stays',
        type: 'stay',
        title: stay.name,
        subtitle: 'Exclusive Orchard Estate Buyout for Wedding Parties',
        slug: stay.slug,
        href: `/stays/${stay.slug}`,
        priceINR: stay.rooms[0]?.basePricePerNight || stay.estateBuyoutPrice,
        currency: 'INR',
        image: stay.featuredImage,
        location: stay.locationNote || `${stay.city}, ${stay.state}`,
        badges: ['Estate Buyout', 'Private Chef'],
        crossSellReason: 'Accommodate your VIP wedding guests with private lakeside luxury',
      })
    }

    // 2. Crafts: Bridal Pashmina & Gifting Shawls
    const craft = CRAFT_PRODUCTS[0]
    if (craft) {
      recs.push({
        id: craft.id,
        vertical: 'crafts',
        type: 'craft',
        title: craft.name,
        subtitle: 'Authentic GI Pashmina Shawl for Bridal Trousseau',
        slug: craft.slug,
        href: `/crafts/product/${craft.slug}`,
        priceINR: craft.price,
        currency: 'INR',
        image: craft.image,
        location: 'Srinagar, Kashmir',
        badges: ['GI Tag Certified', 'Bridal Heirloom'],
        crossSellReason: 'Bespoke handwoven keepsakes for bride, groom, and key family',
      })
    }

    // 3. Gifting: Wedding Favors
    recs.push({
      id: 'gift-wedding-casket',
      vertical: 'gifting',
      type: 'product',
      title: 'The Royal Zabarwan Walnut Wood Casket',
      subtitle: 'Carved Walnut Keepsake Hamper with Pure Mongra Saffron',
      slug: 'royal-zabarwan-trousseau',
      href: '/gifting',
      priceINR: 4950,
      currency: 'INR',
      image: '/images/luxury-hamper-jars.png',
      badges: ['Custom Couple Monogram', 'GI Saffron'],
      crossSellReason: 'Handover prestigious dry fruit favors to all wedding guests',
    })

    // 4. Travel: Airport Luxury Convoy & Guest Shuttles
    const travel = KASHMIR_TRAVEL_PACKAGES[0]
    if (travel) {
      recs.push({
        id: travel.id,
        vertical: 'travel',
        type: 'package',
        title: 'Wedding Guest Airport & Sightseeing Convoy',
        subtitle: 'Dedicated 4x4 Luxury Fleet with Local Concierge',
        slug: travel.slug,
        href: `/travel/kashmir/${travel.slug}`,
        priceINR: 18500,
        currency: 'INR',
        image: travel.featuredImage,
        badges: ['Private Chauffeur', 'Flight Sync'],
        crossSellReason: 'Stress-free transit for outstation guests from Srinagar Airport',
      })
    }
  }

  // Case 2: User looking at Travel (travel.nutytales.com)
  else if (fromVertical === 'travel') {
    // 1. Boutique Stay
    const stay = STAY_PROPERTIES[1] || STAY_PROPERTIES[0]
    if (stay) {
      recs.push({
        id: stay.id,
        vertical: 'stays',
        type: 'stay',
        title: stay.name,
        subtitle: 'Alpine Ski Chalet & Valley Views',
        slug: stay.slug,
        href: `/stays/${stay.slug}`,
        priceINR: stay.rooms[0]?.basePricePerNight || stay.estateBuyoutPrice,
        currency: 'INR',
        image: stay.featuredImage,
        location: stay.locationNote || `${stay.city}, ${stay.state}`,
        badges: ['Heated Chalet', 'Valley View'],
        crossSellReason: 'Pair your expedition with our handpicked private residences',
      })
    }

    // 2. Crafts: Wear the Story (Pherans & Shawls)
    const craft = CRAFT_PRODUCTS[1] || CRAFT_PRODUCTS[0]
    if (craft) {
      recs.push({
        id: craft.id,
        vertical: 'crafts',
        type: 'craft',
        title: craft.name,
        subtitle: 'Authentic Wool Pheran (Try with SI Virtual Drape)',
        slug: craft.slug,
        href: `/crafts/product/${craft.slug}`,
        priceINR: craft.price,
        currency: 'INR',
        image: craft.image,
        badges: ['Winter Warmth', 'SI Drape'],
        crossSellReason: 'Dress authentically for snowy valleys and mountain passes',
      })
    }

    // 3. Products: Saffron & Kehwa to Take Home
    const saffron = PRODUCTS.find((p) => p.slug.includes('saffron')) || PRODUCTS[0]
    if (saffron) {
      recs.push({
        id: saffron.id,
        vertical: 'business',
        type: 'product',
        title: saffron.name,
        subtitle: 'GI-Tagged Pure Pampore Mongra Saffron',
        slug: saffron.slug,
        href: `/shop/${saffron.slug}`,
        priceINR: saffron.retailPrice,
        currency: 'INR',
        image: saffron.image || saffron.images?.[0] || '/images/hero-dry-fruits.png',
        badges: ['GI Mongra', 'NABL Lab Tested'],
        crossSellReason: 'Authentic Himalayan harvest shipped direct to your home doorstep',
      })
    }

    // 4. Stays/Host Concierge
    recs.push({
      id: 'travel-concierge-gifting',
      vertical: 'gifting',
      type: 'product',
      title: 'Kashmir Travelers Gift Hamper',
      subtitle: 'Curated Trail Mix, Saffron Kehwa & Raw Forest Honey',
      slug: 'travel-hamper',
      href: '/gifting',
      priceINR: 1850,
      currency: 'INR',
      image: '/images/luxury-teal-gift-box.jpg',
      badges: ['Travel Pack', 'Kehwa Blends'],
      crossSellReason: 'Wholesome nutrition for high-altitude hikes and scenic drives',
    })
  }

  // Case 3: Corporate Buyer at Business / B2B Supply (business.nutytales.com)
  else if (fromVertical === 'business') {
    // 1. Corporate Gifting Hamper Desk
    recs.push({
      id: 'b2b-corporate-gifting-casket',
      vertical: 'gifting',
      type: 'product',
      title: 'The Executive Vegan Leatherette Hamper Trunk',
      subtitle: 'Custom Laser Brand Logo & PAN-India Employee Doorstep Delivery',
      slug: 'executive-trunk',
      href: '/gifting',
      priceINR: 2450,
      currency: 'INR',
      image: '/images/corporate-diwali-gifting.jpg',
      badges: ['18% GST Credit', 'Multi-City AWB'],
      crossSellReason: 'Turn corporate procurement into memorable employee & client appreciation gifts',
    })

    // 2. Executive Corporate Retreat Buyout
    const stay = STAY_PROPERTIES[0]
    if (stay) {
      recs.push({
        id: stay.id,
        vertical: 'stays',
        type: 'stay',
        title: stay.name,
        subtitle: 'Annual Leadership Offsite & Boardroom Buyout',
        slug: stay.slug,
        href: `/stays/${stay.slug}`,
        priceINR: stay.rooms[0]?.basePricePerNight || stay.estateBuyoutPrice,
        currency: 'INR',
        image: stay.featuredImage,
        location: stay.locationNote || `${stay.city}, ${stay.state}`,
        badges: ['Boardroom Suite', 'Gigabit WiFi'],
        crossSellReason: 'Exclusive mountain offsite venue with dedicated catering and meetings setup',
      })
    }

    // 3. Wholesale Crafts / Corporate Souvenirs
    const craft = CRAFT_PRODUCTS[2] || CRAFT_PRODUCTS[0]
    if (craft) {
      recs.push({
        id: craft.id,
        vertical: 'crafts',
        type: 'craft',
        title: 'Hand-Carved Walnut Wood Keepsake Trophies',
        subtitle: 'Artisan Awards & Corporate Milestone Souvenirs',
        slug: craft.slug,
        href: `/crafts/product/${craft.slug}`,
        priceINR: craft.price,
        currency: 'INR',
        image: craft.image,
        badges: ['Artisan Wood', 'Laser Brass Plaque'],
        crossSellReason: 'Distinguish your annual corporate awards with authentic artisan trophies',
      })
    }

    // 4. Travel: Corporate Leadership Expeditions
    const travel = KASHMIR_TRAVEL_PACKAGES[1] || KASHMIR_TRAVEL_PACKAGES[0]
    if (travel) {
      recs.push({
        id: travel.id,
        vertical: 'travel',
        type: 'package',
        title: 'Corporate Alpine Leadership Retreat (4 Days)',
        subtitle: 'Strategy Offsite, Heli-Skiing & Fireside Discussions',
        slug: travel.slug,
        href: `/travel/kashmir/${travel.slug}`,
        priceINR: 35000,
        currency: 'INR',
        image: travel.featuredImage,
        badges: ['Corporate Offsite', 'All Inclusive'],
        crossSellReason: 'Reward top executive performers with unforgettable mountain expeditions',
      })
    }
  }

  // Case 4: Gifting (gifting.nutytales.com)
  else if (fromVertical === 'gifting') {
    // 1. Crafts Heritage Gifting
    const craft = CRAFT_PRODUCTS[0]
    if (craft) {
      recs.push({
        id: craft.id,
        vertical: 'crafts',
        type: 'craft',
        title: craft.name,
        subtitle: 'Add a Pure Pashmina Stole to Your Gift Casket',
        slug: craft.slug,
        href: `/crafts/product/${craft.slug}`,
        priceINR: craft.price,
        currency: 'INR',
        image: craft.image,
        badges: ['GI Tagged', 'Pure Cashmere'],
        crossSellReason: 'Elevate your hamper into a luxurious heirloom gift with Kashmiri handlooms',
      })
    }

    // 2. Business Supply for Large In-House Hamper Packaging
    const commodity = B2B_COMMODITIES[1]
    if (commodity) {
      recs.push({
        id: commodity.id,
        vertical: 'business',
        type: 'b2b_commodity',
        title: `${commodity.name} (Wholesale Tiers)`,
        subtitle: 'Sourcing 500kg+ in Bulk for Large Gifting Operations',
        slug: 'almonds-bulk',
        href: '/b2b',
        priceINR: commodity.tierPrices.tier2.pricePerKg,
        currency: 'INR',
        image: '/images/products/almonds-california.jpg',
        badges: ['Factory Direct', 'Tiered Rates'],
        crossSellReason: 'Buying in massive scale? Save significantly with container B2B pricing',
      })
    }

    // 3. Stays: Gift a Stay Experience Voucher
    const stay = STAY_PROPERTIES[0]
    if (stay) {
      recs.push({
        id: stay.id,
        vertical: 'stays',
        type: 'stay',
        title: `${stay.name} — Gift a Weekend Retreat`,
        subtitle: 'Luxury Stay Voucher for CXOs & Honeymoon Couples',
        slug: stay.slug,
        href: `/stays/${stay.slug}`,
        priceINR: stay.rooms[0]?.basePricePerNight || stay.estateBuyoutPrice,
        currency: 'INR',
        image: stay.featuredImage,
        location: stay.locationNote || `${stay.city}, ${stay.state}`,
        badges: ['Gift Experience', 'Flexible Dates'],
        crossSellReason: 'Gift an unforgettable escape at our private walnut orchard estate',
      })
    }

    // 4. Wedding Returns
    recs.push({
      id: 'wedding-return-favors',
      vertical: 'weddings',
      type: 'wedding_service',
      title: 'Bespoke Wedding Return Favors & Registry Desk',
      subtitle: 'Complete Guest Favor Logistics',
      slug: 'wedding-favors',
      href: '/weddings',
      priceINR: 1200,
      currency: 'INR',
      image: '/images/luxury-hamper-jars.png',
      badges: ['Custom Tagging', 'Doorstep Drop'],
      crossSellReason: 'Coordinating a family wedding? Explore royal trousseau favors',
    })
  }

  // Case 5: Default Fallback (Crafts or Stays)
  else {
    const p1 = PRODUCTS[0]
    if (p1) {
      recs.push({
        id: p1.id,
        vertical: 'business',
        type: 'product',
        title: p1.name,
        subtitle: 'Premium Gourmet Dry Fruits',
        slug: p1.slug,
        href: `/shop/${p1.slug}`,
        priceINR: p1.retailPrice,
        currency: 'INR',
        image: p1.image || p1.images?.[0] || '/images/hero-dry-fruits.png',
        badges: [p1.grade || 'Fresh Harvest', 'FSSAI Certified'],
      })
    }
    const c1 = CRAFT_PRODUCTS[0]
    if (c1) {
      recs.push({
        id: c1.id,
        vertical: 'crafts',
        type: 'craft',
        title: c1.name,
        subtitle: 'Handwoven Changthangi Pashmina',
        slug: c1.slug,
        href: `/crafts/product/${c1.slug}`,
        priceINR: c1.price,
        currency: 'INR',
        image: c1.image,
        badges: ['GI Tagged'],
      })
    }
  }

  return recs.slice(0, limit)
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. SI NATURAL LANGUAGE INTENT PARSER
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Intelligent commercial intent resolver.
 * Parses natural user language into actionable marketplace queries.
 */
export function parseCustomerIntent(query: string, contextProduct?: PlatformVertical): IntentResolution {
  const q = query.toLowerCase()
  const verticals: PlatformVertical[] = contextProduct ? [contextProduct] : []
  let budgetMax: number | undefined
  let quantity: number | undefined
  let location: string | undefined

  // Location extraction
  if (q.includes('kashmir') || q.includes('srinagar') || q.includes('gulmarg') || q.includes('pahalgam')) {
    location = 'Kashmir'
  } else if (q.includes('delhi') || q.includes('noida') || q.includes('ncr')) {
    location = 'Delhi NCR'
  } else if (q.includes('dubai') || q.includes('uae')) {
    location = 'UAE / Dubai'
  } else if (q.includes('london') || q.includes('uk')) {
    location = 'UK / London'
  }

  // Vertical matching
  if (q.includes('wedding') || q.includes('roka') || q.includes('mehendi') || q.includes('trousseau') || q.includes('venue')) {
    verticals.push('weddings')
  }
  if (q.includes('gift') || q.includes('hamper') || q.includes('employee') || q.includes('diwali') || q.includes('festive')) {
    verticals.push('gifting')
  }
  if (q.includes('stay') || q.includes('hotel') || q.includes('villa') || q.includes('houseboat') || q.includes('resort')) {
    verticals.push('stays')
  }
  if (q.includes('trip') || q.includes('travel') || q.includes('tour') || q.includes('itinerary') || q.includes('expedition') || q.includes('ski')) {
    verticals.push('travel')
  }
  if (q.includes('pashmina') || q.includes('shawl') || q.includes('pheran') || q.includes('craft') || q.includes('embroidery')) {
    verticals.push('crafts')
  }
  if (q.includes('bulk') || q.includes('wholesale') || q.includes('kg') || q.includes('bakery') || q.includes('ingredient') || q.includes('ton')) {
    verticals.push('business')
  }

  // Budget detection (e.g. "under 5000", "under ₹2000", "under $100")
  const budgetMatch = q.match(/under\s*(?:₹|\$|rs\.?|inr)?\s*([0-9,]+)/i)
  if (budgetMatch) {
    budgetMax = parseInt(budgetMatch[1].replace(/,/g, ''), 10)
  }

  // Quantity detection (e.g. "for 500 employees", "200 guests", "50kg")
  const qtyMatch = q.match(/(?:for\s+)?([0-9,]+)\s*(?:employees|guests|people|boxes|kg|units)/i)
  if (qtyMatch) {
    quantity = parseInt(qtyMatch[1].replace(/,/g, ''), 10)
  }

  // Default to discovery if no vertical matched
  if (verticals.length === 0) {
    verticals.push('gifting', 'business')
  }

  const primary = verticals[0]
  const recommendedItems = getCrossVerticalRecommendations({ fromVertical: primary, location })

  let actionLabel = 'Explore Nuty Tales'
  let actionHref = '/shop'

  if (primary === 'weddings') {
    actionLabel = 'Configure Wedding Concierge'
    actionHref = '/weddings'
  } else if (primary === 'gifting') {
    actionLabel = 'Open Gifting Desk'
    actionHref = '/gifting'
  } else if (primary === 'business') {
    actionLabel = 'Request Wholesale Quote'
    actionHref = '/b2b'
  } else if (primary === 'crafts') {
    actionLabel = 'Explore Handlooms & Crafts'
    actionHref = '/crafts'
  } else if (primary === 'stays') {
    actionLabel = 'Book Private Residence'
    actionHref = '/stays'
  } else if (primary === 'travel') {
    actionLabel = 'Build Custom Itinerary'
    actionHref = '/travel'
  }

  return {
    parsedVerticals: verticals,
    location,
    budgetMaxINR: budgetMax,
    guestCountOrQuantity: quantity,
    recommendedItems,
    suggestedAction: {
      label: actionLabel,
      href: actionHref,
      vertical: primary,
    },
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. MASTER CROSS-VERTICAL ITEM CATALOG
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns all verified commercial items across all 6 verticals
 * formatted into the unified MarketplaceItem schema.
 */
export function getAllMarketplaceItems(): MarketplaceItem[] {
  const items: MarketplaceItem[] = []

  // 1. Gifting & Retail Products
  PRODUCTS.forEach((p) => {
    items.push({
      id: `prod-${p.id}`,
      vertical: 'gifting',
      type: 'product',
      title: p.name,
      subtitle: p.category,
      slug: p.slug,
      href: `/shop/${p.slug}`,
      priceINR: p.retailPrice,
      currency: 'INR',
      image: p.image || p.images?.[0] || '/images/hero-dry-fruits.png',
      badges: [p.grade || 'Direct Farm', 'FSSAI Certified'],
      crossSellReason: 'Direct harvest dry fruit and gourmet gifting',
    })
  })

  // 2. Crafts & Handlooms
  CRAFT_PRODUCTS.forEach((c) => {
    items.push({
      id: `craft-${c.id}`,
      vertical: 'crafts',
      type: 'craft',
      title: c.name,
      subtitle: `${c.category} · Handcrafted`,
      slug: c.slug,
      href: `/crafts/product/${c.slug}`,
      priceINR: c.price,
      currency: 'INR',
      image: c.image,
      location: 'Kashmir Valley',
      badges: ['GI Tag Certified', 'Artisan Guild'],
      crossSellReason: 'Authentic Changthangi Cashmere and master craftsmanship',
    })
  })

  // 3. Boutique Stays & Estates
  STAY_PROPERTIES.forEach((s) => {
    items.push({
      id: `stay-${s.id}`,
      vertical: 'stays',
      type: 'stay',
      title: s.name,
      subtitle: `${s.category} · ${s.city}, ${s.state}`,
      slug: s.slug,
      href: `/stays/${s.slug}`,
      priceINR: s.rooms[0]?.basePricePerNight || s.estateBuyoutPrice,
      currency: 'INR',
      image: s.featuredImage,
      location: s.locationNote || `${s.city}, ${s.state}`,
      badges: ['Private Estate', 'Verified Host'],
      crossSellReason: 'Immersive heritage stays & luxury orchard living',
    })
  })

  // 4. Curated Travel Packages
  KASHMIR_TRAVEL_PACKAGES.forEach((t) => {
    items.push({
      id: `travel-${t.id}`,
      vertical: 'travel',
      type: 'package',
      title: t.title,
      subtitle: `${t.duration} · ${t.tagline}`,
      slug: t.slug,
      href: `/travel/kashmir/${t.slug}`,
      priceINR: t.basePricePerAdult,
      currency: 'INR',
      image: t.featuredImage,
      location: 'Kashmir Highlands',
      badges: ['Curated DMC', 'All-Inclusive Itinerary'],
      crossSellReason: 'Expert-led alpine travel and cultural expeditions',
    })
  })

  // 5. B2B Commodities & Sourcing
  B2B_COMMODITIES.forEach((b) => {
    items.push({
      id: `b2b-${b.id}`,
      vertical: 'business',
      type: 'b2b_commodity',
      title: b.name,
      subtitle: `Wholesale ${b.origin} · Min. ${b.moqKg} kg`,
      slug: b.id,
      href: '/b2b',
      priceINR: b.tierPrices.tier1.pricePerKg,
      currency: 'INR',
      image: '/images/hero-dry-fruits.png',
      location: b.origin,
      badges: ['Institutional Grade', 'Export Ready'],
      crossSellReason: 'Direct bulk procurement from grower aggregators',
    })
  })

  // 6. Weddings & Royal Trousseau
  WEDDING_OCCASIONS.forEach((w) => {
    items.push({
      id: `wedding-${w.id}`,
      vertical: 'weddings',
      type: 'wedding_service',
      title: `${w.name} — Bespoke Hampers`,
      subtitle: w.tagline,
      slug: w.id,
      href: '/weddings',
      priceINR: 3500,
      currency: 'INR',
      image: '/images/luxury-hamper-jars.png',
      location: 'PAN-India & Destination Delivery',
      badges: ['Monogram Sleeve', 'Turnkey Logistics'],
      crossSellReason: 'Royal destination wedding return favors and trousseau gifts',
    })
  })

  return items
}

