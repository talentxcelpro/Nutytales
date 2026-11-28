'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'

export interface SavedAddress {
  id: string
  label: 'Home' | 'Office' | 'Parents' | 'Relative' | 'Other'
  fullName: string
  phone: string
  email: string
  address: string
  city: string
  state: string
  pincode: string
  isDefault?: boolean
}

const LABELS: SavedAddress['label'][] = ['Home', 'Office', 'Parents', 'Relative', 'Other']

export default function AccountProfilePage() {
  const { user, profile } = useAuth()
  const storageKey = user?.uid ? `nt_saved_addresses_${user.uid}` : 'nt_saved_addresses_guest'

  const [addresses, setAddresses] = useState<SavedAddress[]>([])
  const [label, setLabel] = useState<SavedAddress['label']>('Home')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [pincode, setPincode] = useState('')
  const [savedMsg, setSavedMsg] = useState<string | null>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey)
      if (raw) setAddresses(JSON.parse(raw))
    } catch {
      // ignore
    }
    if (profile || user) {
      setFullName((prev) => prev || profile?.full_name || user?.displayName || '')
      setEmail((prev) => prev || profile?.email || user?.email || '')
      setPhone((prev) => prev || profile?.phone || '')
    }
  }, [storageKey, profile, user])

  const persist = (next: SavedAddress[]) => {
    setAddresses(next)
    localStorage.setItem(storageKey, JSON.stringify(next))
  }

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault()
    if (addresses.length >= 5) {
      setSavedMsg('You can save up to 5 addresses. Delete one to add another.')
      return
    }
    const newAddr: SavedAddress = {
      id: `addr_${Date.now()}`,
      label,
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      address: address.trim(),
      city: city.trim(),
      state: state.trim(),
      pincode: pincode.trim(),
      isDefault: addresses.length === 0,
    }
    persist([...addresses, newAddr])
    setAddress('')
    setCity('')
    setState('')
    setPincode('')
    setSavedMsg(`${label} address saved for 1-click checkout.`)
  }

  const handleDelete = (id: string) => {
    persist(addresses.filter((a) => a.id !== id))
  }

  const handleSetDefault = (id: string) => {
    persist(addresses.map((a) => ({ ...a, isDefault: a.id === id })))
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#17233B] pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl font-normal text-[#17233B]">
              My Profile &amp; Saved Addresses
            </h1>
            <p className="text-xs text-stone-600 mt-1">
              Save up to 5 delivery addresses (Home, Office, Parents, Relative, Other) for instant checkout.
            </p>
          </div>
          <Link
            href="/account/orders"
            className="px-4 py-2 rounded-full border border-stone-200 bg-white text-xs font-semibold text-[#17233B] self-start"
          >
            My Orders →
          </Link>
        </div>

        {/* Saved Addresses List */}
        {addresses.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {addresses.map((a) => (
              <div
                key={a.id}
                className="bg-white rounded-3xl border border-[#EAE3D5] p-5 space-y-2 relative"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#FAF6EE] border border-[#EAE3D5] text-[#17233B]">
                    {a.label}
                  </span>
                  {a.isDefault ? (
                    <span className="text-[10px] font-bold text-emerald-700">✓ Default</span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSetDefault(a.id)}
                      className="text-[11px] font-semibold text-[#176B68] hover:underline"
                    >
                      Set Default
                    </button>
                  )}
                </div>
                <p className="text-xs font-bold text-[#17233B]">{a.fullName}</p>
                <p className="text-xs text-stone-600">
                  {a.address}, {a.city}, {a.state} - {a.pincode}
                </p>
                <p className="text-[11px] text-stone-500">
                  {a.phone} · {a.email}
                </p>
                <button
                  type="button"
                  onClick={() => handleDelete(a.id)}
                  className="text-[11px] font-semibold text-rose-600 hover:underline pt-1"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add New Address Form */}
        <form
          onSubmit={handleAddAddress}
          className="bg-white rounded-3xl border border-[#EAE3D5] p-6 sm:p-8 shadow-xs space-y-4"
        >
          <h2 className="font-serif text-xl text-[#17233B]">
            Add Address ({addresses.length}/5)
          </h2>

          <div className="flex flex-wrap gap-2">
            {LABELS.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLabel(l)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  label === l
                    ? 'bg-[#17233B] text-white'
                    : 'bg-stone-50 border border-stone-200 text-stone-600'
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Full Name *"
              className="px-4 py-2.5 rounded-xl border border-stone-200 text-xs"
            />
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone Number (WhatsApp) *"
              className="px-4 py-2.5 rounded-xl border border-stone-200 text-xs"
            />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address *"
              className="px-4 py-2.5 rounded-xl border border-stone-200 text-xs sm:col-span-2"
            />
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Street / Building / Flat *"
              className="px-4 py-2.5 rounded-xl border border-stone-200 text-xs sm:col-span-2"
            />
            <input
              type="text"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City *"
              className="px-4 py-2.5 rounded-xl border border-stone-200 text-xs"
            />
            <input
              type="text"
              required
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="State *"
              className="px-4 py-2.5 rounded-xl border border-stone-200 text-xs"
            />
            <input
              type="text"
              required
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              placeholder="Postal Code / PIN *"
              className="px-4 py-2.5 rounded-xl border border-stone-200 text-xs"
            />
          </div>

          {savedMsg && (
            <p className="text-xs font-semibold text-[#176B68]">{savedMsg}</p>
          )}

          <button
            type="submit"
            disabled={addresses.length >= 5}
            className="px-6 py-3 rounded-full bg-[#17233B] hover:bg-[#176B68] text-white text-xs font-bold uppercase tracking-wider disabled:opacity-50"
          >
            Save Address
          </button>
        </form>
      </div>
    </div>
  )
}
