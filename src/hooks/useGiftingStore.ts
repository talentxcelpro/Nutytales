'use client'

import { useState, useEffect, useCallback } from 'react'

export interface GiftingCartItem {
  productId: string
  name: string
  slug: string
  price: number
  unitPrice: number
  quantity: number
  image?: string
  variant?: string
  recipientName?: string
  giftMessage?: string
  deliveryDate?: string
  isGiftWrapped?: boolean
  totalPrice?: number
}

// ── Indian Major City PIN Map for Instant Feedback ──────────────────────────
export const PIN_LOCATION_DATABASE: Record<string, { city: string; state: string; days: number }> = {
  '110001': { city: 'Central Delhi', state: 'Delhi', days: 2 },
  '110020': { city: 'South Delhi', state: 'Delhi', days: 2 },
  '201301': { city: 'Noida', state: 'Uttar Pradesh', days: 1 },
  '201309': { city: 'Greater Noida', state: 'Uttar Pradesh', days: 1 },
  '122001': { city: 'Gurugram', state: 'Haryana', days: 1 },
  '400001': { city: 'South Mumbai', state: 'Maharashtra', days: 2 },
  '400050': { city: 'Bandra / Mumbai', state: 'Maharashtra', days: 2 },
  '560001': { city: 'Bengaluru Central', state: 'Karnataka', days: 3 },
  '560034': { city: 'Koramangala, Bengaluru', state: 'Karnataka', days: 3 },
  '500081': { city: 'Hitec City, Hyderabad', state: 'Telangana', days: 3 },
  '600001': { city: 'Chennai Central', state: 'Tamil Nadu', days: 3 },
  '700001': { city: 'Kolkata Central', state: 'West Bengal', days: 3 },
  '190001': { city: 'Srinagar Old City', state: 'Jammu & Kashmir', days: 1 },
  '190008': { city: 'Rajbagh, Srinagar', state: 'Jammu & Kashmir', days: 1 },
  '800001': { city: 'Patna Central', state: 'Bihar', days: 2 },
  '380001': { city: 'Ahmedabad', state: 'Gujarat', days: 2 },
  '302001': { city: 'Jaipur', state: 'Rajasthan', days: 2 },
  '411001': { city: 'Pune Central', state: 'Maharashtra', days: 2 },
}

export function useGiftingStore() {
  const [wishlist, setWishlist] = useState<string[]>([])
  const [deliveryPincode, setDeliveryPincode] = useState<string>('110001')
  const [deliveryLocation, setDeliveryLocation] = useState<string>('Delhi NCR')
  const [cartCount, setCartCount] = useState<number>(0)
  const [isReady, setIsReady] = useState(false)

  // Load from local storage
  const syncStore = useCallback(() => {
    try {
      // Wishlist
      const storedWishlist = localStorage.getItem('nt_wishlist')
      if (storedWishlist) {
        setWishlist(JSON.parse(storedWishlist))
      }

      // PIN code
      const storedPin = localStorage.getItem('nt_delivery_pin')
      if (storedPin) {
        setDeliveryPincode(storedPin)
        const matched = PIN_LOCATION_DATABASE[storedPin]
        if (matched) {
          setDeliveryLocation(`${matched.city}, ${matched.state}`)
        } else {
          setDeliveryLocation(`PIN ${storedPin}`)
        }
      }

      // Cart count
      const storedCart = localStorage.getItem('nt_cart')
      if (storedCart) {
        const parsed = JSON.parse(storedCart)
        const totalQty = Array.isArray(parsed)
          ? parsed.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0)
          : 0
        setCartCount(totalQty)
      } else {
        setCartCount(0)
      }
    } catch {
      // Fallback
    }
  }, [])

  useEffect(() => {
    syncStore()
    setIsReady(true)

    const handleCartUpdate = () => syncStore()
    const handleWishlistUpdate = () => syncStore()
    const handlePinUpdate = () => syncStore()

    window.addEventListener('nt_cart_updated', handleCartUpdate)
    window.addEventListener('nt_wishlist_updated', handleWishlistUpdate)
    window.addEventListener('nt_pin_updated', handlePinUpdate)

    return () => {
      window.removeEventListener('nt_cart_updated', handleCartUpdate)
      window.removeEventListener('nt_wishlist_updated', handleWishlistUpdate)
      window.removeEventListener('nt_pin_updated', handlePinUpdate)
    }
  }, [syncStore])

  const toggleWishlist = (slug: string) => {
    try {
      const current = [...wishlist]
      const index = current.indexOf(slug)
      let updated: string[] = []
      if (index >= 0) {
        updated = current.filter((s) => s !== slug)
      } else {
        updated = [...current, slug]
      }
      setWishlist(updated)
      localStorage.setItem('nt_wishlist', JSON.stringify(updated))
      window.dispatchEvent(new Event('nt_wishlist_updated'))
      return index < 0 // true if added, false if removed
    } catch {
      return false
    }
  }

  const setPincode = (pin: string) => {
    const clean = pin.trim().replace(/\D/g, '').slice(0, 6)
    setDeliveryPincode(clean)
    localStorage.setItem('nt_delivery_pin', clean)
    const matched = PIN_LOCATION_DATABASE[clean]
    if (matched) {
      setDeliveryLocation(`${matched.city}, ${matched.state}`)
    } else if (clean.length === 6) {
      setDeliveryLocation(`PIN ${clean}`)
    }
    window.dispatchEvent(new Event('nt_pin_updated'))
  }

  const openCart = () => {
    window.dispatchEvent(new Event('nt_open_cart'))
  }

  const addToCart = (item: {
    productId: string
    name: string
    slug: string
    price: number
    quantity?: number
    image?: string
    variant?: string
    recipientName?: string
    giftMessage?: string
    deliveryDate?: string
    isGiftWrapped?: boolean
  }) => {
    try {
      const stored = localStorage.getItem('nt_cart')
      const currentCart: any[] = stored ? JSON.parse(stored) : []
      const quantityToAdd = item.quantity || 1

      // Match item
      const existingIdx = currentCart.findIndex(
        (ci: any) =>
          ci.productId === item.productId &&
          ci.variant === item.variant &&
          ci.recipientName === item.recipientName
      )

      if (existingIdx >= 0) {
        currentCart[existingIdx].quantity += quantityToAdd
        currentCart[existingIdx].totalPrice =
          currentCart[existingIdx].quantity * (currentCart[existingIdx].unitPrice || item.price)
      } else {
        currentCart.push({
          productId: item.productId,
          name: item.name,
          slug: item.slug,
          unitPrice: item.price,
          price: item.price,
          quantity: quantityToAdd,
          totalPrice: item.price * quantityToAdd,
          image: item.image,
          variant: item.variant || 'Standard Pack',
          recipientName: item.recipientName || '',
          giftMessage: item.giftMessage || '',
          deliveryDate: item.deliveryDate || '',
          isGiftWrapped: !!item.isGiftWrapped,
        })
      }

      localStorage.setItem('nt_cart', JSON.stringify(currentCart))
      window.dispatchEvent(new Event('nt_cart_updated'))
      openCart()
      return true
    } catch {
      return false
    }
  }

  return {
    wishlist,
    toggleWishlist,
    isInWishlist: (slug: string) => wishlist.includes(slug),
    deliveryPincode,
    deliveryLocation,
    setPincode,
    cartCount,
    openCart,
    addToCart,
    isReady,
  }
}
