'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { CRAFT_PRODUCTS, CraftProduct } from '@/lib/crafts-data'

type ModelGender = 'women' | 'men'
type GarmentType = 'pherans' | 'shawls' | 'stoles' | 'jackets-coats' | 'winter-wear'

const AVATAR_MODELS = {
  women: [
    { id: 'w1', name: 'Alia (Alpine Light)', image: '/images/crafts-shawls.jpg' },
    { id: 'w2', name: 'Zoya (Evening Elegance)', image: '/images/crafts-jackets.jpg' },
    { id: 'w3', name: 'Tara (Classic Ivory)', image: '/images/crafts-stoles.jpg' },
  ],
  men: [
    { id: 'm1', name: 'Faizan (Himalayan Snow)', image: '/images/crafts-pherans.jpg' },
    { id: 'm2', name: 'Kabir (Executive Winter)', image: '/images/crafts-winterwear.jpg' },
  ],
}

export default function TryWithSIPage() {
  const [activeTab, setActiveTab] = useState<'tryon' | 'advisor'>('tryon')
  const [selectedGender, setSelectedGender] = useState<ModelGender>('women')
  const [selectedGarmentType, setSelectedGarmentType] = useState<GarmentType>('pherans')
  const [currentProduct, setCurrentProduct] = useState<CraftProduct>(CRAFT_PRODUCTS[3]) // Royal Silk Velvet Pheran
  const [selectedColorIdx, setSelectedColorIdx] = useState(0)
  const [userPhoto, setUserPhoto] = useState<string | null>(null)
  const [activeModelIdx, setActiveModelIdx] = useState(0)
  const [zoomLevel, setZoomLevel] = useState(false)
  const [addedToast, setAddedToast] = useState(false)

  // Style Advisor state
  const [advisorQuery, setAdvisorQuery] = useState('')
  const [advisorResponse, setAdvisorResponse] = useState<{
    text: string
    recommendedProduct: CraftProduct
    pairingProduct?: CraftProduct
    tempRating: string
  } | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const categoryProducts = CRAFT_PRODUCTS.filter(
    (p) => p.category === selectedGarmentType && (p.gender === selectedGender || p.gender === 'unisex')
  )

  const complementaryProduct = currentProduct.pairWithSlug
    ? CRAFT_PRODUCTS.find((p) => p.slug === currentProduct.pairWithSlug)
    : CRAFT_PRODUCTS.find((p) => p.category === 'stoles' && p.id !== currentProduct.id)

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (ev) => {
        setUserPhoto(ev.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAddToCart = (includePairing = false) => {
    try {
      const existing = JSON.parse(localStorage.getItem('nt_cart') || '[]')
      const itemsToAdd = [
        {
          productId: currentProduct.id,
          name: `${currentProduct.name} (${currentProduct.colorOptions[selectedColorIdx]?.name || 'Standard'})`,
          slug: currentProduct.slug,
          mode: 'retail' as const,
          sizeLabel: currentProduct.sizes[0] || 'Free Size',
          unitPrice: currentProduct.price,
          quantity: 1,
          totalPrice: currentProduct.price,
          image: currentProduct.image,
        },
      ]

      if (includePairing && complementaryProduct) {
        itemsToAdd.push({
          productId: complementaryProduct.id,
          name: `${complementaryProduct.name} (Paired)`,
          slug: complementaryProduct.slug,
          mode: 'retail' as const,
          sizeLabel: complementaryProduct.sizes[0] || 'Free Size',
          unitPrice: Math.round(complementaryProduct.price * 0.9),
          quantity: 1,
          totalPrice: Math.round(complementaryProduct.price * 0.9),
          image: complementaryProduct.image,
        })
      }

      localStorage.setItem('nt_cart', JSON.stringify([...existing, ...itemsToAdd]))
      setAddedToast(true)
      setTimeout(() => setAddedToast(false), 3500)
    } catch {
      // ignore
    }
  }

  const handleAskAdvisor = (customPrompt?: string) => {
    const query = customPrompt || advisorQuery
    if (!query) return

    setIsAnalyzing(true)
    setTimeout(() => {
      const q = query.toLowerCase()
      let rec = CRAFT_PRODUCTS[0]
      let pair = CRAFT_PRODUCTS[2]
      let temp = '❄️❄️ Sub-zero certified (-5°C to 5°C)'

      if (q.includes('december') || q.includes('snow') || q.includes('gulmarg') || q.includes('kashmir')) {
        rec = CRAFT_PRODUCTS.find((p) => p.slug === 'classic-kashmiri-wool-tweed-pheran-men') || CRAFT_PRODUCTS[2]
        pair = CRAFT_PRODUCTS.find((p) => p.slug === 'pure-pashmina-sozni-hand-embroidered-shawl') || CRAFT_PRODUCTS[1]
        temp = '❄️❄️❄️ Heavy Winter Shield (-10°C to 0°C)'
      } else if (q.includes('wedding') || q.includes('festive') || q.includes('royal')) {
        rec = CRAFT_PRODUCTS.find((p) => p.slug === 'royal-silk-velvet-tilla-pheran') || CRAFT_PRODUCTS[3]
        pair = CRAFT_PRODUCTS.find((p) => p.slug === 'royal-kani-pashmina-shawl-floral-jamawar') || CRAFT_PRODUCTS[0]
        temp = '✨ Regal Warmth (0°C to 12°C)'
      } else if (q.includes('delhi') || q.includes('noida') || q.includes('coat') || q.includes('office') || q.includes('executive')) {
        rec = CRAFT_PRODUCTS.find((p) => p.slug === 'contemporary-aari-velvet-long-coat') || CRAFT_PRODUCTS[4]
        pair = CRAFT_PRODUCTS.find((p) => p.slug === 'kashmiri-hand-embroidered-cashmere-stole-floral-ivory') || CRAFT_PRODUCTS[2]
        temp = '🍂 Crisp Evening Drape (8°C to 18°C)'
      }

      setAdvisorResponse({
        text: `Based on your request ("${query}"), SI recommends our authentic Kashmiri heritage layering. In sub-zero temperatures, the combination of virgin wool insulation and fine Changthangi Pashmina traps micro-air pockets to provide royal warmth without bulkiness.`,
        recommendedProduct: rec,
        pairingProduct: pair,
        tempRating: temp,
      })
      setIsAnalyzing(false)
    }, 600)
  }

  return (
    <main className="min-h-screen bg-[#FAF6EE] text-[#17233B] pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb & Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-6">
          <div>
            <nav className="text-xs text-[#704B32] mb-1 flex items-center gap-2">
              <Link href="/" className="hover:text-[#176B68]">Home</Link>
              <span>/</span>
              <Link href="/crafts" className="hover:text-[#176B68]">Crafts & Heritage</Link>
              <span>/</span>
              <span className="text-[#17233B] font-semibold">Try with SI Studio</span>
            </nav>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#17233B]">
              Nutty Tales — Try with SI
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 font-light mt-1">
              Virtual draping, drape comparison, and curated Himalayan winter styling
            </p>
          </div>

          <div className="bg-[#17233B] p-1 rounded-xl flex text-xs">
            <button
              onClick={() => setActiveTab('tryon')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                activeTab === 'tryon' ? 'bg-[#176B68] text-white shadow-sm' : 'text-stone-300 hover:text-white'
              }`}
            >
              Try-On Studio
            </button>
            <button
              onClick={() => setActiveTab('advisor')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                activeTab === 'advisor' ? 'bg-[#176B68] text-white shadow-sm' : 'text-stone-300 hover:text-white'
              }`}
            >
              Ask SI Stylist
            </button>
          </div>
        </div>

        {/* Tab 1: Studio */}
        {activeTab === 'tryon' && (
          <div className="bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
            {/* Visual Canvas (7 cols) */}
            <div className="lg:col-span-7 bg-stone-100 p-6 sm:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-stone-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-stone-200 text-xs shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-semibold text-[#17233B]">SI Neural Drape Engine</span>
                </div>

                <button
                  onClick={() => setZoomLevel(!zoomLevel)}
                  className="bg-white px-3.5 py-1.5 rounded-full border border-stone-200 text-xs font-semibold text-[#17233B] hover:bg-stone-50 shadow-sm transition-colors"
                >
                  {zoomLevel ? 'Fit View' : 'Zoom Embroidery'}
                </button>
              </div>

              {/* Garment / Model Visual Canvas */}
              <div className="relative aspect-[4/5] w-full max-w-md mx-auto rounded-2xl overflow-hidden shadow-2xl border border-stone-200 bg-stone-200">
                <Image
                  src={
                    userPhoto ||
                    (zoomLevel
                      ? currentProduct.additionalImages?.[1] || currentProduct.image
                      : currentProduct.image)
                  }
                  alt={currentProduct.name}
                  fill
                  className={`object-cover transition-all duration-500 ${zoomLevel ? 'scale-125' : 'scale-100'}`}
                />

                <div className="absolute top-4 left-4 bg-[#17233B]/80 backdrop-blur-md text-[#FAF6EE] px-3 py-1.5 rounded-md text-[11px] font-medium border border-white/10 flex items-center gap-2">
                  <span>{currentProduct.provenance.craftTradition}</span>
                  {currentProduct.provenance.giTagCertified && (
                    <span className="bg-[#C9A45C] text-[#17233B] font-bold text-[9px] px-1.5 py-0.5 rounded">
                      GI Verified
                    </span>
                  )}
                </div>

                <div className="absolute bottom-4 left-4 right-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 rounded-b-xl text-white">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#C9A45C]">
                    Now Draped
                  </span>
                  <h4 className="font-serif text-lg font-bold leading-tight">{currentProduct.name}</h4>
                  <div className="flex items-center justify-between text-xs mt-1 text-stone-200">
                    <span>Colour: {currentProduct.colorOptions[selectedColorIdx]?.name}</span>
                    <span className="font-bold text-white">₹{currentProduct.price.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Bottom controls */}
              <div className="mt-6 pt-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-stone-600">Model:</span>
                  {AVATAR_MODELS[selectedGender].map((m, i) => (
                    <button
                      key={m.id}
                      onClick={() => {
                        setUserPhoto(null)
                        setActiveModelIdx(i)
                      }}
                      className={`px-3 py-1 rounded-md border text-[11px] font-medium transition-colors ${
                        !userPhoto && activeModelIdx === i
                          ? 'bg-[#17233B] text-white border-[#17233B]'
                          : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
                      }`}
                    >
                      {m.name.split(' ')[0]}
                    </button>
                  ))}
                </div>

                <label className="cursor-pointer bg-white hover:bg-stone-50 text-[#176B68] font-semibold px-4 py-1.5 rounded-md border border-[#176B68]/30 shadow-sm transition-colors flex items-center gap-2">
                  <span>📸 Upload Your Photo</span>
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                </label>
              </div>
            </div>

            {/* Customization Controls (5 cols) */}
            <div className="lg:col-span-5 p-6 sm:p-10 space-y-6 flex flex-col justify-between">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs uppercase font-bold tracking-wider text-[#704B32]">
                      1. Garment Category
                    </span>
                    <div className="flex gap-1 text-[11px]">
                      <button
                        onClick={() => setSelectedGender('women')}
                        className={`px-2.5 py-0.5 rounded font-semibold ${
                          selectedGender === 'women'
                            ? 'bg-[#176B68] text-white'
                            : 'bg-stone-200 text-stone-700'
                        }`}
                      >
                        Women
                      </button>
                      <button
                        onClick={() => setSelectedGender('men')}
                        className={`px-2.5 py-0.5 rounded font-semibold ${
                          selectedGender === 'men'
                            ? 'bg-[#176B68] text-white'
                            : 'bg-stone-200 text-stone-700'
                        }`}
                      >
                        Men
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {(['pherans', 'shawls', 'stoles', 'jackets-coats', 'winter-wear'] as GarmentType[]).map(
                      (cat) => {
                        const labels: Record<GarmentType, string> = {
                          pherans: 'Pherans',
                          shawls: 'Shawls',
                          stoles: 'Stoles',
                          'jackets-coats': 'Jackets',
                          'winter-wear': 'Capes',
                        }
                        return (
                          <button
                            key={cat}
                            onClick={() => {
                              setSelectedGarmentType(cat)
                              const match = CRAFT_PRODUCTS.find((p) => p.category === cat)
                              if (match) setCurrentProduct(match)
                            }}
                            className={`py-2 px-2 rounded-lg font-semibold border text-center transition-all ${
                              selectedGarmentType === cat
                                ? 'bg-[#17233B] text-white border-[#17233B] shadow-sm'
                                : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300'
                            }`}
                          >
                            {labels[cat]}
                          </button>
                        )
                      }
                    )}
                  </div>
                </div>

                {/* Garments in category */}
                <div>
                  <span className="text-xs uppercase font-bold tracking-wider text-[#704B32] block mb-2">
                    2. Select Garment
                  </span>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {categoryProducts.map((prod) => (
                      <button
                        key={prod.id}
                        onClick={() => {
                          setCurrentProduct(prod)
                          setSelectedColorIdx(0)
                        }}
                        className={`w-full p-2.5 rounded-xl border text-left flex items-center gap-3 transition-all ${
                          currentProduct.id === prod.id
                            ? 'bg-white border-[#176B68] shadow-md ring-1 ring-[#176B68]'
                            : 'bg-stone-50 border-stone-200 hover:bg-white'
                        }`}
                      >
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-white flex-shrink-0">
                          <Image src={prod.image} alt={prod.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-serif font-bold text-xs truncate text-[#17233B]">{prod.name}</p>
                          <p className="text-[11px] text-stone-500">{prod.provenance.origin}</p>
                        </div>
                        <span className="text-xs font-bold text-[#176B68]">
                          ₹{prod.price.toLocaleString('en-IN')}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Palette */}
                <div>
                  <span className="text-xs uppercase font-bold tracking-wider text-[#704B32] block mb-2">
                    3. Shade: {currentProduct.colorOptions[selectedColorIdx]?.name}
                  </span>
                  <div className="flex items-center gap-3">
                    {currentProduct.colorOptions.map((col, idx) => (
                      <button
                        key={col.name}
                        onClick={() => setSelectedColorIdx(idx)}
                        className={`w-9 h-9 rounded-full border-2 transition-transform ${
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

                {/* Complete the Look Pairing */}
                {complementaryProduct && (
                  <div className="p-4 rounded-2xl bg-[#F0EBE1] border border-[#C9A45C]/40 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-[#704B32] flex items-center gap-1.5">
                        <span>✨ Complete the Look Pairing</span>
                        <span className="bg-[#C9A45C] text-[#17233B] text-[9px] px-1.5 py-0.2 rounded font-extrabold">
                          Save 10%
                        </span>
                      </span>
                      <span className="text-[11px] text-stone-500">Curated combo</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-white border border-stone-200 flex-shrink-0">
                        <Image
                          src={complementaryProduct.image}
                          alt={complementaryProduct.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-serif font-bold text-xs text-[#17233B] truncate">
                          {complementaryProduct.name}
                        </p>
                        <p className="text-[11px] text-stone-600">
                          {complementaryProduct.provenance.craftTradition}
                        </p>
                        <p className="text-xs font-bold text-[#176B68]">
                          ₹{Math.round(complementaryProduct.price * 0.9).toLocaleString('en-IN')}{' '}
                          <span className="line-through text-stone-400 font-normal text-[10px]">
                            ₹{complementaryProduct.price.toLocaleString('en-IN')}
                          </span>
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleAddToCart(true)}
                      className="w-full py-2.5 bg-[#17233B] hover:bg-[#10192A] text-white rounded-xl text-xs font-bold tracking-wider uppercase transition-colors shadow-sm"
                    >
                      Add Both to Basket (Save ₹
                      {Math.round(complementaryProduct.price * 0.1).toLocaleString('en-IN')})
                    </button>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4 border-t border-stone-200">
                {addedToast && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold text-center animate-fadeIn">
                    ✓ Garment added to your Shopping Basket!
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => handleAddToCart(false)}
                    className="flex-1 py-3.5 bg-[#176B68] hover:bg-[#125350] text-white rounded-xl text-xs font-bold tracking-wider uppercase transition-colors shadow-md"
                  >
                    Add This Garment to Cart (₹{currentProduct.price.toLocaleString('en-IN')})
                  </button>
                  <Link
                    href={`/crafts/product/${currentProduct.slug}`}
                    className="px-5 py-3.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold tracking-wider uppercase transition-colors"
                  >
                    Full Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Style Advisor */}
        {activeTab === 'advisor' && (
          <div className="bg-white rounded-3xl border border-stone-200 shadow-xl p-8 sm:p-12 max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <span className="text-xs uppercase tracking-widest text-[#704B32] font-bold">
                SI Smart Wardrobe Consultant
              </span>
              <h2 className="font-serif text-3xl font-bold text-[#17233B]">
                Ask SI — What should I wear?
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 max-w-lg mx-auto">
                Consult with SI for tailored winter travel recommendations, sub-zero layering tips,
                or luxury wedding attire guidance.
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                Click a popular question to ask:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {[
                  'I am going to Kashmir in December. I want something elegant but warm.',
                  'Attending a royal winter destination wedding in Delhi/Rajasthan.',
                  'Need a lightweight luxury cashmere wrap for business flights.',
                  'What is the warmest traditional pheran for snow in Gulmarg?',
                ].map((promptText) => (
                  <button
                    key={promptText}
                    onClick={() => {
                      setAdvisorQuery(promptText)
                      handleAskAdvisor(promptText)
                    }}
                    className="text-left bg-stone-50 hover:bg-[#FAF6EE] border border-stone-200 hover:border-[#176B68] p-3 rounded-xl text-[#17233B] transition-colors"
                  >
                    💬 “{promptText}”
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={advisorQuery}
                onChange={(e) => setAdvisorQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAskAdvisor()}
                placeholder="Ask SI anything (e.g. Planning a weekend trip to Srinagar in January...)"
                className="flex-1 bg-stone-50 border border-stone-300 rounded-xl px-5 py-4 text-xs text-[#17233B] focus:outline-none focus:ring-2 focus:ring-[#176B68]"
              />
              <button
                onClick={() => handleAskAdvisor()}
                disabled={isAnalyzing}
                className="px-8 py-4 bg-[#176B68] hover:bg-[#125350] disabled:bg-stone-400 text-white rounded-xl text-xs font-bold tracking-wider uppercase transition-colors shadow-md"
              >
                {isAnalyzing ? 'Consulting...' : 'Ask SI'}
              </button>
            </div>

            {advisorResponse && (
              <div className="p-6 sm:p-8 bg-[#FAF6EE] rounded-2xl border border-[#C9A45C]/50 space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-[#176B68] text-white flex items-center justify-center text-xs font-bold">
                      SI
                    </span>
                    <span className="font-serif font-bold text-base text-[#17233B]">
                      Curated Winter Wardrobe Recommendation
                    </span>
                  </div>
                  <span className="text-xs font-bold text-[#704B32] bg-white px-3 py-1 rounded-full border border-stone-200">
                    {advisorResponse.tempRating}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-light">
                  {advisorResponse.text}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 bg-white rounded-xl border border-stone-200 flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-stone-100 flex-shrink-0">
                      <Image
                        src={advisorResponse.recommendedProduct.image}
                        alt={advisorResponse.recommendedProduct.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[9px] uppercase font-bold tracking-wider text-[#704B32] block">
                        Anchor Piece
                      </span>
                      <p className="font-serif font-bold text-xs truncate text-[#17233B]">
                        {advisorResponse.recommendedProduct.name}
                      </p>
                      <p className="text-xs font-bold text-[#176B68]">
                        ₹{advisorResponse.recommendedProduct.price.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>

                  {advisorResponse.pairingProduct && (
                    <div className="p-4 bg-white rounded-xl border border-stone-200 flex items-center gap-4">
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-stone-100 flex-shrink-0">
                        <Image
                          src={advisorResponse.pairingProduct.image}
                          alt={advisorResponse.pairingProduct.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[9px] uppercase font-bold tracking-wider text-[#704B32] block">
                          Styling Layer
                        </span>
                        <p className="font-serif font-bold text-xs truncate text-[#17233B]">
                          {advisorResponse.pairingProduct.name}
                        </p>
                        <p className="text-xs font-bold text-[#176B68]">
                          ₹{advisorResponse.pairingProduct.price.toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end gap-3 pt-3">
                  <button
                    onClick={() => {
                      setCurrentProduct(advisorResponse.recommendedProduct)
                      setActiveTab('tryon')
                    }}
                    className="px-5 py-2.5 bg-[#17233B] text-white text-xs font-bold rounded-xl uppercase tracking-wider hover:bg-[#10192A] transition-colors"
                  >
                    View in Try-On Studio →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
