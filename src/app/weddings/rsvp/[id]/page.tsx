'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { getActiveProject, getAllProjects, addGuest } from '@/lib/weddings/storage'
import { WeddingProject } from '@/lib/weddings/types'

export default function GuestRsvpPage() {
  const params = useParams()
  const projectId = typeof params.id === 'string' ? params.id : ''

  const [project, setProject] = useState<WeddingProject | null>(null)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [household, setHousehold] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [attendingStatus, setAttendingStatus] = useState<'attending' | 'declined'>('attending')
  const [guestCount, setGuestCount] = useState(1)
  const [selectedEvents, setSelectedEvents] = useState<string[]>([
    'Mehendi & Welcome Dinner',
    'Sangeet Night',
    'Wedding Ceremony (Pheras)',
    'Royal Reception Banquet',
  ])
  const [mealPreference, setMealPreference] = useState('Royal Wazwan & Multi-Cuisine')
  const [dietaryNotes, setDietaryNotes] = useState('')
  const [needAccommodation, setNeedAccommodation] = useState(false)
  const [needChauffeur, setNeedChauffeur] = useState(false)
  const [blessingMessage, setBlessingMessage] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  useEffect(() => {
    // Look up project from storage
    const all = getAllProjects()
    const found = all.find((p) => p.id === projectId)
    if (found) {
      setProject(found)
    } else {
      // Fallback to active project
      setProject(getActiveProject())
    }
  }, [projectId])

  const toggleEvent = (evt: string) => {
    if (selectedEvents.includes(evt)) {
      setSelectedEvents(selectedEvents.filter((e) => e !== evt))
    } else {
      setSelectedEvents([...selectedEvents, evt])
    }
  }

  const handleSubmitRsvp = (e: React.FormEvent) => {
    e.preventDefault()
    if (!firstName) return

    const effectiveProjectId = project ? project.id : projectId || 'WED-2026-JAIPUR-001'

    addGuest(effectiveProjectId, {
      firstName,
      lastName,
      household: household || `${firstName} Household`,
      email,
      phone,
      rsvpStatus: attendingStatus,
      attendingCount: attendingStatus === 'attending' ? guestCount : 0,
      eventsAttending: attendingStatus === 'attending' ? selectedEvents : [],
      mealPreference,
      dietaryRestrictions: dietaryNotes || undefined,
      accommodationNeeded: needAccommodation,
      transportNeeded: needChauffeur,
      notes: blessingMessage || undefined,
    })

    setIsSubmitted(true)
  }

  const coupleDisplay = project ? project.coupleName : 'Ananya & Vikramaditya'
  const dateDisplay = project ? project.weddingDate : 'November 20, 2026'
  const destDisplay = project ? project.destination : 'Jaipur, Rajasthan'

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#17233B] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* ── Monogram Crest & Invitation Header ───────────────────────── */}
        <div className="text-center space-y-4 pt-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-[#701A31] to-[#8E2848] text-[#FAF7F2] text-2xl font-serif shadow-lg border-2 border-[#C9A45C]">
            <span>💍</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#8E2848] block mb-1">
              Official Wedding Guest RSVP
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#2D1520] tracking-tight">
              {coupleDisplay}
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 mt-2 font-light">
              Together with their families, request the honour of your presence.
            </p>
          </div>

          <div className="inline-flex items-center gap-4 px-5 py-2.5 rounded-full bg-white border border-stone-200 shadow-xs text-xs font-semibold text-stone-700">
            <span>📅 {dateDisplay}</span>
            <span className="text-stone-300">•</span>
            <span>📍 {destDisplay}</span>
          </div>
        </div>

        {/* ── Confirmation State ────────────────────────────────────────── */}
        {isSubmitted ? (
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-stone-200 shadow-xl text-center space-y-6 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 text-3xl flex items-center justify-center mx-auto shadow-inner">
              ✓
            </div>
            <div className="space-y-2">
              <h2 className="font-serif text-2xl font-bold text-[#17233B]">
                {attendingStatus === 'attending' ? 'RSVP Confirmed with Joy!' : 'Response Received with Gratitude'}
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed max-w-md mx-auto">
                {attendingStatus === 'attending'
                  ? `Thank you, ${firstName}! Your attendance has been synchronized directly with the couple's wedding planning registry.`
                  : `Thank you for letting us know, ${firstName}. Your warm wishes will be conveyed directly to the couple.`}
              </p>
            </div>

            {attendingStatus === 'attending' && (
              <div className="p-4 rounded-2xl bg-[#FAF6EE] border border-[#C9A45C]/40 text-left text-xs space-y-2 text-stone-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E2848] block">
                  Registered Details:
                </span>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <p>Guests: <strong>{guestCount} Guest{guestCount > 1 ? 's' : ''}</strong></p>
                  <p>Meal: <strong>{mealPreference}</strong></p>
                  <p>Stay: <strong>{needAccommodation ? 'Hotel Block Requested' : 'Self-Arranged'}</strong></p>
                  <p>Pickup: <strong>{needChauffeur ? 'Airport Chauffeur Requested' : 'Self-Arranged'}</strong></p>
                </div>
              </div>
            )}

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 text-xs">
              <Link
                href="/"
                className="w-full sm:w-auto px-6 py-3 bg-[#17233B] hover:bg-[#8E2848] text-white font-bold uppercase tracking-wider rounded-xl transition-colors"
              >
                Explore Nuty Tales Weddings
              </Link>
            </div>
          </div>
        ) : (
          /* ── Interactive RSVP Form ──────────────────────────────────── */
          <form
            onSubmit={handleSubmitRsvp}
            className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-xl space-y-6"
          >
            {/* Attendance Choice */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
                Will you be attending? *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAttendingStatus('attending')}
                  className={`p-4 rounded-2xl border text-center transition-all ${
                    attendingStatus === 'attending'
                      ? 'border-[#8E2848] bg-[#8E2848]/5 text-[#8E2848] font-bold shadow-xs ring-2 ring-[#8E2848]/20'
                      : 'border-stone-200 hover:bg-stone-50 text-stone-600'
                  }`}
                >
                  <span className="text-lg block mb-1">🎉</span>
                  <span className="text-xs font-bold block">Joyfully Accept</span>
                  <span className="text-[10px] text-stone-400 font-light block">Can&apos;t wait to celebrate</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAttendingStatus('declined')}
                  className={`p-4 rounded-2xl border text-center transition-all ${
                    attendingStatus === 'declined'
                      ? 'border-stone-700 bg-stone-100 text-stone-900 font-bold shadow-xs'
                      : 'border-stone-200 hover:bg-stone-50 text-stone-600'
                  }`}
                >
                  <span className="text-lg block mb-1">💌</span>
                  <span className="text-xs font-bold block">Regretfully Decline</span>
                  <span className="text-[10px] text-stone-400 font-light block">Sending love from afar</span>
                </button>
              </div>
            </div>

            {/* Guest Contact Information */}
            <div className="space-y-3 pt-2 border-t border-stone-100">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
                Guest Identification *
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="e.g. Radhika"
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#8E2848]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Last Name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="e.g. Sharma"
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#8E2848]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">WhatsApp Phone *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#8E2848]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="radhika@example.com"
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#8E2848]"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-stone-700 text-xs block mb-1">
                  Household / Family Name (Optional)
                </label>
                <input
                  type="text"
                  value={household}
                  onChange={(e) => setHousehold(e.target.value)}
                  placeholder="e.g. The Sharma Family"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 text-xs focus:outline-none"
                />
              </div>
            </div>

            {attendingStatus === 'attending' && (
              <>
                {/* Guest Count & Plus Ones */}
                <div className="space-y-2 pt-2 border-t border-stone-100 text-xs">
                  <div className="flex justify-between items-center">
                    <label className="font-bold uppercase tracking-wider text-stone-500">
                      Total Attending Guests (Including You)
                    </label>
                    <span className="font-bold text-[#8E2848] text-sm">{guestCount}</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={6}
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                    className="w-full accent-[#8E2848] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-stone-400">
                    <span>1 (Just me)</span>
                    <span>2 (Couple)</span>
                    <span>3–4 (Family)</span>
                    <span>5–6 (Full Household)</span>
                  </div>
                </div>

                {/* Ceremonies Attending */}
                <div className="space-y-2 pt-2 border-t border-stone-100 text-xs">
                  <label className="font-bold uppercase tracking-wider text-stone-500 block">
                    Which ceremonies will you attend?
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      'Mehendi & Welcome Dinner',
                      'Sangeet Night',
                      'Wedding Ceremony (Pheras)',
                      'Royal Reception Banquet',
                    ].map((ceremony) => {
                      const checked = selectedEvents.includes(ceremony)
                      return (
                        <label
                          key={ceremony}
                          className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer text-xs transition-colors ${
                            checked ? 'bg-[#8E2848]/5 border-[#8E2848] font-bold text-[#17233B]' : 'bg-stone-50 border-stone-200 text-stone-600'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleEvent(ceremony)}
                            className="accent-[#8E2848] w-4 h-4"
                          />
                          <span>{ceremony}</span>
                        </label>
                      )
                    })}
                  </div>
                </div>

                {/* Meal & Dietary */}
                <div className="space-y-3 pt-2 border-t border-stone-100 text-xs">
                  <span className="font-bold uppercase tracking-wider text-stone-500 block">
                    Culinary &amp; Dietary Preferences
                  </span>
                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">Catering Choice</label>
                    <select
                      aria-label="Catering choice"
                      value={mealPreference}
                      onChange={(e) => setMealPreference(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 font-semibold focus:outline-none"
                    >
                      <option value="Royal Wazwan & Multi-Cuisine">Royal Wazwan &amp; Multi-Cuisine (Traditional Non-Veg &amp; Veg)</option>
                      <option value="Pure Vegetarian">Pure Vegetarian Cuisine</option>
                      <option value="Strict Jain (No Root Veg)">Strict Jain (No Onion, Garlic or Root Vegetables)</option>
                      <option value="Halal Certified">Halal Certified Dishes</option>
                      <option value="Vegan / Gluten-Free">Vegan / Gluten-Free</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">Dietary Allergies or Special Notes</label>
                    <input
                      type="text"
                      value={dietaryNotes}
                      onChange={(e) => setDietaryNotes(e.target.value)}
                      placeholder="e.g. Severe peanut allergy, diabetic options required"
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs focus:outline-none"
                    />
                  </div>
                </div>

                {/* Logistics Requirements */}
                <div className="space-y-2 pt-2 border-t border-stone-100 text-xs">
                  <span className="font-bold uppercase tracking-wider text-stone-500 block">
                    Accommodation &amp; Travel Assistance
                  </span>
                  <div className="space-y-2">
                    <label className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between cursor-pointer">
                      <div>
                        <strong className="block text-stone-800">🏨 Hotel Room Block Allocation</strong>
                        <span className="text-[11px] text-stone-500">I will require a room reserved from the couple&apos;s hotel block</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={needAccommodation}
                        onChange={(e) => setNeedAccommodation(e.target.checked)}
                        className="accent-[#8E2848] w-4 h-4"
                      />
                    </label>

                    <label className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between cursor-pointer">
                      <div>
                        <strong className="block text-stone-800">🚗 Airport Chauffeur Shuttle</strong>
                        <span className="text-[11px] text-stone-500">I would like to be included in the scheduled airport arrival waves</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={needChauffeur}
                        onChange={(e) => setNeedChauffeur(e.target.checked)}
                        className="accent-[#8E2848] w-4 h-4"
                      />
                    </label>
                  </div>
                </div>
              </>
            )}

            {/* Warm Wishes */}
            <div className="space-y-2 pt-2 border-t border-stone-100 text-xs">
              <label className="font-bold uppercase tracking-wider text-stone-500 block">
                Message / Blessings for the Couple
              </label>
              <textarea
                rows={3}
                value={blessingMessage}
                onChange={(e) => setBlessingMessage(e.target.value)}
                placeholder="Share your warm wishes and blessings..."
                className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 text-xs focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-[#8E2848] hover:bg-[#721f39] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-lg hover:scale-[1.01]"
            >
              Submit RSVP Response →
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
