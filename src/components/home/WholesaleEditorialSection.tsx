import Link from 'next/link'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE, FSSAI_NUMBER } from '@/lib/constants'

export default function WholesaleEditorialSection() {
  const whatsappPhone = (WHATSAPP_NUMBERS.SUPPORT || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')

  return (
    <section className="py-24 bg-[#F7F2E8] border-b border-[#17233B]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs uppercase tracking-[0.25em] text-[#704B32] font-semibold block">
              Commercial Procurement
            </span>

            <div className="space-y-3">
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#17233B] tracking-tight leading-[1.15]">
                Wholesale supply, <br />
                engineered for scale.
              </h2>
              <p className="text-sm sm:text-base text-[#17233B]/80 max-w-lg leading-relaxed font-normal">
                Direct sourcing and tiered wholesale pricing for retailers, supermarkets, bakeries, sweet shops, and institutional buyers. Operating from our central warehouses in Noida, Srinagar, and Patna.
              </p>
            </div>

            {/* Hubs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-white border border-[#17233B]/10 space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#176B68] tracking-wider block">
                  Central Hub
                </span>
                <span className="font-bold text-sm text-[#17233B] block">Noida / NCR</span>
                <p className="text-[11px] text-[#17233B]/70">Khari Baoli links &amp; rapid NCR fulfillment.</p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-[#17233B]/10 space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#176B68] tracking-wider block">
                  Valley Hub
                </span>
                <span className="font-bold text-sm text-[#17233B] block">Srinagar</span>
                <p className="text-[11px] text-[#17233B]/70">Walnut, saffron &amp; Kashmir B2B network.</p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-[#17233B]/10 space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#176B68] tracking-wider block">
                  Eastern Hub
                </span>
                <span className="font-bold text-sm text-[#17233B] block">Patna / Bihar</span>
                <p className="text-[11px] text-[#17233B]/70">Mithila Makhana &amp; bakery supply.</p>
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                href="/wholesale-dry-fruits"
                className="px-7 py-3.5 bg-[#17233B] hover:bg-[#176B68] text-white font-semibold text-xs uppercase tracking-widest transition-colors shadow-sm"
              >
                Wholesale Portal
              </Link>
              <Link
                href="/bulk-quote"
                className="px-7 py-3.5 border border-[#17233B] text-[#17233B] hover:bg-[#17233B] hover:text-white font-semibold text-xs uppercase tracking-widest transition-colors"
              >
                Request RFQ
              </Link>
              <a
                href={`https://wa.me/${whatsappPhone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs uppercase tracking-wider font-semibold text-[#176B68] hover:underline"
              >
                WhatsApp Desk (+91 9717161809) →
              </a>
            </div>
          </div>

          {/* Right Highlights & Compliance */}
          <div className="lg:col-span-6 bg-white p-8 sm:p-10 rounded-2xl border border-[#17233B]/10 shadow-sm space-y-6">
            <h3 className="font-serif text-2xl font-bold text-[#17233B]">
              Why Indian Enterprises Choose Nuty Tales
            </h3>

            <div className="space-y-4 text-xs text-[#17233B]/80">
              <div className="flex items-start gap-3">
                <span className="text-base text-[#176B68]">✓</span>
                <div>
                  <strong className="text-[#17233B] text-sm block">Quantity Break Tiers</strong>
                  Transparent per-kilogram rate slabs for 5kg, 10kg, 25kg, 50kg, and 100kg+ volumes without hidden surcharges.
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-base text-[#176B68]">✓</span>
                <div>
                  <strong className="text-[#17233B] text-sm block">100% Tax Compliant GST Billing</strong>
                  Full HSN-coded GST tax invoices for claiming Input Tax Credit (ITC) on all business purchases.
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-base text-[#176B68]">✓</span>
                <div>
                  <strong className="text-[#17233B] text-sm block">FSSAI Certified Quality</strong>
                  Batch-tested kernels adhering to FSSAI Lic. {FSSAI_NUMBER} standards for moisture, oil content, and purity.
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-base text-[#176B68]">✓</span>
                <div>
                  <strong className="text-[#17233B] text-sm block">Location-Aware Fulfillment</strong>
                  Dispatches mapped automatically to the nearest warehouse (Noida, Kashmir, Patna) to reduce transit time and freight costs.
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-[#704B32]">
              <span>B2B Credit &amp; Repeat Ordering Available</span>
              <Link href="/business" className="font-semibold text-[#176B68] hover:underline">
                Create Business Account →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
