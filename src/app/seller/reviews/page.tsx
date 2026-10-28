'use client'

import React, { useState, useEffect } from 'react'
import { useSeller } from '../SellerContext'
import { SellerReview } from '@/lib/seller-portal/types'

export default function SellerReviewsPage() {
  const { seller } = useSeller()
  const [reviews, setReviews] = useState<SellerReview[]>([])
  const [loading, setLoading] = useState(true)
  const [replyReviewId, setReplyReviewId] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const [submittingReply, setSubmittingReply] = useState(false)
  const [ratingFilter, setRatingFilter] = useState<number | 'all'>('all')

  const fetchReviews = async (sellerId: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/seller/reviews?sellerId=${sellerId}`)
      if (res.ok) {
        const data = await res.json()
        if (data.reviews) setReviews(data.reviews)
      }
    } catch (err) {
      console.error('Failed to load reviews:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (seller?.id) {
      fetchReviews(seller.id)
    }
  }, [seller?.id])

  const handlePostReply = async (reviewId: string) => {
    if (!replyText.trim()) return
    setSubmittingReply(true)
    try {
      const res = await fetch('/api/seller/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewId, replyText }),
      })
      if (res.ok) {
        const data = await res.json()
        if (data.review) {
          setReviews((prev) =>
            prev.map((r) => (r.id === reviewId ? data.review : r))
          )
          setReplyReviewId(null)
          setReplyText('')
        }
      }
    } catch (err) {
      console.error('Failed to post reply:', err)
    } finally {
      setSubmittingReply(false)
    }
  }

  const filtered = reviews.filter((r) => {
    if (ratingFilter === 'all') return true
    return r.rating === ratingFilter
  })

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : '5.0'

  const ratingCounts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  reviews.forEach((r) => {
    ratingCounts[r.rating] = (ratingCounts[r.rating] || 0) + 1
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200 shadow-xs">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-[#C5A869] font-bold">
            Reputation & Customer Sentiment
          </span>
          <h1 className="text-2xl font-serif font-bold text-[#163326] mt-0.5">
            Ratings & Verified Feedback
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Monitor product quality reviews from verified domestic and international customers. Public responses enhance marketplace conversion.
          </p>
        </div>
      </div>

      {/* Rating Overview Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-6 rounded-3xl border border-stone-200 shadow-xs items-center">
        <div className="text-center md:border-r border-stone-200 pr-4">
          <div className="text-5xl font-black font-serif text-[#163326]">{averageRating}</div>
          <div className="flex justify-center text-amber-400 text-lg my-1">
            {'★'.repeat(Math.round(Number(averageRating)))}
            {'☆'.repeat(5 - Math.round(Number(averageRating)))}
          </div>
          <span className="text-xs text-stone-500">Based on {reviews.length} verified purchases</span>
        </div>

        {/* Rating Breakdown Bars */}
        <div className="md:col-span-2 space-y-2">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = ratingCounts[star] || 0
            const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0
            return (
              <div
                key={star}
                onClick={() => setRatingFilter(ratingFilter === star ? 'all' : star)}
                className="flex items-center gap-3 text-xs cursor-pointer group"
              >
                <span className="w-12 font-semibold text-stone-700 group-hover:text-[#163326]">
                  {star} Star
                </span>
                <div className="flex-1 h-3 rounded-full bg-stone-100 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#D4AF37] to-[#163326] rounded-full transition-all duration-300"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-8 text-right text-stone-400 font-mono">{count}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex gap-2">
        <button
          onClick={() => setRatingFilter('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
            ratingFilter === 'all'
              ? 'bg-[#163326] text-white'
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          All Ratings ({reviews.length})
        </button>
        {[5, 4, 3].map((star) => (
          <button
            key={star}
            onClick={() => setRatingFilter(star)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              ratingFilter === star
                ? 'bg-[#163326] text-white'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            {star} Stars ({ratingCounts[star] || 0})
          </button>
        ))}
      </div>

      {/* Reviews Stream */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white p-12 text-center text-xs text-stone-500 rounded-3xl border border-stone-200">
            Loading reviews...
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white p-12 text-center text-xs text-stone-500 rounded-3xl border border-stone-200">
            No reviews match the selected filter.
          </div>
        ) : (
          filtered.map((rev) => (
            <div
              key={rev.id}
              className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="text-amber-500 text-sm tracking-wide">
                    {'★'.repeat(rev.rating)}
                    {'☆'.repeat(5 - rev.rating)}
                  </div>
                  <h4 className="font-bold text-stone-900 text-xs">{rev.title}</h4>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-stone-400">
                  <span className="font-medium text-stone-600">{rev.customerName}</span>
                  <span>·</span>
                  <span className="bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full text-[10px]">
                    {rev.customerCountry}
                  </span>
                  <span>·</span>
                  <span>{new Date(rev.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="text-xs text-stone-700 leading-relaxed">{rev.comment}</div>

              <div className="flex items-center justify-between text-[11px] text-stone-500 pt-2 border-t border-stone-100">
                <span className="font-medium text-stone-700 truncate max-w-md">
                  Item: {rev.productTitle}
                </span>

                {rev.sellerReply ? (
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    ✓ Replied
                  </span>
                ) : (
                  <button
                    onClick={() => {
                      setReplyReviewId(rev.id)
                      setReplyText('')
                    }}
                    className="text-[#163326] font-semibold hover:underline"
                  >
                    Reply as Merchant →
                  </button>
                )}
              </div>

              {/* Existing Seller Reply */}
              {rev.sellerReply && (
                <div className="p-3.5 bg-[#FAF6EF] rounded-2xl border border-[#C5A869]/30 text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold text-[#163326] text-[11px]">
                    <span>Store Response ({seller?.storeName || 'Merchant'}):</span>
                    <span className="font-normal text-stone-400">
                      {typeof rev.sellerReply === 'object'
                        ? new Date(rev.sellerReply.repliedAt).toLocaleDateString()
                        : 'Verified Response'}
                    </span>
                  </div>
                  <p className="text-stone-700">
                    {typeof rev.sellerReply === 'object' ? rev.sellerReply.text : rev.sellerReply}
                  </p>
                </div>
              )}

              {/* Reply Box */}
              {replyReviewId === rev.id && (
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                  <span className="text-xs font-bold text-stone-700">Write Official Store Response</span>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Thank the customer or address their feedback professionally..."
                    rows={2}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300 bg-white"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setReplyReviewId(null)}
                      className="px-3 py-1.5 text-xs text-stone-600 hover:bg-stone-200 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handlePostReply(rev.id)}
                      disabled={submittingReply || !replyText.trim()}
                      className="px-4 py-1.5 bg-[#163326] hover:bg-[#11291E] disabled:bg-stone-300 text-white text-xs font-semibold rounded-lg shadow-xs"
                    >
                      {submittingReply ? 'Posting...' : 'Publish Response'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
