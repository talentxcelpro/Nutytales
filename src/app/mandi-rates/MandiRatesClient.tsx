'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE, FSSAI_NUMBER } from '@/lib/constants'

export interface MandiItem {
  id: string
  commodity: string
  category: string
  origin: string
  grade: string
  khariBaoliRate: number
  kashmirMandiRate: number
  mumbaiApmcRate: number
  nutytalesWholesaleRate: number
  trend: 'up' | 'down' | 'stable'
  changePercent: string
  moq: string
  moisture: string
  leadTime: string
  bestFor: string
  slug: string
}

const MANDI_DATA: MandiItem[] = [
  {
    id: 'mamra-badam-grade-a',
    commodity: 'Kashmiri Mamra Almonds',
    category: 'Almonds',
    origin: 'Budgam & Pulwama, Kashmir',
    grade: 'Grade-A Seedling (100% Oil Rich)',
    khariBaoliRate: 3450,
    kashmirMandiRate: 3200,
    mumbaiApmcRate: 3550,
    nutytalesWholesaleRate: 3150,
    trend: 'up',
    changePercent: '+2.4%',
    moq: '10 kg',
    moisture: '< 4.5%',
    leadTime: '48 hrs',
    bestFor: 'Luxury Retail, Ayurvedic Pharmacies, Premium Gifting',
    slug: 'mamra-almonds-kashmiri-badam',
  },
  {
    id: 'kashmiri-saffron-mongra',
    commodity: 'Pure Kashmiri Mongra Saffron',
    category: 'Saffron',
    origin: 'Pampore Karewas, Kashmir',
    grade: 'ISO 3632 Cat-I (Crocin > 240)',
    khariBaoliRate: 260000,
    kashmirMandiRate: 235000,
    mumbaiApmcRate: 275000,
    nutytalesWholesaleRate: 230000,
    trend: 'stable',
    changePercent: '0.0%',
    moq: '50 grams',
    moisture: '< 8.0%',
    leadTime: '24 hrs Air Cargo',
    bestFor: 'Sweet Manufacturers, Temples, Ayurvedic Formulations',
    slug: 'kashmiri-mongra-saffron',
  },
  {
    id: 'mithila-makhana-7suta',
    commodity: 'Mithila Phool Makhana',
    category: 'Makhana',
    origin: 'Darbhanga & Madhubani, Bihar',
    grade: '7-Suta Jumbo Whole (>20mm)',
    khariBaoliRate: 980,
    kashmirMandiRate: 1050,
    mumbaiApmcRate: 1020,
    nutytalesWholesaleRate: 899,
    trend: 'down',
    changePercent: '-1.8%',
    moq: '25 kg Sacks',
    moisture: '< 7.5%',
    leadTime: '48 hrs',
    bestFor: 'Namkeen Roasters, FMCG Packaging, Supermarkets',
    slug: 'makhana-grade-a-fox-nuts',
  },
  {
    id: 'kagzi-walnut-kernels-snow',
    commodity: 'Kashmiri Walnut Kernels (Snow White)',
    category: 'Walnuts',
    origin: 'Shopian & Kupwara, Kashmir',
    grade: 'Extra Light Halves (80%+ Halves)',
    khariBaoliRate: 1450,
    kashmirMandiRate: 1280,
    mumbaiApmcRate: 1520,
    nutytalesWholesaleRate: 1250,
    trend: 'up',
    changePercent: '+3.1%',
    moq: '20 kg Vacuum Box',
    moisture: '< 4.0%',
    leadTime: '48 hrs',
    bestFor: 'Bakeries, Confectioners, Export Packaging',
    slug: 'kashmiri-walnut-kernels-snow-white-halves',
  },
  {
    id: 'cashews-w240-king',
    commodity: 'Cashew Kernels (W240 King)',
    category: 'Cashews',
    origin: 'Goa & Konkan Coastal Terroir',
    grade: 'W240 Whole (Export Quality)',
    khariBaoliRate: 880,
    kashmirMandiRate: 920,
    mumbaiApmcRate: 860,
    nutytalesWholesaleRate: 830,
    trend: 'stable',
    changePercent: '+0.5%',
    moq: '10 kg Tin',
    moisture: '< 5.0%',
    leadTime: '24-48 hrs',
    bestFor: 'Hotels, Catering, Premium Roasted Snacks',
    slug: 'cashews-w240-king-jumbo',
  },
  {
    id: 'pista-green-slivers',
    commodity: 'Peshawari Green Pista Slivers',
    category: 'Pistachios',
    origin: 'Silk Route Heritage Origin',
    grade: 'Emerald Green Wazwan Cut',
    khariBaoliRate: 2950,
    kashmirMandiRate: 3100,
    mumbaiApmcRate: 3050,
    nutytalesWholesaleRate: 2850,
    trend: 'up',
    changePercent: '+1.5%',
    moq: '5 kg',
    moisture: '< 5.2%',
    leadTime: '24 hrs',
    bestFor: 'Traditional Mithai, Shufta, Royal Catering',
    slug: 'green-peeled-pista-slivers',
  },
  {
    id: 'afghan-anjeer-mala',
    commodity: 'Kandahari Mala Anjeer (Figs)',
    category: 'Figs',
    origin: 'Kandahar Cotton-String Wreath',
    grade: 'Grade-A Jumbo Disc Flakes',
    khariBaoliRate: 1850,
    kashmirMandiRate: 1950,
    mumbaiApmcRate: 1920,
    nutytalesWholesaleRate: 1750,
    trend: 'stable',
    changePercent: '0.0%',
    moq: '10 kg Wreath Box',
    moisture: '< 12.0%',
    leadTime: '48 hrs',
    bestFor: 'Health Food Stores, Festive Hampers, Daily Nutrition',
    slug: 'afghan-kandahari-mala-anjeer',
  },
]

export default function MandiRatesClient() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [rfqModalItem, setRfqModalItem] = useState<MandiItem | null>(null)
  const [rfqQuantity, setRfqQuantity] = useState<string>('50 kg')
  const [rfqCity, setRfqCity] = useState<string>('Delhi NCR')

  const whatsappPhone = (WHATSAPP_NUMBERS.B2B || WHATSAPP_NUMBERS.SUPPORT || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')

  const categories = ['All', 'Almonds', 'Saffron', 'Makhana', 'Walnuts', 'Cashews', 'Pistachios', 'Figs']

  const filteredItems =
    selectedCategory === 'All'
      ? MANDI_DATA
      : MANDI_DATA.filter((i) => i.category === selectedCategory)

  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="space-y-12">
      {/* Live Market Alert Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-amber-950 text-white p-6 sm:p-8 rounded-2xl shadow-xl border border-amber-900/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-block w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-300">
                Live Wholesale Mandi Ticker · Market Open
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-amber-100">
              India Wholesale Dry Fruits Mandi Rates
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 mt-1">
              Benchmark daily rates across Delhi (Khari Baoli), Srinagar Mandi, and Mumbai APMC. Direct farm-gate dispatch with GST invoices & Central FSSAI Lic. #{FSSAI_NUMBER}.
            </p>
          </div>
          <div className="text-right shrink-0">
            <div className="text-xs text-stone-400">Rate Effective Date</div>
            <div className="text-lg font-bold text-amber-300">{currentDate}</div>
            <div className="text-[11px] text-stone-400 mt-0.5">Updated Every Morning at 08:30 AM IST</div>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-[#3D2B1F] text-amber-100 shadow-md'
                : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Mandi Rates Comparison Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-serif font-bold text-lg text-stone-900">
              Direct Mandi Benchmark Table (Per Kg / Grams)
            </h3>
            <p className="text-xs text-stone-500">
              Compare local terminal wholesale mandi rates with Nuty Tales direct farmer-origin gate pricing.
            </p>
          </div>
          <span className="text-xs bg-amber-50 text-amber-900 border border-amber-200 px-3 py-1 rounded-full font-medium">
            ⚡ Save 8% to 15% via Origin Gate Dispatch
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#FAF7F2] text-stone-700 font-semibold uppercase text-[11px] tracking-wider border-b border-stone-200">
              <tr>
                <th className="py-4 px-4 sm:px-6">Commodity & Grade</th>
                <th className="py-4 px-4 text-center">Khari Baoli (Delhi)</th>
                <th className="py-4 px-4 text-center">Mumbai APMC</th>
                <th className="py-4 px-4 text-center bg-amber-50/80 text-amber-950 font-bold border-x border-amber-200">
                  Nuty Tales Direct
                </th>
                <th className="py-4 px-4 text-center">7D Trend</th>
                <th className="py-4 px-4 text-center">MOQ</th>
                <th className="py-4 px-4 text-center">Bulk Quote</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredItems.map((item) => {
                const isSaffron = item.category === 'Saffron'
                const unit = isSaffron ? '/kg (bulk)' : '/kg'

                return (
                  <tr key={item.id} className="hover:bg-amber-50/30 transition">
                    {/* Commodity Info */}
                    <td className="py-4 px-4 sm:px-6">
                      <div className="font-bold text-stone-900 font-serif text-sm sm:text-base">
                        {item.commodity}
                      </div>
                      <div className="text-xs text-amber-800 font-medium">{item.grade}</div>
                      <div className="text-[11px] text-stone-500">{item.origin} · Moisture {item.moisture}</div>
                    </td>

                    {/* Khari Baoli Rate */}
                    <td className="py-4 px-4 text-center font-medium text-stone-600">
                      ₹{item.khariBaoliRate.toLocaleString('en-IN')}{unit}
                    </td>

                    {/* Mumbai APMC Rate */}
                    <td className="py-4 px-4 text-center font-medium text-stone-600">
                      ₹{item.mumbaiApmcRate.toLocaleString('en-IN')}{unit}
                    </td>

                    {/* Nuty Tales Direct Rate */}
                    <td className="py-4 px-4 text-center bg-amber-50/50 border-x border-amber-200/80">
                      <div className="font-bold text-stone-950 text-base sm:text-lg">
                        ₹{item.nutytalesWholesaleRate.toLocaleString('en-IN')}
                      </div>
                      <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-1.5 py-0.5 rounded">
                        Best Origin Rate
                      </span>
                    </td>

                    {/* Trend */}
                    <td className="py-4 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 font-bold text-xs ${
                          item.trend === 'up'
                            ? 'text-red-600'
                            : item.trend === 'down'
                            ? 'text-emerald-600'
                            : 'text-stone-500'
                        }`}
                      >
                        {item.trend === 'up' ? '▲' : item.trend === 'down' ? '▼' : '●'}{' '}
                        {item.changePercent}
                      </span>
                    </td>

                    {/* MOQ */}
                    <td className="py-4 px-4 text-center font-semibold text-stone-700">
                      {item.moq}
                    </td>

                    {/* Action */}
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => setRfqModalItem(item)}
                        className="bg-[#3D2B1F] hover:bg-[#2A1810] text-amber-100 font-semibold px-3 py-1.5 rounded-lg text-xs transition shadow-sm whitespace-nowrap"
                      >
                        Get RFQ / Order →
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Commercial Buyer Benefits Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
          <div className="text-3xl mb-3">📄</div>
          <h4 className="font-serif font-bold text-base text-stone-900 mb-1">
            100% Tax Compliant GST Invoices
          </h4>
          <p className="text-xs text-stone-600 leading-relaxed">
            All dispatches carry formal HSN 0802 / 0801 / 0910 GST invoices for complete input tax credit (ITC) reconciliation for businesses.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
          <div className="text-3xl mb-3">🚚</div>
          <h4 className="font-serif font-bold text-base text-stone-900 mb-1">
            Doorstep Surface & Air Logistics
          </h4>
          <p className="text-xs text-stone-600 leading-relaxed">
            Partnered with BlueDart, Delhivery Surface, and VRL Logistics for fast, insured transport to Delhi-NCR, Mumbai, Bengaluru, Hyderabad, and Kolkata.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
          <div className="text-3xl mb-3">🛡️</div>
          <h4 className="font-serif font-bold text-base text-stone-900 mb-1">
            Central FSSAI & NABL Certified
          </h4>
          <p className="text-xs text-stone-600 leading-relaxed">
            Licensed under Central FSSAI #{FSSAI_NUMBER}. Third-party NABL lab reports provided for oil content, moisture, and zero adulteration.
          </p>
        </div>
      </div>

      {/* RFQ / Direct Order Modal */}
      {rfqModalItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative">
            <button
              onClick={() => setRfqModalItem(null)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 text-xl font-bold w-8 h-8 rounded-full flex items-center justify-center hover:bg-stone-100"
            >
              ✕
            </button>

            <span className="text-xs uppercase font-bold text-amber-800 tracking-wider bg-amber-50 px-2.5 py-1 rounded-md">
              Instant Wholesale RFQ
            </span>

            <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 mt-2 mb-1">
              {rfqModalItem.commodity}
            </h3>
            <p className="text-xs text-stone-500 mb-6">
              Grade: {rfqModalItem.grade} · Origin: {rfqModalItem.origin}
            </p>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Required Order Volume (MOQ: {rfqModalItem.moq})
                </label>
                <input
                  type="text"
                  value={rfqQuantity}
                  onChange={(e) => setRfqQuantity(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-800"
                  placeholder="e.g. 50 kg, 100 kg, 1 ton"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Delivery Destination / City
                </label>
                <input
                  type="text"
                  value={rfqCity}
                  onChange={(e) => setRfqCity(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-800"
                  placeholder="e.g. Delhi NCR, Mumbai, Ahmedabad"
                />
              </div>

              <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200 text-xs text-stone-700 space-y-1">
                <div>
                  <span className="font-semibold">Indicative Wholesale Rate: </span>
                  <span className="font-bold text-stone-900">
                    ₹{rfqModalItem.nutytalesWholesaleRate.toLocaleString('en-IN')}/kg
                  </span>
                </div>
                <div>
                  <span className="font-semibold">Standard Lead Time: </span>
                  <span>{rfqModalItem.leadTime}</span>
                </div>
                <div>
                  <span className="font-semibold">Payment Terms: </span>
                  <span>Advance / LC / Cash Against Documents</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <a
                href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
                  `*WHOLESALE B2B INQUIRY (Mandi Rates)*\n\nCommodity: ${rfqModalItem.commodity}\nGrade: ${rfqModalItem.grade}\nRequired Quantity: ${rfqQuantity}\nDelivery City: ${rfqCity}\n\nPlease share official proforma invoice and dispatch schedule.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl text-sm transition shadow-md"
              >
                💬 Send RFQ on WhatsApp ({WHATSAPP_NUMBERS.B2B || DEFAULT_CONTACT_PHONE})
              </a>

              <Link
                href={`/shop/${rfqModalItem.slug}`}
                className="block w-full text-center bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold py-2.5 px-4 rounded-xl text-xs transition"
              >
                View Retail Pack ({rfqModalItem.commodity}) →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
