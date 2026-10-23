'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { GiftingProduct } from '@/lib/gifting-marketplace-data'
import { useGiftingStore } from '@/hooks/useGiftingStore'

interface PersonalizationModalProps {
  product: GiftingProduct | null
  isOpen: boolean
  onClose: () => void
}

export const GREETING_CARD_TEMPLATES = [
  { id: 'festive-gold', name: 'Royal Gold Festive Card', preview: 'Warm festive greetings & heartfelt prosperity.' },
  { id: 'birthday-joy', name: 'Happy Birthday Card', preview: 'Wishing you another spectacular year filled with happiness & sweet moments.' },
  { id: 'wedding-bless', name: 'Wedding Blessings Card', preview: 'May your union be blessed with eternal love, harmony, and joy.' },
  { id: 'executive-thanks', name: 'Executive Gratitude Card', preview: 'With sincere appreciation for your partnership, excellence, and shared journey.' },
]

export default function PersonalizationModal({ product, isOpen, onClose }: PersonalizationModalProps) {
  const { addToCart } = useGiftingStore()
  const [recipientName, setRecipientName] = useState('')
  const [giftMessage, setGiftMessage] = useState('With warmest wishes and best compliments!')
  const [selectedCard, setSelectedCard] = useState(GREETING_CARD_TEMPLATES[0].id)
  const [deliveryDate, setDeliveryDate] = useState('')
  const [isGiftWrapped, setIsGiftWrapped] = useState(true)
  const [addedSuccess, setAddedSuccess] = useState(false)

  if (!isOpen || !product) return null

  const handleSaveAndAdd = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      quantity: 1,
      image: product.primaryImage,
      variant: 'Personalized Custom Pack',
      recipientName: recipientName.trim(),
      giftMessage: giftMessage.trim(),
      deliveryDate,
      isGiftWrapped,
    })
    setAddedSuccess(true)
    setTimeout(() => {
      setAddedSuccess(false)
      onClose()
    }, 1200)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-[#10192A]/70 backdrop-blur-xs" onClick={onClose} />

      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden z-10 max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 bg-[#FAF7F2] border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">✍️</span>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#C9A45C]">
                Bespoke Studio
              </span>
              <h3 className="font-serif text-xl font-bold text-[#17233B]">
                Personalize &ldquo;{product.name}&rdquo;
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-700 flex items-center justify-center text-sm font-bold transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Body Grid: Left Controls, Right Live Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-y-auto">
          {/* Left Form */}
          <div className="lg:col-span-7 p-6 space-y-5 text-xs">
            {/* Recipient Name */}
            <div>
              <label className="font-bold text-[#17233B] block mb-1">
                Recipient Name / Inscription (Printed on Gift / Box) *
              </label>
              <input
                type="text"
                maxLength={product.personalizationOptions?.charLimit || 60}
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="e.g. Ayesha Khan or The Sharma Family"
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:border-[#C9A45C] focus:bg-white focus:outline-hidden text-sm"
              />
              <span className="text-[10px] text-stone-400 mt-1 block">
                {(product.personalizationOptions?.charLimit || 60) - recipientName.length} characters remaining
              </span>
            </div>

            {/* Custom Gift Message */}
            <div>
              <label className="font-bold text-[#17233B] block mb-1">
                Handwritten / Printed Message Inside Greeting Card
              </label>
              <textarea
                rows={3}
                maxLength={250}
                value={giftMessage}
                onChange={(e) => setGiftMessage(e.target.value)}
                placeholder="Write your personal blessing, gratitude note, or greeting..."
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:border-[#C9A45C] focus:bg-white focus:outline-hidden text-xs"
              />
            </div>

            {/* Card Template */}
            <div>
              <label className="font-bold text-[#17233B] block mb-1.5">
                Select Complimentary Keepsake Greeting Card
              </label>
              <div className="grid grid-cols-2 gap-2">
                {GREETING_CARD_TEMPLATES.map((tmpl) => (
                  <button
                    key={tmpl.id}
                    type="button"
                    onClick={() => {
                      setSelectedCard(tmpl.id)
                      setGiftMessage(tmpl.preview)
                    }}
                    className={`p-2.5 rounded-xl text-left border transition-all ${
                      selectedCard === tmpl.id
                        ? 'border-[#0B2521] bg-[#0B2521] text-white shadow-sm'
                        : 'border-stone-200 bg-stone-50 text-stone-700 hover:border-stone-400'
                    }`}
                  >
                    <span className="font-bold text-[11px] block">{tmpl.name}</span>
                    <span
                      className={`text-[10px] line-clamp-1 ${
                        selectedCard === tmpl.id ? 'text-[#C9A45C]' : 'text-stone-500'
                      }`}
                    >
                      {tmpl.preview}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Delivery Date */}
            <div>
              <label className="font-bold text-[#17233B] block mb-1">
                Preferred Delivery Date (Optional milestone / anniversary date)
              </label>
              <input
                type="date"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:border-[#C9A45C] focus:bg-white focus:outline-hidden text-xs"
              />
            </div>

            {/* Packaging Option */}
            <div className="flex items-center gap-3 p-3 bg-[#FAF7F2] rounded-xl border border-stone-200">
              <input
                type="checkbox"
                id="wrap-check"
                checked={isGiftWrapped}
                onChange={(e) => setIsGiftWrapped(e.target.checked)}
                className="w-4 h-4 text-[#0B2521] accent-[#0B2521] cursor-pointer"
              />
              <label htmlFor="wrap-check" className="cursor-pointer">
                <span className="font-bold text-[#17233B]">
                  Complimentary Luxury Gift Wrapping with Gold Satin Ribbon
                </span>
                <span className="block text-stone-500 text-[11px]">
                  Includes tamper-evident seal and gold foil Nuty Tales crest
                </span>
              </label>
            </div>
          </div>

          {/* Right Live Visual Card Preview */}
          <div className="lg:col-span-5 bg-[#FAF7F2] p-6 border-l border-stone-200 flex flex-col justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-stone-400 block mb-3">
                Live Gift Presentation Preview
              </span>

              {/* Simulated Card */}
              <div className="bg-white rounded-2xl p-5 border border-[#C9A45C]/40 shadow-lg space-y-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-[#C9A45C]/15 rounded-bl-full flex items-start justify-end p-2 text-stone-400 text-xs">
                  ✦
                </div>

                <div className="flex items-center gap-3 border-b border-stone-100 pb-3">
                  <div className="relative w-12 h-12 rounded-xl bg-stone-50 overflow-hidden border border-stone-200 flex-shrink-0">
                    <Image
                      src={product.primaryImage}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-serif text-sm font-bold text-[#17233B]">{product.name}</h4>
                    <span className="text-xs font-mono font-bold text-[#C9A45C]">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Simulated Engraved Box or Card */}
                <div className="p-4 bg-[#FBF8F3] rounded-xl border border-dashed border-[#C9A45C]/60 text-center space-y-2">
                  <div className="text-[10px] uppercase tracking-widest text-[#704B32] font-semibold">
                    Inscribed For
                  </div>
                  <div className="font-serif text-xl font-bold text-[#17233B] italic">
                    {recipientName || 'Your Recipient’s Name'}
                  </div>
                  <div className="w-12 h-0.5 bg-[#C9A45C] mx-auto my-1" />
                  <p className="text-xs text-stone-600 font-serif italic leading-relaxed px-2">
                    &ldquo;{giftMessage || 'Your personal greeting message here'}&rdquo;
                  </p>
                  <div className="text-[9px] text-stone-400 tracking-wider uppercase pt-2">
                    {isGiftWrapped ? '✦ Luxury Gold Ribbon Wrap Included ✦' : ''}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 space-y-2">
              <button
                type="button"
                onClick={handleSaveAndAdd}
                className="w-full py-3.5 bg-[#C9A45C] hover:bg-[#b5924d] text-[#17233B] font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
              >
                {addedSuccess ? (
                  <span>✓ Added to Basket!</span>
                ) : (
                  <>
                    <span>✨</span>
                    <span>Save Customization &amp; Add to Cart</span>
                  </>
                )}
              </button>
              <p className="text-[10px] text-center text-stone-500">
                100% Quality Guaranteed · Safe Food-Grade Packing · FSSAI Certified
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
