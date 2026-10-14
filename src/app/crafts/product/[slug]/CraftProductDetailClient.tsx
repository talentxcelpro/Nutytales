'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { CLOTHING_PRODUCTS, getClothingBySlug, ClothingProduct } from '@/lib/clothing-data'
import { CRAFT_PRODUCTS, getCraftBySlug } from '@/lib/crafts-data'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE } from '@/lib/constants'
import TryWithSIModal from '@/components/crafts/TryWithSIModal'
import SizeGuideModal from '@/components/crafts/SizeGuideModal'
import GarmentViewer3DModal from '@/components/crafts/GarmentViewer3DModal'
import ArtisanPassportModal from '@/components/crafts/ArtisanPassportModal'
import ExpressBuyModal from '@/components/crafts/ExpressBuyModal'
import { useMarketCurrency } from '@/hooks/useMarketCurrency'
import { getRecommendedModelForProduct } from '@/lib/models-data'

export default function CraftProductDetailClient() {
  const { formatCraftPrice, currency, isWesternMarket } = useMarketCurrency()
  const params = useParams()
  const router = useRouter()
  const slug = params?.slug as string

  // Look up clothing catalog first, fallback to crafts data
  const clothingItem = getClothingBySlug(slug)
  const legacyItem = getCraftBySlug(slug)
  const product: ClothingProduct =
    clothingItem ||
    (legacyItem
      ? {
          id: legacyItem.id,
          sku: `NT-CRF-${legacyItem.id}`,
          name: legacyItem.name,
          slug: legacyItem.slug,
          gender: legacyItem.gender,
          primaryCategory: legacyItem.category as any,
          categoryLabel: legacyItem.categoryLabel,
          subCategory: legacyItem.subCategory || legacyItem.categoryLabel,
          shortDesc: legacyItem.shortDesc,
          longDesc: legacyItem.longDesc,
          editorialStory: legacyItem.editorialStory,
          price: legacyItem.price,
          mrp: legacyItem.mrp,
          image: legacyItem.image,
          secondaryImage: legacyItem.additionalImages?.[1] || legacyItem.image,
          detailImage: legacyItem.additionalImages?.[2] || legacyItem.image,
          textureImage: legacyItem.image,
          packagingImage: '/images/crafts-gifting-box.jpg',
          additionalImages: legacyItem.additionalImages || [],
          sizes: legacyItem.sizes,
          colorOptions: legacyItem.colorOptions,
          material: legacyItem.provenance.material,
          craft: legacyItem.provenance.craftTradition,
          warmthRating: legacyItem.warmthRating as any,
          length: 'Long',
          occasion: 'Luxury',
          fit: 'Relaxed Silhouette',
          dimensions: 'Standard Dimensions',
          provenance: legacyItem.provenance as any,
          isNew: false,
          isBestseller: true,
          isFallWinter2026: true,
          is3DSupported: true,
          tryWithSiSupported: legacyItem.tryWithSiSupported,
          stockStatus: legacyItem.stockStatus,
          stockCount: 8,
          tags: legacyItem.tags,
          reviews: [
            {
              id: 'rev-leg-1',
              author: 'Priya Narayanan',
              city: 'Bengaluru',
              rating: 5,
              date: 'Oct 2, 2026',
              comment: 'Exceptional craftsmanship. Woven with pure care.',
              verifiedPurchase: true,
            },
          ],
          pairWithSlug: legacyItem.pairWithSlug,
        }
      : CLOTHING_PRODUCTS[0])

  const [selectedImage, setSelectedImage] = useState(product.image)
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'Free Size')
  const [selectedColorIdx, setSelectedColorIdx] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [addedToast, setAddedToast] = useState(false)
  const [siModalOpen, setSiModalOpen] = useState(false)
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false)
  const [passportModalOpen, setPassportModalOpen] = useState(false)
  const [expressBuyOpen, setExpressBuyOpen] = useState(false)
  const [viewer3DOpen, setViewer3DOpen] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [isZoomed, setIsZoomed] = useState(false)
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 })
  const [activeIdx, setActiveIdx] = useState(0)

  // Reset gallery and variant state when product changes
  useEffect(() => {
    setSelectedImage(product.image)
    setSelectedSize(product.sizes[0] || 'Free Size')
    setSelectedColorIdx(0)
    setActiveIdx(0)
  }, [product.id, product.image])

  // Pincode delivery check state
  const [pincode, setPincode] = useState('')
  const [deliveryEstimate, setDeliveryEstimate] = useState<string | null>(null)
  const [isCheckingPincode, setIsCheckingPincode] = useState(false)

  // Wishlist state
  const [isWishlisted, setIsWishlisted] = useState(() => {
    if (typeof window === 'undefined') return false
    try {
      const list = JSON.parse(localStorage.getItem('nt_wishlist') || '[]')
      return list.includes(product.id)
    } catch {
      return false
    }
  })

  const whatsappPhone = (WHATSAPP_NUMBERS.SUPPORT || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')

  const handleToggleWishlist = () => {
    try {
      const list = JSON.parse(localStorage.getItem('nt_wishlist') || '[]')
      let updated: string[]
      if (list.includes(product.id)) {
        updated = list.filter((id: string) => id !== product.id)
        setIsWishlisted(false)
      } else {
        updated = [...list, product.id]
        setIsWishlisted(true)
      }
      localStorage.setItem('nt_wishlist', JSON.stringify(updated))
      window.dispatchEvent(new Event('nt_wishlist_updated'))
    } catch {
      // ignore
    }
  }

  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault()
    if (!pincode || pincode.length < 6) return
    setIsCheckingPincode(true)
    setTimeout(() => {
      setIsCheckingPincode(false)
      setDeliveryEstimate(`Express Delivery to ${pincode} by Friday, Oct 9 (Complimentary Insured Shipping)`)
    }, 400)
  }

  const handleAddToCart = () => {
    try {
      const existing = JSON.parse(localStorage.getItem('nt_cart') || '[]')
      const colorName = product.colorOptions[selectedColorIdx]?.name || 'Standard'
      const newItem = {
        productId: product.id,
        name: `${product.name} (${colorName})`,
        slug: product.slug,
        mode: 'retail' as const,
        sizeLabel: selectedSize,
        unitPrice: product.price,
        quantity: quantity,
        totalPrice: product.price * quantity,
        image: product.image,
      }
      localStorage.setItem('nt_cart', JSON.stringify([...existing, newItem]))
      window.dispatchEvent(new Event('nt_cart_updated'))
      window.dispatchEvent(new Event('nt_open_cart'))
      setAddedToast(true)
      setTimeout(() => setAddedToast(false), 3500)
    } catch {
      // ignore
    }
  }

  const handleBuyNow = () => {
    handleAddToCart()
    router.push('/checkout')
  }

  // Priority: 1) Swatch 0 hero image, 2) Swatch 1 hero image (if different),
  // 3) Secondary angle, 4) Detail/embroidery, 5) Texture, 6) Additional model views, 7) Process/Artisan, 8) Packaging
  const colorwayImgs = (product.colorOptions?.map((c) => c.image).filter(Boolean) || []) as string[]
  const rawGallery = [
    product.image,
    ...colorwayImgs,
    product.secondaryImage,
    product.detailImage,
    product.textureImage,
    ...(product.additionalImages || []),
  ].filter(Boolean) as string[]

  const galleryImages = Array.from(new Set(rawGallery))

  const handleSelectColor = (idx: number) => {
    setSelectedColorIdx(idx)
    const col = product.colorOptions[idx]
    if (col) {
      const targetImg = col.image || product.image
      setSelectedImage(targetImg)
      const fIdx = galleryImages.indexOf(targetImg)
      if (fIdx >= 0) {
        setActiveIdx(fIdx)
      } else {
        setActiveIdx(0)
      }
    }
  }

  // Pairing item
  const pairedItem = product.pairWithSlug
    ? CLOTHING_PRODUCTS.find((p) => p.slug === product.pairWithSlug)
    : CLOTHING_PRODUCTS.find((p) => p.id !== product.id)

  const youMayAlsoLike = CLOTHING_PRODUCTS.filter(
    (p) => p.id !== product.id && (p.primaryCategory === product.primaryCategory || p.gender === product.gender)
  ).slice(0, 4)

  const featuredModel = getRecommendedModelForProduct(
    product.gender === 'men' ? 'men' : 'women',
    product.categoryLabel || product.name
  )

  return (
    <main className="min-h-screen bg-[#FAF6EE] text-[#17233B] pt-4 sm:pt-6 pb-24">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-12">
        {/* Breadcrumbs */}
        <nav className="text-xs text-[#704B32] flex items-center gap-2">
          <Link href="/" className="hover:text-[#176B68]">Home</Link>
          <span>/</span>
          <Link href="/crafts" className="hover:text-[#176B68]">Crafts &amp; Heritage</Link>
          <span>/</span>
          <Link href={`/crafts/${product.gender === 'men' ? 'men' : 'women'}`} className="hover:text-[#176B68] capitalize">
            {product.gender}
          </Link>
          <span>/</span>
          <span className="text-[#17233B] font-semibold truncate">{product.name}</span>
        </nav>

        {/* —— Product Commercial Two-Column Grid ——————————————————————————————— */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* LEFT: Next-Gen Luxury Image Gallery (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
            
            {/* 1. Left Vertical Thumbnail Rail (Desktop: All 8-10 Angles) */}
            {galleryImages.length > 1 && (
              <div className="hidden md:flex flex-col gap-2.5 w-20 flex-shrink-0 max-h-[640px] overflow-y-auto pr-1 no-scrollbar">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSelectedImage(img)
                      setActiveIdx(idx)
                      const matchCol = product.colorOptions.findIndex((c) => c.image === img)
                      if (matchCol >= 0) setSelectedColorIdx(matchCol)
                    }}
                    onMouseEnter={() => {
                      setSelectedImage(img)
                      setActiveIdx(idx)
                    }}
                    className={`relative w-20 aspect-[3/4] rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === img
                        ? 'border-[#17233B] ring-2 ring-[#C9A45C] scale-102 shadow-md'
                        : 'border-stone-200 opacity-60 hover:opacity-100 hover:border-stone-400'
                    }`}
                  >
                    <Image src={img} alt={`${product.name} angle ${idx + 1}`} fill className="object-cover" />
                    <span className="absolute bottom-1 right-1 bg-black/75 backdrop-blur-xs text-white text-[8px] font-bold px-1 rounded">
                      {idx + 1}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* 2. Main Stage with Interactive HD Loupe Zoom & Quick Controls */}
            <div className="flex-1 space-y-3">
              <div
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect()
                  const x = ((e.clientX - rect.left) / rect.width) * 100
                  const y = ((e.clientY - rect.top) / rect.height) * 100
                  setZoomPos({ x, y })
                }}
                className="relative aspect-[3/4] sm:aspect-[4/5] w-full rounded-2xl overflow-hidden bg-white shadow-sm border border-stone-200 cursor-crosshair group"
              >
                <Image
                  src={selectedImage}
                  alt={product.name}
                  fill
                  priority
                  quality={95}
                  className={`object-cover object-[center_top] transition-transform duration-300 ${
                    isZoomed ? 'scale-140' : 'scale-100'
                  }`}
                  style={
                    isZoomed
                      ? {
                          transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                        }
                      : undefined
                  }
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />

                {/* Top Badges (Origin & GI Certification) */}
                <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10 pointer-events-none">
                  <span className="bg-[#17233B] text-white px-2.5 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider shadow-sm flex items-center gap-1">
                    <span>📍</span> {(product as any).state || product.provenance.origin}
                  </span>
                  {product.provenance.giTagCertified && (
                    <span className="bg-[#C9A45C] text-[#17233B] px-2.5 py-0.5 rounded-md text-[10px] uppercase font-extrabold tracking-wider shadow-sm">
                      GI Certified Handloom
                    </span>
                  )}
                </div>

                {/* Photo Angle Counter & Contextual Badge */}
                <div className="absolute top-4 right-4 z-10 flex flex-col items-end gap-1.5 pointer-events-none">
                  <span className="bg-[#10192A]/85 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider shadow-sm">
                    {activeIdx + 1} of {galleryImages.length} Angles
                  </span>
                  {selectedImage.includes('artisan') && (
                    <span className="bg-amber-950/85 backdrop-blur-md text-amber-200 border border-amber-400/30 px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wide shadow-sm flex items-center gap-1.5">
                      <span>🪡 Verified Loom Weaving</span>
                    </span>
                  )}
                  {(selectedImage.includes('box') || selectedImage.includes('gifting')) && (
                    <span className="bg-[#17233B]/90 backdrop-blur-md text-[#FAF6EE] border border-white/20 px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wide shadow-sm flex items-center gap-1.5">
                      <span>📦 Heirloom Packaging Included</span>
                    </span>
                  )}
                </div>

                {/* Previous & Next Stage Arrows */}
                {galleryImages.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        const prevIdx = (activeIdx - 1 + galleryImages.length) % galleryImages.length
                        setActiveIdx(prevIdx)
                        const prevImg = galleryImages[prevIdx]
                        setSelectedImage(prevImg)
                        const matchCol = product.colorOptions.findIndex((c) => c.image === prevImg)
                        if (matchCol >= 0) setSelectedColorIdx(matchCol)
                      }}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#17233B] text-xl font-bold flex items-center justify-center shadow-md transition-transform active:scale-90 opacity-0 group-hover:opacity-100 z-10"
                      aria-label="Previous photo"
                    >
                      &#8249;
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        const nextIdx = (activeIdx + 1) % galleryImages.length
                        setActiveIdx(nextIdx)
                        const nextImg = galleryImages[nextIdx]
                        setSelectedImage(nextImg)
                        const matchCol = product.colorOptions.findIndex((c) => c.image === nextImg)
                        if (matchCol >= 0) setSelectedColorIdx(matchCol)
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#17233B] text-xl font-bold flex items-center justify-center shadow-md transition-transform active:scale-90 opacity-0 group-hover:opacity-100 z-10"
                      aria-label="Next photo"
                    >
                      &#8250;
                    </button>
                  </>
                )}

                {/* 3D and Fullscreen Zoom Triggers */}
                <div className="absolute bottom-4 right-4 flex items-center gap-2 z-10">
                  <button
                    type="button"
                    onClick={() => setLightboxOpen(true)}
                    className="px-3 py-1.5 rounded-xl bg-white/95 hover:bg-white text-[#17233B] text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-md flex items-center gap-1.5 transition-transform active:scale-95"
                  >
                    <span>🔍</span>
                    <span>HD Zoom</span>
                  </button>
                  {product.is3DSupported && (
                    <button
                      type="button"
                      onClick={() => setViewer3DOpen(true)}
                      className="px-3 py-1.5 rounded-xl bg-[#17233B]/90 hover:bg-[#17233B] text-white text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-md flex items-center gap-1.5 transition-transform active:scale-95"
                    >
                      <span>✨</span>
                      <span>View in 3D</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Mobile Horizontal Thumbnail Rail */}
              {galleryImages.length > 1 && (
                <div className="flex md:hidden gap-2 overflow-x-auto pb-1 no-scrollbar">
                  {galleryImages.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setSelectedImage(img)
                        setActiveIdx(idx)
                        const matchCol = product.colorOptions.findIndex((c) => c.image === img)
                        if (matchCol >= 0) setSelectedColorIdx(matchCol)
                      }}
                      className={`relative w-16 aspect-[3/4] rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${
                        selectedImage === img
                          ? 'border-[#17233B] ring-2 ring-[#C9A45C]'
                          : 'border-stone-200 opacity-60'
                      }`}
                    >
                      <Image src={img} alt="" fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
            </div>

            {/* Editorial Craft Story Quote */}
            {product.editorialStory && (
              <div className="p-6 bg-white rounded-2xl border border-stone-200 text-xs text-[#17233B] space-y-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#704B32] block">
                  The Artisan Narrative
                </span>
                <p className="font-serif italic text-base sm:text-lg leading-relaxed text-[#17233B]/90">
                  &ldquo;{product.editorialStory}&rdquo;
                </p>
              </div>
            )}
          </div>

          {/* RIGHT: Commerce Info & Selectors (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2 border-b border-stone-200 pb-5">
              <div className="flex items-center justify-between text-xs text-[#704B32] font-semibold">
                <span className="uppercase tracking-widest">{product.categoryLabel} · {product.subCategory}</span>
                <span className="bg-stone-200 px-2 py-0.5 rounded text-stone-700 text-[10px] font-bold">
                  {product.warmthRating.split(' ')[0]} Warmth
                </span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#17233B] leading-tight">
                {product.name}
              </h1>

              {/* Review Stars */}
              <div className="flex items-center gap-2 text-xs pt-0.5">
                <span className="text-amber-500 font-bold">★★★★★</span>
                <span className="text-stone-600 font-medium">5.0 ({product.reviews.length} reviews)</span>
                <span className="text-stone-300">•</span>
                <span className="text-[#176B68] font-bold">100% Handcrafted</span>
              </div>

              {/* ASOS / Net-a-Porter Style Model Specifications & 58-Model Agency Drape Access */}
              <div className="p-3 bg-amber-50/70 border border-amber-200/70 rounded-xl flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="relative w-9 h-9 rounded-full overflow-hidden border border-[#C9A45C]/50 flex-shrink-0">
                    <Image src={featuredModel.avatar} alt={featuredModel.name} fill className="object-cover" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-[#17233B] truncate">
                      Modeled by <span className="font-bold">{featuredModel.name}</span> ({featuredModel.city})
                    </p>
                    <p className="text-[11px] text-stone-600 truncate">
                      Height: <strong className="text-[#17233B]">{featuredModel.height}</strong> ({featuredModel.heightCm}cm) · Fit: <strong className="text-[#17233B]">{featuredModel.fitType}</strong>
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSiModalOpen(true)}
                  className="px-2.5 py-1.5 rounded-lg bg-[#17233B] hover:bg-[#176B68] text-white text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-colors shadow-xs flex items-center gap-1 flex-shrink-0"
                >
                  <span>👗</span>
                  <span>Try on 58 Models</span>
                </button>
              </div>
            </div>

            {/* Pricing Box */}
            <div className="p-4 bg-white rounded-2xl border border-stone-200 flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 shadow-xs">
              <div>
                <div className="flex items-baseline gap-2.5 flex-wrap">
                  <span className="font-serif text-3xl font-bold text-[#17233B]">
                    {formatCraftPrice(product.price)}
                  </span>
                  {product.mrp > product.price && (
                    <span className="text-sm text-stone-400 line-through">
                      {formatCraftPrice(product.mrp)}
                    </span>
                  )}
                  {product.mrp > product.price && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Save {formatCraftPrice(product.mrp - product.price)}
                    </span>
                  )}
                  {isWesternMarket && (
                    <span className="text-[10px] font-extrabold text-[#17233B] bg-[#C9A45C] px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Insured Worldwide Delivery &amp; Duties Included
                    </span>
                  )}
                </div>
                <span className="block text-[11px] text-stone-500 mt-1">
                  {isWesternMarket
                    ? `Insured export to ${currency}: Includes priority DHL/FedEx Express international air transport, customs clearance, and verified artisan guild settlement.`
                    : 'Inclusive of all taxes · Free insured courier pan-India · 68% Direct Weaver Remuneration'}
                </span>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 whitespace-nowrap self-start sm:self-auto">
                {product.stockStatus === 'IN_STOCK' ? 'In Stock' : 'Limited'}
              </span>
            </div>

            {/* Colour Variant Selector */}
            {product.colorOptions.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="uppercase font-bold tracking-wider text-[#704B32] flex items-center gap-1.5">
                    <span>Colour:</span>
                    <strong className="text-[#17233B]">
                      {product.colorOptions[selectedColorIdx]?.name || 'Standard'}
                    </strong>
                  </span>
                  <span className="text-[11px] text-stone-500">
                    {product.colorOptions.length} artisanal shade{product.colorOptions.length > 1 ? 's' : ''}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2.5">
                  {product.colorOptions.map((col, idx) => {
                    const isSelected = selectedColorIdx === idx
                    return (
                      <button
                        key={col.name}
                        type="button"
                        onClick={() => handleSelectColor(idx)}
                        className={`group/swatch px-3.5 py-2 rounded-full border-2 flex items-center gap-2.5 transition-all active:scale-95 ${
                          isSelected
                            ? 'bg-white border-[#17233B] shadow-md ring-2 ring-[#C9A45C]'
                            : 'bg-white/80 border-stone-200 hover:border-stone-400 hover:bg-white'
                        }`}
                      >
                        <span
                          className="w-5 h-5 rounded-full border border-black/20 shadow-xs flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0"
                          style={{ backgroundColor: col.hex }}
                        >
                          {isSelected && '✓'}
                        </span>
                        <span className={`text-xs font-semibold ${isSelected ? 'text-[#17233B]' : 'text-stone-600'}`}>
                          {col.name}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Size Selector + Size Guide Trigger */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="uppercase font-bold tracking-wider text-[#704B32]">
                  Select Size
                </span>
                <button
                  type="button"
                  onClick={() => setSizeGuideOpen(true)}
                  className="text-[11px] text-[#176B68] hover:underline font-bold flex items-center gap-1"
                >
                  <span>📏</span>
                  <span>Size &amp; Fit Guide</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-2 text-xs">
                {product.sizes.map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setSelectedSize(sz)}
                    className={`py-2 px-3.5 rounded-xl border font-bold text-center transition-all ${
                      selectedSize === sz
                        ? 'bg-[#17233B] text-white border-[#17233B] shadow-sm'
                        : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-stone-700">Quantity:</span>
              <div className="flex items-center border border-stone-300 rounded-xl bg-white px-2">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-2.5 py-1.5 text-stone-600 font-bold hover:text-black"
                >
                  −
                </button>
                <span className="px-3 font-bold text-stone-800">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-2.5 py-1.5 text-stone-600 font-bold hover:text-black"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons: ADD TO CART, BUY NOW, TRY WITH SI, WISHLIST */}
            <div className="space-y-3 pt-2">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 py-4 bg-[#17233B] hover:bg-[#176B68] text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  <span>🛍️</span>
                  <span>Add to Bag</span>
                </button>

                <button
                  type="button"
                  onClick={() => setExpressBuyOpen(true)}
                  className="flex-1 py-4 bg-[#C9A45C] hover:bg-[#b5924d] text-[#17233B] rounded-xl font-bold text-xs uppercase tracking-wider transition-colors shadow-md flex items-center justify-center gap-1.5"
                >
                  <span>⚡</span>
                  <span>1-Click Buy</span>
                </button>

                <button
                  type="button"
                  onClick={handleToggleWishlist}
                  title="Save to Wishlist"
                  className="w-13 h-13 rounded-xl bg-white hover:bg-stone-50 border border-stone-300 flex items-center justify-center text-lg text-stone-700 transition-colors shadow-xs"
                >
                  {isWishlisted ? '♥' : '♡'}
                </button>
              </div>

              {/* Artisan GI Passport Button */}
              <button
                type="button"
                onClick={() => setPassportModalOpen(true)}
                className="w-full py-3 bg-white hover:bg-stone-50 text-[#17233B] rounded-xl font-bold text-xs uppercase tracking-wider transition-colors border border-stone-300 flex items-center justify-center gap-2 shadow-xs"
              >
                <span>📜</span>
                <span>Inspect Digital GI &amp; Artisan Lineage Passport</span>
              </button>

              {product.tryWithSiSupported && (
                <button
                  type="button"
                  onClick={() => setSiModalOpen(true)}
                  className="w-full py-3.5 bg-gradient-to-r from-[#17233B] to-[#176B68] text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-2 hover:opacity-95"
                >
                  <span>✨</span>
                  <span>Try with SI — Virtual Drape Simulation</span>
                </button>
              )}

              {addedToast && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold text-center flex items-center justify-between">
                  <span>✓ Added to Shopping Bag!</span>
                  <Link href="/cart" className="underline uppercase font-bold">
                    View Bag →
                  </Link>
                </div>
              )}
            </div>

            {/* Pincode Delivery Check */}
            <div className="p-4 bg-white rounded-2xl border border-stone-200 space-y-2 text-xs">
              <span className="font-bold text-[#17233B] block">Check Delivery Time:</span>
              <form onSubmit={handleCheckPincode} className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 6-digit Pincode"
                  className="flex-1 px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-1 focus:ring-[#176B68]"
                />
                <button
                  type="submit"
                  disabled={isCheckingPincode || pincode.length < 6}
                  className="px-4 py-2 bg-[#17233B] text-white rounded-xl font-bold text-xs uppercase tracking-wider disabled:opacity-50"
                >
                  {isCheckingPincode ? 'Checking...' : 'Check'}
                </button>
              </form>
              {deliveryEstimate && (
                <p className="text-[11px] text-emerald-700 font-medium pt-1">
                  ✓ {deliveryEstimate}
                </p>
              )}
            </div>

            {/* Product Specifications Table */}
            <div className="p-5 bg-white rounded-2xl border border-stone-200 space-y-3 text-xs">
              <span className="font-serif font-bold text-sm text-[#17233B] block border-b border-stone-100 pb-2">
                Product Details &amp; Specifications
              </span>
              <dl className="grid grid-cols-2 gap-y-2.5 gap-x-4">
                <div>
                  <dt className="text-[10px] uppercase font-bold text-stone-400">Material</dt>
                  <dd className="font-medium text-stone-800">{product.material}</dd>
                </div>
                <div>
                  <dt className="text-[10px] uppercase font-bold text-stone-400">Craft Technique</dt>
                  <dd className="font-medium text-stone-800">{product.craft}</dd>
                </div>
                <div>
                  <dt className="text-[10px] uppercase font-bold text-stone-400">Origin</dt>
                  <dd className="font-medium text-stone-800">{product.provenance.origin}</dd>
                </div>
                <div>
                  <dt className="text-[10px] uppercase font-bold text-stone-400">Warmth Rating</dt>
                  <dd className="font-medium text-stone-800">{product.warmthRating}</dd>
                </div>
                <div>
                  <dt className="text-[10px] uppercase font-bold text-stone-400">Fit Silhouette</dt>
                  <dd className="font-medium text-stone-800">{product.fit}</dd>
                </div>
                <div>
                  <dt className="text-[10px] uppercase font-bold text-stone-400">Occasion</dt>
                  <dd className="font-medium text-stone-800">{product.occasion}</dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-[10px] uppercase font-bold text-stone-400">Garment Dimensions</dt>
                  <dd className="font-medium text-stone-800">{product.dimensions}</dd>
                </div>
                <div className="col-span-2 pt-2 border-t border-stone-100">
                  <dt className="text-[10px] uppercase font-bold text-stone-400">Care &amp; Storage</dt>
                  <dd className="text-stone-600 leading-relaxed">{product.provenance.care}</dd>
                </div>
              </dl>
            </div>

            {/* Authenticity & Provenance Card */}
            <div className="p-5 bg-white rounded-2xl border border-[#C9A45C]/40 space-y-3 text-xs shadow-xs">
              <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                <span className="font-serif font-bold text-sm text-[#17233B]">
                  ✨ Authenticity &amp; GI Provenance
                </span>
                {product.provenance.giTagCertified && (
                  <span className="text-[9px] font-extrabold uppercase bg-[#C9A45C] text-[#17233B] px-2 py-0.5 rounded">
                    GI Tag Certified
                  </span>
                )}
              </div>
              <p className="text-stone-600 leading-relaxed text-[11px]">
                {product.longDesc}
              </p>
              {product.provenance.giCertificateNo && (
                <div className="p-2.5 bg-[#FAF6EE] rounded-xl font-mono text-[10px] text-[#176B68] font-bold">
                  Official GI Registry Code: {product.provenance.giCertificateNo}
                </div>
              )}
            </div>

            {/* Complete the Look Pairing */}
            {pairedItem && (
              <div className="p-4 bg-[#F0EBE1] rounded-2xl border border-stone-200 space-y-2.5 text-xs">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#704B32] block">
                  Complete the Look Pairing
                </span>
                <div className="flex items-center gap-3">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-white flex-shrink-0">
                    <Image src={pairedItem.image} alt={pairedItem.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif font-bold text-xs text-[#17233B] truncate">{pairedItem.name}</h4>
                    <p className="text-[11px] text-stone-500">{pairedItem.craft}</p>
                    <p className="text-xs font-bold text-[#176B68]">{formatCraftPrice(pairedItem.price)}</p>
                  </div>
                  <Link
                    href={`/crafts/product/${pairedItem.slug}`}
                    className="px-3.5 py-2 bg-white hover:bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold text-[#17233B]"
                  >
                    View
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── You May Also Like ──────────────────────────────────────────────── */}
        <section className="pt-12 border-t border-stone-200 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-2xl font-bold text-[#17233B]">
              You May Also Like
            </h3>
            <Link href="/crafts" className="text-xs font-bold text-[#176B68] hover:underline uppercase">
              View All Collection →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {youMayAlsoLike.map((p) => (
              <div key={p.id} className="group bg-white rounded-2xl overflow-hidden border border-stone-200 p-3 flex flex-col justify-between">
                <div className="relative aspect-[3/4] w-full bg-[#FAF6EE] rounded-xl overflow-hidden mb-2">
                  <Image src={p.image} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-serif font-bold text-xs text-[#17233B] line-clamp-1">{p.name}</h4>
                  <p className="text-[10px] text-stone-500">{p.craft}</p>
                  <p className="font-serif font-bold text-xs text-[#17233B]">{formatCraftPrice(p.price)}</p>
                </div>
                <Link
                  href={`/crafts/product/${p.slug}`}
                  className="mt-2 block w-full py-1.5 text-center bg-stone-100 hover:bg-[#17233B] hover:text-white rounded-lg text-[10px] font-bold uppercase transition-colors"
                >
                  View Garment
                </Link>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Modals */}
      <ArtisanPassportModal
        product={product}
        isOpen={passportModalOpen}
        onClose={() => setPassportModalOpen(false)}
      />

      <ExpressBuyModal
        product={product}
        isOpen={expressBuyOpen}
        onClose={() => setExpressBuyOpen(false)}
      />

      <SizeGuideModal
        isOpen={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
      />

      <GarmentViewer3DModal
        product={product}
        isOpen={viewer3DOpen}
        onClose={() => setViewer3DOpen(false)}
        onAddToCart={handleAddToCart}
      />

      <TryWithSIModal
        isOpen={siModalOpen}
        onClose={() => setSiModalOpen(false)}
        initialProduct={product}
        initialColorIdx={selectedColorIdx}
        initialModelId={featuredModel.id}
      />

      {/* Fullscreen HD Lightbox Modal */}
      {lightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-lg flex flex-col items-center justify-between p-4 sm:p-8 animate-fadeIn"
          onClick={() => setLightboxOpen(false)}
        >
          <div className="w-full flex items-center justify-between text-white/80 max-w-6xl z-10" onClick={(e) => e.stopPropagation()}>
            <div>
              <p className="text-xs uppercase tracking-widest text-[#C9A45C] font-semibold">{product.craft}</p>
              <h4 className="font-serif text-lg text-white font-bold">{product.name}</h4>
            </div>
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white text-xl flex items-center justify-center transition-colors"
              aria-label="Close Fullscreen View"
            >
              ✕
            </button>
          </div>

          <div
            className="relative w-full max-w-4xl h-[75vh] my-auto flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={selectedImage}
              alt={product.name}
              fill
              className="object-contain"
              sizes="100vw"
              priority
              quality={95}
            />
          </div>

          <p className="text-white/60 text-xs text-center" onClick={(e) => e.stopPropagation()}>
            HD Uncropped Studio Presentation · Click anywhere outside or ✕ to exit
          </p>
        </div>
      )}
    </main>
  )
}