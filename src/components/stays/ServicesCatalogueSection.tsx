'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { BOOKABLE_TRAVEL_SERVICES, TravelServiceItem } from '@/lib/stays-data'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE } from '@/lib/constants'

export default function ServicesCatalogueSection() {
  const [selectedServiceForModal, setSelectedServiceForModal] = useState<TravelServiceItem | null>(null)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [guestCount, setGuestCount] = useState(2)
  const [guestPhone, setGuestPhone] = useState('')
  const [bookedSuccess, setBookedSuccess] = useState(false)

  const whatsappPhone = (WHATSAPP_NUMBERS.STAYS || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')

  const handleBookService = (e: React.FormEvent) => {
    e.preventDefault()
    if (!guestPhone) return
    setBookedSuccess(true)
    setTimeout(() => {
      setBookedSuccess(false)
      setSelectedServiceForModal(null)
    }, 3000)
  }

  return (
    <section id="services-catalogue" className="py-12 space-y-8 scroll-mt-24">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E7E2D9] pb-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold uppercase tracking-wider border border-emerald-200">
            <span>✨</span> IN-STAY CONCIERGE &amp; LOCAL SERVICES
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#17233B]">
            Book Everything Around the Stay
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 max-w-2xl leading-relaxed">
            From heated 4x4 snow convoys and hereditary Master Wazwan chefs to private walnut harvest walks and equipment fitting delivered to your doorstep.
          </p>
        </div>

        <a
          href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
            'Hello Nuty Tales Hospitality! I would like to book a local travel service (Wazwan chef, 4x4 airport convoy, or harvest tour).',
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2.5 rounded-xl border border-stone-300 text-stone-800 hover:border-black font-semibold text-xs transition-colors inline-flex items-center gap-1.5 flex-shrink-0"
        >
          <span>💬 Custom Concierge Request</span>
        </a>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {BOOKABLE_TRAVEL_SERVICES.map((srv) => (
          <div
            key={srv.id}
            className="bg-white rounded-3xl border border-[#E7E2D9] overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
          >
            <div>
              <div className="relative aspect-16/10 w-full overflow-hidden bg-stone-100">
                <Image
                  src={srv.image}
                  alt={srv.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md bg-[#17233B]/90 text-white text-[10px] font-bold tracking-wide backdrop-blur-xs">
                  {srv.categoryLabel}
                </span>
                <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-white/90 text-stone-800 text-[10px] font-semibold backdrop-blur-xs">
                  {srv.duration}
                </span>
              </div>

              <div className="p-5 space-y-3">
                <h3 className="font-serif font-bold text-base text-[#17233B] leading-snug">
                  {srv.title}
                </h3>
                <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                  {srv.description}
                </p>

                <div className="pt-2 border-t border-stone-100 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">Includes:</span>
                  <ul className="text-[11px] text-stone-700 space-y-1">
                    {srv.includedFeatures.slice(0, 2).map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-center gap-1.5">
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span className="truncate">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="p-5 pt-0 border-t border-stone-100 mt-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-stone-400 uppercase font-semibold block">Tariff</span>
                <div className="font-mono text-sm font-bold text-[#176B68]">
                  ₹{srv.price.toLocaleString('en-IN')}{' '}
                  <span className="text-[10px] font-normal text-stone-500">{srv.unit}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedServiceForModal(srv)}
                className="py-2 px-3.5 bg-[#17233B] hover:bg-[#176B68] text-white font-bold text-xs rounded-xl transition-colors shadow-2xs"
              >
                Book Service
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {selectedServiceForModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#FAF8F5] w-full max-w-lg rounded-3xl p-6 border border-[#E7E2D9] shadow-2xl space-y-5 animate-scaleUp">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#704B32] block">
                  Reserve Travel Service
                </span>
                <h3 className="font-serif text-lg font-bold text-[#17233B]">
                  {selectedServiceForModal.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedServiceForModal(null)}
                className="p-1 text-stone-400 hover:text-black text-lg"
              >
                ✕
              </button>
            </div>

            {bookedSuccess ? (
              <div className="p-6 bg-emerald-50 border border-emerald-300 rounded-2xl text-center space-y-2">
                <span className="text-3xl">✓</span>
                <h4 className="font-serif font-bold text-base text-emerald-900">
                  Service Request Dispatched!
                </h4>
                <p className="text-xs text-stone-700">
                  Our regional concierge has locked {selectedServiceForModal.title}. We will WhatsApp you the provider voucher within 15 minutes.
                </p>
              </div>
            ) : (
              <form onSubmit={handleBookService} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Date Required *</label>
                    <input
                      type="date"
                      required
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full p-2.5 bg-white border border-stone-200 rounded-xl font-semibold text-stone-800"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Party Count</label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={guestCount}
                      onChange={(e) => setGuestCount(Number(e.target.value))}
                      className="w-full p-2.5 bg-white border border-stone-200 rounded-xl font-semibold text-stone-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">WhatsApp / Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full p-2.5 bg-white border border-stone-200 rounded-xl text-stone-800"
                  />
                </div>

                <div className="p-3 bg-stone-100 rounded-xl flex justify-between items-center text-xs">
                  <span className="text-stone-600">Estimated Total:</span>
                  <span className="font-mono text-base font-bold text-[#17233B]">
                    ₹{(selectedServiceForModal.price * (selectedServiceForModal.unit.includes('person') ? guestCount : 1)).toLocaleString('en-IN')}
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#17233B] hover:bg-[#176B68] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md"
                >
                  Confirm Service Reservation
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
