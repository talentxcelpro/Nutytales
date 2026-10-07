import type { Metadata } from 'next'
import Link from 'next/link'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE, FSSAI_NUMBER } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Terms of Service & Commercial Conditions | Nutty Tales',
  description:
    'Terms of service, purchase contracts, wholesale procurement guidelines, hospitality reservation policies, and authenticity guarantees for Nutty Tales Private Limited.',
  alternates: {
    canonical: 'https://nutytales.com/terms',
  },
}

export default function TermsOfServicePage() {
  const whatsappPhone = (WHATSAPP_NUMBERS.SUPPORT || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')

  return (
    <main className="min-h-screen bg-[#F7F2E8] text-[#17233B] pt-28 sm:pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Breadcrumb & Title */}
        <div className="space-y-4 border-b border-[#17233B]/10 pb-8">
          <div className="flex items-center gap-2 text-xs font-mono text-[#C9A45C]">
            <Link href="/" className="hover:underline">Home</Link>
            <span>/</span>
            <span className="text-[#17233B]/60">Legal &amp; Trust</span>
            <span>/</span>
            <span className="text-[#17233B] font-semibold">Terms of Service</span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3 py-1 rounded-full bg-[#C9A45C]/15 text-[#96732B] font-semibold text-xs tracking-wider uppercase border border-[#C9A45C]/30">
              Commercial Agreement
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-xs border border-emerald-200">
              FSSAI Reg. {FSSAI_NUMBER}
            </span>
            <span className="text-xs text-[#17233B]/50 font-mono">
              Last Updated: October 7, 2026
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#17233B]">
            Terms of Service &amp; Commercial Agreement
          </h1>

          <p className="text-sm sm:text-base text-[#17233B]/80 leading-relaxed font-normal max-w-2xl">
            Welcome to Nutty Tales. These Terms of Service constitute a legally binding agreement between you (&ldquo;Customer&rdquo;, &ldquo;Buyer&rdquo;, &ldquo;Guest&rdquo;) and Nutty Tales Private Limited governing access to our commerce platforms, wholesale supply desks, bespoke gifting portals, and hospitality services.
          </p>
        </div>

        {/* 6 Business Framework Pillars */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-8 text-xs">
          <div className="bg-white p-4 rounded-xl border border-[#17233B]/10 shadow-sm">
            <strong className="text-[#17233B] block font-semibold mb-1">1. Gourmet Retail</strong>
            <p className="text-[#17233B]/70">FSSAI compliant, vacuum nitrogen packaging, zero-chemical guarantee.</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-[#17233B]/10 shadow-sm">
            <strong className="text-[#17233B] block font-semibold mb-1">2. B2B Wholesale</strong>
            <p className="text-[#17233B]/70">GST invoicing, tiered volume pricing, strict dispatch SLAs from Tri-Hubs.</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-[#17233B]/10 shadow-sm">
            <strong className="text-[#17233B] block font-semibold mb-1">3. Corporate Gifting</strong>
            <p className="text-[#17233B]/70">Laser-engraved branding, multi-address scheduled Pan-India delivery.</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-[#17233B]/10 shadow-sm">
            <strong className="text-[#17233B] block font-semibold mb-1">4. Destination Weddings</strong>
            <p className="text-[#17233B]/70">Royal trousseau boxes, artisan favours, milestone budget governance.</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-[#17233B]/10 shadow-sm">
            <strong className="text-[#17233B] block font-semibold mb-1">5. Heirloom Crafts</strong>
            <p className="text-[#17233B]/70">Govt J&amp;K GI tag certification, silk-thread testing guarantee.</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-[#17233B]/10 shadow-sm">
            <strong className="text-[#17233B] block font-semibold mb-1">6. Stays &amp; Travel</strong>
            <p className="text-[#17233B]/70">Vetted private estates, 4x4 convoys, and local DMC coordination.</p>
          </div>
        </div>

        {/* Legal Text Body */}
        <div className="bg-white rounded-2xl border border-[#17233B]/10 p-6 sm:p-10 shadow-sm space-y-10 text-sm sm:text-base text-[#17233B]/85 leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#17233B]">
              1. Acceptance &amp; Eligibility
            </h2>
            <p>
              By accessing, browsing, or transacting on{' '}
              <span className="font-mono text-xs bg-[#F7F2E8] px-1.5 py-0.5 rounded">nutytales.com</span> or any of our official business subdomains (business, gifting, weddings, crafts, stays, travel), you confirm that you are at least 18 years of age and legally competent to enter into contracts under the Indian Contract Act, 1872.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3 border-t border-[#17233B]/10 pt-8">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#17233B]">
              2. Product Quality &amp; GI Tag Provenance Warranty
            </h2>
            <p>
              Nutty Tales guarantees the authenticity and origin of our catalog items:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm text-[#17233B]/80">
              <li>
                <strong>Kashmiri Saffron (Mongra):</strong> 100% pure high-altitude Pampore stigma, ISO 3632 Category I grade, free from foreign matter, artificial colorants, or adulterants.
              </li>
              <li>
                <strong>Kashmiri Badam (Mamra &amp; Kagzi):</strong> Cold-press tested oil content exceeding 48%, native Himalayan tree stock without chemical bleaching.
              </li>
              <li>
                <strong>Authentic Changthangi Pashmina:</strong> Handcrafted under the Geographical Indication (GI) registry of the Government of Jammu &amp; Kashmir, featuring microscopic laser-etched secure provenance tags.
              </li>
              <li>
                <strong>Mithila Phool Makhana:</strong> Hand-popped in Bihar wetland clusters, graded jumbo size without artificial polish.
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3 border-t border-[#17233B]/10 pt-8">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#17233B]">
              3. Pricing, Payments &amp; Taxes
            </h2>
            <p>
              All prices displayed for consumer retail include applicable Goods and Services Tax (GST). For B2B wholesale transactions, prices may be quoted ex-hub (Noida/Srinagar/Patna) with GST added at the statutory rates (5%, 12%, or 18% based on HSN classifications). Invoices are issued with full tax credit eligibility.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3 border-t border-[#17233B]/10 pt-8">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#17233B]">
              4. Cancellations, Replacement &amp; Returns
            </h2>
            <p>
              Due to the perishable nature of gourmet dry fruits, returns are accepted exclusively in the following circumstances:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm text-[#17233B]/80">
              <li>Packaging seal compromised or physically damaged upon delivery.</li>
              <li>Incorrect item or weight dispatched compared to the verified order receipt.</li>
              <li>Quality non-conformance reported within 48 hours of delivery accompanied by batch photographic evidence.</li>
            </ul>
            <p className="text-xs text-[#17233B]/70 bg-[#F7F2E8] p-3 rounded-lg border border-[#17233B]/10">
              For bespoke engraved corporate gift boxes and custom hand-loomed bridal pashminas, orders enter irreversible production upon approval of digital proofs and are non-cancellable once manufacturing commences.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3 border-t border-[#17233B]/10 pt-8">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#17233B]">
              5. Boutique Stays &amp; Kashmir Travel Bookings
            </h2>
            <p>
              Reservations for private orchard villas, houseboats, and travel itineraries are subject to seasonal weather contingencies:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm text-[#17233B]/80">
              <li>Standard cancellation: Full refund up to 14 days before check-in; 50% refund up to 7 days before check-in.</li>
              <li>High-altitude force majeure: In the event of winter airport closures or national highway blockages, reservation dates may be rescheduled without penalty for up to 12 months.</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="space-y-3 border-t border-[#17233B]/10 pt-8">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#17233B]">
              6. Governing Law &amp; Dispute Resolution
            </h2>
            <p>
              These Terms of Service are governed by and construed under the laws of the Republic of India. Any legal dispute, arbitration, or claim shall be subject to the exclusive jurisdiction of the competent courts in Gautam Buddha Nagar, Noida, Uttar Pradesh, and Srinagar, Jammu &amp; Kashmir.
            </p>
          </section>
        </div>

        {/* Footer Support Card */}
        <div className="mt-10 bg-[#17233B] text-white p-6 sm:p-8 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-serif text-xl font-bold text-white">Need commercial or contract assistance?</h3>
            <p className="text-xs text-stone-300">Connect directly with our legal &amp; corporate relations team.</p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={`https://wa.me/${whatsappPhone}?text=Hello%20Nutty%20Tales%2C%20I%20have%20an%20inquiry%20regarding%20commercial%20terms.`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#C9A45C] hover:bg-[#B38F46] text-[#17233B] text-xs font-bold px-5 py-3 rounded-xl transition-all shadow-sm"
            >
              💬 WhatsApp Concierge
            </a>
            <Link
              href="/shipping"
              className="border border-white/20 hover:bg-white/10 text-white text-xs font-semibold px-4 py-3 rounded-xl transition-all"
            >
              Insured Shipping &rarr;
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
