// ─── Nuty Tales — Dynamic Campaign, Festival, Season & Occasion Engine ────────
// Replaces date-locked categories (FW26, Diwali 2026) with permanent dynamic engines.

export interface CampaignDefinition {
  id: string
  name: string
  year?: number
  campaignType:
    | 'festival'
    | 'season'
    | 'occasion'
    | 'shopping_event'
    | 'travel_season'
    | 'life_event'
  startDate: string // ISO date
  endDate: string   // ISO date
  targetCountries: string[] // ISO codes e.g. ['IN', 'AE', 'UK', 'US']
  targetVerticals: ('business' | 'gifting' | 'weddings' | 'crafts' | 'stays' | 'travel')[]
  badge: string
  bannerTitle: string
  bannerSubtitle: string
  discountText?: string
  priority: number
  landingRoute: string
  seoTitle: string
  seoDescription: string
  isActive?: boolean
}

export interface FestivalEntity {
  id: string
  slug: string
  name: string
  season: string
  monthRange: string
  description: string
  traditions: string[]
  suggestedGifts: string[]
  relatedVerticals: ('gifting' | 'crafts' | 'business' | 'stays' | 'travel')[]
  heroImage: string
}

export interface SeasonEntity {
  id: string
  slug: string
  name: string
  seasonType: 'spring' | 'summer' | 'monsoon' | 'autumn' | 'winter' | 'autumn-winter' | 'harvest'
  months: string
  description: string
  craftHighlights: string[]
  culinaryHighlights: string[]
  travelHighlights: string[]
  heroImage: string
}

export interface OccasionEntity {
  id: string
  slug: string
  name: string
  type: 'personal' | 'corporate' | 'milestone' | 'hospitality'
  description: string
  idealFor: string[]
  suggestedHampers: string[]
  heroImage: string
}

export interface LifeEventEntity {
  id: string
  slug: string
  name: string
  description: string
  milestones: string[]
  connectedVerticals: ('weddings' | 'gifting' | 'stays' | 'travel' | 'crafts' | 'business')[]
  heroImage: string
}

export interface TravelSeasonEntity {
  id: string
  slug: string
  name: string
  seasonLabel: string
  bestMonths: string
  experiences: string[]
  destinations: string[]
  heroImage: string
}

// ─── 1. Permanent Festivals ──────────────────────────────────────────────────
export const FESTIVALS: FestivalEntity[] = [
  {
    id: 'diwali',
    slug: 'diwali',
    name: 'Diwali',
    season: 'Autumn / Festive',
    monthRange: 'October – November',
    description:
      'The Festival of Lights. Celebrated globally with royal dry fruit hampers, Mongra saffron, silver coins, and artisan Kashmiri walnut caskets.',
    traditions: ['Lighting Diyas', 'Family Feasts', 'Corporate Gratitude', 'Sweet & Dry Fruit Gifting'],
    suggestedGifts: ['Royal Zabarwan Casket', 'Pampore Mongra Saffron 1g GI', 'Mamra Badam', 'Silver-plated Dry Fruit Box'],
    relatedVerticals: ['gifting', 'business', 'crafts'],
    heroImage: '/images/corporate-diwali-gifting.jpg',
  },
  {
    id: 'eid',
    slug: 'eid',
    name: 'Eid',
    season: 'Spring / Summer',
    monthRange: 'Varies with Islamic Lunar Calendar',
    description:
      'A blessed celebration of peace, community, and hospitality. Celebrated with premium dates, Afghan raisins, saffron sheer khurma, and handwoven Pashmina gifts.',
    traditions: ['Eidi Gifting', 'Sheer Khurma', 'Community Banquets', 'Fine Apparel'],
    suggestedGifts: ['Arabian Medjool Dates', 'GI Mongra Saffron', 'Kashmiri Walnut Kernel Halves', 'Handmade Pashmina Shawl'],
    relatedVerticals: ['gifting', 'crafts', 'business', 'stays'],
    heroImage: '/images/luxury-hamper-jars.png',
  },
  {
    id: 'christmas',
    slug: 'christmas',
    name: 'Christmas & Holiday Season',
    season: 'Winter',
    monthRange: 'December',
    description:
      'Global holiday celebration of warmth and generosity. Featuring spice-roasted nuts, plum cake bakery nuts supply, and bespoke luxury holiday hampers.',
    traditions: ['Holiday Hamper Exchange', 'Artisan Bakery Baking', 'Winter Fireside Feasts'],
    suggestedGifts: ['Gourmet Spiced Nut Collection', 'Walnut Wood Keepsake Chest', 'Forest Raw Honey', 'Cashmere Wool Wrap'],
    relatedVerticals: ['gifting', 'business', 'stays', 'travel', 'crafts'],
    heroImage: '/images/luxury-teal-gift-box.jpg',
  },
  {
    id: 'hanukkah',
    slug: 'hanukkah',
    name: 'Hanukkah',
    season: 'Winter',
    monthRange: 'November – December',
    description:
      'The Festival of Lights celebrating renewal and warmth. Premium roasted nuts, dried fruits, and artisanal keepsakes.',
    traditions: ['Menorah Lighting', 'Traditional Treats', 'Gifting Delicacies'],
    suggestedGifts: ['Assorted Tree Nuts Gift Pack', 'High-Elevation Walnuts', 'Cold-Pressed Almond Oil'],
    relatedVerticals: ['gifting', 'business'],
    heroImage: '/images/long-festive-gift-box.jpg',
  },
  {
    id: 'lunar-new-year',
    slug: 'lunar-new-year',
    name: 'Lunar New Year',
    season: 'Spring',
    monthRange: 'January – February',
    description:
      'Celebration of prosperity, good fortune, and family reunion across East and Southeast Asia. Auspicious red and gold presentation boxes.',
    traditions: ['Prosperity Hamper Giving', 'Reunion Dinners', 'Auspicious Red Packaging'],
    suggestedGifts: ['Prosperity Nut Casket', 'Jumbo Cashews W180', 'Iranian Pistachios'],
    relatedVerticals: ['gifting', 'business', 'travel'],
    heroImage: '/images/corporate-diwali-gifting.jpg',
  },
  {
    id: 'holi',
    slug: 'holi',
    name: 'Holi',
    season: 'Spring',
    monthRange: 'March',
    description:
      'The Festival of Colors celebrating spring harvest, friendship, and joy. Thandai nuts blends, organic makhana snacks, and cheerful gift boxes.',
    traditions: ['Thandai Saffron Concoctions', 'Organic Colors', 'Festive Snacking'],
    suggestedGifts: ['Thandai Saffron & Nut Kit', 'Roasted Peri Peri Makhana', 'Pistachios & Almonds'],
    relatedVerticals: ['gifting', 'business'],
    heroImage: '/images/luxury-hamper-jars.png',
  },
  {
    id: 'navratri',
    slug: 'navratri',
    name: 'Navratri',
    season: 'Autumn / Spring',
    monthRange: 'March – April & October',
    description:
      'Nine nights of auspicious festivity, prayer, and pure Sattvic nutrition. Pure fasting-friendly Foxnut (Makhana), almonds, and dry fruits.',
    traditions: ['Fasting & Sattvic Nutrition', 'Spiritual Feasts', 'Pure Harvest Sourcing'],
    suggestedGifts: ['Jumbo Phool Makhana 6+ Sutra', 'Californian Almonds', 'Organic Dates'],
    relatedVerticals: ['gifting', 'business'],
    heroImage: '/images/makhana-harvest.jpg',
  },
  {
    id: 'raksha-bandhan',
    slug: 'raksha-bandhan',
    name: 'Raksha Bandhan',
    season: 'Monsoon',
    monthRange: 'August',
    description:
      'Honoring sibling bonds with ceremonial dry fruit hampers, handcrafted ties, and sweet treats delivered across all domestic and global addresses.',
    traditions: ['Rakhi Thread Binding', 'Gift Exchange', 'Sweet & Nut Tokens'],
    suggestedGifts: ['Sibling Gourmet Nut Trunk', 'Velvet Embroidered Pouch with Saffron', 'Roasted Nut Trio'],
    relatedVerticals: ['gifting', 'crafts'],
    heroImage: '/images/luxury-teal-gift-box.jpg',
  },
  {
    id: 'thanksgiving',
    slug: 'thanksgiving',
    name: 'Thanksgiving',
    season: 'Autumn',
    monthRange: 'November',
    description:
      'Harvest gratitude and family gatherings across North America. Whole baking nuts, pecan alternatives, and artisanal table hampers.',
    traditions: ['Harvest Tables', 'Baking Pies', 'Client Gratitude Notes'],
    suggestedGifts: ['Walnut Halves for Baking', 'Smoked Almonds & Cashews', 'Raw Chinar Honey'],
    relatedVerticals: ['gifting', 'business'],
    heroImage: '/images/long-festive-gift-box.jpg',
  },
  {
    id: 'mothers-day',
    slug: 'mothers-day',
    name: "Mother's Day",
    season: 'Spring',
    monthRange: 'May',
    description:
      'Celebrating maternal care with delicate pure Pashmina wraps, saffron wellness kits, and wholesome nutrient-dense treats.',
    traditions: ['Wellness Care Packs', 'Pashmina Wrap Gifting', 'Breakfast in Bed Hampers'],
    suggestedGifts: ['Pure Handloom Pashmina Stole', 'Kashmir Saffron & Green Tea Tin', 'Mamra Badam Wellness Jar'],
    relatedVerticals: ['gifting', 'crafts', 'stays'],
    heroImage: '/images/luxury-hamper-jars.png',
  },
  {
    id: 'fathers-day',
    slug: 'fathers-day',
    name: "Father's Day",
    season: 'Summer',
    monthRange: 'June',
    description:
      'Honoring fatherhood with executive leatherette nut boxes, hand-carved walnut wood desk organizers, and gourmet roasted savory nuts.',
    traditions: ['Executive Gifting', 'Gourmet Snacking', 'Artisan Desk Accessories'],
    suggestedGifts: ['Executive Vegan Leatherette Trunk', 'Carved Walnut Desk Box', 'Roasted Salted Pistachios'],
    relatedVerticals: ['gifting', 'crafts'],
    heroImage: '/images/corporate-diwali-gifting.jpg',
  },
]

// ─── 2. Permanent Seasons ────────────────────────────────────────────────────
export const SEASONS: SeasonEntity[] = [
  {
    id: 'autumn-winter',
    slug: 'autumn-winter',
    name: 'Autumn & Winter Collections',
    seasonType: 'autumn-winter',
    months: 'October – February',
    description:
      'The premier high-demand season of the Himalayas. Fresh walnut and almond harvests, pure saffron harvest in Pampore, warm handspun Pashmina shawls, and cosy luxury alpine stays.',
    craftHighlights: ['Heavy Wool Pherans', 'Handwoven Kani Shawls', 'Needlework Sozni Velvet Coats', 'Walnut Wood Furniture'],
    culinaryHighlights: ['Fresh New-Crop Kashmiri Walnuts', 'Pampore Mongra Saffron', 'Mamra Almonds', 'Spiced Kehwa'],
    travelHighlights: ['Gulmarg Ski Slopes', 'Pahalgam Winter Pine Forest', 'Houseboat Cedar Fireside'],
    heroImage: '/images/winter-crafts-hero.jpg',
  },
  {
    id: 'spring',
    slug: 'spring',
    name: 'Spring Blossom',
    seasonType: 'spring',
    months: 'March – May',
    description:
      'Awakening of the valleys: Asia’s largest Tulip Garden blooms in Srinagar, almond blossoms across Badamwari, and lightweight summer-weight Pashmina wraps.',
    craftHighlights: ['Pastel Hand-Dyed Pashmina Stoles', 'Silk-Blend Scarves', 'Papier-Mâché Floral Eggs & Boxes'],
    culinaryHighlights: ['Raw Acacia Spring Honey', 'Crisp Sun-Dried Figs', 'Jumbo Cashews'],
    travelHighlights: ['Badamwari Almond Blossom Walk', 'Srinagar Tulip Festival', 'Dachigam Wildlife Awakening'],
    heroImage: '/images/kashmir-spring.jpg',
  },
  {
    id: 'summer',
    slug: 'summer',
    name: 'Summer Escape',
    seasonType: 'summer',
    months: 'June – August',
    description:
      'High-altitude alpine meadows, trekking the Great Lakes of Kashmir, cooler hill stays, and refreshing healthy seed & trail mixes.',
    craftHighlights: ['Breathable Handloom Linen-Cashmere Blends', 'Cotton Ari Embroidery Robes', 'Walnut Carved Salad Bowls'],
    culinaryHighlights: ['Phool Makhana Roasted Snacks', 'Hydrating Raw Seeds', 'Sun-Dried Iranian Apricots'],
    travelHighlights: ['Kashmir Great Lakes Alpine Trek', 'Sonamarg Thajiwas Glacier Walk', 'Dal Lake Sunset Shikara'],
    heroImage: '/images/summer-retreat.jpg',
  },
  {
    id: 'monsoon',
    slug: 'monsoon',
    name: 'Monsoon Magic',
    seasonType: 'monsoon',
    months: 'July – September',
    description:
      'Lush emerald meadows, misty pine valleys, fireside Kashmiri kehwa tea brewing, and heartwarming immunity-boosting wholesome nuts.',
    craftHighlights: ['Water-Resistant Wool Capes', 'Handwoven Throws & Blankets', 'Heritage Rugs'],
    culinaryHighlights: ['Spiced Masala Roasted Nuts', 'Immunity Seed Mixes', 'Raw Forest Honey'],
    travelHighlights: ['Yusmarg Rain-Soaked Pine Meadows', 'Aru Valley Waterfall Hikes'],
    heroImage: '/images/luxury-hamper-jars.png',
  },
  {
    id: 'harvest-season',
    slug: 'harvest-season',
    name: 'Himalayan Harvest Season',
    seasonType: 'harvest',
    months: 'September – November',
    description:
      'The legendary harvest season of Kashmir and Mithila: walnut knocking from ancient trees, saffron picking at dawn, and lotus seed harvesting in pristine wetland ponds.',
    craftHighlights: ['Harvest Celebration Keepsakes', 'Artisan Walnut Wood Trays'],
    culinaryHighlights: ['New-Crop Wet In-Shell Walnuts', 'Fresh GI Saffron Stigmas', 'Jumbo Grade 6 Makhana'],
    travelHighlights: ['Pampore Purple Saffron Field Walking', 'Walnut Orchard Harvest Trails'],
    heroImage: '/images/makhana-harvest.jpg',
  },
]

// ─── 3. Permanent Occasions ──────────────────────────────────────────────────
export const OCCASIONS: OccasionEntity[] = [
  {
    id: 'corporate-gifting',
    slug: 'corporate-gifting',
    name: 'Festive & Corporate Gifting',
    type: 'corporate',
    description:
      'Enterprise multi-recipient gift desks with laser-etched branding, 18% GST input tax credit, and scheduled door-to-door pan-India and international dispatches.',
    idealFor: ['Employee Appreciation', 'Festive Annual Rollout', 'Leadership Milestone', 'Boardroom Thank You'],
    suggestedHampers: ['The Royal Zabarwan Walnut Casket', 'The Executive Vegan Leatherette Trunk', 'The Chinar Rigid Box'],
    heroImage: '/images/corporate-diwali-gifting.jpg',
  },
  {
    id: 'wedding-favors',
    slug: 'wedding-favors',
    name: 'Wedding Favors & Royal Trousseau',
    type: 'milestone',
    description:
      'Customized wedding favors, royal silver-plated and walnut wood trousseau gift boxes with customized couple crests and GI-certified ingredients.',
    idealFor: ['Destination Wedding Guest Welcomes', 'Mehendi Favors', 'Roka Announcements', 'Royal Return Gifts'],
    suggestedHampers: ['Royal Trousseau Keepsake Chest', 'Silver Bowl Dry Fruit Set', 'Bespoke Saffron & Honey Favors'],
    heroImage: '/images/luxury-hamper-jars.png',
  },
  {
    id: 'employee-recognition',
    slug: 'employee-recognition',
    name: 'Employee Recognition & Welcome Gifts',
    type: 'corporate',
    description:
      'Day-1 welcome kits and milestone anniversary recognition packages shipped automatically via HRMS integrations or bulk CSV roster uploads.',
    idealFor: ['Day-1 Onboarding', 'Work Anniversary', 'Quarterly Excellence Awards', 'Retirement Honors'],
    suggestedHampers: ['The Gulmarg Celebration Casket', 'Nuty Nutrition Work Desk Pack', 'Custom Branded Sleeve Box'],
    heroImage: '/images/luxury-teal-gift-box.jpg',
  },
  {
    id: 'client-appreciation',
    slug: 'client-appreciation',
    name: 'VIP Client Appreciation',
    type: 'corporate',
    description:
      'High-impact CXO-tier gifts designed to strengthen multi-million enterprise relationships with personalized wax-sealed handwritten notes.',
    idealFor: ['Key Account Milestones', 'Contract Renewal Celebration', 'Holiday Gratitude', 'C-Suite Networking'],
    suggestedHampers: ['Hand-Carved Walnut Keepsake Casket with GI Mongra Saffron & Mamra Almonds'],
    heroImage: '/images/luxury-hamper-jars.png',
  },
  {
    id: 'birthday-anniversary',
    slug: 'birthday-anniversary',
    name: 'Birthday & Anniversary Celebrations',
    type: 'personal',
    description:
      'Curated luxury gift presentations with personalized ribbon greetings, dry fruit heart packs, and doorstep express delivery.',
    idealFor: ['Milestone Birthdays', 'Silver & Golden Anniversaries', 'Family Celebrations'],
    suggestedHampers: ['Bespoke Velvet Ribbon Gift Box', 'Premium Nut & Dried Berry Collection'],
    heroImage: '/images/long-festive-gift-box.jpg',
  },
  {
    id: 'welcome-gift',
    slug: 'welcome-gift',
    name: 'VIP Hospitality & Guest Welcome Drops',
    type: 'hospitality',
    description:
      'Hotel room drops and event welcome boxes delivering an unforgettable first impression at luxury resorts, conferences, and destination retreats.',
    idealFor: ['Boutique Hotel Room Turndown', 'Conference Delegate Pack', 'VIP Retreat Welcome'],
    suggestedHampers: ['Signature Kehwa & Roasted Nut Jar Duo', 'Pashmina Stole Welcome Kit'],
    heroImage: '/images/corporate-diwali-gifting.jpg',
  },
]

// ─── 4. Permanent Life Events ────────────────────────────────────────────────
export const LIFE_EVENTS: LifeEventEntity[] = [
  {
    id: 'weddings',
    slug: 'weddings',
    name: 'Weddings & Royal Nuptials',
    description:
      'End-to-end destination wedding orchestration: luxury heritage venues in Kashmir & Rajasthan, guest concierge, authentic Wazwan banqueting, and heirloom favor hampers.',
    milestones: ['Roka Ceremony', 'Mehendi & Sangeet', 'Main Nuptials', 'Wazwan Reception', 'Honeymoon Transition'],
    connectedVerticals: ['weddings', 'gifting', 'stays', 'travel', 'crafts'],
    heroImage: '/images/luxury-hamper-jars.png',
  },
  {
    id: 'corporate-retreats',
    slug: 'corporate-retreats',
    name: 'Executive Retreats & Offsites',
    description:
      'Exclusive buyout of private walnut orchard villas, alpine ski chalets, and boardroom retreats combined with curated high-altitude expeditions.',
    milestones: ['Leadership Strategy Sessions', 'Team Adventure Challenges', 'Private Chef Dinners', 'Fireside Keynotes'],
    connectedVerticals: ['stays', 'travel', 'business', 'gifting'],
    heroImage: '/images/summer-retreat.jpg',
  },
  {
    id: 'milestone-celebrations',
    slug: 'milestone-celebrations',
    name: 'Milestone Jubilees & Anniversaries',
    description:
      'Private family gatherings, 50th jubilee celebrations, and golden anniversaries hosted across historic houseboats and private mountain estates.',
    milestones: ['Welcome Shikara Reception', 'Fireside Banquet', 'Artisan Trousseau Presentation'],
    connectedVerticals: ['stays', 'weddings', 'crafts', 'gifting'],
    heroImage: '/images/winter-crafts-hero.jpg',
  },
]

// ─── 5. Permanent Travel Seasons ─────────────────────────────────────────────
export const TRAVEL_SEASONS: TravelSeasonEntity[] = [
  {
    id: 'snow-and-ski',
    slug: 'snow-and-ski',
    name: 'Snow, Ski & Winter Wonderland',
    seasonLabel: 'Winter',
    bestMonths: 'December – March',
    experiences: ['Gulmarg Heli-Skiing', 'Phase 2 Gondola Summit', 'Frozen Drung Waterfall', 'Heated Cedar Houseboat Stay'],
    destinations: ['Gulmarg', 'Srinagar', 'Pahalgam Betaab Valley', 'Drung'],
    heroImage: '/images/winter-crafts-hero.jpg',
  },
  {
    id: 'spring-blossom',
    slug: 'spring-blossom',
    name: 'Spring Tulip & Blossom Escapes',
    seasonLabel: 'Spring',
    bestMonths: 'March – May',
    experiences: ['Tulip Garden Walks', 'Badamwari Blossom Picnic', 'Dal Lake Lotus Waterways', 'Shikara Sunset High Tea'],
    destinations: ['Srinagar', 'Badamwari', 'Nishat & Shalimar Gardens'],
    heroImage: '/images/kashmir-spring.jpg',
  },
  {
    id: 'alpine-summer',
    slug: 'alpine-summer',
    name: 'Alpine Summer Valleys & Lakes',
    seasonLabel: 'Summer',
    bestMonths: 'June – August',
    experiences: ['Great Lakes Multi-Day Trek', 'Sonamarg Thajiwas Glacier', 'Pahalgam Lidder River Angling', 'Meadow Camping'],
    destinations: ['Sonamarg', 'Pahalgam', 'Aru Valley', 'Gurez Valley'],
    heroImage: '/images/summer-retreat.jpg',
  },
  {
    id: 'golden-autumn',
    slug: 'golden-autumn',
    name: 'Golden Autumn & Chinar Foliage',
    seasonLabel: 'Autumn',
    bestMonths: 'September – November',
    experiences: ['Chinar Foliage Walking Trails', 'Pampore Saffron Harvesting', 'Walnut Harvest Orchards', 'Heritage Artisan Guilds'],
    destinations: ['Srinagar', 'Pampore', 'Harwan', 'Dachigam'],
    heroImage: '/images/makhana-harvest.jpg',
  },
]

// ─── 6. Dynamic Campaign Registry ───────────────────────────────────────────
// Admin and dynamic time-based campaigns plug into this system.
// Notice campaigns resolve dates dynamically and can be updated without rebuilding routes!

export function getDynamicActiveCampaigns(dateInput?: Date): CampaignDefinition[] {
  const now = dateInput ?? new Date()
  const year = now.getFullYear()

  // Base dynamic campaign templates that auto-resolve to current year & next year
  return [
    {
      id: `festive-corporate-${year}`,
      name: `Festive Corporate Gifting ${year}`,
      year,
      campaignType: 'festival',
      startDate: `${year}-08-01T00:00:00Z`,
      endDate: `${year}-11-20T23:59:59Z`,
      targetCountries: ['IN', 'AE', 'UK', 'US', 'SG'],
      targetVerticals: ['gifting', 'business', 'crafts'],
      badge: `FESTIVE ${year} DESK OPEN`,
      bannerTitle: `Festive Corporate Gifting ${year}`,
      bannerSubtitle: `Early-reserve verified fresh-harvest dry fruit caskets with 15% corporate advantage & guaranteed multi-city dispatch.`,
      discountText: '15% Early-Bird Corporate Advantage',
      priority: 100,
      landingRoute: '/festivals/diwali',
      seoTitle: `Festive Corporate Gifting Hampers ${year} | Nuty Tales Gifting`,
      seoDescription: `Custom corporate dry fruit gift hampers, laser-etched walnut wood boxes, GST invoice tax credit, and PAN-India/global door-to-door delivery.`,
    },
    {
      id: `autumn-winter-crafts-${year}`,
      name: `Autumn & Winter Heritage Collection`,
      year,
      campaignType: 'season',
      startDate: `${year}-09-01T00:00:00Z`,
      endDate: `${year + 1}-03-01T23:59:59Z`,
      targetCountries: ['IN', 'AE', 'UK', 'US', 'CA', 'AU'],
      targetVerticals: ['crafts', 'stays', 'travel'],
      badge: `AUTUMN & WINTER`,
      bannerTitle: `Autumn & Winter Heritage Collection`,
      bannerSubtitle: `Handspun GI Changthangi Pashmina shawls, needlework Sozni velvet pherans, and artisan walnut furniture from master Srinagar guilds.`,
      discountText: 'Curated by SI · Virtual Drape Available',
      priority: 90,
      landingRoute: '/seasons/autumn-winter',
      seoTitle: `Authentic Kashmir Pashmina Shawls & Winter Wear | Nuty Tales Crafts`,
      seoDescription: `GI-certified handloom Pashmina, Kashmiri pherans, Sozni embroidery, and artisan home decor delivered globally with provenance verification.`,
    },
    {
      id: `destination-weddings-${year}`,
      name: `Royal Nuptials & Destination Weddings`,
      year,
      campaignType: 'life_event',
      startDate: `${year}-01-01T00:00:00Z`,
      endDate: `${year}-12-31T23:59:59Z`,
      targetCountries: ['IN', 'AE', 'UK', 'US'],
      targetVerticals: ['weddings', 'gifting', 'stays', 'travel'],
      badge: `WEDDING CONCIERGE`,
      bannerTitle: `Destination Weddings in Kashmir & Royal Destinations`,
      bannerSubtitle: `Exclusive palace & orchard buyout, authentic Wazwan banqueting, curated trousseau caskets, and bespoke guest travel management.`,
      discountText: 'Complimentary Wedding Tasting Box with Booking',
      priority: 85,
      landingRoute: '/life-events/weddings',
      seoTitle: `Destination Weddings in Kashmir | Royal Favors & Concierge | Nuty Tales Weddings`,
      seoDescription: `Plan your dream destination wedding in Kashmir. Heritage venues, Wazwan catering, bespoke dry fruit hampers, and guest luxury stays.`,
    },
    {
      id: `b2b-harvest-contracts-${year}`,
      name: `Direct Orchard Bulk Harvest Procurement`,
      year,
      campaignType: 'shopping_event',
      startDate: `${year}-01-01T00:00:00Z`,
      endDate: `${year}-12-31T23:59:59Z`,
      targetCountries: ['IN', 'AE', 'UK', 'US'],
      targetVerticals: ['business'],
      badge: `LIVE COMMODITY BOARD`,
      bannerTitle: `Direct Farm & Orchard Commercial Procurement`,
      bannerSubtitle: `Tiered wholesale pricing on container and pallet lots of California almonds, Kashmiri walnuts, Mithila makhana, and GI saffron with lab COA certificates.`,
      discountText: 'Save up to 18% with GST Input Tax Credit',
      priority: 80,
      landingRoute: '/business-supply',
      seoTitle: `Wholesale Dry Fruits & Food Ingredients Supply | Nuty Tales Business`,
      seoDescription: `B2B procurement platform for commercial bakeries, hotels, FMCG brands, and wholesalers. Direct farm aggregation and multi-point cold-chain logistics.`,
    },
  ]
}

// ─── Query Helpers ───────────────────────────────────────────────────────────
export function getFestivalBySlug(slug: string): FestivalEntity | undefined {
  return FESTIVALS.find((f) => f.slug.toLowerCase() === slug.toLowerCase())
}

export function getSeasonBySlug(slug: string): SeasonEntity | undefined {
  return SEASONS.find((s) => s.slug.toLowerCase() === slug.toLowerCase())
}

export function getOccasionBySlug(slug: string): OccasionEntity | undefined {
  return OCCASIONS.find((o) => o.slug.toLowerCase() === slug.toLowerCase())
}

export function getLifeEventBySlug(slug: string): LifeEventEntity | undefined {
  return LIFE_EVENTS.find((l) => l.slug.toLowerCase() === slug.toLowerCase())
}

export function getTravelSeasonBySlug(slug: string): TravelSeasonEntity | undefined {
  return TRAVEL_SEASONS.find((t) => t.slug.toLowerCase() === slug.toLowerCase())
}
