'use client'

import React, { useState, useMemo } from 'react'

export default function PriceScenarioCalculator() {
  // Default values from strategic proposal
  const DEFAULT_VALUES = {
    enquiries: 100,
    conversionPct: 10,
    aov: 50000,
    marginPct: 8,
    ordersPerBuyer: 1.5,
  }

  const [enquiries, setEnquiries] = useState<number>(DEFAULT_VALUES.enquiries)
  const [conversionPct, setConversionPct] = useState<number>(DEFAULT_VALUES.conversionPct)
  const [aov, setAov] = useState<number>(DEFAULT_VALUES.aov)
  const [marginPct, setMarginPct] = useState<number>(DEFAULT_VALUES.marginPct)
  const [ordersPerBuyer, setOrdersPerBuyer] = useState<number>(DEFAULT_VALUES.ordersPerBuyer)

  const handleReset = () => {
    setEnquiries(DEFAULT_VALUES.enquiries)
    setConversionPct(DEFAULT_VALUES.conversionPct)
    setAov(DEFAULT_VALUES.aov)
    setMarginPct(DEFAULT_VALUES.marginPct)
    setOrdersPerBuyer(DEFAULT_VALUES.ordersPerBuyer)
  }

  // Model Calculations
  const calculated = useMemo(() => {
    const convertedBuyers = enquiries * (conversionPct / 100)
    const monthlyOrders = Math.round(convertedBuyers * ordersPerBuyer)
    const gmv = monthlyOrders * aov
    const grossContribution = Math.round(gmv * (marginPct / 100))

    const formatCurrency = (amount: number) => {
      if (amount >= 10000000) {
        return `₹${(amount / 10000000).toFixed(2)} Cr`
      }
      if (amount >= 100000) {
        return `₹${(amount / 100000).toFixed(1)} L`
      }
      return `₹${amount.toLocaleString('en-IN')}`
    }

    return {
      monthlyOrders,
      gmv,
      grossContribution,
      formattedGmv: formatCurrency(gmv),
      formattedContribution: formatCurrency(grossContribution),
    }
  }, [enquiries, conversionPct, aov, marginPct, ordersPerBuyer])

  return (
    <div className="bg-[#10192A] text-white rounded-3xl p-6 sm:p-10 border border-[#C9A45C]/30 shadow-2xl space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#C9A45C] text-[10px] font-bold uppercase tracking-widest">
            <span>📊</span> PROCUREMENT UNIT ECONOMICS &amp; GOAL TRACKER
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight text-white">
            Wholesale Business Scenario Calculator
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 font-light max-w-2xl leading-relaxed">
            Adjust the assumptions below to see how commercial order conversion and repeat procurement frequency compound into monthly platform volume and gross margin contribution.
          </p>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="self-start md:self-auto px-4 py-2 bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white rounded-xl text-xs font-semibold transition-colors border border-white/10 flex items-center gap-1.5"
        >
          <span>↺</span>
          <span>Reset assumptions</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Interactive Sliders (7 cols) */}
        <div className="lg:col-span-7 space-y-6 text-xs">
          {/* Slider 1: Qualified buyer enquiries per month */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="font-bold text-stone-200">
                1. Qualified buyer enquiries per month:
              </label>
              <span className="font-mono text-sm font-bold text-[#C9A45C] bg-white/10 px-2.5 py-0.5 rounded">
                {enquiries.toLocaleString('en-IN')}
              </span>
            </div>
            <input
              type="range"
              min={10}
              max={1000}
              step={10}
              value={enquiries}
              onChange={(e) => setEnquiries(Number(e.target.value))}
              className="w-full accent-[#C9A45C] h-2 bg-stone-700 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-400">
              <span>10</span>
              <span>500</span>
              <span>1,000</span>
            </div>
          </div>

          {/* Slider 2: Enquiry-to-first-order conversion */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="font-bold text-stone-200">
                2. Enquiry-to-first-order conversion:
              </label>
              <span className="font-mono text-sm font-bold text-emerald-400 bg-white/10 px-2.5 py-0.5 rounded">
                {conversionPct}%
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={30}
              step={1}
              value={conversionPct}
              onChange={(e) => setConversionPct(Number(e.target.value))}
              className="w-full accent-emerald-500 h-2 bg-stone-700 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-400">
              <span>1%</span>
              <span>15%</span>
              <span>30%</span>
            </div>
          </div>

          {/* Slider 3: Average order value (AOV) */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="font-bold text-stone-200">
                3. Average Order Value (AOV):
              </label>
              <span className="font-mono text-sm font-bold text-white bg-white/10 px-2.5 py-0.5 rounded">
                ₹{aov.toLocaleString('en-IN')}
              </span>
            </div>
            <input
              type="range"
              min={5000}
              max={200000}
              step={5000}
              value={aov}
              onChange={(e) => setAov(Number(e.target.value))}
              className="w-full accent-[#C9A45C] h-2 bg-stone-700 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-400">
              <span>₹5,000 (Sample lot)</span>
              <span>₹1,00,000</span>
              <span>₹2,00,000 (Truckload run)</span>
            </div>
          </div>

          {/* Slider 4: Gross contribution margin */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="font-bold text-stone-200">
                4. Gross contribution margin:
              </label>
              <span className="font-mono text-sm font-bold text-emerald-400 bg-white/10 px-2.5 py-0.5 rounded">
                {marginPct}%
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={20}
              step={1}
              value={marginPct}
              onChange={(e) => setMarginPct(Number(e.target.value))}
              className="w-full accent-emerald-500 h-2 bg-stone-700 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-400">
              <span>1%</span>
              <span>10%</span>
              <span>20%</span>
            </div>
          </div>

          {/* Slider 5: Orders per converted buyer per month */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="font-bold text-stone-200">
                5. Orders per converted buyer per month (Repeat Velocity):
              </label>
              <span className="font-mono text-sm font-bold text-[#C9A45C] bg-white/10 px-2.5 py-0.5 rounded">
                {ordersPerBuyer}x
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={4}
              step={0.5}
              value={ordersPerBuyer}
              onChange={(e) => setOrdersPerBuyer(Number(e.target.value))}
              className="w-full accent-[#C9A45C] h-2 bg-stone-700 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-400">
              <span>1.0 (One-off)</span>
              <span>2.5 (Bi-weekly)</span>
              <span>4.0 (Weekly scheduled run)</span>
            </div>
          </div>
        </div>

        {/* Right: Real-Time Results Output Box (5 cols) */}
        <div className="lg:col-span-5 bg-[#17233B] rounded-2xl p-6 sm:p-7 border border-[#C9A45C]/40 space-y-6 shadow-xl">
          <div className="text-[10px] uppercase font-bold tracking-widest text-[#C9A45C] border-b border-white/10 pb-3 flex items-center justify-between">
            <span>Projected Monthly Outcome</span>
            <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded text-[10px]">
              Live Simulation
            </span>
          </div>

          <div className="space-y-4">
            {/* Metric 1 */}
            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <span className="text-[11px] text-stone-300 block mb-1">
                Estimated Monthly Orders
              </span>
              <div className="font-serif text-3xl font-bold text-white">
                {calculated.monthlyOrders}{' '}
                <span className="text-xs font-normal text-stone-400">fulfilled orders</span>
              </div>
            </div>

            {/* Metric 2 */}
            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <span className="text-[11px] text-stone-300 block mb-1">
                Monthly Gross Merchandise Value (GMV)
              </span>
              <div className="font-serif text-3xl font-bold text-[#C9A45C]">
                {calculated.formattedGmv}
              </div>
              <span className="text-[10px] text-stone-400 mt-1 block">
                Total commercial transaction volume
              </span>
            </div>

            {/* Metric 3 */}
            <div className="p-4 bg-emerald-950/40 rounded-xl border border-emerald-500/30">
              <span className="text-[11px] text-emerald-300 block mb-1 font-semibold">
                Estimated Gross Contribution per Month
              </span>
              <div className="font-serif text-3xl font-bold text-emerald-400">
                {calculated.formattedContribution}
              </div>
              <span className="text-[10px] text-emerald-200/70 mt-1 block">
                Available contribution margin before overhead &amp; tax
              </span>
            </div>
          </div>

          <p className="text-[10px] text-stone-400 leading-relaxed border-t border-white/10 pt-4 italic">
            * Illustrative model based on entered unit economics. Excludes corporate overhead, warehousing debt, and finance charges. Assumes margin is net contribution on landed order volume.
          </p>
        </div>
      </div>

      {/* Weekly Operational North Star Metrics */}
      <div className="border-t border-white/10 pt-6 space-y-4">
        <span className="text-xs uppercase font-bold tracking-widest text-[#C9A45C] block">
          8 Weekly Operational North Star Metrics (How Nuty Tales Wins)
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-white/5 rounded-xl border border-white/10">
            <span className="text-stone-400 block text-[10px]">Metric 1</span>
            <strong className="text-white block mt-0.5">Qualified Enquiries</strong>
            <span className="text-[10px] text-emerald-400">Active commercial buyer leads</span>
          </div>
          <div className="p-3 bg-white/5 rounded-xl border border-white/10">
            <span className="text-stone-400 block text-[10px]">Metric 2</span>
            <strong className="text-white block mt-0.5">Time to First Quote</strong>
            <span className="text-[10px] text-[#C9A45C]">&lt; 4 Hours Target SLA</span>
          </div>
          <div className="p-3 bg-white/5 rounded-xl border border-white/10">
            <span className="text-stone-400 block text-[10px]">Metric 3</span>
            <strong className="text-white block mt-0.5">Enquiry-to-Order %</strong>
            <span className="text-[10px] text-stone-300">Quote conversion velocity</span>
          </div>
          <div className="p-3 bg-white/5 rounded-xl border border-white/10">
            <span className="text-stone-400 block text-[10px]">Metric 4</span>
            <strong className="text-white block mt-0.5">Gross Contribution</strong>
            <span className="text-[10px] text-emerald-400">Profitability per lot</span>
          </div>
          <div className="p-3 bg-white/5 rounded-xl border border-white/10">
            <span className="text-stone-400 block text-[10px]">Metric 5</span>
            <strong className="text-white block mt-0.5">OTIF Delivery Rate</strong>
            <span className="text-[10px] text-emerald-400">&gt; 98.5% Target</span>
          </div>
          <div className="p-3 bg-white/5 rounded-xl border border-white/10">
            <span className="text-stone-400 block text-[10px]">Metric 6</span>
            <strong className="text-white block mt-0.5">30/60/90-Day Repeat</strong>
            <span className="text-[10px] text-[#C9A45C]">Buyer retention index</span>
          </div>
          <div className="p-3 bg-white/5 rounded-xl border border-white/10">
            <span className="text-stone-400 block text-[10px]">Metric 7</span>
            <strong className="text-white block mt-0.5">Claim / Refund %</strong>
            <span className="text-[10px] text-stone-300">&lt; 0.5% Quality rejection</span>
          </div>
          <div className="p-3 bg-white/5 rounded-xl border border-white/10">
            <span className="text-stone-400 block text-[10px]">Metric 8</span>
            <strong className="text-white block mt-0.5">CAC Payback Period</strong>
            <span className="text-[10px] text-emerald-400">&lt; 2 repeat orders</span>
          </div>
        </div>
      </div>
    </div>
  )
}
