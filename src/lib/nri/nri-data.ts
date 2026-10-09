// ─── Nuty Tales NRI — Master Service Catalog & Operational Data ─────────────────
// Operating Platform for Indians Living Abroad | nri.nutytales.com

import { ServiceCategoryKey, OperationalCity, NriProvider } from './types'

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
}

export const OPERATIONAL_CITIES: OperationalCity[] = [
  {
    id: 'srinagar',
    name: 'Srinagar',
    state: 'Jammu & Kashmir',
    operationalTier: 'Tier 1 - Full Operational Supply',
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
    id: 'delhi-ncr',
    name: 'Delhi NCR',
    state: 'Delhi / Haryana / UP',
    operationalTier: 'Tier 1 - Full Operational Supply',
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
    operationalTier: 'Tier 1 - Full Operational Supply',
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
    operationalTier: 'Tier 1 - Full Operational Supply',
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
    id: 'chandigarh',
    name: 'Chandigarh / Tricity',
    state: 'Punjab & Haryana',
    operationalTier: 'Tier 1 - Full Operational Supply',
    leadCoverage: ['Kothi / House Inspections', 'Elder Care Liaison', 'Land Title Searches', 'Airport Chauffeurs'],
    emergencyDirectory: {
      police: '112',
      ambulance: '108',
      fire: '101',
      seniorHelpline: '1090',
      nriCell: '+91-172-2740000',
    },
  },
  {
    id: 'hyderabad',
    name: 'Hyderabad',
    state: 'Telangana',
    operationalTier: 'Tier 2 - Verified Partner Network',
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
    operationalTier: 'Tier 2 - Verified Partner Network',
    leadCoverage: ['Apartment Key Holding', 'Parent Care Visits', 'Home Maintenance'],
    emergencyDirectory: {
      police: '112',
      ambulance: '108',
      fire: '101',
      seniorHelpline: '1090',
    },
  },
  {
    id: 'amritsar',
    name: 'Amritsar',
    state: 'Punjab',
    operationalTier: 'Tier 2 - Verified Partner Network',
    leadCoverage: ['Ancestral Property Visits', 'Family Travel', 'Elder Health Escort'],
    emergencyDirectory: {
      police: '112',
      ambulance: '108',
      fire: '101',
      seniorHelpline: '14567',
    },
  },
]

export const VERIFIED_PROVIDERS: NriProvider[] = [
  {
    id: 'prov-kash-prop-01',
    name: 'Farooq Ahmad Mir',
    businessName: 'Mir Estate & Property Solutions',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    categories: ['property_management', 'home_services'],
    cities: ['Srinagar', 'Gulmarg', 'Pahalgam'],
    experienceYears: 14,
    verificationStatus: 'verified',
    verificationLevel: 'Premier Partner',
    rating: 4.96,
    reviewCount: 48,
    completedJobs: 132,
    nriExperience: 'Managing 35+ properties for Kashmiri families residing in UAE, UK, US and Saudi Arabia.',
    languages: ['English', 'Kashmiri', 'Urdu', 'Hindi'],
    bio: 'Former civil works engineer specializing in Srinagar heritage residences, orchard boundary security, winterization, and regular structural checkups.',
    phone: '+91-9858000101',
    email: 'farooq.mir@nutytales-providers.com',
    panGstDeclared: true,
    sampleRate: '₹3,499 / inspection',
  },
  {
    id: 'prov-delhi-elder-02',
    name: 'Ananya Sharma',
    businessName: 'Seva Senior Care & Companion Associates',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    categories: ['parent_care', 'healthcare'],
    cities: ['Delhi NCR', 'Gurugram', 'Noida'],
    experienceYears: 9,
    verificationStatus: 'verified',
    verificationLevel: 'Background Checked',
    rating: 4.92,
    reviewCount: 39,
    completedJobs: 98,
    nriExperience: 'Coordinates medical checkups and weekly companionship for parents of NRIs living in North America and Europe.',
    languages: ['English', 'Hindi', 'Punjabi'],
    bio: 'Trained medical social worker. Dedicated to compassionate companionship, Max / Medanta / Apollo hospital OPD escorts, and weekly digital wellness summaries.',
    phone: '+91-9811000202',
    email: 'ananya.sharma@nutytales-providers.com',
    panGstDeclared: true,
    sampleRate: '₹1,999 / visit',
  },
  {
    id: 'prov-law-poa-03',
    name: 'Adv. Vikramjit Singh Khosla',
    businessName: 'Khosla & Associates Law Chambers',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    categories: ['legal_documents', 'tax_finance'],
    cities: ['Delhi NCR', 'Chandigarh', 'Amritsar'],
    experienceYears: 18,
    verificationStatus: 'verified',
    verificationLevel: 'Licensed Professional',
    rating: 4.98,
    reviewCount: 62,
    completedJobs: 154,
    nriExperience: 'Specialist in NRI POA consular adjudication, partition suits, and revenue registry verification.',
    languages: ['English', 'Punjabi', 'Hindi'],
    bio: 'Advocate on Record with 18 years handling cross-border succession, Sub-Registrar execution, and title verification across Punjab and Delhi NCR.',
    phone: '+91-9872000303',
    email: 'adv.khosla@nutytales-providers.com',
    panGstDeclared: true,
    sampleRate: '₹8,500 / POA filing',
  },
  {
    id: 'prov-ca-tax-04',
    name: 'CA Rajesh Agarwal (FCA)',
    businessName: 'Agarwal Global Tax Advisory',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    categories: ['tax_finance', 'business_procurement'],
    cities: ['Mumbai', 'Bengaluru', 'Delhi NCR'],
    experienceYears: 16,
    verificationStatus: 'verified',
    verificationLevel: 'Licensed Professional',
    rating: 4.95,
    reviewCount: 51,
    completedJobs: 128,
    nriExperience: 'Repatriated over ₹40+ Crores under Form 15CB for NRIs in US, UK, Singapore and UAE.',
    languages: ['English', 'Hindi', 'Gujarati'],
    bio: 'Fellow Chartered Accountant (FCA). Expertise in Section 197 lower tax certificates, capital gains exemption calculation, and 15CA/15CB fast-track compliance.',
    phone: '+91-9820000404',
    email: 'ca.agarwal@nutytales-providers.com',
    panGstDeclared: true,
    sampleRate: '₹4,999 / ITR-2 filing',
  },
  {
    id: 'prov-kash-stay-05',
    name: 'Tariq Bhatt',
    businessName: 'Valley Heritage Experiences & Logistics',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    categories: ['travel_stays', 'weddings_events'],
    cities: ['Srinagar', 'Gulmarg', 'Pahalgam'],
    experienceYears: 12,
    verificationStatus: 'verified',
    verificationLevel: 'Premier Partner',
    rating: 4.97,
    reviewCount: 77,
    completedJobs: 210,
    nriExperience: 'Curated 80+ luxury itineraries and diaspora family return tours with private security and customized dietary arrangements.',
    languages: ['English', 'Kashmiri', 'Urdu'],
    bio: 'Bespoke logistics lead operating premium luxury SUV fleets, orchard house stays, and private traditional Wazwan banquets for overseas families.',
    phone: '+91-9906000505',
    email: 'tariq.bhatt@nutytales-providers.com',
    panGstDeclared: true,
    sampleRate: '₹4,500 / day chauffeur SUV',
  },
]
