import type { Metadata } from 'next'
import Link from 'next/link'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE, FSSAI_NUMBER } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Returns, Replacement & Refund Policy | Nuty Tales',
  description:
    'Nuty Tales transparent returns and refund policy. 100% transit insurance, 7-day replacement window for defective or transit-damaged gourmet dry fruits, saffron, and Kashmiri crafts.',
  alternates: {
    canonical: 'https://nutytales.com/returns',
  },
}

export default function ReturnsPolicyPage() {
  const whatsappPhone = (WHATSAPP_NUMBERS.SUPPORT || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')

  return (
    <main className="min-h-screen bg-[#F7F2E8] text-[#17233B] pt-28 sm:pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Breadcrumb & Title */}
        <div className="space-y-4 border-b border-[#17233B]/10 pb-8">
          <div className="flex items-center gap-2 text-xs font-mono text-[#C9A45C]">
            <Link href="/" className="hover:underline">Home</Link>
            <span>/</span>
            <span className="text-[#17233B]/60">Trust &amp; Fulfillment</span>
            <span>/</span>
            <span className="text-[#17233B] font-semibold">Returns &amp; Refunds</span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-xs border border-emerald-200">
              7-Day Replacement Guarantee
            </span>
            <span className="px-3 py-1 rounded-full bg-[#C9A45C]/15 text-[#96732B] font-semibold text-xs tracking-wider uppercase border border-[#C9A45C]/30">
              Zero-Hassle Returns
            </span>
            <span className="text-xs text-[#17233B]/50 font-mono">
              FSSAI Lic. {FSSAI_NUMBER}
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#17233B]">
            Returns, Replacement &amp; Refund Policy
          </h1>

          <p className="text-sm sm:text-base text-[#17233B]/80 leading-relaxed font-normal max-w-2xl">
            At Nuty Tales, every order of single-origin dry fruits, fresh-crop Kashmiri saffron, and artisanal crafts is packed with tamper-evident security seals. Your satisfaction and safety are completely protected.
          </p>
        </div>

        {/* Policy Highlights Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-[#17233B]/10 shadow-sm space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-sm">
              01
            </div>
            <h3 className="font-serif text-base font-bold text-[#17233B]">7-Day Window</h3>
            <p className="text-xs text-[#17233B]/70 leading-relaxed">
              Report any damaged, defective, or incorrect items within 7 days of verified delivery.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#17233B]/10 shadow-sm space-y-2">
            <div className="w-8 h-8 rounded-lg bg-[#C9A45C]/10 text-[#C9A45C] flex items-center justify-center font-bold text-sm">
              02
            </div>
            <h3 className="font-serif text-base font-bold text-[#17233B]">Free Return Shipping</h3>
            <p className="text-xs text-[#17233B]/70 leading-relaxed">
              Zero return or restocking fees. We arrange free courier pickup or instant replacement dispatch.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#17233B]/10 shadow-sm space-y-2">
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center font-bold text-sm">
              03
            </div>
            <h3 className="font-serif text-base font-bold text-[#17233B]">100% Refund SLA</h3>
            <p className="text-xs text-[#17233B]/70 leading-relaxed">
              Approved refunds are credited to your original payment method (UPI/Card/Bank) within 3 to 5 business days.
            </p>
          </div>
        </div>

        {/* Detailed Policy Content */}
        <div className="bg-white rounded-2xl border border-[#17233B]/10 p-6 sm:p-10 shadow-sm space-y-8 text-sm sm:text-base text-[#17233B]/85 leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#17233B]">
              1. Eligible Return &amp; Replacement Scenarios
            </h2>
            <p>
              We honor replacement or refund requests under any of the following conditions:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm text-[#17233B]/80">
              <li>
                <strong>Transit Damage:</strong> Outer carton broken, inner nitrogen pouch punctured, or saffron glass ampoule damaged during transit.
              </li>
              <li>
                <strong>Defective / Non-Conforming Product:</strong> Compromised vacuum seal, wrong grade/size received, or missing items.
              </li>
              <li>
                <strong>Incorrect Consignment:</strong> Mismatch between your digital order invoice and delivered package contents.
              </li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-3 border-t border-[#17233B]/10 pt-8">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#17233B]">
              2. How to Request a Return or Replacement
            </h2>
            <p>
              We believe in zero bureaucracy. You can initiate a return in under 2 minutes:
            </p>
            <ol className="list-decimal pl-5 space-y-2 text-sm text-[#17233B]/80">
              <li>
                Take a quick photo of the outer box label, the batch number, and the damaged or defective item.
              </li>
              <li>
                Send the photos with your Order ID to our concierge via WhatsApp at{' '}
                <a
                  href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent('Hi Nuty Tales support, I would like to initiate a return/replacement for Order ID: ')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-[#C9A45C] hover:underline"
                >
                  +{whatsappPhone}
                </a>{' '}
                or email <span className="font-mono text-xs bg-[#F7F2E8] px-1.5 py-0.5 rounded">support@nutytales.com</span>.
              </li>
              <li>
                Our operations team verifies your request within 4 business hours and dispatches an immediate replacement or initiates a refund.
              </li>
            </ol>
          </section>

          {/* Section 3 */}
          <section className="space-y-3 border-t border-[#17233B]/10 pt-8">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#17233B]">
              3. Refund Method &amp; Timelines
            </h2>
            <p>
              Once a refund is approved:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm text-[#17233B]/80">
              <li>
                <strong>Prepaid Orders (UPI, Netbanking, Credit/Debit Cards):</strong> Credited directly to your source payment account within 3&ndash;5 working days via Razorpay gateway.
              </li>
              <li>
                <strong>Cash on Delivery (COD) Orders:</strong> Transferred via instant IMPS/NEFT to your verified bank account or UPI ID.
              </li>
              <li>
                <strong>Store Credit Option:</strong> Instant wallet credit with an additional 5% goodwill bonus valid for 12 months.
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-3 border-t border-[#17233B]/10 pt-8">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#17233B]">
              4. Return Shipping Fees
            </h2>
            <p>
              <strong>Return Shipping is 100% Free</strong> for all approved damaged, defective, or incorrect consignments. Customers never pay any restocking fees.
            </p>
          </section>

          {/* Contact Box */}
          <div className="bg-[#F7F2E8] p-6 rounded-xl border border-[#17233B]/10 space-y-3">
            <h3 className="font-serif font-bold text-base text-[#17233B]">
              Need Help With an Active Delivery?
            </h3>
            <p className="text-xs text-[#17233B]/80 leading-relaxed">
              Our fulfillment desk operates Monday to Saturday, 9:00 AM to 7:00 PM IST from our central Noida hub.
            </p>
            <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold">
              <Link href="/contact" className="text-[#C9A45C] hover:underline">
                Contact Support &rarr;
              </Link>
              <Link href="/shipping" className="text-[#17233B] hover:underline">
                View Insured Shipping Policy &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
