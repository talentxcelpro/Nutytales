import type { Metadata } from 'next'
import Link from 'next/link'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE, FSSAI_NUMBER } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Insured Shipping & White-Glove Logistics Policy | Nuty Tales',
  description:
    'Nuty Tales insured shipping and logistics network. Temperature-monitored, 100% transit-insured delivery across India, GCC, and global destinations from our Tri-Hub network in Noida, Srinagar, and Patna.',
  alternates: {
    canonical: 'https://nutytales.com/shipping',
  },
}

export default function ShippingPolicyPage() {
  const whatsappPhone = (WHATSAPP_NUMBERS.SUPPORT || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')

  return (
    <main className="min-h-screen bg-[#F7F2E8] text-[#17233B] pt-28 sm:pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Breadcrumb & Title */}
        <div className="space-y-4 border-b border-[#17233B]/10 pb-8">
          <div className="flex items-center gap-2 text-xs font-mono text-[#C9A45C]">
            <Link href="/" className="hover:underline">Home</Link>
            <span>/</span>
            <span className="text-[#17233B]/60">Trust &amp; Fulfillment</span>
            <span>/</span>
            <span className="text-[#17233B] font-semibold">Insured Shipping</span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-xs border border-emerald-200">
              100% Transit Insured
            </span>
            <span className="px-3 py-1 rounded-full bg-[#C9A45C]/15 text-[#96732B] font-semibold text-xs tracking-wider uppercase border border-[#C9A45C]/30">
              Tri-Hub Logistics Network
            </span>
            <span className="text-xs text-[#17233B]/50 font-mono">
              Zero-Loss Guarantee
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#17233B]">
            Insured Shipping &amp; White-Glove Fulfillment
          </h1>

          <p className="text-sm sm:text-base text-[#17233B]/80 leading-relaxed font-normal max-w-2xl">
            Because our catalog comprises delicate single-origin dry fruits, fresh-crop saffron, and priceless GI-tagged heirloom handlooms, our logistics are designed with zero compromise on protection, provenance, and speed.
          </p>
        </div>

        {/* Tri-Hub Axis Cards */}
        <div className="my-8 space-y-4">
          <h2 className="text-xs font-mono uppercase tracking-wider text-[#17233B]/60 font-bold">
            OUR TRI-HUB FULFILLMENT NETWORK
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-[#17233B]/10 shadow-sm space-y-2">
              <div className="w-8 h-8 rounded-lg bg-[#C9A45C]/10 text-[#C9A45C] flex items-center justify-center font-bold text-sm">
                01
              </div>
              <h3 className="font-serif text-base font-bold text-[#17233B]">Central Hub — Noida</h3>
              <p className="text-xs text-[#17233B]/70 leading-relaxed">
                Sector 62, Delhi-NCR. Central grading, cold storage, corporate laser packaging, and express same-day / 24h dispatch across North India.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#17233B]/10 shadow-sm space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-sm">
                02
              </div>
              <h3 className="font-serif text-base font-bold text-[#17233B]">Valley Origin — Srinagar</h3>
              <p className="text-xs text-[#17233B]/70 leading-relaxed">
                Industrial Estate, Srinagar. Direct air-cargo dispatches for fresh walnut harvest, Pampore saffron vials, and GI-certified Changthangi pashminas.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#17233B]/10 shadow-sm space-y-2">
              <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center font-bold text-sm">
                03
              </div>
              <h3 className="font-serif text-base font-bold text-[#17233B]">Eastern Hub — Patna</h3>
              <p className="text-xs text-[#17233B]/70 leading-relaxed">
                Industrial Area, Patna. Direct origin packaging for Mithila Phool Makhana, jumbo grading, and Eastern India regional wholesale fulfillment.
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Shipping Body */}
        <div className="bg-white rounded-2xl border border-[#17233B]/10 p-6 sm:p-10 shadow-sm space-y-10 text-sm sm:text-base text-[#17233B]/85 leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#17233B]">
              1. 100% Comprehensive Transit Insurance
            </h2>
            <p>
              Every parcel leaving a Nuty Tales hub is automatically covered under our comprehensive transit insurance policy. In the exceedingly rare event that an order is lost in transit, intercepted, or damaged:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm text-[#17233B]/80">
              <li>
                <strong>Immediate Replacement Priority:</strong> We dispatch an immediate identical replacement consignment without waiting for courier investigations to conclude.
              </li>
              <li>
                <strong>Zero Bureaucracy:</strong> Simply send a photo of the damaged package or outer seal to our WhatsApp concierge or support email within 48 hours.
              </li>
              <li>
                <strong>Full Refund Guarantee:</strong> If a replacement is unavailable due to seasonal crop rarity, a 100% refund is processed back to your original payment method.
              </li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-3 border-t border-[#17233B]/10 pt-8">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#17233B]">
              2. Packaging Science &amp; Freshness Protection
            </h2>
            <p>
              Premium nuts and dried fruits deteriorate rapidly when exposed to humidity, UV light, or oxygen. We preserve orchard freshness through state-of-the-art packaging:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
              <div className="p-4 bg-[#F7F2E8] rounded-xl border border-[#17233B]/10 space-y-1">
                <strong className="text-[#17233B] block font-semibold">Nitrogen-Flushed Barrier Pouches</strong>
                <p className="text-[#17233B]/70">Prevents rancidity and oxidation of healthy natural oils in walnuts and badam.</p>
              </div>
              <div className="p-4 bg-[#F7F2E8] rounded-xl border border-[#17233B]/10 space-y-1">
                <strong className="text-[#17233B] block font-semibold">Airtight Saffron Glass Ampoules</strong>
                <p className="text-[#17233B]/70">Pharmaceutical-grade sealed vials that preserve safranal aroma and crocin potency.</p>
              </div>
              <div className="p-4 bg-[#F7F2E8] rounded-xl border border-[#17233B]/10 space-y-1">
                <strong className="text-[#17233B] block font-semibold">Heirloom Handloom Boxes</strong>
                <p className="text-[#17233B]/70">Breathable muslin wrapping inside handcrafted walnut wood cases for Pashmina shawls.</p>
              </div>
              <div className="p-4 bg-[#F7F2E8] rounded-xl border border-[#17233B]/10 space-y-1">
                <strong className="text-[#17233B] block font-semibold">Holographic Security Tape</strong>
                <p className="text-[#17233B]/70">Tamper-evident seals on every carton ensuring untouched delivery from factory to door.</p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-3 border-t border-[#17233B]/10 pt-8">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#17233B]">
              3. Delivery Timelines &amp; SLAs
            </h2>
            <div className="overflow-x-auto rounded-xl border border-[#17233B]/10">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#17233B] text-white">
                  <tr>
                    <th className="p-3">Destination Region</th>
                    <th className="p-3">Dispatch Hub</th>
                    <th className="p-3">Standard SLA</th>
                    <th className="p-3">Express / Air Cargo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#17233B]/10 bg-white">
                  <tr>
                    <td className="p-3 font-semibold">Delhi-NCR (Noida, Delhi, Gurgaon)</td>
                    <td className="p-3 font-mono">Noida Central</td>
                    <td className="p-3">24 &ndash; 36 Hours</td>
                    <td className="p-3 text-emerald-700 font-bold">Same-Day Priority</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">Metro Cities (Mumbai, Bengaluru, Hyderabad, Chennai)</td>
                    <td className="p-3 font-mono">Noida / Srinagar Air</td>
                    <td className="p-3">2 &ndash; 3 Days</td>
                    <td className="p-3 text-emerald-700 font-bold">Next-Day Air Cargo</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">Rest of India (Tier 2 &amp; 3)</td>
                    <td className="p-3 font-mono">Tri-Hub Nearest</td>
                    <td className="p-3">3 &ndash; 5 Days</td>
                    <td className="p-3 text-emerald-700 font-bold">2 &ndash; 3 Days Air</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">International (Dubai / UAE, UK, USA)</td>
                    <td className="p-3 font-mono">Srinagar / Delhi Air</td>
                    <td className="p-3">5 &ndash; 8 Days</td>
                    <td className="p-3 text-emerald-700 font-bold">3 &ndash; 5 Days DHL Express</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-3 border-t border-[#17233B]/10 pt-8">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#17233B]">
              4. Corporate Multi-Address Scheduled Delivery
            </h2>
            <p>
              For corporate Diwali hampers, employee milestone gifts, and wedding trousseau distributions, Nuty Tales offers dedicated enterprise dispatch coordination:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm text-[#17233B]/80">
              <li>Upload a single Excel or CSV recipient sheet containing hundreds or thousands of pan-India addresses.</li>
              <li>Schedule unified simultaneous delivery on a specific auspicious date.</li>
              <li>Receive automated dashboard dispatch telemetry with individual AWB tracking links for every recipient.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-3 border-t border-[#17233B]/10 pt-8">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#17233B]">
              5. Live Tracking &amp; Carrier Partnerships
            </h2>
            <p>
              We partner exclusively with Tier-1 express air carriers including Blue Dart Express, Delhivery Air, DTDC Prime, and DHL International. Once your consignment is dispatched, you receive immediate tracking updates via SMS and WhatsApp.
            </p>
          </section>
        </div>

        {/* Footer Support Card */}
        <div className="mt-10 bg-[#17233B] text-white p-6 sm:p-8 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-serif text-xl font-bold text-white">Track an active consignment or book express courier?</h3>
            <p className="text-xs text-stone-300">Message our logistics desk with your Order ID for real-time GPS location.</p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={`https://wa.me/${whatsappPhone}?text=Hello%20Nuty%20Tales%20Logistics%2C%20I%20would%20like%20to%20track%20my%20order%20or%20inquire%20about%20express%20shipping.`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#C9A45C] hover:bg-[#B38F46] text-[#17233B] text-xs font-bold px-5 py-3 rounded-xl transition-all shadow-sm"
            >
              💬 Track on WhatsApp
            </a>
            <Link
              href="/privacy"
              className="border border-white/20 hover:bg-white/10 text-white text-xs font-semibold px-4 py-3 rounded-xl transition-all"
            >
              Privacy Policy &rarr;
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
