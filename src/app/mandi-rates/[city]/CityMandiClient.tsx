'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { CityMandiData, CityMandiCommodity } from '@/lib/mandi-cities-data'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE, FSSAI_NUMBER } from '@/lib/constants'

interface CityMandiClientProps {
  data: CityMandiData
}

export default function CityMandiClient({ data }: CityMandiClientProps) {
  const [selectedCommodity, setSelectedCommodity] = useState<CityMandiCommodity | null>(null)
  const [calcQuantityKg, setCalcQuantityKg] = useState<number>(50)
  const [selectedCalcItemIdx, setSelectedCalcItemIdx] = useState<number>(0)
  const [rfqName, setRfqName] = useState('')
  const [rfqBusiness, setRfqBusiness] = useState('')
  const [rfqCityPin, setRfqCityPin] = useState(data.pincode)

  const whatsappPhone = (WHATSAPP_NUMBERS.B2B || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')

  const currentCalcCommodity = data.commodities[selectedCalcItemIdx] || data.commodities[0]

  // Compute landed cost savings
  const localTotalCost = currentCalcCommodity.localMandiPriceKg * calcQuantityKg
  const nutytalesBaseCost = currentCalcCommodity.nutytalesDirectPriceKg * calcQuantityKg
  const freightCost = (data.freightPerKgFromOrigin.kashmirToCity || 20) * calcQuantityKg
  const nutytalesLandedTotal = nutytalesBaseCost + freightCost
  const netEstimatedSavings = Math.max(0, localTotalCost - nutytalesLandedTotal)

  const handleOpenRfq = (item: CityMandiCommodity) => {
    setSelectedCommodity(item)
  }

  const handleSendWhatsAppRfq = () => {
    if (!selectedCommodity) return

    const message = `*COMMERCIAL BULK RFQ — ${data.mandiName.toUpperCase()}*\n\n` +
      `*Buyer Name:* ${rfqName || 'Business Owner'}\n` +
      `*Firm / Company:* ${rfqBusiness || 'Retailer / Confectioner'}\n` +
      `*Delivery City / Pincode:* ${rfqCityPin} (${data.cityName})\n` +
      `*Commodity:* ${selectedCommodity.name}\n` +
      `*Grade:* ${selectedCommodity.grade}\n` +
      `*Order Quantity:* ${calcQuantityKg} kg (MOQ: ${selectedCommodity.moq})\n` +
      `*Target Rate:* ₹${selectedCommodity.nutytalesDirectPriceKg}/kg (Direct Origin)\n` +
      `*Packaging:* ${selectedCommodity.packaging}\n\n` +
      `Please issue an official Proforma Invoice with GST & freight details.`

    const url = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  const handleDownloadSheet = () => {
    const message = `Hello Nuty Tales! Please share today's official PDF Mandi Rate Sheet and price benchmark for *${data.mandiName} (${data.cityName})*. My business is based in ${data.cityName}.`
    const url = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  return (
    <div className="space-y-12">
      {/* ── Live City Comparison Table ── */}
      <section className="bg-white rounded-3xl border border-stone-200/80 shadow-sm overflow-hidden p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-serif text-stone-900 font-bold">
              {data.mandiName} Live Wholesale Benchmark
            </h2>
            <p className="text-sm text-stone-600 mt-1">
              Direct comparison: Local Mandi Wholesale Rates vs Nuty Tales Farm-Gate Direct Dispatch
            </p>
          </div>

          <button
            onClick={handleDownloadSheet}
            className="inline-flex items-center gap-2 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-900 text-xs font-bold rounded-xl transition-colors self-start sm:self-auto border border-stone-200"
          >
            <svg className="w-4 h-4 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download Daily Rate Sheet (PDF/WhatsApp)
          </button>
        </div>

        {/* Desktop & Mobile Responsive Table */}
        <div className="overflow-x-auto mt-6">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-stone-200 text-stone-600 text-[11px] uppercase tracking-wider bg-stone-50/70">
                <th className="py-3.5 px-4 font-bold rounded-l-xl">Commodity & Grade</th>
                <th className="py-3.5 px-4 font-bold">{data.cityName} Mandi</th>
                <th className="py-3.5 px-4 font-bold text-emerald-950">Nuty Tales Direct</th>
                <th className="py-3.5 px-4 font-bold text-emerald-700">Net Savings</th>
                <th className="py-3.5 px-4 font-bold">MOQ & Tax</th>
                <th className="py-3.5 px-4 font-bold text-right rounded-r-xl">Wholesale RFQ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {data.commodities.map((item, idx) => (
                <tr key={idx} className="hover:bg-emerald-50/30 transition-colors">
                  <td className="py-4 px-4">
                    <Link
                      href={`/shop/${item.slug}`}
                      className="font-bold text-stone-900 hover:text-emerald-800 transition-colors block text-sm"
                    >
                      {item.name}
                    </Link>
                    <span className="text-[11px] text-stone-600 block mt-0.5">{item.grade}</span>
                  </td>

                  <td className="py-4 px-4 font-mono font-medium text-stone-500 line-through">
                    ₹{item.localMandiPriceKg.toLocaleString('en-IN')}/kg
                  </td>

                  <td className="py-4 px-4 font-mono font-bold text-emerald-950 text-base">
                    ₹{item.nutytalesDirectPriceKg.toLocaleString('en-IN')}/kg
                  </td>

                  <td className="py-4 px-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900">
                      Save {item.savingsPercent}% (₹{(item.localMandiPriceKg - item.nutytalesDirectPriceKg).toLocaleString('en-IN')}/kg)
                    </span>
                  </td>

                  <td className="py-4 px-4 text-xs text-stone-600">
                    <div className="font-semibold text-stone-800">MOQ: {item.moq}</div>
                    <div className="text-[11px] text-stone-600">{item.taxGst} (Input Credit)</div>
                  </td>

                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={() => handleOpenRfq(item)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-900 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-xs transition-all whitespace-nowrap"
                    >
                      <span>1-Click RFQ</span>
                      <svg className="w-3.5 h-3.5 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Interactive Freight & Landed Savings Calculator ── */}
      <section className="bg-stone-900 text-white rounded-3xl p-6 sm:p-8 border border-stone-800 shadow-md">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-4">
            <div>
              <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold">
                Logistics & Commercial Estimator
              </span>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-white mt-1">
                Calculate Direct Origin Savings to {data.cityName}
              </h3>
            </div>
            <div className="text-xs text-stone-400 font-mono">
              Transit: {data.freightPerKgFromOrigin.transitDays}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Controls */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-2">
                  Select Commodity:
                </label>
                <select
                  value={selectedCalcItemIdx}
                  onChange={(e) => setSelectedCalcItemIdx(Number(e.target.value))}
                  className="w-full bg-stone-800 border border-stone-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500"
                >
                  {data.commodities.map((item, idx) => (
                    <option key={idx} value={idx}>
                      {item.name} — Direct: ₹{item.nutytalesDirectPriceKg}/kg (Mandi: ₹{item.localMandiPriceKg}/kg)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center text-xs font-semibold text-stone-300 uppercase tracking-wider mb-2">
                  <span>Order Quantity (kg):</span>
                  <span className="font-mono text-emerald-400 text-sm font-bold">{calcQuantityKg} kg</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="1000"
                  step="10"
                  value={calcQuantityKg}
                  onChange={(e) => setCalcQuantityKg(Number(e.target.value))}
                  className="w-full h-2 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-[11px] text-stone-400 mt-1 font-mono">
                  <span>10 kg (Sample)</span>
                  <span>100 kg</span>
                  <span>500 kg</span>
                  <span>1,000 kg (1 Ton)</span>
                </div>
              </div>

              <div className="p-4 bg-stone-800/80 rounded-xl border border-stone-700/60 text-xs text-stone-300 space-y-1">
                <div className="flex justify-between">
                  <span>Estimated Freight to {data.cityName}:</span>
                  <span className="font-mono text-white">~₹{data.freightPerKgFromOrigin.kashmirToCity}/kg</span>
                </div>
                <div className="flex justify-between">
                  <span>Local APMC Cess Saved:</span>
                  <span className="font-mono text-emerald-400">{data.apmcCessRate} (0% on Direct Dispatch)</span>
                </div>
              </div>
            </div>

            {/* Result Box */}
            <div className="bg-emerald-950/70 border border-emerald-800/60 rounded-2xl p-6 flex flex-col justify-between space-y-6">
              <div>
                <div className="text-xs uppercase tracking-widest text-emerald-300 font-semibold">
                  Estimated Total Landed Savings
                </div>
                <div className="text-3xl sm:text-4xl font-serif font-bold text-white mt-2">
                  ₹{netEstimatedSavings.toLocaleString('en-IN')}
                </div>
                <p className="text-xs text-emerald-200/80 mt-1">
                  Compared to local {data.cityName} Mandi broker rates for {calcQuantityKg} kg of {currentCalcCommodity.name}
                </p>
              </div>

              <div className="space-y-2 text-xs pt-4 border-t border-emerald-800/60">
                <div className="flex justify-between text-stone-300">
                  <span>Local Mandi Total:</span>
                  <span className="font-mono line-through text-stone-400">₹{localTotalCost.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-emerald-200 font-bold">
                  <span>Nuty Tales Landed Total:</span>
                  <span className="font-mono text-white text-sm">₹{nutytalesLandedTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                onClick={() => handleOpenRfq(currentCalcCommodity)}
                className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold rounded-xl text-xs uppercase tracking-wider transition-colors shadow-md"
              >
                Request Proforma Invoice for {calcQuantityKg} kg →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── 1-Click WhatsApp RFQ Modal ── */}
      {selectedCommodity && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 border border-stone-200 shadow-2xl relative">
            <button
              onClick={() => setSelectedCommodity(null)}
              className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 p-1"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded">
                Official Commercial RFQ
              </span>
              <h3 className="text-xl font-serif font-bold text-stone-900 mt-2">
                {selectedCommodity.name}
              </h3>
              <p className="text-xs text-stone-600 mt-1">
                Dispatch destination: {data.cityName} ({data.mandiName})
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Your Name / Contact Person:</label>
                <input
                  type="text"
                  placeholder="e.g. Rajesh Sharma"
                  value={rfqName}
                  onChange={(e) => setRfqName(e.target.value)}
                  className="w-full p-2.5 border border-stone-300 rounded-xl text-sm focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Firm / Business / Sweet Shop Name:</label>
                <input
                  type="text"
                  placeholder="e.g. Royal Sweets & Dry Fruits"
                  value={rfqBusiness}
                  onChange={(e) => setRfqBusiness(e.target.value)}
                  className="w-full p-2.5 border border-stone-300 rounded-xl text-sm focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Quantity (kg):</label>
                  <input
                    type="number"
                    min="10"
                    value={calcQuantityKg}
                    onChange={(e) => setCalcQuantityKg(Number(e.target.value))}
                    className="w-full p-2.5 border border-stone-300 rounded-xl text-sm font-mono focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Delivery Pincode:</label>
                  <input
                    type="text"
                    value={rfqCityPin}
                    onChange={(e) => setRfqCityPin(e.target.value)}
                    className="w-full p-2.5 border border-stone-300 rounded-xl text-sm font-mono focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-1">
              <div className="flex justify-between font-semibold text-stone-800">
                <span>Wholesale Target Rate:</span>
                <span className="font-mono text-emerald-800 font-bold">
                  ₹{selectedCommodity.nutytalesDirectPriceKg}/kg + GST
                </span>
              </div>
              <div className="text-[11px] text-stone-500">
                Includes e-Way Bill, NABL batch certificate & direct transporter delivery.
              </div>
            </div>

            <button
              onClick={handleSendWhatsAppRfq}
              className="w-full py-3.5 px-6 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.173.086.275.072.376-.044.101-.116.433-.506.549-.68.116-.173.231-.145.39-.086s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824z" />
              </svg>
              <span>Submit & Open Instant WhatsApp RFQ</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
