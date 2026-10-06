import type { Metadata } from 'next'
import RFQForm from '@/components/rfq/RFQForm'

export const metadata: Metadata = {
  title: 'Request a Bulk Dry Fruit Quote (RFQ) | Nutty Tales Wholesale',
  description:
    'Submit an RFQ for wholesale dry fruits. Multi-product quotes for California almonds, cashews, raisins, walnuts, pistachios, and Makhana. Fast response within 24 hours.',
  keywords: [
    'dry fruit bulk quote',
    'dry fruits rfq india',
    'wholesale dry fruit pricing',
    'bulk almond quote',
    'cashew wholesale quotation',
  ],
}

export default function BulkQuotePage() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] pt-24 pb-20 md:pt-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#D4870A]">
            B2B Procurement Engine
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#3D2B1F] font-serif">
            Request a Bulk Quote
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 max-w-xl mx-auto">
            Tell us your product and volume requirements. We calculate landed cost, freight, and tax based on your delivery hub.
          </p>
        </div>

        <RFQForm />
      </div>
    </div>
  )
}
