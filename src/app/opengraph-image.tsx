import { ImageResponse } from "next/og";

export const runtime = "nodejs";

// ── Image dimensions ──────────────────────────────────────────────────────────
export const size = {
  width:  1200,
  height: 630,
};
export const contentType = "image/png";

/**
 * Default Open Graph image for nutytales.com
 * Served at GET /opengraph-image
 *
 * All pages that don't define their own OG image will inherit this.
 */
export default function OpenGraphImage(): ImageResponse {
  return new ImageResponse(
    (
      <div
        style={{
          display:         "flex",
          flexDirection:   "column",
          alignItems:      "center",
          justifyContent:  "center",
          width:           "100%",
          height:          "100%",
          // Warm cream-to-amber gradient background
          background:
            "linear-gradient(135deg, #FAF7F2 0%, #FDF3E3 35%, #F5D99A 70%, #D4870A 100%)",
          fontFamily:      "system-ui, -apple-system, sans-serif",
          position:        "relative",
          overflow:        "hidden",
        }}
      >
        {/* ── Decorative circles (depth layer) ── */}
        <div
          style={{
            position:        "absolute",
            top:             -120,
            right:           -120,
            width:           500,
            height:          500,
            borderRadius:    "50%",
            background:      "rgba(201, 162, 39, 0.18)",
            display:         "flex",
          }}
        />
        <div
          style={{
            position:        "absolute",
            bottom:          -80,
            left:            -80,
            width:           380,
            height:          380,
            borderRadius:    "50%",
            background:      "rgba(45, 106, 79, 0.12)",
            display:         "flex",
          }}
        />
        <div
          style={{
            position:        "absolute",
            top:             60,
            left:            60,
            width:           140,
            height:          140,
            borderRadius:    "50%",
            background:      "rgba(212, 135, 10, 0.15)",
            display:         "flex",
          }}
        />

        {/* ── FSSAI badge (top-right corner) ── */}
        <div
          style={{
            position:        "absolute",
            top:             32,
            right:           40,
            display:         "flex",
            alignItems:      "center",
            gap:             6,
            background:      "rgba(45, 106, 79, 0.12)",
            border:          "1.5px solid rgba(45, 106, 79, 0.4)",
            borderRadius:    "9999px",
            padding:         "6px 14px",
          }}
        >
          <span
            style={{
              fontSize:   14,
              fontWeight: 600,
              color:      "#2D6A4F",
              letterSpacing: "0.04em",
            }}
          >
            FSSAI 22724441000048
          </span>
        </div>

        {/* ── Logo mark (large "N" monogram) ── */}
        <div
          style={{
            display:         "flex",
            alignItems:      "center",
            justifyContent:  "center",
            width:           110,
            height:          110,
            borderRadius:    "24px",
            background:      "linear-gradient(135deg, #D4870A 0%, #A86508 100%)",
            boxShadow:       "0 8px 32px rgba(168, 101, 8, 0.45)",
            marginBottom:    28,
          }}
        >
          <span
            style={{
              fontSize:      68,
              fontWeight:    800,
              color:         "#fff",
              lineHeight:    1,
              letterSpacing: "-0.04em",
            }}
          >
            N
          </span>
        </div>

        {/* ── Brand name ── */}
        <div
          style={{
            display:         "flex",
            alignItems:      "baseline",
            gap:             12,
            marginBottom:    14,
          }}
        >
          <span
            style={{
              fontSize:      72,
              fontWeight:    800,
              color:         "#3D2B1F",
              letterSpacing: "-0.03em",
              lineHeight:    1,
            }}
          >
            Nuty
          </span>
          <span
            style={{
              fontSize:      72,
              fontWeight:    300,
              color:         "#D4870A",
              letterSpacing: "-0.02em",
              lineHeight:    1,
            }}
          >
            Tales
          </span>
        </div>

        {/* ── Divider ── */}
        <div
          style={{
            width:           180,
            height:          3,
            background:      "linear-gradient(90deg, transparent, #C9A227, transparent)",
            borderRadius:    "9999px",
            marginBottom:    22,
            display:         "flex",
          }}
        />

        {/* ── Tagline ── */}
        <div
          style={{
            display:       "flex",
            fontSize:      30,
            fontWeight:    500,
            color:         "#3D2B1F",
            letterSpacing: "0.02em",
            marginBottom:  16,
            textAlign:     "center",
          }}
        >
          Premium Dry Fruits.&nbsp;
          <span style={{ color: "#2D6A4F", fontWeight: 700 }}>
            Wholesale &amp; Retail.
          </span>
        </div>

        {/* ── Locations ── */}
        <div
          style={{
            display:         "flex",
            alignItems:      "center",
            gap:             16,
            fontSize:        20,
            fontWeight:      500,
            color:           "#6B4C3B",
            letterSpacing:   "0.06em",
            textTransform:   "uppercase",
          }}
        >
          <span>Noida</span>
          <span style={{ color: "#D4870A", fontSize: 12 }}>●</span>
          <span>Kashmir</span>
          <span style={{ color: "#D4870A", fontSize: 12 }}>●</span>
          <span>Patna</span>
          <span style={{ color: "#D4870A", fontSize: 12 }}>●</span>
          <span>Pan India</span>
        </div>

        {/* ── Bottom URL bar ── */}
        <div
          style={{
            position:        "absolute",
            bottom:          0,
            left:            0,
            right:           0,
            display:         "flex",
            alignItems:      "center",
            justifyContent:  "center",
            height:          52,
            background:      "linear-gradient(90deg, #3D2B1F 0%, #6B4C3B 100%)",
          }}
        >
          <span
            style={{
              fontSize:      18,
              fontWeight:    500,
              color:         "rgba(255,255,255,0.8)",
              letterSpacing: "0.08em",
            }}
          >
            www.nutytales.com
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
