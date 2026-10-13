// ─── Nuty Tales NRI — Pan-India Configurable Image & Visual Asset Registry ─────
// Authentic National Representation across North, West, South, East & Central India

export interface PanIndiaImage {
  id: string
  url: string
  title: string
  alt: string
  region: 'North' | 'West' | 'South' | 'East' | 'Central' | 'Pan-India'
  state: string
  city: string
  category: string
  environmentType: 'Apartment' | 'Villa / Independent Home' | 'Heritage Estate' | 'Elder Care' | 'Commercial & Legal' | 'Celebration' | 'Travel'
  caption: string
  provenance: string
}

export const PAN_INDIA_IMAGE_REGISTRY: PanIndiaImage[] = [
  // ── North India ──
  {
    id: 'img-delhi-residence',
    url: '/images/nri/delhi-residence.jpg',
    title: 'Modern Residential Estate — Delhi NCR',
    alt: 'Modern residential property in Delhi NCR handled by Nuty Tales',
    region: 'North',
    state: 'Delhi / Haryana',
    city: 'Delhi NCR',
    category: 'property_management',
    environmentType: 'Villa / Independent Home',
    caption: 'Turnkey property management, tenant oversight & walkthroughs in Delhi NCR & Gurugram',
    provenance: 'Curated architectural asset • North India Hub',
  },
  {
    id: 'img-jaipur-heritage',
    url: '/images/nri/jaipur-heritage.jpg',
    title: 'Heritage Architectural Property — Jaipur',
    alt: 'Heritage residence in Jaipur, Rajasthan',
    region: 'North',
    state: 'Rajasthan',
    city: 'Jaipur',
    category: 'weddings_events',
    environmentType: 'Heritage Estate',
    caption: 'Heritage estate management, destination weddings & family events in Rajasthan',
    provenance: 'Curated architectural asset • Rajasthan Corridor',
  },
  {
    id: 'img-kashmir-orchard',
    url: '/images/stays/kashmir-orchard-estate.jpg',
    title: 'Harwan Orchard Estate — Srinagar',
    alt: 'Ancestral orchard estate in Srinagar, Kashmir',
    region: 'North',
    state: 'Jammu & Kashmir',
    city: 'Srinagar',
    category: 'property_management',
    environmentType: 'Heritage Estate',
    caption: 'Ancestral orchard maintenance, winterization & perimeter audits in Kashmir Valley',
    provenance: 'Nuty Tales J&K Ground Verification Dossier (34.1481° N, 74.8973° E)',
  },

  // ── West India ──
  {
    id: 'img-mumbai-apartment',
    url: '/images/nri/mumbai-apartment.jpg',
    title: 'Contemporary High-Rise Apartment — Mumbai',
    alt: 'High-rise residential apartment in Mumbai handled by Nuty Tales',
    region: 'West',
    state: 'Maharashtra',
    city: 'Mumbai',
    category: 'property_management',
    environmentType: 'Apartment',
    caption: 'Society liaison, tenant handover & routine key-holding oversight in Mumbai MMR',
    provenance: 'Curated urban residential asset • West India Hub',
  },
  {
    id: 'img-modern-interior',
    url: '/images/nri/modern-apartment-interior.jpg',
    title: 'Turnkey Apartment Interior — Pune / Mumbai',
    alt: 'Turnkey residential apartment interior inspection',
    region: 'West',
    state: 'Maharashtra',
    city: 'Pune',
    category: 'home_services',
    environmentType: 'Apartment',
    caption: 'Pre-visit deep sanitization, carpentry & interior checkups',
    provenance: 'Curated residential interior asset • Western Urban Corridor',
  },

  // ── South India ──
  {
    id: 'img-bengaluru-villa',
    url: '/images/nri/bengaluru-villa.jpg',
    title: 'Suburban Executive Villa — Bengaluru',
    alt: 'Executive gated community villa in Bengaluru handled by Nuty Tales',
    region: 'South',
    state: 'Karnataka',
    city: 'Bengaluru',
    category: 'property_management',
    environmentType: 'Villa / Independent Home',
    caption: 'Villa plot inspections, utility clearance & tenant coordination in Bengaluru',
    provenance: 'Curated suburban asset • South India Tech Corridor',
  },
  {
    id: 'img-kerala-heritage',
    url: '/images/nri/kerala-heritage.jpg',
    title: 'Heritage Coastal Homestay & Backwaters — Kerala',
    alt: 'Traditional heritage home and coastal estate in Kerala',
    region: 'South',
    state: 'Kerala',
    city: 'Kochi',
    category: 'travel_stays',
    environmentType: 'Heritage Estate',
    caption: 'Ancestral home maintenance & bespoke diaspora return itineraries in Kerala',
    provenance: 'Curated landscape asset • Malabar & Coastal South',
  },

  // ── East India ──
  {
    id: 'img-kolkata-heritage',
    url: '/images/nri/kolkata-heritage.jpg',
    title: 'Colonial Heritage Residence — Kolkata',
    alt: 'Historic residential property in Kolkata handled by Nuty Tales',
    region: 'East',
    state: 'West Bengal',
    city: 'Kolkata',
    category: 'property_management',
    environmentType: 'Heritage Estate',
    caption: 'Ancestral property audits, legal record retrieval & parent care in Eastern India',
    provenance: 'Curated heritage asset • East India Hub',
  },

  // ── Services & Human Context ──
  {
    id: 'img-senior-care',
    url: '/images/nri/senior-care.jpg',
    title: 'Respectful Elder Parent Companionship',
    alt: 'Compassionate companion care for elderly parents in India',
    region: 'Pan-India',
    state: 'National',
    city: 'Multi-City',
    category: 'parent_care',
    environmentType: 'Elder Care',
    caption: 'Weekly home companion visits, medicine replenishment & compassionate check-ins',
    provenance: 'Curated healthcare asset • Verified Care Protocol',
  },
  {
    id: 'img-home-repair',
    url: '/images/nri/home-repair.jpg',
    title: 'Professional Home Maintenance & Civil Repairs',
    alt: 'Civil repair and plumbing inspection technician in India',
    region: 'Pan-India',
    state: 'National',
    city: 'Multi-City',
    category: 'home_services',
    environmentType: 'Villa / Independent Home',
    caption: 'Turnkey contractor supervision, plumbing repairs, electrical audits & waterproofing',
    provenance: 'Curated technician asset • Verified Contractor Protocol',
  },
  {
    id: 'img-legal-docs',
    url: '/images/nri/legal-docs.jpg',
    title: 'Bar Council Legal Liaison & Document Registration',
    alt: 'Legal document review and notarization in India',
    region: 'Pan-India',
    state: 'National',
    city: 'Multi-City',
    category: 'legal_documents',
    environmentType: 'Commercial & Legal',
    caption: 'Power of Attorney drafting, Sub-Registrar execution & revenue title searches',
    provenance: 'Curated professional asset • Bar Council Liaison',
  },
  {
    id: 'img-healthcare-escort',
    url: '/images/nri/healthcare-escort.jpg',
    title: 'Specialist Medical Liaison & Hospital Escorts',
    alt: 'Accompanied doctor appointment and medical consultation',
    region: 'Pan-India',
    state: 'National',
    city: 'Multi-City',
    category: 'healthcare',
    environmentType: 'Commercial & Legal',
    caption: 'Accompanied OPD appointments, diagnostic tests & medical records digitization',
    provenance: 'Curated medical asset • Hospital Coordination Protocol',
  },
  {
    id: 'img-wedding-celebration',
    url: '/images/nri/wedding-celebration.jpg',
    title: 'Authentic Destination Wedding Coordination',
    alt: 'Traditional Indian wedding ceremony and mandap setup',
    region: 'Pan-India',
    state: 'National',
    city: 'Multi-City',
    category: 'weddings_events',
    environmentType: 'Celebration',
    caption: 'End-to-end wedding logistics, venue procurement & hospitality across Indian destinations',
    provenance: 'Curated event asset • Celebrations Protocol',
  },
  {
    id: 'img-gifting-hamper',
    url: '/images/nri/gifting-hamper.jpg',
    title: 'Bespoke Indian Gifting & Milestone Deliveries',
    alt: 'Artisanal gift hamper and festive delivery boxes in India',
    region: 'Pan-India',
    state: 'National',
    city: 'Multi-City',
    category: 'gifting_deliveries',
    environmentType: 'Celebration',
    caption: 'Handcrafted luxury hampers, GI saffron & dry fruit boxes delivered nationwide',
    provenance: 'Curated artisan asset • Nuty Tales Gifting Suite',
  },
]

import { ALL_INDIA_TERRITORIES } from './states-territories'

export const PAN_INDIA_DESTINATIONS = ALL_INDIA_TERRITORIES.map((t) => ({
  city: t.name,
  state: `${t.type} • Hub: ${t.capital}`,
  region: t.region,
  status: (t.operationalTier.includes('Direct')
    ? 'Direct Fulfillment Hub'
    : t.operationalTier.includes('Scoped')
    ? 'Scoped RFQ Dispatch'
    : 'Expanding Network') as 'Direct Fulfillment Hub' | 'Scoped RFQ Dispatch' | 'Limited Categories' | 'Expanding Network',
  statusBadge: t.statusBadge,
  badgeColor: t.badgeColor,
  image: t.image,
  description: t.description,
  highlights: t.leadServices.slice(0, 3),
}))
