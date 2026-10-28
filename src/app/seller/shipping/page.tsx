'use client'

import React, { useState } from 'react'
import { useSeller } from '../SellerContext'

export default function SellerShippingPage() {
  const { seller } = useSeller()
  const [postalLookup, setPostalLookup] = useState('')
  const [lookupResult, setLookupResult] = useState<string | null>(null)
  const [savedAddress, setSavedAddress] = useState({
    pickupAddress: seller?.pickupAddress || '',
    city: seller?.city || '',
    state: seller?.state || '',
    pincode: seller?.pincode || '',
    country: seller?.country || 'United States',
  })
  const [saving, setSaving] = useState(false)
  const [savedMessage, setSavedMessage] = useState(false)

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      setSavedMessage(true)
      setTimeout(() => setSavedMessage(false), 3000)
    }, 800)
  }

  const checkPostalServiceability = () => {
    if (!postalLookup.trim()) {
      setLookupResult('Please enter a valid postal code or destination ZIP code.')
      return
    }

    const code = postalLookup.toUpperCase().trim()
    if (code.length === 5 && !isNaN(Number(code))) {
      setLookupResult(`US Postal Code ${code} is fully serviceable via FedEx Ground (1-3 days) and UPS 2nd Day Air. International customs clearance pre-cleared.`)
    } else if (code.includes(' ') || code.length >= 6) {
      setLookupResult(`Destination ${code} is fully serviceable via DHL Express Worldwide and Royal Mail / Deutsche Post Tracked. Est. Transit: 2-4 Business Days.`)
    } else {
      setLookupResult(`Destination ${code} is serviceable via global air freight network. Est. Transit: 3-5 Business Days.`)
    }
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200 shadow-xs">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-[#C5A869] font-bold">
            Global Fulfilment & Carrier Infrastructure
          </span>
          <h1 className="text-2xl font-serif font-bold text-[#163326] mt-0.5">
            Shipping & Fulfilment Hub
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Configure primary dispatch warehouse depots, calculate cross-border destination SLAs, and verify carrier connections.
          </p>
        </div>
      </div>

      {savedMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-medium">
          ✓ Warehouse dispatch address updated successfully.
        </div>
      )}

      {/* Grid: Warehouse Address Form + Serviceability Tool */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pickup Warehouse Configuration */}
        <form onSubmit={handleSaveAddress} className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-2">
            <h3 className="font-serif font-bold text-stone-900 text-base">Warehouse Dispatch Address</h3>
            <span className="text-xs bg-[#FAF6EF] text-[#163326] px-2.5 py-0.5 rounded-full font-semibold border border-[#C5A869]/30">
              Primary Hub
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              Pickup Street Address *
            </label>
            <textarea
              rows={2}
              value={savedAddress.pickupAddress}
              onChange={(e) => setSavedAddress({ ...savedAddress, pickupAddress: e.target.value })}
              required
              className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#163326]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">City *</label>
              <input
                type="text"
                value={savedAddress.city}
                onChange={(e) => setSavedAddress({ ...savedAddress, city: e.target.value })}
                required
                className="w-full p-2.5 rounded-xl border border-stone-300"
              />
            </div>
            <div>
              <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">State / Province *</label>
              <input
                type="text"
                value={savedAddress.state}
                onChange={(e) => setSavedAddress({ ...savedAddress, state: e.target.value })}
                required
                className="w-full p-2.5 rounded-xl border border-stone-300"
              />
            </div>
            <div>
              <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">Postal Code / ZIP *</label>
              <input
                type="text"
                value={savedAddress.pincode}
                onChange={(e) => setSavedAddress({ ...savedAddress, pincode: e.target.value })}
                required
                className="w-full p-2.5 rounded-xl border border-stone-300 font-mono"
              />
            </div>
            <div>
              <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">Country *</label>
              <input
                type="text"
                value={savedAddress.country}
                onChange={(e) => setSavedAddress({ ...savedAddress, country: e.target.value })}
                required
                className="w-full p-2.5 rounded-xl border border-stone-300"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="w-full py-2.5 bg-[#163326] hover:bg-[#11291E] text-white text-xs font-bold rounded-xl shadow-xs transition"
            >
              {saving ? 'Saving...' : 'Update Warehouse Location'}
            </button>
          </div>
        </form>

        {/* Global Postal Serviceability & Carrier Layer */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-stone-900 text-base">Check Global Destination Serviceability</h3>
            <p className="text-xs text-stone-500">
              Verify courier reach, air freight transit SLAs, and automated customs pre-clearance to any global destination.
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter postal code or ZIP (e.g. 98101, EC1A 1BB, 110001)..."
                value={postalLookup}
                onChange={(e) => setPostalLookup(e.target.value)}
                className="flex-1 text-xs p-2.5 border border-stone-300 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-[#163326]"
              />
              <button
                type="button"
                onClick={checkPostalServiceability}
                className="px-4 py-2 bg-[#163326] hover:bg-[#11291E] text-white text-xs font-semibold rounded-xl"
              >
                Verify
              </button>
            </div>

            {lookupResult && (
              <div className="p-3.5 bg-[#FAF6EF] border border-[#C5A869]/30 rounded-2xl text-xs text-stone-800 leading-relaxed">
                {lookupResult}
              </div>
            )}
          </div>

          {/* Integrated Carriers Status */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-3">
            <h3 className="font-serif font-bold text-stone-900 text-base">Integrated Global Logistics Fleets</h3>
            <div className="space-y-2.5 text-xs">
              <div className="p-3 border border-stone-200 rounded-2xl flex items-center justify-between">
                <div>
                  <div className="font-bold text-stone-900">DHL Express Worldwide</div>
                  <div className="text-[10px] text-stone-500">Global air freight departures with door-to-door customs pre-clearance</div>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Active Carrier
                </span>
              </div>

              <div className="p-3 border border-stone-200 rounded-2xl flex items-center justify-between">
                <div>
                  <div className="font-bold text-stone-900">FedEx Express & Ground</div>
                  <div className="text-[10px] text-stone-500">North America & European trans-Atlantic priority network</div>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Active Carrier
                </span>
              </div>

              <div className="p-3 border border-stone-200 rounded-2xl flex items-center justify-between">
                <div>
                  <div className="font-bold text-stone-900">Aramex Middle East Express</div>
                  <div className="text-[10px] text-stone-500">Dedicated GCC regional distribution with COD & refrigerated options</div>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Active Carrier
                </span>
              </div>

              <div className="p-3 border border-stone-200 rounded-2xl flex items-center justify-between">
                <div>
                  <div className="font-bold text-stone-900">BlueDart Express & Delhivery</div>
                  <div className="text-[10px] text-stone-500">South Asian domestic express cargo & pan-India courier reach</div>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Active Carrier
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
