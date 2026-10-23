'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import { VerifiedStayReview, ReviewAggregateStats } from '@/lib/stays/reviews-store'

interface StayReviewSectionProps {
  propertySlug: string
  hostName: string
  initialRating: number
  initialReviewsCount: number
  initialBreakdown: {
    cleanliness: number
    accuracy: number
    communication: number
    location: number
    checkIn: number
    value: number
  }
}

export default function StayReviewSection({
  propertySlug,
  hostName,
  initialRating,
  initialReviewsCount,
  initialBreakdown,
}: StayReviewSectionProps) {
  const [reviews, setReviews] = useState<VerifiedStayReview[]>([])
  const [stats, setStats] = useState<ReviewAggregateStats>({
    overallRating: initialRating,
    totalReviews: initialReviewsCount,
    ratingsBreakdown: initialBreakdown,
    ratingDistribution: { 5: initialReviewsCount, 4: 0, 3: 0, 2: 0, 1: 0 },
    verifiedPercentage: 100,
  })
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<'all' | '5star' | 'family' | 'couple' | 'photos'>('all')

  // Review Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [guestName, setGuestName] = useState('')
  const [guestCity, setGuestCity] = useState('')
  const [bookingRef, setBookingRef] = useState('')
  const [travelerType, setTravelerType] = useState<'solo' | 'couple' | 'family' | 'business' | 'friends'>('couple')
  const [title, setTitle] = useState('')
  const [comment, setComment] = useState('')
  const [overallRating, setOverallRating] = useState(5)
  const [cleanliness, setCleanliness] = useState(5)
  const [accuracy, setAccuracy] = useState(5)
  const [communication, setCommunication] = useState(5)
  const [locationScore, setLocationScore] = useState(5)
  const [checkInScore, setCheckInScore] = useState(5)
  const [valueScore, setValueScore] = useState(5)
  const [photoUrl, setPhotoUrl] = useState('')
  const [addedPhotos, setAddedPhotos] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // Fetch reviews from API
  useEffect(() => {
    let isMounted = true
    fetch(`/api/stays/reviews?slug=${encodeURIComponent(propertySlug)}`)
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return
        if (data.success) {
          setReviews(data.reviews || [])
          if (data.stats) setStats(data.stats)
        }
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [propertySlug])

  // Filter reviews
  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      if (activeFilter === '5star') return r.rating >= 4.9
      if (activeFilter === 'family') return r.travelerType === 'family'
      if (activeFilter === 'couple') return r.travelerType === 'couple'
      if (activeFilter === 'photos') return r.photos && r.photos.length > 0
      return true
    })
  }, [reviews, activeFilter])

  // Handle Photo addition in modal
  const handleAddPhoto = () => {
    if (photoUrl.trim()) {
      setAddedPhotos((prev) => [...prev, photoUrl.trim()])
      setPhotoUrl('')
    }
  }

  // Handle Review Submission
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMsg(null)

    try {
      const res = await fetch('/api/stays/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertySlug,
          bookingRef: bookingRef.trim() || undefined,
          guestName: guestName.trim(),
          guestCity: guestCity.trim() || 'Verified Guest',
          title: title.trim(),
          comment: comment.trim(),
          rating: overallRating,
          ratingsBreakdown: {
            cleanliness,
            accuracy,
            communication,
            location: locationScore,
            checkIn: checkInScore,
            value: valueScore,
          },
          travelerType,
          photos: addedPhotos,
        }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setSubmitSuccess(true)
        if (data.review) {
          setReviews((prev) => [data.review, ...prev])
        }
        if (data.updatedStats) {
          setStats(data.updatedStats)
        }
        setTimeout(() => {
          setIsModalOpen(false)
          setSubmitSuccess(false)
          // Reset form
          setGuestName('')
          setGuestCity('')
          setBookingRef('')
          setTitle('')
          setComment('')
          setAddedPhotos([])
        }, 1500)
      } else {
        setErrorMsg(data.error || 'Failed to submit review. Please try again.')
      }
    } catch {
      setErrorMsg('Network error while posting your review.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* ── 1. Top Ratings Summary & verified banner ───────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <span className="font-serif text-3xl font-extrabold text-[#17233B]">
              ★ {stats.overallRating.toFixed(2)}
            </span>
            <span className="text-stone-400">·</span>
            <span className="text-base font-semibold text-stone-700">
              {stats.totalReviews} Verified Guest Reviews
            </span>
          </div>
          <p className="text-xs text-stone-500">
            {stats.verifiedPercentage}% verified bookings with audited check-ins.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 bg-[#17233B] hover:bg-[#1E3048] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs flex items-center gap-2 self-start sm:self-auto"
        >
          <span>✍️</span>
          <span>Write a Review</span>
        </button>
      </div>

      {/* ── 2. 6-Factor Radar / Breakdown Matrix ────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 p-6 bg-white rounded-3xl border border-[#E7E2D9] shadow-xs text-xs">
        <div className="space-y-1.5 border-r border-stone-100 pr-2">
          <span className="text-stone-500 text-[11px] block">Cleanliness</span>
          <div className="flex items-baseline justify-between">
            <strong className="text-base font-bold text-[#17233B]">
              {stats.ratingsBreakdown.cleanliness.toFixed(1)}
            </strong>
            <span className="text-[10px] text-stone-400">/ 5</span>
          </div>
          <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[#17233B] h-full rounded-full"
              style={{ width: `${(stats.ratingsBreakdown.cleanliness / 5) * 100}%` }}
            />
          </div>
        </div>

        <div className="space-y-1.5 border-r border-stone-100 pr-2">
          <span className="text-stone-500 text-[11px] block">Accuracy</span>
          <div className="flex items-baseline justify-between">
            <strong className="text-base font-bold text-[#17233B]">
              {stats.ratingsBreakdown.accuracy.toFixed(1)}
            </strong>
            <span className="text-[10px] text-stone-400">/ 5</span>
          </div>
          <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[#17233B] h-full rounded-full"
              style={{ width: `${(stats.ratingsBreakdown.accuracy / 5) * 100}%` }}
            />
          </div>
        </div>

        <div className="space-y-1.5 border-r border-stone-100 pr-2">
          <span className="text-stone-500 text-[11px] block">Communication</span>
          <div className="flex items-baseline justify-between">
            <strong className="text-base font-bold text-[#17233B]">
              {stats.ratingsBreakdown.communication.toFixed(1)}
            </strong>
            <span className="text-[10px] text-stone-400">/ 5</span>
          </div>
          <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[#17233B] h-full rounded-full"
              style={{ width: `${(stats.ratingsBreakdown.communication / 5) * 100}%` }}
            />
          </div>
        </div>

        <div className="space-y-1.5 border-r border-stone-100 pr-2">
          <span className="text-stone-500 text-[11px] block">Location</span>
          <div className="flex items-baseline justify-between">
            <strong className="text-base font-bold text-[#17233B]">
              {stats.ratingsBreakdown.location.toFixed(1)}
            </strong>
            <span className="text-[10px] text-stone-400">/ 5</span>
          </div>
          <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[#17233B] h-full rounded-full"
              style={{ width: `${(stats.ratingsBreakdown.location / 5) * 100}%` }}
            />
          </div>
        </div>

        <div className="space-y-1.5 border-r border-stone-100 pr-2">
          <span className="text-stone-500 text-[11px] block">Check-in</span>
          <div className="flex items-baseline justify-between">
            <strong className="text-base font-bold text-[#17233B]">
              {stats.ratingsBreakdown.checkIn.toFixed(1)}
            </strong>
            <span className="text-[10px] text-stone-400">/ 5</span>
          </div>
          <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[#17233B] h-full rounded-full"
              style={{ width: `${(stats.ratingsBreakdown.checkIn / 5) * 100}%` }}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <span className="text-stone-500 text-[11px] block">Value</span>
          <div className="flex items-baseline justify-between">
            <strong className="text-base font-bold text-[#17233B]">
              {stats.ratingsBreakdown.value.toFixed(1)}
            </strong>
            <span className="text-[10px] text-stone-400">/ 5</span>
          </div>
          <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[#17233B] h-full rounded-full"
              style={{ width: `${(stats.ratingsBreakdown.value / 5) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── 3. Filter Chips ─────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setActiveFilter('all')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
            activeFilter === 'all'
              ? 'bg-[#17233B] text-white shadow-2xs'
              : 'bg-white border border-stone-200 text-stone-600 hover:border-stone-400'
          }`}
        >
          All ({reviews.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter('5star')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
            activeFilter === '5star'
              ? 'bg-[#17233B] text-white shadow-2xs'
              : 'bg-white border border-stone-200 text-stone-600 hover:border-stone-400'
          }`}
        >
          ★ 5-Star Reviews
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter('family')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
            activeFilter === 'family'
              ? 'bg-[#17233B] text-white shadow-2xs'
              : 'bg-white border border-stone-200 text-stone-600 hover:border-stone-400'
          }`}
        >
          👨‍👩‍👧 Families
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter('couple')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
            activeFilter === 'couple'
              ? 'bg-[#17233B] text-white shadow-2xs'
              : 'bg-white border border-stone-200 text-stone-600 hover:border-stone-400'
          }`}
        >
          💑 Couples
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter('photos')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
            activeFilter === 'photos'
              ? 'bg-[#17233B] text-white shadow-2xs'
              : 'bg-white border border-stone-200 text-stone-600 hover:border-stone-400'
          }`}
        >
          📷 With Photos
        </button>
      </div>

      {/* ── 4. Reviews List ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredReviews.map((rev) => (
          <div
            key={rev.id}
            className="p-6 bg-white rounded-3xl border border-[#E7E2D9] space-y-4 shadow-xs flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <strong className="text-sm font-bold text-[#17233B]">{rev.guestName}</strong>
                    {rev.verifiedStay && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold text-[10px] border border-emerald-200">
                        ✓ Verified Stay
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-stone-500">
                    {rev.guestCity} · {rev.date}
                    {rev.travelerType ? ` · Traveled with ${rev.travelerType}` : ''}
                  </span>
                </div>
                <div className="flex items-center text-amber-500 text-xs">
                  {'★'.repeat(Math.round(rev.rating))}
                  {'☆'.repeat(Math.max(0, 5 - Math.round(rev.rating)))}
                </div>
              </div>

              <h4 className="font-bold text-xs text-stone-900">&ldquo;{rev.title}&rdquo;</h4>
              <p className="text-xs text-stone-600 leading-relaxed font-light">{rev.comment}</p>

              {/* Photo Attachments */}
              {rev.photos && rev.photos.length > 0 && (
                <div className="flex items-center gap-2 pt-2 overflow-x-auto">
                  {rev.photos.slice(0, 3).map((photo, pIdx) => (
                    <div
                      key={pIdx}
                      className="relative w-16 h-16 rounded-xl overflow-hidden bg-stone-100 flex-shrink-0 border border-stone-200"
                    >
                      <Image src={photo} alt="Guest Review Photo" fill className="object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Host Response Bubble */}
            {rev.hostResponse && (
              <div className="p-3.5 bg-[#FAF8F5] rounded-2xl border border-stone-200 text-[11px] text-stone-700 space-y-1 mt-2">
                <div className="flex items-center gap-1.5 font-bold text-[#17233B]">
                  <span>💬</span>
                  <span>Response from host {hostName}:</span>
                </div>
                <p className="font-light italic text-stone-600">{rev.hostResponse}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredReviews.length === 0 && (
        <div className="p-8 text-center bg-white rounded-3xl border border-stone-200 text-xs text-stone-500">
          No reviews found under this filter.
        </div>
      )}

      {/* ── 5. Review Submission Modal ───────────────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full space-y-5 border border-[#E7E2D9] shadow-2xl my-8">
            <div className="flex justify-between items-center border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-serif font-bold text-xl text-[#17233B]">
                  Review Your Stay
                </h3>
                <p className="text-xs text-stone-500">
                  Help fellow travelers explore this luxury residence.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-black text-lg p-1"
              >
                ✕
              </button>
            </div>

            {submitSuccess ? (
              <div className="p-6 bg-emerald-50 border border-emerald-300 rounded-2xl text-center space-y-2 animate-fadeIn">
                <div className="text-3xl">✓</div>
                <h4 className="font-serif font-bold text-base text-emerald-950">
                  Review Published!
                </h4>
                <p className="text-xs text-emerald-800">
                  Thank you! Your verified feedback is now visible and has updated the estate score.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
                {errorMsg && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold">
                    {errorMsg}
                  </div>
                )}

                {/* Identity */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ananya Roy"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-stone-200 bg-[#FAF8F5]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-1">
                      City of Residence
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Mumbai / London"
                      value={guestCity}
                      onChange={(e) => setGuestCity(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-stone-200 bg-[#FAF8F5]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-1">
                      Booking Reference (Optional for badge)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. NT-STAY-2026-6401"
                      value={bookingRef}
                      onChange={(e) => setBookingRef(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-stone-200 bg-[#FAF8F5] uppercase font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-1">
                      Traveler Type
                    </label>
                    <select
                      value={travelerType}
                      onChange={(e: any) => setTravelerType(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-stone-200 bg-[#FAF8F5]"
                    >
                      <option value="couple">Couple</option>
                      <option value="family">Family with Children</option>
                      <option value="solo">Solo Retreat</option>
                      <option value="business">Work / Executive</option>
                      <option value="friends">Group of Friends</option>
                    </select>
                  </div>
                </div>

                {/* Overall Rating Stars */}
                <div className="p-3 bg-[#FAF8F5] rounded-xl border border-stone-200 flex items-center justify-between">
                  <span className="font-bold text-stone-800">Overall Estate Experience:</span>
                  <div className="flex items-center gap-1 text-xl cursor-pointer">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        onClick={() => setOverallRating(star)}
                        className={star <= overallRating ? 'text-amber-500' : 'text-stone-300'}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>

                {/* 6-Factor Sliders */}
                <div className="space-y-2.5 pt-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                    Detailed 6-Dimension Audit:
                  </label>
                  <div className="grid grid-cols-2 gap-3 bg-[#FAF8F5] p-3 rounded-2xl border border-stone-200">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-stone-600">Cleanliness:</span>
                      <select
                        value={cleanliness}
                        onChange={(e) => setCleanliness(Number(e.target.value))}
                        className="bg-white border rounded-lg px-2 py-0.5 text-xs font-bold"
                      >
                        {[5, 4, 3, 2, 1].map((n) => (
                          <option key={n} value={n}>{n} ★</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-stone-600">Accuracy:</span>
                      <select
                        value={accuracy}
                        onChange={(e) => setAccuracy(Number(e.target.value))}
                        className="bg-white border rounded-lg px-2 py-0.5 text-xs font-bold"
                      >
                        {[5, 4, 3, 2, 1].map((n) => (
                          <option key={n} value={n}>{n} ★</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-stone-600">Communication:</span>
                      <select
                        value={communication}
                        onChange={(e) => setCommunication(Number(e.target.value))}
                        className="bg-white border rounded-lg px-2 py-0.5 text-xs font-bold"
                      >
                        {[5, 4, 3, 2, 1].map((n) => (
                          <option key={n} value={n}>{n} ★</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-stone-600">Location:</span>
                      <select
                        value={locationScore}
                        onChange={(e) => setLocationScore(Number(e.target.value))}
                        className="bg-white border rounded-lg px-2 py-0.5 text-xs font-bold"
                      >
                        {[5, 4, 3, 2, 1].map((n) => (
                          <option key={n} value={n}>{n} ★</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-stone-600">Check-In:</span>
                      <select
                        value={checkInScore}
                        onChange={(e) => setCheckInScore(Number(e.target.value))}
                        className="bg-white border rounded-lg px-2 py-0.5 text-xs font-bold"
                      >
                        {[5, 4, 3, 2, 1].map((n) => (
                          <option key={n} value={n}>{n} ★</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-stone-600">Value for Money:</span>
                      <select
                        value={valueScore}
                        onChange={(e) => setValueScore(Number(e.target.value))}
                        className="bg-white border rounded-lg px-2 py-0.5 text-xs font-bold"
                      >
                        {[5, 4, 3, 2, 1].map((n) => (
                          <option key={n} value={n}>{n} ★</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Headline & Body */}
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-1">
                    Review Headline *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Unmatched peaceful orchard experience and royal hospitality"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-200 bg-[#FAF8F5]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-1">
                    Your Detailed Feedback *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe the rooms, views, food, butler service, and what made your stay memorable..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-200 bg-[#FAF8F5]"
                  />
                </div>

                {/* Photo attachment */}
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-1">
                    Add Photo (Image URL)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="https://example.com/photo.jpg"
                      value={photoUrl}
                      onChange={(e) => setPhotoUrl(e.target.value)}
                      className="w-full p-2 rounded-xl border border-stone-200 bg-[#FAF8F5] text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddPhoto}
                      className="px-3 py-1.5 bg-stone-200 hover:bg-stone-300 font-bold rounded-xl"
                    >
                      Attach
                    </button>
                  </div>
                  {addedPhotos.length > 0 && (
                    <div className="flex gap-2 pt-2">
                      {addedPhotos.map((p, idx) => (
                        <span key={idx} className="text-[10px] bg-stone-100 px-2 py-1 rounded-md text-stone-600 truncate max-w-[150px]">
                          📷 Photo #{idx + 1}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-[#17233B] hover:bg-[#1E3048] disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <span>{isSubmitting ? 'Verifying & Publishing...' : 'Publish Verified Review'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
