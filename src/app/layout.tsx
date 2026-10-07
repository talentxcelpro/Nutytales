import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SIFloatingAssistant from "@/components/si/SIFloatingAssistant";
import { AuthProvider } from "@/context/AuthContext";
import AuthModal from "@/components/auth/AuthModal";

// ── Fonts ─────────────────────────────────────────────────────────────────────
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

// ── Canonical URL ─────────────────────────────────────────────────────────────
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://nuttytales.com";

// ── Site-wide metadata ─────────────────────────────────────────────────────────
export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),

  title: {
    default: "Nutty Tales — Premium Dry Fruits Wholesale & Retail",
    template: "%s | Nutty Tales",
  },

  description:
    "Buy premium dry fruits retail or wholesale. Almonds, Cashews, Raisins, Pistachios, Walnuts, Anjeer, Makhana and more. Serving Noida, Kashmir, Patna and all India.",

  keywords: [
    "dry fruits wholesale India",
    "buy dry fruits online",
    "wholesale almonds cashews",
    "dry fruits Noida",
    "dry fruits Kashmir",
    "dry fruits Patna",
    "makhana wholesale",
    "bulk dry fruits supplier",
    "B2B dry fruits",
    "premium dry fruits",
    "anjeer wholesale",
    "pistachios wholesale India",
    "walnuts wholesale",
    "raisins wholesale India",
    "dry fruits gift hamper",
    "FSSAI certified dry fruits",
    "NuttyTales wholesale",
    "dry fruits bulk order",
  ],

  authors: [{ name: "Nutty Tales", url: APP_URL }],
  creator: "Nutty Tales",
  publisher: "Nutty Tales",

  category: "food",

  openGraph: {
    type: "website",
    locale: "en_IN",
    url: APP_URL,
    siteName: "Nutty Tales",
    title: "Nutty Tales — Premium Dry Fruits Wholesale & Retail",
    description:
      "India's trusted dry fruit brand. Wholesale & retail. Almonds, Cashews, Makhana, Walnuts, Pistachios & more. FSSAI certified.",
    images: [
      {
        url: `${APP_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Nutty Tales — Premium Dry Fruits Wholesale & Retail",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    site: "@nuttytales",
    creator: "@nuttytales",
    title: "Nutty Tales — Premium Dry Fruits Wholesale & Retail",
    description:
      "India's trusted dry fruit brand. Wholesale & retail. Almonds, Cashews, Makhana & more. FSSAI certified.",
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

  alternates: {
    canonical: APP_URL,
  },
};

// ── Root Layout ───────────────────────────────────────────────────────────────
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* ── Google Tag Manager ── */}
        {gtmId && (
          <Script
            id="gtm-script"
            strategy="beforeInteractive"
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
      </head>

      <body className="min-h-screen bg-nt-cream text-nt-brown flex flex-col">
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
          <Navbar />
          <div className="flex-1">
            {children}
          </div>
          <Footer />
          <SIFloatingAssistant />
          <AuthModal />
        </AuthProvider>
      </body>
    </html>
  );
}
