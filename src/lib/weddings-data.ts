// ─── Nutty Tales Weddings & Custom Packaging Engine ─────────────────────────────
// Bespoke dry fruit gifting, couple personalisation, and multi-city PAN-India delivery

export interface WeddingOccasion {
  id: string
  name: string
  tagline: string
  idealBudget: string
  description: string
  recommendedPackaging: string
}

export const WEDDING_OCCASIONS: WeddingOccasion[] = [
  {
    id: 'roka',
    name: 'Roka & Engagement',
    tagline: 'First auspicious announcements with royal dry fruits',
    idealBudget: '₹1,500 – ₹3,500',
    description: 'Rich velvet and gold foiled boxes with pure Kashmiri Mongra Saffron, Jumbo Cashews, and California Almonds to honour the match.',
    recommendedPackaging: 'Velvet Rigid Box with Gold Metal Monogram',
  },
  {
    id: 'favours',
    name: 'Wedding Favours & Room Hampers',
    tagline: 'Warm hospitality tokens for hotel guest welcomes',
    idealBudget: '₹650 – ₹1,200',
    description: 'Compact, fragrant dry fruit pouches with roasted makhana, peri-peri cashews, and trail mix placed in guest rooms upon arrival.',
    recommendedPackaging: 'Bespoke Printed Rigid Box or Silk Brocade Potli',
  },
  {
    id: 'haldi-mehendi',
    name: 'Mehendi & Haldi Favours',
    tagline: 'Vibrant, colourful gift keepsakes for friends & bridesmaids',
    idealBudget: '₹800 – ₹1,800',
    description: 'Floral-themed tins and hand-painted papier-mâché boxes filled with gourmet roasted nuts and saffron infused snacks.',
    recommendedPackaging: 'Kashmir Hand-Painted Papier-Mâché Box or Floral Metal Tin',
  },
  {
    id: 'bride-groom',
    name: 'Bride & Groom VIP Families',
    tagline: 'Generous traditional hampers exchanged between families',
    idealBudget: '₹3,500 – ₹7,500',
    description: 'Opulent multi-tiered hampers featuring single-origin Kashmiri walnuts, Medjool dates, pure Acacia honey, and Changthangi Cashmere stoles.',
    recommendedPackaging: 'Hand-Carved Walnut Wood Chest or Laser-Engraved Brass Platter',
  },
  {
    id: 'reception',
    name: 'Reception & Return Gifts',
    tagline: 'Gracious thank-you tokens for all attending wedding guests',
    idealBudget: '₹900 – ₹2,200',
    description: 'Custom-sleeved dry fruit gift hampers with couple initials, wedding date, and QR video message thank-you cards.',
    recommendedPackaging: 'Custom Sliding Sleeve with Satin Pull Ribbon',
  },
  {
    id: 'planners',
    name: 'Wedding Planners & Hospitality',
    tagline: 'Turnkey PAN-India execution for event management teams',
    idealBudget: 'Custom Volume Tiers (100 - 2,500+ Hampers)',
    description: 'Multi-destination shipping to hotels across Udaipur, Jaipur, Goa, Jim Corbett, Delhi NCR, and Kashmir with scheduled dispatch.',
    recommendedPackaging: 'Drop-tested palletized delivery with temperature stabilization',
  },
]

export const PACKAGING_STYLES = [
  {
    id: 'rigid-box',
    name: 'Luxury Rigid Gift Box',
    desc: 'Heavy 1200 GSM Kappa board with gold hot foil stamping, magnetic clasp, and custom couple monogram.',
    image: '/images/luxury-teal-gift-box.jpg',
  },
  {
    id: 'walnut-chest',
    name: 'Kashmiri Hand-Carved Walnut Chest',
    desc: 'Solid root-wood carved by Srinagar master artisans with brass hardware. An heirloom that lives in homes forever.',
    image: '/images/dark-wood-gourmet-tray.jpg',
  },
  {
    id: 'craft-box',
    name: 'Kashmir Papier-Mâché Keepsake Box',
    desc: 'Handmade paper pulp with genuine gold leaf floral motifs. Exquisite, sustainable, and uniquely Kashmiri.',
    image: '/images/crafts-gifting-box.jpg',
  },
  {
    id: 'brass-tray',
    name: 'Embossed Brass / Copper Serving Platter',
    desc: 'Traditional hammered metal craftsmanship from artisan guilds with velvet ribbon wrapping.',
    image: '/images/crystal-gold-nut-bowls.jpg',
  },
  {
    id: 'custom-sleeve',
    name: 'Custom Pantone-Matched Designer Sleeve',
    desc: 'Tailored to match your wedding invitation color palette, typography, wax seals, and laser cuts.',
    image: '/images/corporate-diwali-gifting.jpg',
  },
]

export const WEDDING_CURATIONS = [
  {
    id: 'wed-cur-001',
    name: 'The Noor-e-Kashmir Royal Wedding Box',
    subtitle: 'VIP Family & Roka Gift',
    price: 3800,
    contents: ['200g Kashmiri Kagzi Akhrot', '200g W240 Cashews', '200g California Almonds', '1g Pure Pampore Mongra Saffron', '250g Raw Acacia Honey'],
    packaging: 'Emerald Velvet Rigid Chest with Gold Foil Seal',
    image: '/images/crafts-gifting-box.jpg',
    minQty: 25,
  },
  {
    id: 'wed-cur-002',
    name: 'The Chinar Blossom Favour Hamper',
    subtitle: 'Guest Welcome & Mehendi Keepsake',
    price: 1250,
    contents: ['150g California Almonds', '150g Roasted Salted Cashews', '100g Desi Ghee Pink Salt Makhana', 'Personalized Wedding Note'],
    packaging: 'Custom Monogram Rigid Box with Satin Ribbon',
    image: '/images/luxury-teal-gift-box.jpg',
    minQty: 50,
  },
  {
    id: 'wed-cur-003',
    name: 'The Badamwari Return Gift Platter',
    subtitle: 'Reception Gratitude Box',
    price: 1850,
    contents: ['150g California Almonds', '150g W240 Cashews', '150g Iranian Pistachios', '150g Royal Medjool Dates'],
    packaging: 'Gold Foil 4-Jar Octagonal Presentation Box',
    image: '/images/luxury-hamper-jars.png',
    minQty: 50,
  },
  {
    id: 'wed-cur-004',
    name: 'The Shehr-e-Khaas Heritage Trousseau Chest',
    subtitle: 'Luxury In-Law & Elder Blessing Gift',
    price: 8500,
    contents: ['Pure Cashmere Pashmina Stole', '1g Pampore Saffron', '250g Snow White Walnuts', '250g Mamra Almonds', 'Hand-Carved Walnut Wood Box'],
    packaging: 'Heirloom Carved Kashmiri Walnut Wood Box',
    image: '/images/dark-wood-gourmet-tray.jpg',
    minQty: 10,
  },
]
