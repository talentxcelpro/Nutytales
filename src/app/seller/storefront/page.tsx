'use client'

import React, { useState, useEffect } from 'react'
import { useSeller } from '../SellerContext'
import { StorefrontProfile } from '@/lib/seller-portal/types'

export default function SellerStorefrontPage() {
  const { seller, refreshSeller } = useSeller()
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [profile, setProfile] = useState<StorefrontProfile>({
    displayName: seller?.storefront?.displayName || seller?.storeName || '',
    tagline: seller?.storefront?.tagline || 'Global direct merchant on Nuty Tales',
    bio: seller?.storefront?.bio || '',
    logoUrl: seller?.storefront?.logoUrl || '',
    bannerUrl: seller?.storefront?.bannerUrl || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80',
    ratingAverage: seller?.storefront?.ratingAverage || 5.0,
    totalReviews: seller?.storefront?.totalReviews || 0,
    shipsInternationally: seller?.storefront?.shipsInternationally ?? true,
    returnPolicyDays: seller?.storefront?.returnPolicyDays || 30,
    warrantyPolicy: seller?.storefront?.warrantyPolicy || '100% Satisfaction Guarantee. Authentic origin guaranteed.',
    socialLinks: {
      instagram: seller?.storefront?.socialLinks?.instagram || '',
      twitter: seller?.storefront?.socialLinks?.twitter || '',
      facebook: seller?.storefront?.socialLinks?.facebook || '',
      website: seller?.storefront?.socialLinks?.website || seller?.website || '',
    },
  })

  useEffect(() => {
    if (seller?.storefront) {
      setProfile((prev) => ({
        ...prev,
        ...seller.storefront,
        displayName: seller.storefront.displayName || seller.storeName,
      }))
    }
  }, [seller])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!seller?.id) return
    setSaving(true)
    setError(null)
    setSuccess(false)

    try {
      const res = await fetch('/api/seller/storefront', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sellerId: seller.id,
          storefront: profile,
        }),
      })

      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update storefront')
      }

      setSuccess(true)
      await refreshSeller()
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200 shadow-xs">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-[#C5A869] font-bold">
            Public Presence & Storefront Identity
          </span>
          <h1 className="text-2xl font-serif font-bold text-[#163326] mt-0.5">
            Storefront Brand Profile
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Customize the merchant banner, logo, brand narrative, warranty, and customer return policies displayed across the global storefront.
          </p>
        </div>
      </div>

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs flex items-center gap-2">
          <span>✓</span>
          <span>Storefront profile and brand presence saved successfully.</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs flex items-center gap-2">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Live Brand Banner Preview */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="relative h-48 bg-stone-800 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={profile.bannerUrl || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80'}
            alt="Storefront Banner Preview"
            className="w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-4 left-6 flex items-end gap-4 text-white">
            <div className="w-16 h-16 rounded-2xl bg-[#163326] border-2 border-[#C5A869] flex items-center justify-center text-2xl font-serif font-black shadow-lg text-[#C5A869]">
              {profile.displayName?.slice(0, 2).toUpperCase() || 'NT'}
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold">{profile.displayName || 'Your Storefront'}</h2>
              <p className="text-xs text-stone-200">{profile.tagline}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Core Brand Metadata */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-stone-200 shadow-xs space-y-4">
          <h3 className="font-serif font-bold text-base text-stone-900 border-b border-stone-100 pb-2">
            1. Brand Identity & Narrative
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Storefront Display Name *
              </label>
              <input
                type="text"
                value={profile.displayName}
                onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                required
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#163326]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Brand Tagline
              </label>
              <input
                type="text"
                value={profile.tagline}
                onChange={(e) => setProfile({ ...profile, tagline: e.target.value })}
                placeholder="e.g. Master-crafted heritage textiles from the valley"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#163326]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Store Banner Image URL
              </label>
              <input
                type="url"
                value={profile.bannerUrl}
                onChange={(e) => setProfile({ ...profile, bannerUrl: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#163326]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Brand Bio & Craft Story
              </label>
              <textarea
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                rows={3}
                placeholder="Tell your enterprise story, manufacturing standards, heritage origins, or sustainability practices..."
                className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#163326]"
              />
            </div>
          </div>
        </div>

        {/* Policies & Assurance */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-stone-200 shadow-xs space-y-4">
          <h3 className="font-serif font-bold text-base text-stone-900 border-b border-stone-100 pb-2">
            2. Customer Terms, Returns & Warranty
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Buyer Return Window (Days)
              </label>
              <select
                value={profile.returnPolicyDays}
                onChange={(e) => setProfile({ ...profile, returnPolicyDays: Number(e.target.value) })}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white"
              >
                <option value={14}>14 Days (Standard)</option>
                <option value={30}>30 Days (Recommended for Global)</option>
                <option value={45}>45 Days (Extended Guarantee)</option>
                <option value={60}>60 Days (Premium Guarantee)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                International Cross-Border Shipping
              </label>
              <select
                value={profile.shipsInternationally ? 'yes' : 'no'}
                onChange={(e) => setProfile({ ...profile, shipsInternationally: e.target.value === 'yes' })}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white font-medium"
              >
                <option value="yes">✓ Yes, Enable Global Cross-Border Dispatch</option>
                <option value="no">Domestic Market Only</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Warranty & Authenticity Guarantee Statement
              </label>
              <input
                type="text"
                value={profile.warrantyPolicy}
                onChange={(e) => setProfile({ ...profile, warrantyPolicy: e.target.value })}
                placeholder="e.g. 1-Year Craftsmanship Guarantee / Lab-tested 100% Purity"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300"
              />
            </div>
          </div>
        </div>

        {/* Social & Digital Presence */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-stone-200 shadow-xs space-y-4">
          <h3 className="font-serif font-bold text-base text-stone-900 border-b border-stone-100 pb-2">
            3. External Verification & Channels
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Instagram Handle / URL
              </label>
              <input
                type="text"
                value={profile.socialLinks?.instagram || ''}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    socialLinks: { ...profile.socialLinks, instagram: e.target.value },
                  })
                }
                placeholder="https://instagram.com/yourbrand"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Official Website
              </label>
              <input
                type="url"
                value={profile.socialLinks?.website || ''}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    socialLinks: { ...profile.socialLinks, website: e.target.value },
                  })
                }
                placeholder="https://www.yourbrand.com"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300"
              />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-[#163326] hover:bg-[#11291E] disabled:bg-stone-300 text-white text-xs font-bold rounded-xl shadow-md transition"
          >
            {saving ? 'Saving Changes...' : 'Save Storefront Profile'}
          </button>
        </div>
      </form>
    </div>
  )
}
