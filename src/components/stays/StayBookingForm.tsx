'use client'

import { useState } from 'react'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE } from '@/lib/constants'

interface StayBookingFormProps {
  defaultProperty?: string
}

export default function StayBookingForm({
  defaultProperty = 'Kashmir Valley Orchard Stay',
}: StayBookingFormProps) {
  const [formData, setFormData] = useState({
    property: defaultProperty,
    checkIn: '',
    checkOut: '',
    guests: '2 Adults',
    rooms: '1 Room',
    guestName: '',
    mobile: '',
    email: '',
    experiences: [] as string[],
    notes: '',
  })

  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleExperienceToggle = (exp: string) => {
    setFormData((prev) => ({
      ...prev,
      experiences: prev.experiences.includes(exp)
        ? prev.experiences.filter((item) => item !== exp)
        : [...prev.experiences, exp],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.guestName,
          phone: formData.mobile,
          email: formData.email,
          city: 'Travel Enquirer',
          businessName: `[STAYS RESERVATION] ${formData.property}`,
          message: `Dates: ${formData.checkIn} to ${formData.checkOut} | Guests: ${formData.guests} (${formData.rooms}) | Add-ons: ${formData.experiences.join(', ') || 'None'} | Notes: ${formData.notes}`,
          source: 'stays-portal',
        }),
      })
      setSubmitted(true)
    } catch {
      setSubmitted(true)
    } finally {
      setLoading(false)
    }
  }

  const whatsappPhone = (WHATSAPP_NUMBERS.STAYS || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')
  const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
    `Hello Nuty Tales Stays! 🏔️\n\nI want to book / enquire about *${formData.property}*:\n• Dates: ${formData.checkIn || 'TBD'} to ${formData.checkOut || 'TBD'}\n• Guests: ${formData.guests}\n• Name: ${formData.guestName || 'Guest'}\n\nPlease share availability and tariff!`,
  )}`

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-stone-200 p-6 md:p-8">
      {submitted ? (
        <div className="text-center py-8 space-y-4">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
            ✓
          </div>
          <h3 className="text-xl font-bold text-[#3D2B1F]">
            Reservation Enquiry Received!
          </h3>
          <p className="text-sm text-stone-600 max-w-md mx-auto">
            Our Hospitality Concierge will confirm room availability and tariff within 2 hours.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm transition-all shadow-md inline-flex items-center justify-center gap-2"
            >
              <span>Instant Chat with Concierge (+91 9717161809)</span>
            </a>
            <button
              onClick={() => setSubmitted(false)}
              className="px-6 py-3 border border-stone-300 text-stone-700 rounded-xl text-sm font-semibold hover:bg-stone-50"
            >
              Enquire Another Date
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="border-b border-stone-100 pb-3">
            <h3 className="text-xl font-bold text-[#3D2B1F]">
              Book Your Stay & Experience
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Taste. Stay. Explore. Our concierge handles your room, transfers & excursions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Select Property *
              </label>
              <select
                name="property"
                value={formData.property}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#D4870A] text-sm bg-white font-medium"
              >
                <option value="Kashmir Valley Orchard Stay (Srinagar)">
                  🏔️ Kashmir Valley Orchard Stay (Srinagar, J&K)
                </option>
                <option value="Noida Executive Retreat (Delhi NCR)">
                  🏢 Noida Executive Retreat (Delhi NCR / Sector 62)
                </option>
                <option value="Patna Heritage Comfort Stay (Bihar)">
                  🌾 Patna Heritage Comfort Stay (Patna, Bihar)
                </option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Check-In Date *
              </label>
              <input
                type="date"
                name="checkIn"
                required
                value={formData.checkIn}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#D4870A] text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Check-Out Date *
              </label>
              <input
                type="date"
                name="checkOut"
                required
                value={formData.checkOut}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#D4870A] text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Guests
              </label>
              <select
                name="guests"
                value={formData.guests}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#D4870A] text-sm bg-white"
              >
                <option value="1 Adult">1 Adult</option>
                <option value="2 Adults">2 Adults</option>
                <option value="2 Adults + 1 Child">2 Adults + 1 Child</option>
                <option value="3-4 Adults (Family)">3–4 Adults (Family Suite)</option>
                <option value="5+ Group / Corporate">5+ Group / Corporate Retreat</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Rooms Required
              </label>
              <select
                name="rooms"
                value={formData.rooms}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#D4870A] text-sm bg-white"
              >
                <option value="1 Room">1 Room</option>
                <option value="2 Rooms">2 Rooms</option>
                <option value="3+ Rooms">3+ Rooms</option>
                <option value="Entire Villa / Floor">Entire Villa / Floor Buyout</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Your Full Name *
              </label>
              <input
                type="text"
                name="guestName"
                required
                placeholder="e.g. Sameer Shah"
                value={formData.guestName}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#D4870A] text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Mobile Number *
              </label>
              <input
                type="tel"
                name="mobile"
                required
                placeholder="+91 98765 43210"
                value={formData.mobile}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#D4870A] text-sm"
              />
            </div>
          </div>

          {/* Add-on Experiences */}
          <div className="pt-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
              Add-On Curated Experiences (Optional)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {[
                'Airport Pickup & Drop',
                'Gulmarg Day Tour',
                'Pahalgam Valley Tour',
                'Shikara Ride & Dal Lake',
                'Saffron & Walnut Orchard Visit',
                'Traditional Kashmiri Wazwan Dinner',
              ].map((exp) => (
                <label
                  key={exp}
                  className={`p-2.5 rounded-xl border cursor-pointer flex items-center gap-2 transition-colors ${
                    formData.experiences.includes(exp)
                      ? 'bg-amber-50 border-amber-300 text-[#3D2B1F]'
                      : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.experiences.includes(exp)}
                    onChange={() => handleExperienceToggle(exp)}
                    className="rounded text-[#D4870A] focus:ring-[#D4870A]"
                  />
                  <span>{exp}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
              Special Requests / Dietary Preferences
            </label>
            <textarea
              name="notes"
              rows={2}
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="e.g. Mountain view room, vegetarian meals, early check-in request..."
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#D4870A] text-sm"
            />
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3 items-center">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-[#2D6A4F] to-[#1E4D38] hover:from-[#1E4D38] hover:to-[#143526] text-white font-bold rounded-xl shadow-md transition-all text-sm uppercase tracking-wider disabled:opacity-50"
            >
              {loading ? 'Checking Availability...' : 'Enquire & Reserve Now →'}
            </button>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-5 py-3.5 border border-emerald-600 text-emerald-700 hover:bg-emerald-50 rounded-xl text-sm font-semibold transition-all inline-flex items-center justify-center gap-2"
            >
              <span>💬 WhatsApp Concierge (+91 9717161809)</span>
            </a>
          </div>
        </form>
      )}
    </div>
  )
}
