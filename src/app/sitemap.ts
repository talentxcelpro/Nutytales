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
import { JOURNAL_ARTICLES } from "@/lib/journal-data";
import { HEALTH_CONDITIONS } from "@/lib/health-data";
import { MANDI_CITIES } from "@/lib/mandi-cities-data";
import { CULINARY_RECIPES } from "@/lib/recipes-data";
import { VRAT_FESTIVALS } from "@/lib/vrat-fasting-data";
import { COMMODITY_COMPARISONS } from "@/lib/comparisons-data";
import { DELIVERY_CITIES } from "@/lib/delivery-cities-data";

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
    // Health & Interactive Nutrition Tools
    { url: `${APP_URL}/calculator`, lastModified: now, changeFrequency: "daily", priority: 0.98 },
    { url: `${APP_URL}/compare`, lastModified: now, changeFrequency: "weekly", priority: 0.96 },
    { url: `${APP_URL}/express-delivery`, lastModified: now, changeFrequency: "weekly", priority: 0.96 },
    { url: `${APP_URL}/health`, lastModified: now, changeFrequency: "daily", priority: 0.98 },
    { url: `${APP_URL}/mandi-rates`, lastModified: now, changeFrequency: "daily", priority: 0.98 },
    { url: `${APP_URL}/recipes`, lastModified: now, changeFrequency: "daily", priority: 0.97 },
    { url: `${APP_URL}/saffron-purity-guide`, lastModified: now, changeFrequency: "daily", priority: 0.98 },
    { url: `${APP_URL}/verify`, lastModified: now, changeFrequency: "weekly", priority: 0.95 },
    { url: `${APP_URL}/vrat-fasting`, lastModified: now, changeFrequency: "weekly", priority: 0.97 },
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

  // 11. Gastronomy Journal Botanical Monographs
  const journalPages: MetadataRoute.Sitemap = JOURNAL_ARTICLES.map((article) => ({
    url: `${APP_URL}/gastronomy-journal/${article.id}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  // 12. Programmatic Health Condition Protocols
  const healthConditionPages: MetadataRoute.Sitemap = Object.values(HEALTH_CONDITIONS).map((condition) => ({
    url: `${APP_URL}/health/${condition.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.96,
  }));

  // 13. Regional Mandi Rates Hubs
  const cityMandiPages: MetadataRoute.Sitemap = Object.values(MANDI_CITIES).map((city) => ({
    url: `${APP_URL}/mandi-rates/${city.slug}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.96,
  }));

  // 14. Superfood & Festive Culinary Recipes
  const recipePages: MetadataRoute.Sitemap = Object.values(CULINARY_RECIPES).map((recipe) => ({
    url: `${APP_URL}/recipes/${recipe.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.95,
  }));

  // 15. Sacred Indian Vrat & Fasting Guides
  const vratPages: MetadataRoute.Sitemap = Object.values(VRAT_FESTIVALS).map((fest) => ({
    url: `${APP_URL}/vrat-fasting/${fest.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.95,
  }));

  // 16. Superfood & Botanical Comparison Guides
  const comparisonPages: MetadataRoute.Sitemap = Object.values(COMMODITY_COMPARISONS).map((comp) => ({
    url: `${APP_URL}/compare/${comp.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.95,
  }));

  // 17. Programmatic Metro Express Delivery Hubs
  const expressDeliveryPages: MetadataRoute.Sitemap = Object.values(DELIVERY_CITIES).map((city) => ({
    url: `${APP_URL}/express-delivery/${city.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.95,
  }));

  // Deduplicate and assemble master sitemap
  const allEntries = [
    ...corePages,
    ...verticalHubs,
    ...healthConditionPages,
    ...cityMandiPages,
    ...recipePages,
    ...vratPages,
    ...comparisonPages,
    ...expressDeliveryPages,
    ...productPages,
    ...stayPages,
    ...travelPages,
    ...craftPages,
    ...venuePages,
    ...vendorPages,
    ...giftingPages,
    ...journalPages,
    ...wholesaleIndustryPages,
    ...wholesaleCityPages,
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
