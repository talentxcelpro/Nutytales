// ─── Nuty Tales NRI — Master Service Catalog & Operational Data ─────────────────
// Operating Platform for Indians Living Abroad | nri.nutytales.com

import { ServiceCategoryKey, OperationalCity, NriProvider } from './types'
import { ALL_INDIA_TERRITORIES, TERRITORY_COUNTS } from './states-territories'

export { ALL_INDIA_TERRITORIES, TERRITORY_COUNTS }

export interface CategoryInfo {
  key: ServiceCategoryKey
  title: string
  shortTitle: string
  tagline: string
  heroBadge: string
  icon: string
  description: string
  inclusions: string[]
  sampleServices: {
    id: string
    name: string
    turnaround: string
    pricingType: 'Fixed' | 'Quote' | 'Monthly Retainer'
    estimatedRange: string
    deliverable: string
  }[]
  inspectionChecklist?: string[]
  regulatoryDisclaimer?: string
  popularCities: string[]
  faqs: { q: string; a: string }[]
}

export const NRI_CATEGORIES: Record<ServiceCategoryKey, CategoryInfo> = {
  property_management: {
    key: 'property_management',
    title: 'Property & Home Management',
    shortTitle: 'Property Care',
    tagline: 'Inspections, tenant coordination, repairs & vacant property oversight in India',
    heroBadge: 'GPS Timestamped Proof',
    icon: '🏡',
    description:
      'Manage ancestral homes, rental apartments, and vacant plots across India with complete visibility. Our verified ground coordinators conduct physical walkthroughs, capture high-resolution photographic evidence, interface with tenants, and resolve maintenance issues.',
    inclusions: [
      'Comprehensive 42-point interior & exterior inspection',
      'High-resolution date/GPS stamped photographs & video walkthrough',
      'Tenant agreement verification & maintenance request resolution',
      'Electricity, water, society maintenance & municipal tax coordination',
      'Pre-monsoon and post-winter structural seepage audits',
      'Emergency visit within 24 hours for severe weather or security alerts',
    ],
    sampleServices: [
      {
        id: 'prop-insp-1',
        name: 'Comprehensive Property Inspection & Health Report',
        turnaround: '48-72 Hours',
        pricingType: 'Fixed',
        estimatedRange: '₹3,499 – ₹4,999 (Per Visit)',
        deliverable: 'Digital Inspection Dossier with 30+ Photos and Structural Checklist',
      },
      {
        id: 'prop-mgmt-retainer',
        name: 'Annual Caretaker & Tenant Oversight Retainer',
        turnaround: 'Continuous Monthly',
        pricingType: 'Monthly Retainer',
        estimatedRange: '₹4,999 – ₹9,999 / month (Illustrative)',
        deliverable: 'Bi-monthly visits, utility management, tenant rent ledger, repair coordination',
      },
      {
        id: 'prop-deep-clean',
        name: 'Pre-Visit Deep Cleaning & Turnkey Setup',
        turnaround: '2-3 Days',
        pricingType: 'Quote',
        estimatedRange: '₹6,000 – ₹15,000 based on sq.ft.',
        deliverable: 'Floor scrubbing, upholstery sanitization, kitchen chimney, water-tank flushing',
      },
      {
        id: 'prop-repair-coordination',
        name: 'Civil Repairs, Waterproofing & Painting Coordination',
        turnaround: '1-3 Weeks',
        pricingType: 'Quote',
        estimatedRange: 'Custom Itemized Contractor Quotes',
        deliverable: 'Milestone payment schedule, before/after proof, supervisor signoff',
      },
    ],
    inspectionChecklist: [
      'Boundary wall, gate locks & exterior perimeter integrity',
      'Roof, ceiling & window sill moisture / seepage levels',
      'Plumbing fixtures, overhead water tank & drainage flow',
      'Main electrical distribution board, meters & earthing checks',
      'Cabinetry, termite evidence & woodwork status',
      'Utility meter readings (Electricity, Water, Piped Gas)',
    ],
    regulatoryDisclaimer:
      'Nuty Tales coordinates verified local execution partners. Legal title clearing and mutation require formal engagement with qualified revenue advocates.',
    popularCities: ['Srinagar', 'Delhi NCR', 'Mumbai', 'Bengaluru', 'Chandigarh', 'Pune'],
    faqs: [
      {
        q: 'How do I know the coordinator actually visited my house in Srinagar or Delhi?',
        a: 'Every inspection produces an encrypted inspection report containing geotagged, timestamped photos of the exterior, electricity meter, and interior rooms. You can review the evidence and approve completion before milestones are released.',
      },
      {
        q: 'Can you handle tenant check-in and inventory sign-off?',
        a: 'Yes. Our ground team verifies tenant identification documents, conducts detailed inventory inspections before handover, and obtains signed acceptance sheets.',
      },
    ],
  },

  parent_care: {
    key: 'parent_care',
    title: 'Family, Parents & Senior Assistance',
    shortTitle: 'Parent Care',
    tagline: 'Scheduled home visits, medical errands, grocery delivery & trusted companion liaison',
    heroBadge: 'Dedicated Local Companion',
    icon: '❤️',
    description:
      'Be there for your parents in India even when you are thousands of miles away. We provide respectful, reliable, and background-verified local companions who visit regularly, coordinate grocery replenishment, pick up prescription medicines, and accompany them on outings.',
    inclusions: [
      'Scheduled bi-weekly or monthly respectful home visits',
      'Doorstep prescription medicine pickup & delivery from licensed pharmacies',
      'Grocery & monthly pantry replenishment coordination',
      'Utility bill payment, pension life certificate & bank branch escort',
      '24/7 emergency response escalation with local ambulance coordination',
      'Post-visit WhatsApp or portal summary with approved photos',
    ],
    sampleServices: [
      {
        id: 'parent-visit-single',
        name: 'Companion Home Visit & Household Errand Run',
        turnaround: 'Scheduled 2-hour visit',
        pricingType: 'Fixed',
        estimatedRange: '₹1,499 – ₹2,499 / visit',
        deliverable: 'Wellness check-in, errand completion, digital family report',
      },
      {
        id: 'parent-care-essential',
        name: 'Essential Parent Care Plan (2 Visits/Month)',
        turnaround: 'Monthly Standing Plan',
        pricingType: 'Monthly Retainer',
        estimatedRange: '₹4,999 / month (Illustrative)',
        deliverable: '2 Companion visits, medicine pickup, bill payments, emergency contact hotline',
      },
      {
        id: 'parent-care-plus',
        name: 'Plus Guardian Care Plan (4 Visits/Month)',
        turnaround: 'Weekly Visits',
        pricingType: 'Monthly Retainer',
        estimatedRange: '₹9,999 / month (Illustrative)',
        deliverable: 'Weekly visits, doctor appointment accompaniment, dedicated care manager',
      },
    ],
    regulatoryDisclaimer:
      'We coordinate non-clinical companion and logistical support. For acute medical emergencies, local emergency numbers (112 / 102) must be dialed immediately.',
    popularCities: ['Delhi NCR', 'Srinagar', 'Chandigarh', 'Mumbai', 'Bengaluru', 'Amritsar'],
    faqs: [
      {
        q: 'Who are the companions visiting my elderly parents?',
        a: 'Our companions undergo Aadhaar identity verification, police verification, reference checks, and interview vetting for empathy and patience.',
      },
      {
        q: 'Can my siblings in Canada and the UK also view the visit reports?',
        a: 'Yes. The My India dashboard supports multi-family authorized access so all siblings can see visit photos, notes, and medication refill alerts simultaneously.',
      },
    ],
  },

  healthcare: {
    key: 'healthcare',
    title: 'Healthcare Coordination',
    shortTitle: 'Healthcare',
    tagline: 'Specialist hospital bookings, diagnostic sample pickups & post-hospital caregiver coordination',
    heroBadge: 'NABH Hospital Partners',
    icon: '🏥',
    description:
      'Navigate the Indian medical ecosystem seamlessly. We assist in scheduling consultations with senior consultants at top tertiary hospitals, arranging accredited diagnostic home visits, and coordinating vetted nursing attendants.',
    inclusions: [
      'Priority OPD appointment booking with renowned senior specialists',
      'Home blood and diagnostic sample collection via NABL accredited laboratories',
      'Hospital admission and discharge documentation assistance',
      'Vetted medical attendants and bedside caregivers for recovery',
      'Consolidation and digital archiving of medical prescriptions and lab reports',
    ],
    sampleServices: [
      {
        id: 'health-opd-escort',
        name: 'Specialist Consultation & Hospital Escort',
        turnaround: 'Half-day accompaniment',
        pricingType: 'Fixed',
        estimatedRange: '₹1,999 – ₹3,499 + Hospital Consultation Fee',
        deliverable: 'Queue management, wheelchair assistance, report digital upload',
      },
      {
        id: 'health-home-diagnostics',
        name: 'NABL Diagnostic Blood Profile (Home Sample)',
        turnaround: 'Same day collection, 24h reports',
        pricingType: 'Fixed',
        estimatedRange: '₹1,200 – ₹3,500 (At Lab Rates)',
        deliverable: 'Accredited digital report delivered directly to your NRI account',
      },
      {
        id: 'health-second-opinion',
        name: 'Super-Specialist Tele-Review & Second Opinion',
        turnaround: '3-5 Business Days',
        pricingType: 'Quote',
        estimatedRange: '₹3,000 – ₹6,000',
        deliverable: 'Written clinical assessment by leading Indian specialist',
      },
    ],
    regulatoryDisclaimer:
      'Nuty Tales is a healthcare logistics and coordination platform. We do not practice medicine, diagnose conditions, or prescribe medications.',
    popularCities: ['Delhi NCR', 'Mumbai', 'Bengaluru', 'Hyderabad', 'Srinagar', 'Pune'],
    faqs: [
      {
        q: 'Can you arrange a private ambulance or wheelchair cab?',
        a: 'Yes, we coordinate sanitized medical transport vehicles with attendants for hospital appointments.',
      },
    ],
  },

  legal_documents: {
    key: 'legal_documents',
    title: 'Legal, Documents & Government Assistance',
    shortTitle: 'Legal & POA',
    tagline: 'Power of Attorney consular registration, property title checks & revenue record retrieval',
    heroBadge: 'Bar Council Advocates',
    icon: '📜',
    description:
      'Resolve bureaucratic requirements in India without needing an emergency flight. Our network of verified Bar Council enrolled advocates and document specialists coordinates Power of Attorney (POA) registration, revenue extracts (Jamabandi/Fard), and civil registry paperwork.',
    inclusions: [
      'POA drafting formatted for Indian consular attestation abroad and Sub-Registrar execution in India',
      'Property title search, Encumbrance Certificate (EC) retrieval, and mutation record extraction',
      'Succession certificate, legal heir documentation, and Will execution consultations',
      'Birth, marriage, and police clearance certificate procurement coordination',
      'Private cloud document vault with end-to-end encrypted sharing',
    ],
    sampleServices: [
      {
        id: 'legal-poa-package',
        name: 'NRI Power of Attorney (Drafting & Sub-Registrar Stamping)',
        turnaround: '5-10 Business Days',
        pricingType: 'Fixed',
        estimatedRange: '₹7,500 – ₹14,000 (Excl. Govt Stamp Duty)',
        deliverable: 'Consulate-compliant draft, SDM/Registrar adjudication support, legal receipt',
      },
      {
        id: 'legal-title-search',
        name: '30-Year Property Title Search & Encumbrance Report',
        turnaround: '7-12 Business Days',
        pricingType: 'Fixed',
        estimatedRange: '₹12,000 – ₹25,000',
        deliverable: 'Advocate-certified search report and certified record copies from Sub-Registrar',
      },
      {
        id: 'legal-revenue-fard',
        name: 'Kashmir Revenue Record (Fard / Jamabandi / Intiqal)',
        turnaround: '1-2 Weeks',
        pricingType: 'Quote',
        estimatedRange: '₹8,000 – ₹18,000',
        deliverable: 'Official certified revenue extract from Patwari / Tehsildar office',
      },
    ],
    regulatoryDisclaimer:
      'Legal advice is rendered solely by independent Bar Council advocates. Nuty Tales coordinates document logistics and transparent invoicing.',
    popularCities: ['Srinagar', 'Delhi NCR', 'Chandigarh', 'Mumbai', 'Amritsar', 'Bengaluru'],
    faqs: [
      {
        q: 'How does an NRI execute a Power of Attorney while living in the UK or US?',
        a: 'We prepare the custom legal draft conforming to your specific state/registrar requirements in India. You print it, execute it before the Indian High Commission/Consulate or an authorized apostille notary in your country, and courier it to our advocate for adjudication and registration with the Sub-Registrar.',
      },
    ],
  },

  tax_finance: {
    key: 'tax_finance',
    title: 'Tax, Finance & Professional Assistance',
    shortTitle: 'Tax & FEMA',
    tagline: 'NRI income tax filing, Form 15CA/15CB repatriation, capital gains & NRE/NRO banking',
    heroBadge: 'ICAI Chartered Accountants',
    icon: '📊',
    description:
      'Manage cross-border tax liabilities and repatriation smoothly. Qualified Indian Chartered Accountants assist with NRI ITR filing, capital gains on Indian property sales, Form 15CA/15CB foreign remittances, and lower TDS certificates.',
    inclusions: [
      'NRI Income Tax Return (ITR-2 / ITR-3) preparation and e-filing with the ITD',
      'Capital gains computation and Section 54/54EC exemption planning on real estate sales',
      'Form 15CB CA certification & Form 15CA submission on the income tax portal for funds repatriation',
      'Lower TDS certificate application (Section 197) to reduce withholding tax from 20% to actual rate',
      'NRE / NRO bank account resolution and RBI FEMA compliance advice',
    ],
    sampleServices: [
      {
        id: 'tax-nri-itr',
        name: 'NRI Annual Income Tax Return (ITR-2/3)',
        turnaround: '3-5 Business Days',
        pricingType: 'Fixed',
        estimatedRange: '₹4,999 – ₹9,999',
        deliverable: 'Verified computation sheet, e-filing acknowledgement, refund tracking',
      },
      {
        id: 'tax-15ca-15cb',
        name: 'Form 15CA & 15CB Repatriation Certification',
        turnaround: '2-4 Business Days',
        pricingType: 'Fixed',
        estimatedRange: '₹7,500 – ₹15,000 (Per Remittance)',
        deliverable: 'Digitally signed 15CB CA Certificate and 15CA portal filing for AD Bank',
      },
      {
        id: 'tax-lower-tds-197',
        name: 'Section 197 Lower TDS Certificate (Property Sale)',
        turnaround: '3-6 Weeks (Govt Processing)',
        pricingType: 'Quote',
        estimatedRange: '₹20,000 – ₹35,000',
        deliverable: 'Assessing Officer Lower Withholding Certificate protecting seller capital',
      },
    ],
    regulatoryDisclaimer:
      'All tax certifications and statutory filings are executed by independent ICAI registered Chartered Accountants in accordance with the Chartered Accountants Act.',
    popularCities: ['Delhi NCR', 'Mumbai', 'Bengaluru', 'Srinagar', 'Hyderabad', 'Pune'],
    faqs: [
      {
        q: 'Can I repatriate the sale proceeds of my property in Srinagar or Delhi to my bank in the US?',
        a: 'Yes. Under RBI FEMA guidelines, an NRI can repatriate up to USD 1,000,000 per financial year from their NRO account upon submitting Form 15CA and Form 15CB issued by a Chartered Accountant.',
      },
    ],
  },

  home_services: {
    key: 'home_services',
    title: 'Home Services & Civil Repairs',
    shortTitle: 'Home Repairs',
    tagline: 'Deep sanitization, plumbing, electrical rewiring, waterproofing & turnkey painting',
    heroBadge: 'Vetted Craft Guilds',
    icon: '🔧',
    description:
      'Keep your home in pristine condition before you arrive or protect it during harsh winters and monsoons. We coordinate certified electricians, plumbers, carpenters, and waterproofing teams with structured milestone payment approval.',
    inclusions: [
      'High-pressure deep cleaning of villas, apartments, and courtyards',
      'Complete plumbing health checks, pipe winterization & tank flushing',
      'Electrical rewiring, inverter battery maintenance & switchboard upgrades',
      'Roof, terrace & balcony waterproofing and winter thermal sealing',
      'Turnkey interior painting with premium low-VOC paints',
    ],
    sampleServices: [
      {
        id: 'home-plumb-elec',
        name: 'Plumbing & Electrical Comprehensive Diagnostic',
        turnaround: '1-2 Days',
        pricingType: 'Fixed',
        estimatedRange: '₹1,499 – ₹2,999',
        deliverable: 'Full pressure test, fuse box test, written repair quote',
      },
      {
        id: 'home-waterproof',
        name: 'Terrace & Roof Waterproofing Treatment',
        turnaround: '3-7 Days',
        pricingType: 'Quote',
        estimatedRange: 'Itemized per sq.ft quotation',
        deliverable: 'Elastomeric membrane application, before/after photos, 3-5 year warranty',
      },
    ],
    popularCities: ['Srinagar', 'Delhi NCR', 'Chandigarh', 'Mumbai', 'Bengaluru'],
    faqs: [
      {
        q: 'Can you winterize my house in Srinagar to prevent pipes from bursting in snow season?',
        a: 'Yes. Our specialized Kashmir winterization team drains water heaters, adds insulated thermal jackets to exposed pipes, and seals windows.',
      },
    ],
  },

  travel_stays: {
    key: 'travel_stays',
    title: 'Travel, Chauffeurs & Stays',
    shortTitle: 'Travel & Stays',
    tagline: 'Bespoke Kashmir journeys, airport transfers, luxury heritage villas & family itineraries',
    heroBadge: 'Private Chauffeurs & Stays',
    icon: '✈️',
    description:
      'Experience India with absolute peace of mind. We arrange private airport transfers, sanitized luxury vehicles with verified chauffeurs, private heritage orchard estates in Kashmir, and personalized family travel experiences.',
    inclusions: [
      'Airport meet-and-greet at Delhi, Srinagar, Mumbai, and Bengaluru',
      'Dedicated sanitized Innova Crysta / Fortuner with English-speaking chauffeur',
      'Curated bookings at Nuty Tales boutique heritage estates and orchard villas',
      'Dal Lake luxury shikara experiences and private Gulmarg snow excursions',
      '24/7 travel desk liaison for seamless flight or itinerary adjustments',
    ],
    sampleServices: [
      {
        id: 'travel-airport-transfer',
        name: 'VIP Airport Meet, Greet & Luxury Transfer',
        turnaround: 'Live Flight Tracking',
        pricingType: 'Fixed',
        estimatedRange: '₹2,499 – ₹4,999',
        deliverable: 'Terminal arrival assistance, luggage porter, sanitized luxury SUV',
      },
      {
        id: 'travel-chauffeur-week',
        name: 'Dedicated Chauffeur & Vehicle (7-Day Valley Pass)',
        turnaround: '7 Consecutive Days',
        pricingType: 'Fixed',
        estimatedRange: '₹28,000 – ₹42,000 (Incl. Fuel & Tolls)',
        deliverable: 'Experienced mountain driver, unlimited local standby, 24/7 hotline',
      },
      {
        id: 'travel-orchard-stay',
        name: 'Private Harwan Orchard Estate (3 Nights Heritage Stay)',
        turnaround: 'Seasonal Booking',
        pricingType: 'Fixed',
        estimatedRange: '₹35,000 – ₹65,000',
        deliverable: 'Exclusive estate buyout, private chef with traditional wazwan & kahwa',
      },
    ],
    popularCities: ['Srinagar', 'Gulmarg', 'Pahalgam', 'Delhi NCR', 'Agra', 'Jaipur'],
    faqs: [
      {
        q: 'Can I book travel and villas directly through my NRI account?',
        a: 'Yes. All stays and vehicle bookings are managed directly from your NRI dashboard with consolidated billing in USD, GBP, AED, CAD, or INR.',
      },
    ],
  },

  weddings_events: {
    key: 'weddings_events',
    title: 'Weddings & Milestone Celebrations',
    shortTitle: 'Weddings',
    tagline: 'Destination Kashmir & royal Indian weddings orchestrated seamlessly from abroad',
    heroBadge: 'Wedding Command Center',
    icon: '💍',
    description:
      'Plan your dream destination wedding in India from London, Dubai, Toronto, or New York. Our dedicated wedding managers oversee venue procurement, traditional Kashmiri Wazwan banquets, bridal trousseau, guest transportation, and decor.',
    inclusions: [
      'Complete vendor orchestration (Venues, Decorators, Sound, Photographers)',
      'Traditional Kashmiri Wazwan master chefs (Wazas) and luxury catering',
      'Tilla & Pashmina bridal trousseau sourcing directly from master artisans',
      'Airport logistics and luxury boutique stay allocations for overseas guests',
      'Dedicated on-ground wedding day producer and bilingual guest concierge',
    ],
    sampleServices: [
      {
        id: 'wed-remote-concierge',
        name: 'Destination Wedding Command Center & Ground Producer',
        turnaround: '3-6 Months Planning',
        pricingType: 'Monthly Retainer',
        estimatedRange: '₹50,000 – ₹1,50,000 / month',
        deliverable: 'Vendor contracts, timeline tracking, budget ledger, rehearsal management',
      },
      {
        id: 'wed-favor-curation',
        name: 'Curated Heritage Favors (Walnut Wood & Royal Saffron Boxes)',
        turnaround: '2-4 Weeks Production',
        pricingType: 'Quote',
        estimatedRange: '₹1,500 – ₹4,500 per box',
        deliverable: 'Custom brass monogrammed boxes, nitrogen-sealed dry fruits, guest delivery',
      },
    ],
    popularCities: ['Srinagar', 'Delhi NCR', 'Jaipur', 'Udaipur', 'Goa'],
    faqs: [
      {
        q: 'Can we taste the menu or inspect decor remotely?',
        a: 'Yes. We conduct high-definition live video walkthroughs of venue setups, decor mockups, and deliver tasting hampers to your family in India for sign-off.',
      },
    ],
  },

  gifting_deliveries: {
    key: 'gifting_deliveries',
    title: 'Gifting & Occasion Deliveries',
    shortTitle: 'Gifting',
    tagline: 'Handcrafted festive hampers, gourmet dry fruits, Pashmina stoles & doorstep deliveries',
    heroBadge: 'Personalized Delivery Proof',
    icon: '🎁',
    description:
      'Celebrate life milestones, Eid, Diwali, birthdays, and anniversaries with family across India. Send luxury single-origin Kashmiri Kagzi walnuts, Grade-A Mongra saffron, royal Mamra almonds, and GI-certified shawls with handwritten notes.',
    inclusions: [
      'Single-origin organic dry fruit and saffron gift boxes in handcrafted walnut wood',
      'Artisan crafted GI certified Pashmina shawls and hand-embroidered stoles',
      'Customized calligraphed greeting card with your personalized message',
      'Scheduled doorstep delivery with photographic delivery confirmation',
      'International card payment with zero conversion surprises',
    ],
    sampleServices: [
      {
        id: 'gift-chinar-royal',
        name: 'Royal Chinar Saffron & Mamra Almond Wooden Hamper',
        turnaround: '2-4 Days Express Dispatch',
        pricingType: 'Fixed',
        estimatedRange: '₹4,499 – ₹7,999',
        deliverable: 'Carved walnut wood keepsake box, 5g Mongra Saffron, 500g Mamra Almonds',
      },
      {
        id: 'gift-festival-bulk',
        name: 'Family & Corporate Festival Distribution (Multi-Address)',
        turnaround: 'Scheduled Festival Day',
        pricingType: 'Quote',
        estimatedRange: 'Custom Volume Tiers',
        deliverable: 'Multi-recipient address management, real-time dispatch dashboard',
      },
    ],
    popularCities: ['Pan-India Delivery (All Pincodes)'],
    faqs: [
      {
        q: 'Can I schedule a gift delivery on the exact day of my mother’s birthday in India?',
        a: 'Yes. You can select the exact delivery date during checkout, and our delivery team will hand-deliver the hamper with your personal greeting card.',
      },
    ],
  },

  crafts_heritage: {
    key: 'crafts_heritage',
    title: 'Crafts & Heritage Products',
    shortTitle: 'Heritage Crafts',
    tagline: 'GI-certified Kashmiri Pashmina, walnut wood master carvings & hand-knotted silk rugs',
    heroBadge: 'GI Tag Authenticated',
    icon: '🧣',
    description:
      'Direct provenance from master artisans of Kashmir. Source heirloom GI-tagged Kani and Sozni Pashmina shawls, carved walnut wood dining masterpieces, and genuine hand-knotted silk carpets with verifiable craft certification.',
    inclusions: [
      'Government GI (Geographical Indication) micro-chipped certification on luxury Pashmina',
      'Direct artisan guild pricing with zero middleman markups',
      'Custom bespoke sizing for hand-knotted silk rugs and heritage furniture',
      'Insured global and domestic door-to-door courier logistics',
    ],
    sampleServices: [
      {
        id: 'craft-kani-pashmina',
        name: 'Heirloom Kani Pashmina Shawl (GI Certified)',
        turnaround: 'Ready / 3 Months Handloom',
        pricingType: 'Fixed',
        estimatedRange: '₹45,000 – ₹1,20,000',
        deliverable: 'GI micro-chip barcode certificate, luxury presentation casket',
      },
      {
        id: 'craft-walnut-furniture',
        name: 'Master Woodcarver Bespoke Furniture Piece',
        turnaround: '4-8 Weeks',
        pricingType: 'Quote',
        estimatedRange: 'Custom Woodcraft Pricing',
        deliverable: 'Seasoned Kashmir walnut wood, hand-carved Chinar motifs, worldwide crate delivery',
      },
    ],
    popularCities: ['Worldwide Delivery / Srinagar Atelier'],
    faqs: [
      {
        q: 'How is GI Pashmina certified?',
        a: 'Each piece is tested at the Craft Development Institute (CDI) Srinagar using microscopic laser diameter measurement (< 15 microns) and tagged with an official tamper-proof QR label.',
      },
    ],
  },

  business_procurement: {
    key: 'business_procurement',
    title: 'Business & Procurement Assistance',
    shortTitle: 'Business Sourcing',
    tagline: 'Supplier factory audits, commercial quality testing, local representation & corporate liaison',
    heroBadge: 'On-Ground Sourcing Desk',
    icon: '🏢',
    description:
      'Expand your business operations or source products from India without maintaining expensive local offices. Our commercial coordinators conduct factory verification audits, oversee batch quality inspections, and assist in legal registrations.',
    inclusions: [
      'Physical supplier factory visit, machinery audit & capacity verification',
      'Pre-shipment batch random sampling and NABL laboratory testing',
      'Private company incorporation, GST registration & trademark liaison',
      'Local sample consolidation and express international courier dispatch',
    ],
    sampleServices: [
      {
        id: 'biz-factory-audit',
        name: 'On-Ground Supplier Verification & Factory Audit',
        turnaround: '3-5 Business Days',
        pricingType: 'Fixed',
        estimatedRange: '₹14,999 – ₹24,999 (Plus Intercity Travel)',
        deliverable: '18-page audit report, machinery photos, GST/PAN verification, financial health score',
      },
      {
        id: 'biz-sample-testing',
        name: 'Commercial Commodity Batch Testing (NABL Accredited)',
        turnaround: '3-7 Business Days',
        pricingType: 'Fixed',
        estimatedRange: '₹8,000 – ₹15,000 (Per Test Parameter)',
        deliverable: 'Certified laboratory chemical / microbiological analysis certificate',
      },
    ],
    popularCities: ['Delhi NCR', 'Mumbai', 'Bengaluru', 'Srinagar', 'Hyderabad', 'Pune'],
    faqs: [
      {
        q: 'Can you verify an Indian supplier before I transfer advance money?',
        a: 'Yes. Our ground team visits their registered office and factory, verifies operational existence, talks to local market references, and checks legal registration filings.',
      },
    ],
  },

  agriculture_orchards: {
    key: 'agriculture_orchards',
    title: 'Ancestral Land, Agriculture & Orchard Care',
    shortTitle: 'Land & Orchards',
    tagline: 'Boundary stone demarcation, apple & mango orchard maintenance, soil audits & tenant farmer oversight',
    heroBadge: 'On-Ground Agricultural Desks',
    icon: '🌳',
    description:
      'Manage ancestral farmlands, tea gardens, apple orchards, and rural agricultural estates across India. Our verified agricultural coordinators perform physical boundary checks, oversee seasonal pruning and spraying, audit tube-well and borewell irrigation systems, and interface with local revenue officials and tenant farmers.',
    inclusions: [
      'Physical boundary stone demarcation & perimeter fence inspection',
      'Seasonal orchard pruning, pesticide spraying & harvest yield auditing',
      'Borewell, solar pump, drip irrigation & water table physical status check',
      'Tenant farmer crop-sharing agreement verification & physical harvest weighing',
      'Tehsildar and Patwari revenue record physical field inspection (Girdawari & Khasra)',
      'Soil testing sample collection and physical laboratory delivery',
    ],
    sampleServices: [
      {
        id: 'agri-orchard-audit',
        name: 'Seasonal Orchard & Estate Physical Health Audit',
        turnaround: '48-72 Hours',
        pricingType: 'Fixed',
        estimatedRange: '₹4,999 – ₹7,999 (Per Estate)',
        deliverable: 'Tree health count, pruning proof, boundary GPS report & irrigation verification dossier',
      },
      {
        id: 'agri-boundary-fencing',
        name: 'Boundary Demarcation & Physical Perimeter Fencing',
        turnaround: '1-2 Weeks',
        pricingType: 'Quote',
        estimatedRange: 'Custom Itemized Contractor Quotes',
        deliverable: 'Patwari presence report, concrete boundary pillars, barbed-wire fence installation proof',
      },
      {
        id: 'agri-tenant-harvest',
        name: 'Harvest Weighing & Crop-Sharing Oversight Retainer',
        turnaround: 'Continuous Seasonal',
        pricingType: 'Quote',
        estimatedRange: '₹12,000 – ₹25,000 / harvest season',
        deliverable: 'On-field harvest supervision, physical weighbridge slips, crop share reconciliation ledger',
      },
      {
        id: 'agri-irrigation-borewell',
        name: 'Tube-Well, Solar Pump & Irrigation Physical Audit',
        turnaround: '3-5 Days',
        pricingType: 'Fixed',
        estimatedRange: '₹3,499 – ₹5,500',
        deliverable: 'Pump flow rate test, electrical starter panel check, underground water line leakage test',
      },
    ],
    popularCities: ['Srinagar', 'Punjab', 'Himachal Pradesh', 'Maharashtra', 'Kerala', 'Assam'],
    faqs: [
      {
        q: 'Can you ensure local encroachers do not move boundary markers on our ancestral farm?',
        a: 'Yes. Our team conducts physical site visits, photographs existing survey boundary stones with GPS tags, and coordinates with the local Patwari / Revenue Kanungo for official boundary demarcations.',
      },
      {
        q: 'How do you monitor our apple or mango crop harvest when we live overseas?',
        a: 'Our ground supervisor stays on-site during harvest days, monitors crate picking, accompanies produce to the mandi weighbridge, and submits certified weighment receipts directly to your dashboard.',
      },
    ],
  },

  construction_renovation: {
    key: 'construction_renovation',
    title: 'Construction, Renovation & Structural Supervision',
    shortTitle: 'Construction Care',
    tagline: 'Civil construction progress audits, contractor milestone verification & structural snagging',
    heroBadge: 'Civil Engineer Site Audits',
    icon: '🏗️',
    description:
      'Build or renovate your home in India without fear of contractor shortcuts or phantom billing. Our qualified civil engineers and site supervisors visit your construction site in person, test material quality, verify stage completion before milestone funds are disbursed, and capture 360-degree high-definition video walkthroughs.',
    inclusions: [
      'Independent structural engineer physical site inspection & foundation checks',
      'Cement grade, TMT rebar steel verification & slump concrete testing',
      'Contractor bill verification and physical milestone completion sign-off',
      '120-point pre-handover builder snag list inspection (plumbing, tiles, hollow cavities)',
      'Terrace waterproofing, expansion joint caulking & external structural sealant checks',
      'High-definition 360° video walkthrough & milestone progress dossier',
    ],
    sampleServices: [
      {
        id: 'const-snag-inspection',
        name: '120-Point Pre-Possession Builder Snag List Audit',
        turnaround: '3-4 Days',
        pricingType: 'Fixed',
        estimatedRange: '₹6,499 – ₹11,999 based on sq.ft',
        deliverable: 'Room-by-room snag list, hollow tile acoustic test, plumbing slope check, electrical earth test',
      },
      {
        id: 'const-milestone-audit',
        name: 'Contractor Milestone Verification & Bill Audit',
        turnaround: '48 Hours',
        pricingType: 'Fixed',
        estimatedRange: '₹4,500 / Site Visit',
        deliverable: 'Measurement sheet verification, materials on-site ledger, engineer sign-off certificate',
      },
      {
        id: 'const-civil-retainer',
        name: 'Monthly Civil Construction Supervision Retainer',
        turnaround: 'Bi-Weekly Visits',
        pricingType: 'Monthly Retainer',
        estimatedRange: '₹14,999 – ₹24,999 / month',
        deliverable: 'Bi-weekly engineer visits, quality compliance report, contractor discrepancy arbitration',
      },
      {
        id: 'const-waterproof-audit',
        name: 'Terrace & Basement Waterproofing Quality Audit',
        turnaround: '2-3 Days',
        pricingType: 'Fixed',
        estimatedRange: '₹3,999 – ₹6,999',
        deliverable: 'Ponding flood test (48 hours), thermal moisture camera imaging, warranty verification',
      },
    ],
    popularCities: ['Delhi NCR', 'Bengaluru', 'Mumbai', 'Chandigarh', 'Hyderabad', 'Kochi'],
    faqs: [
      {
        q: 'How does Nuty Tales prevent local contractors from overcharging or using sub-standard materials?',
        a: 'Our independent civil engineers verify actual physical quantities of steel, brick, and cement against the architect blueprints before you release stage payments, ensuring you only pay for completed, tested work.',
      },
    ],
  },

  vehicle_garage_care: {
    key: 'vehicle_garage_care',
    title: 'Vehicle Care, Garage & RTO Logistics',
    shortTitle: 'Vehicle & Garage',
    tagline: 'Long-term garage caretaking, battery maintenance, RTO fitness renewal & airport chauffeur delivery',
    heroBadge: 'In-Garage Physical Upkeep',
    icon: '🚗',
    description:
      'Keep your cars and two-wheelers in India in pristine running condition while you live abroad. Our ground coordinators visit your garage, trickle-charge batteries, start and idle engines, perform rodent-repellent treatments, escort vehicles to authorized dealership service centers, and renew official RTO fitness and HSRP plates.',
    inclusions: [
      'Bi-weekly engine warm-up, tire flat-spot prevention & battery voltage check',
      'In-garage professional dry cleaning, exterior wash & moisture-proofing',
      'Dealership annual service physical escort (Maruti, Toyota, Hyundai, Honda, luxury brands)',
      'RTO physical inspection accompaniment, PUC emission certificates & HSRP plate fitting',
      'Pre-trip vehicle turnaround, deep sanitization & airport pickup delivery',
      'Ultrasonic engine bay rodent repellent treatment',
    ],
    sampleServices: [
      {
        id: 'veh-garage-retainer',
        name: 'Monthly Garage Care & Engine Exercising Retainer',
        turnaround: 'Bi-Weekly Visits',
        pricingType: 'Monthly Retainer',
        estimatedRange: '₹2,499 – ₹3,999 / month',
        deliverable: 'Bi-weekly 20-min engine idle, tire pressure top-up, battery trickle-charge, WhatsApp video clip',
      },
      {
        id: 'veh-service-escort',
        name: 'Authorized Dealership Annual Servicing Physical Escort',
        turnaround: '1-2 Days',
        pricingType: 'Fixed',
        estimatedRange: '₹2,999 + Authorized OEM Bill',
        deliverable: 'Coordinator stays at service center, verifies estimate, rejects unnecessary add-ons, returns car to garage',
      },
      {
        id: 'veh-rto-hsrp',
        name: 'RTO Fitness Certificate, PUC & HSRP Plate Physical Liaison',
        turnaround: '3-5 Business Days',
        pricingType: 'Fixed',
        estimatedRange: '₹3,499 + Official Govt Fees',
        deliverable: 'Physical vehicle inspection at RTO track, emission certificate, tamper-proof HSRP rivets fitted',
      },
      {
        id: 'veh-pre-trip-prep',
        name: 'Pre-Arrival Vehicle Recommissioning & Deep Detailing',
        turnaround: '2 Days Prior to Arrival',
        pricingType: 'Fixed',
        estimatedRange: '₹3,999 – ₹7,500',
        deliverable: 'AC gas check, foam wash, interior leather conditioning, full tank fuel fill, airport readiness',
      },
    ],
    popularCities: ['Delhi NCR', 'Mumbai', 'Bengaluru', 'Chandigarh', 'Pune', 'Hyderabad'],
    faqs: [
      {
        q: 'Will my battery die if I leave my car in Delhi or Mumbai for a year?',
        a: 'With our garage retainer, a coordinator connects a smart trickle-charger, starts the engine every two weeks, rolls the car to prevent tire flat-spotting, and runs the AC to prevent mold.',
      },
    ],
  },

  memorial_ancestral_care: {
    key: 'memorial_ancestral_care',
    title: 'Memorial, Cemetery & Ancestral Heritage Upkeep',
    shortTitle: 'Memorial Care',
    tagline: 'Gravesite maintenance, memorial floral offerings, ancestral samadhis & heritage tribute ceremonies',
    heroBadge: 'Dignified Physical Care',
    icon: '🕊️',
    description:
      'Honor your departed ancestors and preserve family heritage with respectful, physical on-ground care in India. Our dignified coordinators physically visit family gravesites, kabristans, memorials, and samadhis, perform meticulous cleaning and weeding, arrange fresh floral wreaths on death anniversaries, and coordinate traditional community meals (Langar / Niyaz) with photographic confirmation.',
    inclusions: [
      'Physical clearing of weeds, moss removal & polished marble cleaning',
      'Engraved epitaph inscription re-blacking and gold leaf restoration',
      'Fresh floral tribute and wreath placement on exact Barsi / Shradh / Death Anniversary dates',
      'Local religious trust / cemetery board maintenance fee payment',
      'Ancestral community meal (Langar / Niyaz / Annadanam) physical preparation and distribution',
      'Respectful high-resolution photographic and video proof delivered within 4 hours of visit',
    ],
    sampleServices: [
      {
        id: 'mem-grave-clean',
        name: 'Gravesite / Memorial Cleaning & Fresh Floral Tribute',
        turnaround: 'Exact Scheduled Date',
        pricingType: 'Fixed',
        estimatedRange: '₹2,999 / Scheduled Visit',
        deliverable: 'Meticulous stone washing, weeding, fresh marigold/rose wreath, before/after timestamped photos',
      },
      {
        id: 'mem-annual-retainer',
        name: 'Annual Ancestral Memorial Care Retainer (Quarterly Visits + 2 Anniversaries)',
        turnaround: 'Quarterly + Special Dates',
        pricingType: 'Monthly Retainer',
        estimatedRange: '₹8,999 / year',
        deliverable: '4 Quarterly deep cleanings, 2 personalized death anniversary floral ceremonies, perpetual upkeep ledger',
      },
      {
        id: 'mem-community-meal',
        name: 'Memorial Community Feast (Langar / Niyaz / Annadanam) Distribution',
        turnaround: 'Scheduled Memorial Date',
        pricingType: 'Quote',
        estimatedRange: '₹11,000 – ₹25,000 (Based on Meal Count)',
        deliverable: 'Community hall / shrine meal preparation, raw ingredient procurement receipts, dignified distribution photos',
      },
      {
        id: 'mem-stone-restoration',
        name: 'Marble Headstone & Epitaph Inscription Restoration',
        turnaround: '1-2 Weeks',
        pricingType: 'Quote',
        estimatedRange: 'Custom Masonry Pricing',
        deliverable: 'Stone repolishing, crack grouting, high-contrast black/gold inscription re-carving',
      },
    ],
    popularCities: ['Srinagar', 'Punjab', 'Delhi NCR', 'Kolkata', 'Kerala', 'Goa', 'Hyderabad'],
    faqs: [
      {
        q: 'Can you place fresh flowers on my late father’s grave on his exact death anniversary in India?',
        a: 'Yes. You specify the exact calendar date, and our local coordinator visits the memorial early morning, cleans the site, lays fresh seasonal flowers, and sends photos with timestamps to you within hours.',
      },
    ],
  },
}

const METRO_FLAGSHIP_HUBS: OperationalCity[] = [
  // ── Tier 1: Direct Fulfillment Hubs (Platform Managed Ground Desks) ──
  {
    id: 'delhi-ncr',
    name: 'Delhi NCR',
    state: 'Delhi / Haryana / UP',
    region: 'North',
    operationalTier: 'Tier 1 - Direct Fulfillment Hub',
    coverageStatus: 'Available to Book',
    coverageSummary: 'Direct ground coordination desk active across New Delhi, Gurugram, and Noida.',
    leadCoverage: ['Tertiary Healthcare Escort', 'Apartment Management', 'High Court / POA', 'Senior Companion Care', 'Civil Repairs'],
    emergencyDirectory: {
      police: '112',
      ambulance: '102 / 108',
      fire: '101',
      seniorHelpline: '14567 / 1291',
      nriCell: '+91-11-23382020 (MEA Overseas Indian Affairs)',
    },
  },
  {
    id: 'mumbai',
    name: 'Mumbai',
    state: 'Maharashtra',
    region: 'West',
    operationalTier: 'Tier 1 - Direct Fulfillment Hub',
    coverageStatus: 'Available to Book',
    coverageSummary: 'Direct ground operations active across South Mumbai, Western Suburbs, Thane & Navi Mumbai.',
    leadCoverage: ['Society Flat Oversight', 'Specialist Medical Liaison', 'FEMA / 15CB CA Sourcing', 'High Court Documentation'],
    emergencyDirectory: {
      police: '112 / 100',
      ambulance: '108',
      fire: '101',
      seniorHelpline: '1090',
      nriCell: '+91-22-22025000',
    },
  },
  {
    id: 'bengaluru',
    name: 'Bengaluru',
    state: 'Karnataka',
    region: 'South',
    operationalTier: 'Tier 1 - Direct Fulfillment Hub',
    coverageStatus: 'Available to Book',
    coverageSummary: 'Direct ground desk active across Central, Whitefield, Sarjapur & North Bengaluru.',
    leadCoverage: ['Villa & Plot Inspections', 'Tenant Handover', 'Hospital Escorts', 'Corporate Supplier Audits'],
    emergencyDirectory: {
      police: '112',
      ambulance: '108',
      fire: '101',
      seniorHelpline: '1090',
      nriCell: '+91-80-22255000',
    },
  },
  {
    id: 'srinagar',
    name: 'Srinagar',
    state: 'Jammu & Kashmir',
    region: 'North',
    operationalTier: 'Tier 1 - Direct Fulfillment Hub',
    coverageStatus: 'Available to Book',
    coverageSummary: 'Direct ground operations active across Srinagar, Harwan, Dal, Budgam & Kashmir Valley.',
    leadCoverage: ['Property Inspections', 'Orchard Care', 'Parent Errand Escort', 'Wazwan & Weddings', 'GI Crafts', 'Revenue Record Retrieval'],
    emergencyDirectory: {
      police: '112 / 0194-2452222',
      ambulance: '102 / 108',
      fire: '101 / 0194-2479488',
      seniorHelpline: '14567',
      nriCell: '+91-194-2450001 (J&K NRI Grievance Desk)',
    },
  },
  {
    id: 'chandigarh',
    name: 'Chandigarh / Tricity',
    state: 'Punjab & Haryana',
    region: 'North',
    operationalTier: 'Tier 1 - Direct Fulfillment Hub',
    coverageStatus: 'Available to Book',
    coverageSummary: 'Direct ground desk active across Chandigarh Sectors, Mohali & Panchkula.',
    leadCoverage: ['Kothi / House Inspections', 'Elder Care Liaison', 'Land Title Searches', 'Airport Chauffeurs'],
    emergencyDirectory: {
      police: '112',
      ambulance: '108',
      fire: '101',
      seniorHelpline: '1090',
      nriCell: '+91-172-2740000',
    },
  },

  // ── Tier 2: Scoped RFQ Dispatch (Custom Feasibility & Vendor Scoping) ──
  {
    id: 'hyderabad',
    name: 'Hyderabad',
    state: 'Telangana',
    region: 'South',
    operationalTier: 'Tier 2 - Scoped RFQ Dispatch',
    coverageStatus: 'Request a Quote',
    coverageSummary: 'Custom request scoping and vendor dispatch across Hitec City, Gachibowli & Jubilee Hills.',
    leadCoverage: ['Gated Community Oversight', 'Hospital Coordination', 'Tenant Management'],
    emergencyDirectory: {
      police: '112',
      ambulance: '108',
      fire: '101',
      seniorHelpline: '14567',
    },
  },
  {
    id: 'pune',
    name: 'Pune',
    state: 'Maharashtra',
    region: 'West',
    operationalTier: 'Tier 2 - Scoped RFQ Dispatch',
    coverageStatus: 'Request a Quote',
    coverageSummary: 'Custom partner dispatch across Kalyani Nagar, Koregaon Park, Baner & Kothrud.',
    leadCoverage: ['Apartment Key Holding', 'Parent Care Visits', 'Home Maintenance'],
    emergencyDirectory: {
      police: '112',
      ambulance: '108',
      fire: '101',
      seniorHelpline: '1090',
    },
  },
  {
    id: 'jaipur',
    name: 'Jaipur',
    state: 'Rajasthan',
    region: 'North',
    operationalTier: 'Tier 2 - Scoped RFQ Dispatch',
    coverageStatus: 'Request a Quote',
    coverageSummary: 'Custom coordination for heritage properties, destination weddings & family events.',
    leadCoverage: ['Heritage Property Oversight', 'Event Vendor Scoping', 'Document Retrieval'],
    emergencyDirectory: {
      police: '112',
      ambulance: '108',
      fire: '101',
      seniorHelpline: '14567',
    },
  },
  {
    id: 'kochi',
    name: 'Kochi & Kerala',
    state: 'Kerala',
    region: 'South',
    operationalTier: 'Tier 2 - Scoped RFQ Dispatch',
    coverageStatus: 'Request a Quote',
    coverageSummary: 'Ancestral home maintenance, monsoon proofing & travel logistics across Kerala.',
    leadCoverage: ['Coastal Home Audits', 'Monsoon Care', 'Diaspora Travel Logistics'],
    emergencyDirectory: {
      police: '112',
      ambulance: '108',
      fire: '101',
      seniorHelpline: '14567',
    },
  },
  {
    id: 'kolkata',
    name: 'Kolkata',
    state: 'West Bengal',
    region: 'East',
    operationalTier: 'Tier 2 - Scoped RFQ Dispatch',
    coverageStatus: 'Request a Quote',
    coverageSummary: 'Ancestral home inspections, High Court documentation & elder care in Eastern India.',
    leadCoverage: ['Ancestral Property Visits', 'Legal Document Retrieval', 'Elder Companionship'],
    emergencyDirectory: {
      police: '112',
      ambulance: '102 / 108',
      fire: '101',
      seniorHelpline: '1090',
    },
  },
  {
    id: 'amritsar',
    name: 'Amritsar',
    state: 'Punjab',
    region: 'North',
    operationalTier: 'Tier 2 - Scoped RFQ Dispatch',
    coverageStatus: 'Request a Quote',
    coverageSummary: 'Ancestral property visits, GT Road corridor logistics & land revenue records.',
    leadCoverage: ['Ancestral Property Visits', 'Family Travel', 'Elder Health Escort'],
    emergencyDirectory: {
      police: '112',
      ambulance: '108',
      fire: '101',
      seniorHelpline: '14567',
    },
  },
  {
    id: 'patna',
    name: 'Patna & Bihar',
    state: 'Bihar',
    region: 'East',
    operationalTier: 'Tier 2 - Scoped RFQ Dispatch',
    coverageStatus: 'Request a Quote',
    coverageSummary: 'Land revenue records, Mithila regional coordination & family property visits.',
    leadCoverage: ['Land Mutation Liaison', 'Ancestral Home Oversight', 'Elder Visits'],
    emergencyDirectory: {
      police: '112',
      ambulance: '102',
      fire: '101',
      seniorHelpline: '14567',
    },
  },

  // ── Tier 3: Expanding Network ──
  {
    id: 'chennai',
    name: 'Chennai',
    state: 'Tamil Nadu',
    region: 'South',
    operationalTier: 'Tier 3 - Expanding Network',
    coverageStatus: 'Limited Coverage',
    coverageSummary: 'Medical appointment coordination & property management scoping on demand.',
    leadCoverage: ['Healthcare Escorts', 'Apartment Checks', 'Legal Liaison'],
    emergencyDirectory: {
      police: '112',
      ambulance: '108',
      fire: '101',
      seniorHelpline: '14567',
    },
  },
]

// ── Master Expansion: All 28 States and 8 Union Territories ──────────────
const ALL_STATE_TERRITORY_DESKS: OperationalCity[] = ALL_INDIA_TERRITORIES.map((t) => ({
  id: `territory-${t.id}`,
  name: t.name,
  state: `${t.type} • Hub: ${t.capital}`,
  region: t.region,
  operationalTier: t.operationalTier,
  coverageStatus: t.coverageStatus,
  coverageSummary: t.description,
  leadCoverage: t.leadServices,
  emergencyDirectory: {
    police: '112',
    ambulance: '108',
    fire: '101',
    seniorHelpline: '14567',
    nriCell: t.emergencyHelpline,
  },
}))

export const OPERATIONAL_CITIES: OperationalCity[] = [
  ...METRO_FLAGSHIP_HUBS,
  ...ALL_STATE_TERRITORY_DESKS,
]

// Direct Fulfillment Operations Desks (Zero synthetic ratings or fabricated reviews)
export const VERIFIED_PROVIDERS: NriProvider[] = [
  {
    id: 'prov-desk-delhi',
    name: 'Nuty Tales Operations Desk — North India',
    businessName: 'Nuty Tales Central Ground Operations (Delhi NCR)',
    avatar: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=150&auto=format&fit=crop&q=80',
    categories: ['property_management', 'parent_care', 'healthcare', 'legal_documents', 'home_services'],
    cities: ['Delhi NCR', 'Gurugram', 'Noida', 'Chandigarh'],
    experienceYears: 6,
    verificationStatus: 'verified',
    verificationLevel: 'Platform Managed',
    rating: 5.0,
    reviewCount: 0,
    completedJobs: 0,
    nriExperience: 'Direct platform coordination for overseas families in North America, UK, Europe, and the Middle East.',
    languages: ['English', 'Hindi', 'Punjabi'],
    bio: 'Platform-managed ground coordination desk supervising verified local staff and credentialed legal/CA specialists across Delhi NCR and Haryana.',
    phone: '+91-11-23382020',
    email: 'operations.delhi@nutytales.com',
    panGstDeclared: true,
    sampleRate: 'Custom Scoped Quotation',
  },
  {
    id: 'prov-desk-mumbai',
    name: 'Nuty Tales Operations Desk — West India',
    businessName: 'Nuty Tales Central Ground Operations (Mumbai MMR)',
    avatar: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=150&auto=format&fit=crop&q=80',
    categories: ['property_management', 'tax_finance', 'healthcare', 'business_procurement'],
    cities: ['Mumbai', 'Thane', 'Navi Mumbai', 'Pune'],
    experienceYears: 6,
    verificationStatus: 'verified',
    verificationLevel: 'Platform Managed',
    rating: 5.0,
    reviewCount: 0,
    completedJobs: 0,
    nriExperience: 'Dedicated coordination for diaspora real estate, 15CA/15CB tax remittance, and society management.',
    languages: ['English', 'Hindi', 'Marathi', 'Gujarati'],
    bio: 'Direct platform-managed operations desk in Mumbai providing society coordination, CA certification liaison, and property walkthroughs.',
    phone: '+91-22-22025000',
    email: 'operations.mumbai@nutytales.com',
    panGstDeclared: true,
    sampleRate: 'Custom Scoped Quotation',
  },
  {
    id: 'prov-desk-bengaluru',
    name: 'Nuty Tales Operations Desk — South India',
    businessName: 'Nuty Tales Central Ground Operations (Bengaluru)',
    avatar: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=150&auto=format&fit=crop&q=80',
    categories: ['property_management', 'parent_care', 'home_services', 'business_procurement'],
    cities: ['Bengaluru', 'Hyderabad', 'Chennai'],
    experienceYears: 6,
    verificationStatus: 'verified',
    verificationLevel: 'Platform Managed',
    rating: 5.0,
    reviewCount: 0,
    completedJobs: 0,
    nriExperience: 'Managing tech-diaspora family homes, plot inspections, and elderly parent wellness visits.',
    languages: ['English', 'Hindi', 'Kannada', 'Tamil'],
    bio: 'Platform-managed ground coordination desk for Southern urban hubs, overseeing villa communities and local logistics.',
    phone: '+91-80-22255000',
    email: 'operations.bengaluru@nutytales.com',
    panGstDeclared: true,
    sampleRate: 'Custom Scoped Quotation',
  },
  {
    id: 'prov-desk-srinagar',
    name: 'Nuty Tales Operations Desk — J&K Regional Hub',
    businessName: 'Nuty Tales Central Ground Operations (Srinagar)',
    avatar: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=150&auto=format&fit=crop&q=80',
    categories: ['property_management', 'travel_stays', 'crafts_heritage', 'weddings_events', 'home_services'],
    cities: ['Srinagar', 'Gulmarg', 'Pahalgam'],
    experienceYears: 6,
    verificationStatus: 'verified',
    verificationLevel: 'Platform Managed',
    rating: 5.0,
    reviewCount: 0,
    completedJobs: 0,
    nriExperience: 'Regional hub managing ancestral estates, seasonal winterization, revenue Jamabandi, and luxury logistics.',
    languages: ['English', 'Kashmiri', 'Urdu', 'Hindi'],
    bio: 'Platform-managed regional desk handling Kashmir ancestral estates, perimeter checks, winter pipe insulation, and GI craft provenance.',
    phone: '+91-194-2450001',
    email: 'operations.kashmir@nutytales.com',
    panGstDeclared: true,
    sampleRate: 'Custom Scoped Quotation',
  },
]
