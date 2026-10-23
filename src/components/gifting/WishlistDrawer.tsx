'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useGiftingStore } from '@/hooks/useGiftingStore'
import { GIFTING_PRODUCTS } from '@/lib/gifting-marketplace-data'

interface WishlistDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export default function WishlistDrawer({ isOpen, onClose }: WishlistDrawerProps) {
  const { wishlist, toggleWishlist, addToCart } = useGiftingStore()

  if (!isOpen) return null

  const wishlistProducts = GIFTING_PRODUCTS.filter((p) => wishlist.includes(p.slug))

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="fixed inset-0 bg-[#10192A]/60 backdrop-blur-xs" onClick={onClose} />

      <div className="relative w-full max-w-md bg-white shadow-2xl flex flex-col h-full z-10 border-l border-stone-200 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-[#FAF7F2]">
          <div className="flex items-center gap-2">
            <span className="text-xl">❤️</span>
            <div>
              <h3 className="font-serif text-lg font-bold text-[#17233B]">Saved Wishlist</h3>
              <p className="text-[11px] text-stone-500">
                {wishlistProducts.length} {wishlistProducts.length === 1 ? 'gift' : 'gifts'} saved
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-700 flex items-center justify-center text-xs font-bold"
          >
            ✕
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {wishlistProducts.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <span className="text-4xl">🎁</span>
              <h4 className="font-serif text-base font-bold text-[#17233B]">Your wishlist is empty</h4>
              <p className="text-xs text-stone-500 max-w-xs">
                Save your favorite gifts, hampers, and personalized keepsakes for upcoming birthdays and festivals.
              </p>
              <button
                onClick={onClose}
                className="px-5 py-2.5 bg-[#C9A45C] text-[#17233B] font-bold text-xs uppercase tracking-wider rounded-xl mt-2"
              >
                Browse Gifts
              </button>
            </div>
          ) : (
            wishlistProducts.map((p) => (
              <div
                key={p.id}
                className="bg-[#FAF7F2] rounded-2xl p-3 border border-stone-200 flex gap-3 items-center"
              >
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-white border border-stone-200 flex-shrink-0">
                  <Image src={p.primaryImage} alt={p.name} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="text-xs font-bold text-[#17233B] truncate">{p.name}</h5>
                  <span className="text-[11px] text-stone-500 block">{p.categoryName}</span>
                  <span className="font-mono font-bold text-xs text-[#0B2521]">
                    ₹{p.price.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex flex-col gap-1.5 items-end">
                  <button
                    onClick={() => toggleWishlist(p.slug)}
                    className="text-stone-400 hover:text-rose-600 text-xs p-1"
                    title="Remove from wishlist"
                  >
                    🗑
                  </button>
                  <button
                    onClick={() => {
                      addToCart({
                        productId: p.id,
                        name: p.name,
                        slug: p.slug,
                        price: p.price,
                        quantity: 1,
                        image: p.primaryImage,
                      })
                      toggleWishlist(p.slug)
                    }}
                    className="px-3 py-1 bg-[#C9A45C] hover:bg-[#b5924d] text-[#17233B] font-bold text-[10px] uppercase tracking-wider rounded-lg shadow-xs"
                  >
                    Move to Cart
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
