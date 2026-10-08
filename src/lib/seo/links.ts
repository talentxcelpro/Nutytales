/**
 * Nuty Tales SEO — Internal Linking System
 *
 * Intentional, crawlable, descriptive internal link graph.
 *
 * Rules:
 * - Every important page is reachable through internal links
 * - All links use normal <a href=""> (no JS-only navigation)
 * - Anchor text is descriptive (never "click here" or "read more")
 * - Cross-business links where genuinely relevant (Kashmir travel → Kashmir stays)
 * - No nofollow on internal links to important pages
 * - Hub pages link down to children; children link up to parents
 *
 * The link graph here defines the intended internal link structure.
 * Components use this to render <a> tags in server-rendered HTML.
 */

import type { NutyBusiness } from './types';
import { BUSINESS_DOMAINS } from './types';

// ─────────────────────────────────────────────────────────────────────────────
// INTERNAL LINK DEFINITION
// ─────────────────────────────────────────────────────────────────────────────

export interface DefinedLink {
  href: string;
  anchorText: string;
  rel?: string;           // Default: none (dofollow)
  business: NutyBusiness;
}

// ─────────────────────────────────────────────────────────────────────────────
// CROSS-BUSINESS LINK GRAPH
//
// These represent intentional SEO cross-links between verticals.
// Example: A Kashmir travel page links to Kashmir stays, crafts, gifting.
// ─────────────────────────────────────────────────────────────────────────────

export const CROSS_BUSINESS_LINKS: Record<string, DefinedLink[]> = {
  // Travel Kashmir → Stays, Crafts, Gifting, Weddings
  '/travel/kashmir': [
    { href: `${BUSINESS_DOMAINS.stays}/stays/kashmir`,        anchorText: 'Stay in Kashmir — Boutique Retreats & Villas',        business: 'stays' },
    { href: `${BUSINESS_DOMAINS.stays}/hotels/srinagar`,      anchorText: 'Hotels in Srinagar — Book Now',                        business: 'stays' },
    { href: `${BUSINESS_DOMAINS.crafts}/kashmir-crafts`,      anchorText: 'Shop Authentic Kashmir Crafts',                        business: 'crafts' },
    { href: `${BUSINESS_DOMAINS.crafts}/pashmina-shawls`,     anchorText: 'Genuine Pashmina Shawls from Kashmir',                  business: 'crafts' },
    { href: `${BUSINESS_DOMAINS.gifting}/corporate-gifts`,    anchorText: 'Kashmiri Corporate Gift Hampers',                      business: 'gifting' },
    { href: `${BUSINESS_DOMAINS.weddings}/destination-weddings/kashmir`, anchorText: 'Plan a Destination Wedding in Kashmir', business: 'weddings' },
  ],

  // Travel Kashmir Honeymoon → Stays, Weddings
  '/travel/kashmir/honeymoon': [
    { href: `${BUSINESS_DOMAINS.stays}/luxury-stays/kashmir`, anchorText: 'Luxury Stays for Your Kashmir Honeymoon', business: 'stays' },
    { href: `${BUSINESS_DOMAINS.weddings}/destination-weddings/kashmir`, anchorText: 'Kashmir Destination Weddings', business: 'weddings' },
    { href: `${BUSINESS_DOMAINS.gifting}/wedding-return-gifts`, anchorText: 'Handcraft Wedding Return Gifts', business: 'gifting' },
  ],

  // Travel Kashmir Family → Stays, Shop
  '/travel/kashmir/family': [
    { href: `${BUSINESS_DOMAINS.stays}/family-stays/srinagar`, anchorText: 'Family Stays in Srinagar', business: 'stays' },
    { href: `${BUSINESS_DOMAINS.stays}/stays/kashmir`,          anchorText: 'All Kashmir Accommodation',  business: 'stays' },
    { href: `${BUSINESS_DOMAINS.crafts}/kashmir-crafts`,        anchorText: 'Kashmir Craft Souvenirs',    business: 'crafts' },
  ],

  // Stays Kashmir → Travel, Crafts
  '/stays/kashmir': [
    { href: `${BUSINESS_DOMAINS.travel}/travel/kashmir`,       anchorText: 'Kashmir Travel Packages & Itineraries', business: 'travel' },
    { href: `${BUSINESS_DOMAINS.travel}/travel/kashmir/7-days`, anchorText: '7-Day Kashmir Tour Packages',           business: 'travel' },
    { href: `${BUSINESS_DOMAINS.crafts}/kashmir-crafts`,       anchorText: 'Shop Authentic Kashmir Handicrafts',     business: 'crafts' },
    { href: `${BUSINESS_DOMAINS.weddings}/destination-weddings/kashmir`, anchorText: 'Kashmir Wedding Venues',      business: 'weddings' },
  ],

  // Gifting Corporate Diwali → Gifting other, Business
  '/corporate-gifts/diwali': [
    { href: `${BUSINESS_DOMAINS.gifting}/employee-welcome-gifts`, anchorText: 'Employee Welcome Gift Kits',           business: 'gifting' },
    { href: `${BUSINESS_DOMAINS.gifting}/client-gifts`,           anchorText: 'Premium Client Gift Hampers',          business: 'gifting' },
    { href: `${BUSINESS_DOMAINS.gifting}/executive-gifts`,        anchorText: 'Executive Gift Sets',                  business: 'gifting' },
    { href: `${BUSINESS_DOMAINS.business}/wholesale-dry-fruits`,  anchorText: 'Source Dry Fruits in Bulk for Gifting', business: 'business' },
  ],

  // Crafts Kashmir → Travel, Stays
  '/kashmir-crafts': [
    { href: `${BUSINESS_DOMAINS.travel}/travel/kashmir`,       anchorText: 'Plan Your Kashmir Visit',                 business: 'travel' },
    { href: `${BUSINESS_DOMAINS.stays}/stays/kashmir`,         anchorText: 'Stay in Kashmir',                         business: 'stays' },
    { href: `${BUSINESS_DOMAINS.gifting}/corporate-gifts`,     anchorText: 'Send Kashmiri Gifts Corporately',          business: 'gifting' },
  ],

  // Weddings Kashmir → Travel, Stays, Gifting
  '/destination-weddings/kashmir': [
    { href: `${BUSINESS_DOMAINS.stays}/stays/kashmir`,         anchorText: 'Wedding Guest Accommodation in Kashmir',   business: 'stays' },
    { href: `${BUSINESS_DOMAINS.travel}/travel/kashmir`,       anchorText: 'Kashmir Travel Packages for Wedding Guests', business: 'travel' },
    { href: `${BUSINESS_DOMAINS.gifting}/wedding-return-gifts`, anchorText: 'Kashmiri Wedding Return Gifts',          business: 'gifting' },
    { href: `${BUSINESS_DOMAINS.crafts}/kashmir-crafts`,       anchorText: 'Authentic Kashmir Wedding Décor & Gifts',  business: 'crafts' },
  ],

  // Business Wholesale → Gifting
  '/wholesale-dry-fruits': [
    { href: `${BUSINESS_DOMAINS.gifting}/corporate-gifts`,     anchorText: 'Corporate Gift Hampers with Our Dry Fruits', business: 'gifting' },
    { href: `${BUSINESS_DOMAINS.gifting}/wedding-return-gifts`, anchorText: 'Wedding Return Gift Hampers',            business: 'gifting' },
    { href: `${BUSINESS_DOMAINS.business}/dry-fruits-for-bakeries`, anchorText: 'Dry Fruits for Bakeries',            business: 'business' },
    { href: `${BUSINESS_DOMAINS.business}/dry-fruits-for-hotels`,   anchorText: 'Dry Fruits for Hotels & Restaurants', business: 'business' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// SITE-WIDE NAVIGATION HIERARCHY
//
// Defines the parent→child internal linking structure for each business.
// Hub pages link to all children. Children link back to parents.
// ─────────────────────────────────────────────────────────────────────────────

export interface NavNode {
  href: string;
  label: string;
  children?: NavNode[];
}

export const BUSINESS_NAV_TREES: Record<NutyBusiness, NavNode[]> = {
  root: [
    {
      href: '/shop',
      label: 'Shop Dry Fruits',
      children: [
        { href: '/dry-fruits/almonds',    label: 'Premium Almonds' },
        { href: '/dry-fruits/cashews',    label: 'Cashews' },
        { href: '/dry-fruits/pistachios', label: 'Pistachios' },
        { href: '/dry-fruits/walnuts',    label: 'Walnuts' },
        { href: '/dry-fruits/raisins',    label: 'Raisins & Sultanas' },
        { href: '/dry-fruits/dates',      label: 'Premium Dates' },
        { href: '/dry-fruits/anjeer',     label: 'Anjeer (Figs)' },
        { href: '/makhana',               label: 'Makhana (Lotus Seeds)' },
      ],
    },
    {
      href: '/wholesale-dry-fruits',
      label: 'Wholesale & B2B',
      children: [
        { href: '/wholesale-dry-fruits/noida',     label: 'Wholesale Dry Fruits Noida' },
        { href: '/wholesale-dry-fruits/kashmir',   label: 'Wholesale Dry Fruits Kashmir' },
        { href: '/wholesale-dry-fruits/patna',     label: 'Wholesale Dry Fruits Patna' },
        { href: '/wholesale-dry-fruits/delhi',     label: 'Wholesale Dry Fruits Delhi' },
        { href: '/wholesale-dry-fruits/mumbai',    label: 'Wholesale Dry Fruits Mumbai' },
        { href: '/wholesale-dry-fruits/bangalore', label: 'Wholesale Dry Fruits Bangalore' },
        { href: '/bulk-quote',                     label: 'Get a Bulk Quote' },
      ],
    },
    {
      href: '/gifting',
      label: 'Gift Hampers',
    },
    {
      href: '/crafts',
      label: 'Kashmir Crafts',
    },
    {
      href: '/stays',
      label: 'Kashmir Stays',
    },
    {
      href: '/travel/kashmir',
      label: 'Kashmir Travel',
    },
  ],

  business: [
    {
      href: '/wholesale-dry-fruits',
      label: 'All Wholesale Dry Fruits',
      children: [
        { href: '/almonds-wholesale',          label: 'Wholesale Almonds' },
        { href: '/cashews-wholesale',          label: 'Wholesale Cashews' },
        { href: '/makhana-wholesale',          label: 'Wholesale Makhana' },
        { href: '/almonds-wholesale/dubai',    label: 'Almonds Wholesale Dubai' },
        { href: '/cashews-wholesale/mumbai',   label: 'Cashews Wholesale Mumbai' },
        { href: '/makhana-wholesale/patna',    label: 'Makhana Wholesale Patna' },
      ],
    },
    {
      href: '/dry-fruits-for-bakeries',
      label: 'Dry Fruits for Bakeries',
    },
    {
      href: '/dry-fruits-for-hotels',
      label: 'Dry Fruits for Hotels',
    },
    {
      href: '/dry-fruits-for-sweet-shops',
      label: 'Dry Fruits for Sweet Shops',
    },
    {
      href: '/dry-fruits-for-restaurants',
      label: 'Dry Fruits for Restaurants',
    },
  ],

  gifting: [
    {
      href: '/corporate-gifts',
      label: 'Corporate Gifting',
      children: [
        { href: '/corporate-gifts/diwali',         label: 'Diwali Corporate Gifts' },
        { href: '/corporate-gifts/diwali/dubai',   label: 'Diwali Gifts Dubai' },
        { href: '/corporate-gifts/diwali/mumbai',  label: 'Diwali Gifts Mumbai' },
        { href: '/employee-welcome-gifts',          label: 'Employee Welcome Gifts' },
        { href: '/client-gifts',                    label: 'Client Gifts' },
        { href: '/executive-gifts',                 label: 'Executive Gift Sets' },
      ],
    },
    {
      href: '/wedding-return-gifts',
      label: 'Wedding Gifts',
      children: [
        { href: '/wedding-gifts/kashmir',  label: 'Kashmiri Wedding Gifts' },
        { href: '/wedding-return-gifts',   label: 'Wedding Return Gifts' },
      ],
    },
  ],

  weddings: [
    {
      href: '/destination-weddings',
      label: 'Destination Weddings',
      children: [
        { href: '/destination-weddings/kashmir', label: 'Kashmir Destination Wedding' },
        { href: '/destination-weddings/dubai',   label: 'Dubai Destination Wedding' },
        { href: '/destination-weddings/italy',   label: 'Italy Destination Wedding' },
      ],
    },
    {
      href: '/wedding-planners/kashmir',
      label: 'Wedding Planners',
      children: [
        { href: '/wedding-planners/kashmir', label: 'Wedding Planners in Kashmir' },
      ],
    },
    {
      href: '/wedding-venues/kashmir',
      label: 'Wedding Venues',
    },
    {
      href: '/wedding-catering/kashmir',
      label: 'Wedding Catering Kashmir',
    },
  ],

  crafts: [
    {
      href: '/kashmir-crafts',
      label: 'Kashmir Handicrafts',
      children: [
        { href: '/pashmina-shawls',        label: 'Pashmina Shawls' },
        { href: '/kani-shawls',            label: 'Kani Shawls' },
        { href: '/sozni-shawls',           label: 'Sozni Embroidered Shawls' },
        { href: '/kashmir-crafts/dubai',   label: 'Kashmir Crafts Dubai' },
      ],
    },
  ],

  stays: [
    {
      href: '/stays/kashmir',
      label: 'Stay in Kashmir',
      children: [
        { href: '/hotels/srinagar',          label: 'Hotels in Srinagar' },
        { href: '/hotels/gulmarg',           label: 'Hotels in Gulmarg' },
        { href: '/boutique-stays/kashmir',   label: 'Boutique Stays Kashmir' },
        { href: '/luxury-stays/kashmir',     label: 'Luxury Stays Kashmir' },
        { href: '/family-stays/srinagar',    label: 'Family Stays Srinagar' },
      ],
    },
  ],

  travel: [
    {
      href: '/travel/kashmir',
      label: 'Kashmir Travel',
      children: [
        { href: '/travel/kashmir/7-days',    label: 'Kashmir 7-Day Trip' },
        { href: '/travel/kashmir/5-days',    label: 'Kashmir 5-Day Trip' },
        { href: '/travel/kashmir/family',    label: 'Kashmir Family Trip' },
        { href: '/travel/kashmir/honeymoon', label: 'Kashmir Honeymoon Package' },
        { href: '/travel/kashmir/luxury',    label: 'Luxury Kashmir Tour' },
        { href: '/travel/kashmir/winter',    label: 'Kashmir Winter Trip' },
      ],
    },
    {
      href: '/travel/dubai',
      label: 'Dubai Travel',
    },
    {
      href: '/travel/italy',
      label: 'Italy Travel',
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// BREADCRUMB BUILDER
// ─────────────────────────────────────────────────────────────────────────────

export function buildBreadcrumbs(
  business: NutyBusiness,
  pageLabel: string,
  parentPath?: Array<{ label: string; href: string }>
): Array<{ label: string; href: string }> {
  const domain = BUSINESS_DOMAINS[business];
  const crumbs: Array<{ label: string; href: string }> = [
    { label: 'Nuty Tales', href: BUSINESS_DOMAINS.root },
  ];

  if (business !== 'root') {
    const businessLabels: Record<NutyBusiness, string> = {
      root:     'Nuty Tales',
      business: 'Nuty Tales Business',
      gifting:  'Gifting',
      weddings: 'Weddings',
      crafts:   'Crafts',
      stays:    'Stays',
      travel:   'Travel',
    };
    crumbs.push({ label: businessLabels[business], href: domain });
  }

  if (parentPath) {
    crumbs.push(...parentPath);
  }

  crumbs.push({ label: pageLabel, href: '#' }); // Current page (no href needed)
  return crumbs;
}

// ─────────────────────────────────────────────────────────────────────────────
// RELATED PAGES BUILDER
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns cross-business related links for a given slug.
 * Use in SEO page templates to render related page sections.
 */
export function getCrossBizLinks(slug: string): DefinedLink[] {
  return CROSS_BUSINESS_LINKS[slug] ?? [];
}

/**
 * Flattens the nav tree for a business to get all child links.
 * Used to validate internal link coverage.
 */
export function flattenNavTree(business: NutyBusiness): Array<{ href: string; label: string }> {
  const tree = BUSINESS_NAV_TREES[business];
  const links: Array<{ href: string; label: string }> = [];

  function traverse(nodes: NavNode[]): void {
    for (const node of nodes) {
      links.push({ href: node.href, label: node.label });
      if (node.children) traverse(node.children);
    }
  }

  traverse(tree);
  return links;
}
