'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { ClothingProduct } from '@/lib/clothing-data'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE } from '@/lib/constants'
import { useMarketCurrency } from '@/hooks/useMarketCurrency'

interface ExpressBuyModalProps {
  product: ClothingProduct | null
  isOpen: boolean
  onClose: () => void
}

export default function ExpressBuyModal({
  product,
  isOpen,
  onClose,
}: ExpressBuyModalProps) {
  const { formatCraftPrice, currency, isWesternMarket } = useMarketCurrency()
  if (!isOpen || !product) return null

  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'Free Size')
  const [selectedColorIdx, setSelectedColorIdx] = useState(0)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [pincode, setPincode] = useState('')
  const [address, setAddress] = useState('')
  const [isCompleted, setIsCompleted] = useState(false)
  const [orderRef, setOrderRef] = useState('')

  const currentColor = product.colorOptions[selectedColorIdx] || product.colorOptions[0]
  const whatsappPhone = (WHATSAPP_NUMBERS.SUPPORT || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault()
    const ref = `NT-EXP-${Math.floor(100000 + Math.random() * 900000)}`
    setOrderRef(ref)

    // Save to local orders
    try {
      const existing = JSON.parse(localStorage.getItem('nt_express_orders') || '[]')
      const order = {
        orderId: ref,
        productId: product.id,
        name: product.name,
        color: currentColor.name,
        size: selectedSize,
        price: product.price,
        currency,
        formattedPrice: formatCraftPrice(product.price),
        customerName: name,
        phone,
        pincode,
        address,
        timestamp: new Date().toISOString(),
      }
      localStorage.setItem('nt_express_orders', JSON.stringify([...existing, order]))
    } catch {
      // ignore
    }

    setIsCompleted(true)
  }

  const handleWhatsAppConfirm = () => {
    const text = `Namaste Nuty Tales Crafts! I just placed Express Order *${orderRef}* for:
• Item: *${product.name}*
• Craft: ${product.craft} (${product.state || 'India'})
• Size: ${selectedSize}
• Color: ${currentColor.name}
• Total: ${formatCraftPrice(product.price)} (${currency})
• Name: ${name}
• Delivery Pincode: ${pincode}

Please confirm tracking and dispatch timeline. Thank you!`
    window.open(`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(text)}`, '_blank')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#FAF6EE] text-[#17233B] rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-stone-300 space-y-5 font-sans relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚡</span>
            <div>
              <h3 className="font-serif font-bold text-base sm:text-lg text-[#17233B]">
                1-Click Express Checkout
              </h3>
              <p className="text-[10px] text-stone-500">Fastest Crafts Delivery across India &amp; Worldwide</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-200 hover:bg-stone-300 flex items-center justify-center text-stone-700 font-bold text-xs"
          >
            ✕
          </button>
        </div>

        {!isCompleted ? (
          <form onSubmit={handlePlaceOrder} className="space-y-4">
            {/* Garment Summary */}
            <div className="flex gap-3.5 items-center p-3 bg-white rounded-2xl border border-stone-200">
              <div className="relative w-16 h-20 rounded-xl overflow-hidden bg-stone-100 flex-shrink-0">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-serif font-bold text-sm text-[#17233B] leading-tight">
                  {product.name}
                </h4>
                <p className="text-[11px] text-[#704B32]">
                  📍 {product.state || 'India'} · {product.craft}
                </p>
                <div className="flex items-center gap-2 pt-0.5 flex-wrap">
                  <span className="font-serif font-bold text-base text-[#17233B]">
                    {formatCraftPrice(product.price)}
                  </span>
                  {product.mrp > product.price && (
                    <span className="text-xs text-stone-400 line-through">
                      {formatCraftPrice(product.mrp)}
                    </span>
                  )}
                  <span className="text-[10px] text-emerald-700 font-bold">
                    {isWesternMarket ? 'Insured Global Express Courier' : 'Free Insured Express Shipping'}
                  </span>
                </div>
              </div>
            </div>

            {/* Size & Color Selector */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-stone-600">
                  Select Size
                </label>
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="w-full p-2.5 bg-white border border-stone-300 rounded-xl text-xs font-semibold text-[#17233B] outline-none"
                >
                  {product.sizes.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-stone-600">
                  Select Color
                </label>
                <select
                  value={selectedColorIdx}
                  onChange={(e) => setSelectedColorIdx(Number(e.target.value))}
                  className="w-full p-2.5 bg-white border border-stone-300 rounded-xl text-xs font-semibold text-[#17233B] outline-none"
                >
                  {product.colorOptions.map((c, idx) => (
                    <option key={c.name} value={idx}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Rapid Shipping Details */}
            <div className="space-y-2.5">
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Your Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="p-2.5 bg-white border border-stone-300 rounded-xl text-xs text-[#17233B] outline-none"
                />
                <input
                  type="tel"
                  required
                  placeholder="WhatsApp Mobile (+91...)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="p-2.5 bg-white border border-stone-300 rounded-xl text-xs text-[#17233B] outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Pin Code"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="p-2.5 bg-white border border-stone-300 rounded-xl text-xs text-[#17233B] outline-none col-span-1"
                />
                <input
                  type="text"
                  required
                  placeholder="City, State & Delivery Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="p-2.5 bg-white border border-stone-300 rounded-xl text-xs text-[#17233B] outline-none col-span-2"
                />
              </div>
            </div>

            {/* Payment Method Badges */}
            <div className="flex items-center justify-between text-[11px] text-stone-500 px-1 pt-1">
              <span>🔒 256-Bit SSL Encrypted</span>
              <span className="text-[#176B68] font-bold">UPI · Card · Cash On Delivery Available</span>
            </div>

            {/* CTA */}
            <button
              type="submit"
              className="w-full py-3.5 bg-[#17233B] hover:bg-stone-800 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <span>⚡ Place Express Order (₹{product.price.toLocaleString('en-IN')})</span>
            </button>
          </form>
        ) : (
          <div className="py-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 text-3xl flex items-center justify-center mx-auto shadow-sm">
              ✓
            </div>
            <div className="space-y-1">
              <h4 className="font-serif font-bold text-xl text-[#17233B]">
                Express Order Confirmed!
              </h4>
              <p className="text-xs text-stone-600">
                Order Reference: <strong className="font-mono text-[#17233B]">{orderRef}</strong>
              </p>
              <p className="text-xs text-stone-500 pt-1 max-w-sm mx-auto">
                Our master artisan guild has received your order for <strong>{product.name}</strong>. Dispatch in 24 hours with insured tracking.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
              <button
                type="button"
                onClick={handleWhatsAppConfirm}
                className="px-6 py-3 bg-[#176B68] hover:bg-[#125350] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md"
              >
                <span>💬 Confirm on WhatsApp</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-xl text-xs font-bold uppercase tracking-wider"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
