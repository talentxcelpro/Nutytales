import type { Metadata } from 'next'
import Link from 'next/link'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE, FSSAI_NUMBER } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Privacy Policy | Nuty Tales Private Limited',
  description:
    'Nuty Tales privacy policy. How we collect, safeguard, and process customer data across our gourmet dry fruit store, B2B wholesale portal, luxury stays, Kashmir travel, and GI-certified crafts.',
  alternates: {
    canonical: 'https://nutytales.com/privacy',
  },
}

export default function PrivacyPolicyPage() {
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
            <span className="text-[#17233B] font-semibold">Privacy Policy</span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3 py-1 rounded-full bg-[#C9A45C]/15 text-[#96732B] font-semibold text-xs tracking-wider uppercase border border-[#C9A45C]/30">
              DPDP Act 2023 Compliant
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-xs border border-emerald-200">
              FSSAI Reg. {FSSAI_NUMBER}
            </span>
            <span className="text-xs text-[#17233B]/50 font-mono">
              Effective Date: October 7, 2026
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#17233B]">
            Privacy &amp; Data Protection Policy
          </h1>

          <p className="text-sm sm:text-base text-[#17233B]/80 leading-relaxed font-normal max-w-2xl">
            Nuty Tales Private Limited (&ldquo;Nuty Tales&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;) is committed to the highest standards of data security, consumer privacy, and transparency across our Tri-Hub commerce and experiential network.
          </p>
        </div>

        {/* Quick Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-8">
          <div className="bg-white p-5 rounded-xl border border-[#17233B]/10 shadow-sm space-y-1.5">
            <span className="text-lg">🔒</span>
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#17233B]">Zero Card Storage</h2>
            <p className="text-xs text-[#17233B]/70 leading-relaxed">
              We never store debit/credit card numbers or CVVs. All transactions are tokenized via PCI-DSS Level 1 certified gateways.
            </p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-[#17233B]/10 shadow-sm space-y-1.5">
            <span className="text-lg">🛡️</span>
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#17233B]">No Data Selling</h2>
            <p className="text-xs text-[#17233B]/70 leading-relaxed">
              Your personal information, phone number, and procurement records are never rented, monetized, or shared with third-party advertisers.
            </p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-[#17233B]/10 shadow-sm space-y-1.5">
            <span className="text-lg">📜</span>
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#17233B]">Full Deletion Rights</h2>
            <p className="text-xs text-[#17233B]/70 leading-relaxed">
              You maintain sovereign rights to request an export or complete deletion of your account and personal history at any time.
            </p>
          </div>
        </div>

        {/* Content Sections */}
        <div className="bg-white rounded-2xl border border-[#17233B]/10 p-6 sm:p-10 shadow-sm space-y-10 text-sm sm:text-base text-[#17233B]/85 leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#17233B]">
              1. Information We Collect
            </h2>
            <p>
              Depending on how you interact with our 6 integrated businesses (Dry Fruits Commerce, B2B Procurement, Corporate Gifting, Destination Weddings, GI Crafts, and Boutique Stays/Travel), we may collect:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm text-[#17233B]/80">
              <li>
                <strong>Identity &amp; Contact Details:</strong> Full name, verified mobile number (OTP authentication via Firebase), email address, and delivery coordinates.
              </li>
              <li>
                <strong>B2B Enterprise Data:</strong> Company legal name, GSTIN (Goods &amp; Services Tax Identification Number), billing address, and trade procurement volumes for wholesale RFQs.
              </li>
              <li>
                <strong>Hospitality &amp; Guest Records:</strong> Guest identification (Aadhaar, Passport, or Govt ID) required under local Jammu &amp; Kashmir and state tourism regulations for Stays and Curated Travel expeditions.
              </li>
              <li>
                <strong>Technical &amp; Device Telemetry:</strong> Anonymized IP addresses, browser client fingerprints, and referral sources strictly used to prevent fraudulent orders and optimize page rendering speeds.
              </li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-3 border-t border-[#17233B]/10 pt-8">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#17233B]">
              2. How We Use Your Information
            </h2>
            <p>
              Every data point collected serves an explicit operational purpose:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm text-[#17233B]/80">
              <li>Fulfilling orders, printing FSSAI-compliant batch packaging labels, and scheduling insured temperature-stable courier dispatch.</li>
              <li>Generating valid GST tax invoices and shipping e-way bills.</li>
              <li>Dispatching real-time automated SMS and WhatsApp delivery tracking links.</li>
              <li>Validating GI-certified authenticity codes for handloom Pashmina and luxury craft consignments.</li>
              <li>Coordinating private airport convoys and host check-ins for our boutique orchard estates and houseboats.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3 border-t border-[#17233B]/10 pt-8">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#17233B]">
              3. Payment Security &amp; Financial Confidentiality
            </h2>
            <p>
              All online credit card, debit card, UPI, and NetBanking transactions are processed through RBI-licensed payment aggregators (including Razorpay Software Private Limited) using end-to-end 256-bit SSL encryption.
            </p>
            <p className="text-sm bg-[#F7F2E8] p-4 rounded-xl border border-[#17233B]/10">
              <strong>Security Guarantee:</strong> Nuty Tales employees and systems never have visibility into or access to your card security numbers (CVV), NetBanking passwords, or UPI PINs.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3 border-t border-[#17233B]/10 pt-8">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#17233B]">
              4. Cookies &amp; Tracking Technologies
            </h2>
            <p>
              We employ essential session cookies and performance telemetry to maintain your shopping cart, authenticate your login session, and monitor indexation telemetry. You may disable non-essential cookies via your browser settings at any time without impacting your checkout capability.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3 border-t border-[#17233B]/10 pt-8">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#17233B]">
              5. Data Retention &amp; Sovereign Deletion Rights
            </h2>
            <p>
              We retain commercial order records for the minimum period mandated by Indian tax and accounting statutes (typically 7 financial years). To exercise your right to access, rectify, or permanently purge your personal profile data, email our compliance desk at{' '}
              <a href="mailto:privacy@nutytales.com" className="text-[#C9A45C] font-semibold underline">
                privacy@nutytales.com
              </a>.
            </p>
          </section>

          {/* Section 6 - Grievance Officer */}
          <section className="space-y-3 border-t border-[#17233B]/10 pt-8 bg-[#17233B]/[0.02] p-6 rounded-xl border border-[#17233B]/10">
            <h2 className="font-serif text-xl font-bold text-[#17233B]">
              6. Grievance Officer &amp; Redressal Mechanism
            </h2>
            <p className="text-xs text-[#17233B]/70">
              In accordance with the Information Technology Act 2000 and Digital Personal Data Protection Act 2023:
            </p>
            <div className="text-xs space-y-1 font-mono text-[#17233B]/90 pt-1">
              <p><strong>Designated Grievance Officer:</strong> Arshid Wani</p>
              <p><strong>Entity:</strong> Nuty Tales Private Limited</p>
              <p><strong>Corporate HQ:</strong> Sector 62, Noida, Gautam Buddha Nagar, Uttar Pradesh 201309</p>
              <p><strong>Direct Email:</strong> grievance@nutytales.com</p>
              <p><strong>Response SLA:</strong> Within 48 business hours</p>
            </div>
          </section>
        </div>

        {/* Support Help Desk Card */}
        <div className="mt-10 bg-[#17233B] text-white p-6 sm:p-8 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-serif text-xl font-bold text-white">Have questions about your data privacy?</h3>
            <p className="text-xs text-stone-300">Our concierge desk is available 7 days a week.</p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={`https://wa.me/${whatsappPhone}?text=Hello%20Nuty%20Tales%2C%20I%20have%20a%20question%20regarding%20data%20privacy.`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#C9A45C] hover:bg-[#B38F46] text-[#17233B] text-xs font-bold px-5 py-3 rounded-xl transition-all shadow-sm"
            >
              💬 WhatsApp Concierge
            </a>
            <Link
              href="/terms"
              className="border border-white/20 hover:bg-white/10 text-white text-xs font-semibold px-4 py-3 rounded-xl transition-all"
            >
              Terms of Service &rarr;
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
