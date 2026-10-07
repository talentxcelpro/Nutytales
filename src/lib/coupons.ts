export interface Coupon {
  code: string
  title: string
  description: string
  discountType: 'percentage' | 'fixed' | 'shipping'
  discountValue: number // 10 = 10% or 200 = ₹200
  minOrderValue: number
  badge: string
  categoryScope?: string
  expiresIn?: string
}

export const DYNAMIC_COUPONS: Coupon[] = [
  {
    code: 'NUTY10',
    title: '10% OFF Welcome Perk',
    description: 'Flat 10% off on all harvest packs over ₹999 + Free 100g Kashmiri Walnut sample',
    discountType: 'percentage',
    discountValue: 10,
    minOrderValue: 999,
    badge: 'MOST POPULAR',
    categoryScope: 'all',
  },
  {
    code: 'KASHMIR200',
    title: '₹200 OFF Kashmir Reserve',
    description: 'Instant ₹200 discount on authentic Mamra Badam, Akhrot & Saffron',
    discountType: 'fixed',
    discountValue: 200,
    minOrderValue: 1499,
    badge: 'VALLEY RESERVE',
    categoryScope: 'kashmir',
  },
  {
    code: 'FREESHIP',
    title: 'Free Express Air Courier',
    description: 'Zero shipping charge across all pan-India pin codes',
    discountType: 'shipping',
    discountValue: 0,
    minOrderValue: 499,
    badge: 'ZERO FREIGHT',
  },
  {
    code: 'FESTIVE15',
    title: '15% OFF Connoisseur Box',
    description: 'Save 15% on cart values above ₹2,499 including luxury hampers',
    discountType: 'percentage',
    discountValue: 15,
    minOrderValue: 2499,
    badge: 'FESTIVE PERK',
  },
]

export function calculateDiscount(subtotal: number, couponCode: string | null): number {
  if (!couponCode) return 0
  const coupon = DYNAMIC_COUPONS.find((c) => c.code.toUpperCase() === couponCode.toUpperCase())
  if (!coupon) return 0
  if (subtotal < coupon.minOrderValue) return 0

  if (coupon.discountType === 'percentage') {
    return Math.round((subtotal * coupon.discountValue) / 100)
  }
  if (coupon.discountType === 'fixed') {
    return Math.min(subtotal, coupon.discountValue)
  }
  return 0
}
