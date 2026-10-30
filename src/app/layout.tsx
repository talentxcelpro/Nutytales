import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import GlobalHeader from "@/components/global/GlobalHeader";
import GlobalFooter from "@/components/global/GlobalFooter";
import { AuthProvider } from "@/context/AuthContext";
import GoogleOneTap from "@/components/auth/GoogleOneTap";
import ClientInteractiveOverlays from "@/components/global/ClientInteractiveOverlays";
import MobileBottomNav from "@/components/global/MobileBottomNav";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#17233B",
  viewportFit: "cover",
};

// ── Font: High-performance primary UI sans font with instant fallback ──────────
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

// ── Canonical URL ─────────────────────────────────────────────────────────────
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://nutytales.com";

// ── Site-wide metadata ─────────────────────────────────────────────────────────
export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),

  title: {
    default: "Nuty Tales — Premium Single-Origin Dry Fruits, Saffron & Gourmet Harvest",
    template: "%s | Nuty Tales",
  },

  description:
    "Buy certified single-origin Kashmiri Kagzi walnuts, Pampore Mongra saffron, high-oil Mamra almonds, Mithila jumbo makhana, corporate gifting, and artisanal crafts. FSSAI certified, nitrogen-sealed freshness, worldwide delivery.",

  keywords: [
    "Nuty Tales",
    "buy dry fruits online",
    "kashmiri walnuts",
    "pampore saffron",
    "mamra almonds",
    "mithila makhana",
    "fssai 22724441000048",
    "corporate gifting",
    "wedding hampers",
    "kashmiri crafts",
  ],

  authors: [{ name: "Nuty Tales Foods & Crafts", url: APP_URL }],
  creator: "Nexgenn Services",
  publisher: "Nuty Tales Foods & Crafts",

  category: "marketplace",

  openGraph: {
    type: "website",
    locale: "en_IN",
    url: APP_URL,
    siteName: "Nuty Tales",
    title: "Nuty Tales — Global Marketplace for Products, Gifting, Travel, Stays, Crafts, Weddings & Business",
    description:
      "A global technology-powered marketplace connecting customers, sellers, artisans, farmers, luxury hosts, and corporate buyers across six interconnected ecosystems.",
    images: [
      {
        url: `${APP_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Nuty Tales — Global Marketplace Platform",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    site: "@nutytales",
    creator: "@nutytales",
    title: "Nuty Tales — Global Marketplace Platform",
    description:
      "A global marketplace connecting people, products, places, experiences, and business sourcing.",
    images: [`${APP_URL}/opengraph-image`],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Nuty Tales",
  },

  alternates: {
    canonical: APP_URL,
    types: {
      "text/markdown": "/llms.txt",
    },
  },

  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.png', type: 'image/png', sizes: '192x192' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },

  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? "",
  },
};

// ── Root Layout (100% Static & Edge-Cache Friendly) ───────────────────────────
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
  const gaId  = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html
      lang="en-IN"
      className={`${geistSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* ── Preconnect to Critical Asset CDN Origins ── */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      </head>

      <body
        className="min-h-screen bg-nt-cream text-nt-brown flex flex-col"
        suppressHydrationWarning
      >
        {/* ── GTM noscript fallback ── */}
        {gtmId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
              title="Google Tag Manager"
            />
          </noscript>
        )}

        {/* ── Page content with Firebase + Supabase Auth ── */}
        <AuthProvider>
          <GlobalHeader />
          <div className="flex-1 pb-16 md:pb-0">
            {children}
          </div>
          <GlobalFooter />
          <ClientInteractiveOverlays />
          <MobileBottomNav />
          <GoogleOneTap />
        </AuthProvider>

        {/* ── Google Tag Manager (placed inside body to prevent head hydration mismatches) ── */}
        {gtmId && (
          <Script
            id="gtm-script"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${gtmId}');
              `,
            }}
          />
        )}

        {/* ── Google Analytics 4 (standalone, without GTM) ── */}
        {gaId && !gtmId && (
          <>
            <Script
              id="ga4-script"
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            />
            <Script
              id="ga4-config"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${gaId}', { page_path: window.location.pathname });
                `,
              }}
            />
          </>
        )}
      </body>
    </html>
  );
}
