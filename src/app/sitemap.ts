import type { MetadataRoute } from "next";
import { PRODUCTS } from "@/lib/products-data";
import { CRAFT_PRODUCTS } from "@/lib/crafts-data";
import { CLOTHING_PRODUCTS } from "@/lib/clothing-data";
import { STAY_PROPERTIES } from "@/lib/stays-data";
import { KASHMIR_TRAVEL_PACKAGES } from "@/lib/travel-data";
import { INITIAL_VENUES, INITIAL_VENDORS } from "@/lib/weddings/data";
import { getAllGifts } from "@/lib/gifting-marketplace-data";
import { INDUSTRIES } from "@/lib/business-supply-data";
import { GEO_ENTITIES } from "@/lib/seo/geo";
import { COMMERCIAL_HUBS } from "@/lib/seo/commercial-hubs";
import { buildRootCoreSitemap } from "@/lib/seo/sitemap";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://nutytales.com";

/**
 * Next.js Master Enterprise Sitemap
 * Rendered at GET https://nutytales.com/sitemap.xml
 *
 * Emits comprehensive, verified, canonical, 200 OK indexable URLs across
 * ALL verticals (Food & Dry Fruits, Wholesale, Stays, Crafts, Travel, Weddings, Gifting, NRI).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // 1. Core Hubs & Brand Navigation Pages (Priority 1.0)
  const corePages = buildRootCoreSitemap();

  // 2. High-Intent Vertical Landing Hubs
  const verticalHubs: MetadataRoute.Sitemap = [
    // Stays
    { url: `${APP_URL}/stays`, lastModified: now, changeFrequency: "daily", priority: 0.95 },
    { url: `${APP_URL}/stays/hosts`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${APP_URL}/stays/group-quote`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    // Crafts
    { url: `${APP_URL}/crafts`, lastModified: now, changeFrequency: "daily", priority: 0.95 },
    { url: `${APP_URL}/crafts/kashmir`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${APP_URL}/crafts/pherans`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${APP_URL}/crafts/shawls-stoles`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${APP_URL}/crafts/jackets-coats`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${APP_URL}/crafts/heritage-home`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${APP_URL}/crafts/men`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${APP_URL}/crafts/women`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${APP_URL}/crafts/kids`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${APP_URL}/crafts/winter-wear`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${APP_URL}/pashmina-shawls`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    // Travel
    { url: `${APP_URL}/travel`, lastModified: now, changeFrequency: "daily", priority: 0.95 },
    { url: `${APP_URL}/travel/kashmir`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${APP_URL}/travel/builder`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${APP_URL}/travel/partners`, lastModified: now, changeFrequency: "monthly", priority: 0.75 },
    // Weddings
    { url: `${APP_URL}/weddings`, lastModified: now, changeFrequency: "daily", priority: 0.95 },
    { url: `${APP_URL}/destination-weddings`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${APP_URL}/destination-weddings/kashmir`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${APP_URL}/destination-weddings/dubai`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${APP_URL}/destination-weddings/italy`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${APP_URL}/wedding-return-gifts`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${APP_URL}/weddings/inspiration`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${APP_URL}/weddings/planner`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    // Gifting
    { url: `${APP_URL}/gifting`, lastModified: now, changeFrequency: "daily", priority: 0.95 },
    { url: `${APP_URL}/corporate-gifting`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${APP_URL}/corporate-gifts`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${APP_URL}/corporate-gifts/diwali`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${APP_URL}/corporate-gifts/diwali/mumbai`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${APP_URL}/corporate-gifts/diwali/dubai`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    // B2B Wholesale & Supply
    { url: `${APP_URL}/b2b`, lastModified: now, changeFrequency: "daily", priority: 0.95 },
    { url: `${APP_URL}/business-supply`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${APP_URL}/wholesale-dry-fruits`, lastModified: now, changeFrequency: "daily", priority: 0.95 },
    { url: `${APP_URL}/bulk-quote`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    // NRI Global Services
    { url: `${APP_URL}/nri`, lastModified: now, changeFrequency: "daily", priority: 0.95 },
    { url: `${APP_URL}/nri/services`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${APP_URL}/nri/how-it-works`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${APP_URL}/nri/emergency`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${APP_URL}/nri/country/usa`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${APP_URL}/nri/country/uk`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${APP_URL}/nri/country/canada`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${APP_URL}/nri/country/uae`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    // Regional Portals
    { url: `${APP_URL}/us`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${APP_URL}/us/store`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${APP_URL}/eu`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${APP_URL}/eu/store`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${APP_URL}/me`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${APP_URL}/me/store`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
  ];

  // 3. Retail Products Catalog SKU Pages
  const productPages: MetadataRoute.Sitemap = PRODUCTS.map((product) => ({
    url: `${APP_URL}/shop/${product.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  // 4. Luxury Curated Stays Pages
  const stayPages: MetadataRoute.Sitemap = STAY_PROPERTIES.map((stay) => ({
    url: `${APP_URL}/stays/${stay.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  // 5. Kashmir Travel Experience Packages
  const travelPages: MetadataRoute.Sitemap = KASHMIR_TRAVEL_PACKAGES.map((pkg) => ({
    url: `${APP_URL}/travel/kashmir/${pkg.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  // 6. GI-Certified Kashmiri Crafts & Heritage Apparel
  const craftSlugs = Array.from(
    new Set([
      ...CRAFT_PRODUCTS.map((c) => c.slug),
      ...CLOTHING_PRODUCTS.map((p) => p.slug),
    ])
  );
  const craftPages: MetadataRoute.Sitemap = craftSlugs.map((slug) => ({
    url: `${APP_URL}/crafts/product/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  // 7. Wedding Palace Venues & Master Vendors
  const venuePages: MetadataRoute.Sitemap = INITIAL_VENUES.map((venue) => ({
    url: `${APP_URL}/venues/${venue.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  const vendorPages: MetadataRoute.Sitemap = INITIAL_VENDORS.map((vendor) => ({
    url: `${APP_URL}/vendors/${vendor.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  // 8. Corporate & Luxury Gifting Products
  const giftingPages: MetadataRoute.Sitemap = getAllGifts().map((gift) => ({
    url: `${APP_URL}/gifting/product/${gift.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  // 9. B2B Wholesale Industry Ingredient Pages
  const wholesaleIndustryPages: MetadataRoute.Sitemap = INDUSTRIES.map((ind) => ({
    url: `${APP_URL}/wholesale-dry-fruits/${ind.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  // 10. Programmatic Commercial City & Geo Hub Pages
  const launchedGeos = GEO_ENTITIES.filter(
    (g) => g.isLaunched && (g.type === "city" || g.type === "state")
  );
  const wholesaleCityPages: MetadataRoute.Sitemap = launchedGeos.map((geo) => ({
    url: `${APP_URL}/wholesale-dry-fruits/${geo.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  // 11. Combinatorial Product + City High-Intent Matrix
  const topWholesaleProducts = [
    'mamra-almonds-kashmiri-badam',
    'california-almonds-premium',
    'kashmiri-walnuts-inshell-snow-white',
    'w240-jumbo-cashews-goa-mangalore',
    'pampore-mongra-saffron-grade-a1',
    'makhana-grade-a-fox-nuts',
    'afghan-green-raisins-kishmish',
    'afghani-anjeer-dried-figs',
  ];
  const wholesaleProductCityPages: MetadataRoute.Sitemap = [];
  for (const productSlug of topWholesaleProducts) {
    for (const hub of COMMERCIAL_HUBS.slice(0, 15)) {
      wholesaleProductCityPages.push({
        url: `${APP_URL}/wholesale-dry-fruits/${productSlug}/${hub.slug}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.85,
      });
    }
  }

  // 12. Indian Postal Circle Priority PIN Codes
  const priorityPincodes = [
    '110001', '110006', '110020', '400001', '400003', '400703', '395001', '395003',
    '380001', '380002', '560001', '560002', '500001', '500002', '600001', '700001',
    '302001', '452001', '411001', '226001', '141001', '143001', '160001', '190001',
  ];
  const wholesalePincodePages: MetadataRoute.Sitemap = priorityPincodes.map((pin) => ({
    url: `${APP_URL}/wholesale-dry-fruits/pincode/${pin}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.80,
  }));

  // Deduplicate and assemble master sitemap
  const allEntries = [
    ...corePages,
    ...verticalHubs,
    ...productPages,
    ...stayPages,
    ...travelPages,
    ...craftPages,
    ...venuePages,
    ...vendorPages,
    ...giftingPages,
    ...wholesaleIndustryPages,
    ...wholesaleCityPages,
    ...wholesaleProductCityPages,
    ...wholesalePincodePages,
  ];

  const seenUrls = new Set<string>();
  const uniqueEntries: MetadataRoute.Sitemap = [];

  for (const entry of allEntries) {
    if (!seenUrls.has(entry.url)) {
      seenUrls.add(entry.url);
      uniqueEntries.push(entry);
    }
  }

  // Sort by priority descending
  return uniqueEntries.sort((a, b) => (b.priority ?? 0.5) - (a.priority ?? 0.5));
}
