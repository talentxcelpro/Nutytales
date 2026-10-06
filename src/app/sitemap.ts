import type { MetadataRoute } from "next";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://nuttytales.com";

// ── Helper ────────────────────────────────────────────────────────────────────
function url(
  path: string,
  {
    priority = 0.7,
    changeFrequency = "weekly" as MetadataRoute.Sitemap[number]["changeFrequency"],
    lastModified = new Date(),
  } = {}
): MetadataRoute.Sitemap[number] {
  return {
    url: `${APP_URL}${path}`,
    lastModified,
    changeFrequency,
    priority,
  };
}

// ── Hard-coded product SKU slugs (25 core SKUs) ───────────────────────────────
// TODO: Replace with a Prisma DB query once products are seeded.
const PRODUCT_SLUGS: string[] = [
  // Nuts
  "california-almonds-premium",
  "california-almonds-roasted-salted",
  "cashews-w240-whole",
  "cashews-w320-whole",
  "cashews-roasted-salted",
  "pistachios-iranian-salted",
  "pistachios-american-roasted",
  "walnuts-whole-light-halves",
  "walnuts-kernels-light",
  "macadamia-nuts-roasted",
  // Dried Fruits
  "black-raisins-seedless",
  "golden-raisins-premium",
  "green-raisins-afghani",
  "apricots-dried-turkish",
  "anjeer-figs-premium",
  "dates-medjool",
  "dates-kimia-iranian",
  "cranberries-dried-sweetened",
  "blueberries-dried",
  // Makhana
  "makhana-lotus-seeds-plain",
  "makhana-roasted-peri-peri",
  "makhana-roasted-butter-pepper",
  // Seeds & others
  "pumpkin-seeds-roasted",
  "sunflower-seeds-roasted",
  "mixed-dry-fruits-premium-pack",
];

/**
 * Next.js sitemap.ts
 * Rendered at GET /sitemap.xml
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // ── Core pages ──────────────────────────────────────────────────────────────
  const corePages: MetadataRoute.Sitemap = [
    url("/", { priority: 1.0, changeFrequency: "daily", lastModified: now }),
    url("/shop", { priority: 0.9, changeFrequency: "daily" }),
    url("/wholesale-dry-fruits", { priority: 0.95, changeFrequency: "weekly" }),
    url("/corporate-gifting", { priority: 0.95, changeFrequency: "weekly" }),
    url("/stays", { priority: 0.9, changeFrequency: "weekly" }),
    url("/travel/kashmir", { priority: 0.85, changeFrequency: "weekly" }),
    url("/makhana", { priority: 0.9, changeFrequency: "weekly" }),
    url("/bulk-quote", { priority: 0.9, changeFrequency: "monthly" }),
    url("/business", { priority: 0.85, changeFrequency: "monthly" }),
    url("/cart", { priority: 0.5, changeFrequency: "weekly" }),
    url("/checkout", { priority: 0.5, changeFrequency: "weekly" }),
    url("/weddings", { priority: 0.95, changeFrequency: "weekly" }),
    url("/gifting", { priority: 0.95, changeFrequency: "weekly" }),
    url("/business-supply", { priority: 0.95, changeFrequency: "weekly" }),
    url("/crafts", { priority: 0.95, changeFrequency: "weekly" }),
    url("/crafts/kashmir", { priority: 0.9, changeFrequency: "weekly" }),
    url("/crafts/try-with-si", { priority: 0.9, changeFrequency: "weekly" }),
    url("/crafts/india", { priority: 0.8, changeFrequency: "monthly" }),
    url("/crafts/world", { priority: 0.8, changeFrequency: "monthly" }),
    url("/about", { priority: 0.7, changeFrequency: "monthly" }),
    url("/contact", { priority: 0.75, changeFrequency: "monthly" }),
    url("/blog", { priority: 0.8, changeFrequency: "daily" }),
  ];

  // ── Wholesale location landing pages ────────────────────────────────────────
  const wholesaleLocations: MetadataRoute.Sitemap = [
    url("/wholesale-dry-fruits/noida",  { priority: 0.9, changeFrequency: "weekly" }),
    url("/wholesale-dry-fruits/kashmir",{ priority: 0.9, changeFrequency: "weekly" }),
    url("/wholesale-dry-fruits/patna",  { priority: 0.9, changeFrequency: "weekly" }),
    url("/wholesale-dry-fruits/bihar",  { priority: 0.85, changeFrequency: "weekly" }),
    url("/wholesale-dry-fruits/delhi",  { priority: 0.85, changeFrequency: "weekly" }),
    url("/wholesale-dry-fruits/mumbai", { priority: 0.8, changeFrequency: "weekly" }),
    url("/wholesale-dry-fruits/bangalore", { priority: 0.8, changeFrequency: "weekly" }),
  ];

  // ── Category pages ──────────────────────────────────────────────────────────
  const categories: MetadataRoute.Sitemap = [
    url("/dry-fruits",              { priority: 0.9, changeFrequency: "weekly" }),
    url("/dry-fruits/almonds",      { priority: 0.85, changeFrequency: "weekly" }),
    url("/dry-fruits/cashews",      { priority: 0.85, changeFrequency: "weekly" }),
    url("/dry-fruits/pistachios",   { priority: 0.8, changeFrequency: "weekly" }),
    url("/dry-fruits/walnuts",      { priority: 0.8, changeFrequency: "weekly" }),
    url("/dry-fruits/raisins",      { priority: 0.8, changeFrequency: "weekly" }),
    url("/dry-fruits/dates",        { priority: 0.8, changeFrequency: "weekly" }),
    url("/dry-fruits/anjeer",       { priority: 0.75, changeFrequency: "weekly" }),
    url("/dry-fruits/apricots",     { priority: 0.75, changeFrequency: "weekly" }),
    url("/dry-fruits/mixed",        { priority: 0.75, changeFrequency: "weekly" }),
    url("/dry-fruits/seeds",        { priority: 0.7, changeFrequency: "weekly" }),
    url("/makhana/plain",           { priority: 0.75, changeFrequency: "weekly" }),
    url("/makhana/flavoured",       { priority: 0.75, changeFrequency: "weekly" }),
  ];

  // ── Individual product pages ─────────────────────────────────────────────────
  const productPages: MetadataRoute.Sitemap = PRODUCT_SLUGS.map((slug) =>
    url(`/shop/${slug}`, { priority: 0.75, changeFrequency: "weekly" })
  );

  return [
    ...corePages,
    ...wholesaleLocations,
    ...categories,
    ...productPages,
  ];
}
