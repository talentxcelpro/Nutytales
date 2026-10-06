'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { CRAFT_PRODUCTS, getCraftBySlug } from '@/lib/crafts-data'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE } from '@/lib/constants'
import TryWithSIModal from '@/components/crafts/TryWithSIModal'
import ProductViewer3D, { ModelType } from '@/components/3d/ProductViewer3D'

export default function CraftProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params?.slug as string

  const product = getCraftBySlug(slug) || CRAFT_PRODUCTS[0]

  const [selectedImage, setSelectedImage] = useState(product.image)
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'Free Size')
  const [selectedColorIdx, setSelectedColorIdx] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [addedToast, setAddedToast] = useState(false)
  const [siModalOpen, setSiModalOpen] = useState(false)
  const [viewer3DOpen, setViewer3DOpen] = useState(false)

  const is3DSupported =
    product.category === 'home-heritage' ||
    product.category === 'heritage-gifting' ||
    product.slug.includes('box') ||
    product.slug.includes('walnut') ||
    product.slug.includes('papier')

  const craftModelType: ModelType = product.slug.includes('walnut')
    ? 'walnut-chest'
    : product.slug.includes('papier')
    ? 'papier-mache'
    : 'gift-box'

  const whatsappPhone = (WHATSAPP_NUMBERS.SUPPORT || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')

  // Find complementary pair
  const pairedProduct = product.pairWithSlug
    ? CRAFT_PRODUCTS.find((p) => p.slug === product.pairWithSlug)
    : CRAFT_PRODUCTS.find((p) => p.id !== product.id)

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
      setAddedToast(true)
      setTimeout(() => setAddedToast(false), 3500)
    } catch {
      // ignore
    }
  }

  const galleryImages = [
    product.image,
    ...(product.additionalImages || []),
  ].filter((img, idx, arr) => arr.indexOf(img) === idx)

  return (
    <main className="min-h-screen bg-[#FAF6EE] text-[#17233B] pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="text-xs text-[#704B32] mb-8 flex items-center gap-2">
          <Link href="/" className="hover:text-[#176B68]">Home</Link>
          <span>/</span>
          <Link href="/crafts" className="hover:text-[#176B68]">Crafts & Heritage</Link>
          <span>/</span>
          <Link href="/crafts/kashmir" className="hover:text-[#176B68]">Kashmir</Link>
          <span>/</span>
          <span className="text-[#17233B] font-semibold truncate">{product.name}</span>
        </nav>

        {/* Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left: Gallery (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Main Featured Image */}
            <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-stone-100 shadow-md border border-stone-200">
              <Image
                src={selectedImage}
                alt={product.name}
                fill
                priority
                className="object-cover transition-all duration-300"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <span className="bg-[#17233B]/90 backdrop-blur-sm text-white px-3 py-1 rounded text-xs uppercase font-bold tracking-wider">
                  {product.provenance.craftTradition}
                </span>
                {product.provenance.giTagCertified && (
                  <span className="bg-[#C9A45C] text-[#17233B] px-2.5 py-0.5 rounded text-[10px] uppercase font-extrabold tracking-wider shadow-sm">
                    GI Tag Certified
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnails */}
            {galleryImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`relative w-20 h-24 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${
                      selectedImage === img
                        ? 'border-[#176B68] ring-2 ring-[#176B68]/30 scale-105'
                        : 'border-stone-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt={`${product.name} preview ${idx}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Editorial Story Callout */}
            <div className="p-6 bg-[#F0EBE1] rounded-2xl border border-stone-200 text-xs text-[#17233B] space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#704B32] block">
                The Artisan Story
              </span>
              <p className="font-serif italic text-base sm:text-lg leading-relaxed text-[#17233B]/90">
                &ldquo;{product.editorialStory}&rdquo;
              </p>
            </div>
          </div>

          {/* Right: Info & Actions (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="flex items-center justify-between text-xs text-[#704B32] font-semibold mb-1">
                <span className="uppercase tracking-widest">{product.categoryLabel}</span>
                <span className="bg-stone-200 px-2 py-0.5 rounded text-stone-700">
                  {product.warmthRating}
                </span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#17233B] leading-tight">
                {product.name}
              </h1>
              <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                {product.shortDesc}
              </p>
            </div>

            {/* Pricing */}
            <div className="p-4 bg-white rounded-xl border border-stone-200 flex items-baseline justify-between shadow-sm">
              <div>
                <span className="text-3xl font-bold text-[#17233B]">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.mrp > product.price && (
                  <span className="ml-3 text-sm text-stone-400 line-through">
                    ₹{product.mrp.toLocaleString('en-IN')}
                  </span>
                )}
                <span className="block text-[11px] text-stone-500 mt-0.5">
                  Inclusive of all taxes · Complimentary insurance & pan-India delivery
                </span>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                Ready to Dispatch
              </span>
            </div>

            {/* "TRY WITH SI" Callout Button */}
            {product.tryWithSiSupported && (
              <div className="p-4 rounded-xl bg-gradient-to-r from-[#17233B] to-[#176B68] text-white space-y-3 shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base">✨</span>
                    <span className="font-serif font-bold text-sm">Virtual Drape with SI</span>
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#C9A45C]">
                    Instant Preview
                  </span>
                </div>
                <p className="text-[11px] text-stone-200 font-light leading-relaxed">
                  Upload your photo or choose an avatar model to see how this {product.categoryLabel.toLowerCase()} drapes on you before ordering.
                </p>
                <button
                  onClick={() => setSiModalOpen(true)}
                  className="w-full py-2.5 bg-[#C9A45C] hover:bg-[#b5924d] text-[#17233B] rounded-lg font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
                >
                  Launch Try with SI →
                </button>
              </div>
            )}

            {/* 3D Craft & Packaging Inspection Callout */}
            {is3DSupported && (
              <div className="p-4 rounded-xl bg-white border border-[#C9A45C]/50 space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🏛️</span>
                    <span className="font-serif font-bold text-sm text-[#17233B]">3D Artisan Inspection</span>
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#176B68] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    360° PBR
                  </span>
                </div>
                <p className="text-[11px] text-stone-600 font-light leading-relaxed">
                  Inspect the handcrafted woodwork, brass latches, or lacquered gold leaf detailing from every angle in real-time 3D.
                </p>
                <button
                  onClick={() => setViewer3DOpen(true)}
                  className="w-full py-2.5 bg-[#17233B] hover:bg-[#176B68] text-white rounded-lg font-bold text-xs uppercase tracking-wider transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  <span>Inspect in 3D View →</span>
                </button>
              </div>
            )}

            {/* Colour Variant Selector */}
            {product.colorOptions.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs uppercase font-bold tracking-wider text-[#704B32] block">
                  Select Shade: {product.colorOptions[selectedColorIdx]?.name}
                </span>
                <div className="flex items-center gap-3">
                  {product.colorOptions.map((col, idx) => (
                    <button
                      key={col.name}
                      onClick={() => setSelectedColorIdx(idx)}
                      className={`w-9 h-9 rounded-full border-2 transition-all ${
                        selectedColorIdx === idx
                          ? 'scale-110 border-[#17233B] shadow-md ring-2 ring-[#C9A45C]'
                          : 'border-white hover:scale-105'
                      }`}
                      style={{ backgroundColor: col.hex }}
                      title={col.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="uppercase font-bold tracking-wider text-[#704B32]">
                  Select Dimension / Fit
                </span>
                <span className="text-stone-500 font-light">Custom tailoring available</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {product.sizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`py-2.5 px-3 rounded-lg border font-semibold text-center transition-all ${
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

            {/* Quantity & Add to Cart */}
            <div className="space-y-3 pt-2">
              <div className="flex gap-3">
                <div className="flex items-center border border-stone-300 rounded-xl bg-white px-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="text-stone-500 hover:text-stone-900 text-sm font-bold px-2 py-2"
                  >
                    −
                  </button>
                  <span className="px-3 text-xs font-bold text-[#17233B]">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="text-stone-500 hover:text-stone-900 text-sm font-bold px-2 py-2"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3.5 bg-[#17233B] hover:bg-[#176B68] text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  <span>🛒</span>
                  <span>Add to Shopping Basket</span>
                </button>
              </div>

              {addedToast && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold text-center flex items-center justify-between animate-fadeIn">
                  <span>✓ Added to Basket!</span>
                  <button
                    onClick={() => router.push('/cart')}
                    className="underline uppercase font-bold"
                  >
                    View Basket →
                  </button>
                </div>
              )}

              {/* WhatsApp Concierge */}
              <a
                href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
                  `Hello Nutty Tales! I would like to inquire about ${product.name} (₹${product.price}). Is this in stock?`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-white hover:bg-stone-50 border border-stone-300 text-[#17233B] rounded-xl font-semibold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <span>💬</span>
                <span>Inquire on WhatsApp (+91 9717161809)</span>
              </a>
            </div>

            {/* ── Verified Provenance & Authenticity System ─────────────────── */}
            <div className="p-5 bg-white rounded-2xl border border-[#C9A45C]/40 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <span className="font-serif font-bold text-sm text-[#17233B] flex items-center gap-2">
                  <span className="text-[#C9A45C]">✦</span> Verified Provenance & Heritage
                </span>
                {product.provenance.giTagCertified && (
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#17233B] bg-[#C9A45C] px-2 py-0.5 rounded">
                    GI Certified
                  </span>
                )}
              </div>

              <dl className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs">
                <div>
                  <dt className="text-[10px] uppercase tracking-wider text-stone-400 font-bold">Origin</dt>
                  <dd className="font-semibold text-stone-800 mt-0.5">{product.provenance.origin}</dd>
                </div>
                <div>
                  <dt className="text-[10px] uppercase tracking-wider text-stone-400 font-bold">Artisan Guild</dt>
                  <dd className="font-semibold text-stone-800 mt-0.5">{product.provenance.artisanGroup}</dd>
                </div>
                <div>
                  <dt className="text-[10px] uppercase tracking-wider text-stone-400 font-bold">Technique</dt>
                  <dd className="font-semibold text-stone-800 mt-0.5">{product.provenance.technique}</dd>
                </div>
                <div>
                  <dt className="text-[10px] uppercase tracking-wider text-stone-400 font-bold">Handcraft Time</dt>
                  <dd className="font-semibold text-stone-800 mt-0.5">{product.provenance.artisanHours} Hours</dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-[10px] uppercase tracking-wider text-stone-400 font-bold">Material Composition</dt>
                  <dd className="font-semibold text-stone-800 mt-0.5">{product.provenance.material}</dd>
                </div>
                {product.provenance.giCertificateNo && (
                  <div className="col-span-2">
                    <dt className="text-[10px] uppercase tracking-wider text-stone-400 font-bold">J&K GI Certificate</dt>
                    <dd className="font-mono text-xs text-[#176B68] font-bold mt-0.5">{product.provenance.giCertificateNo}</dd>
                  </div>
                )}
                <div className="col-span-2 pt-2 border-t border-stone-100">
                  <dt className="text-[10px] uppercase tracking-wider text-stone-400 font-bold">Care & Preservation</dt>
                  <dd className="text-stone-600 font-light mt-0.5 leading-relaxed">{product.provenance.care}</dd>
                </div>
              </dl>
            </div>

            {/* Complete the Look Pairing */}
            {pairedProduct && (
              <div className="p-4 bg-[#F0EBE1] rounded-2xl border border-stone-200 space-y-3">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#704B32] block">
                  Complete the Look Pairing
                </span>
                <div className="flex items-center gap-3">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-white flex-shrink-0">
                    <Image src={pairedProduct.image} alt={pairedProduct.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif font-bold text-xs text-[#17233B] truncate">
                      {pairedProduct.name}
                    </h4>
                    <p className="text-[11px] text-stone-500">{pairedProduct.provenance.craftTradition}</p>
                    <p className="text-xs font-bold text-[#176B68] mt-0.5">
                      ₹{pairedProduct.price.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <Link
                    href={`/crafts/product/${pairedProduct.slug}`}
                    className="px-3 py-2 bg-white hover:bg-stone-50 border border-stone-300 rounded-lg text-xs font-bold text-[#17233B]"
                  >
                    View
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Global Try with SI Modal */}
      <TryWithSIModal
        isOpen={siModalOpen}
        onClose={() => setSiModalOpen(false)}
        initialProduct={product}
      />

      {/* 3D Craft & Keepsake Viewer */}
      <ProductViewer3D
        isOpen={viewer3DOpen}
        onClose={() => setViewer3DOpen(false)}
        productName={product.name}
        modelType={craftModelType}
        price={product.price}
        onAddToCart={handleAddToCart}
      />
    </main>
  )
}
