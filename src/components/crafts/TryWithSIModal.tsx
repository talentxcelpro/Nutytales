'use client'

import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { CRAFT_PRODUCTS, CraftProduct } from '@/lib/crafts-data'
import { CLOTHING_PRODUCTS, ClothingProduct } from '@/lib/clothing-data'
import { useMarketCurrency } from '@/hooks/useMarketCurrency'
import {
  ALL_AGENCY_MODELS,
  FEMALE_MODELS,
  MALE_MODELS,
  AgencyModel,
  getModelsByGender,
  getRecommendedModelForProduct,
} from '@/lib/models-data'

interface TryWithSIModalProps {
  isOpen: boolean
  onClose: () => void
  initialProduct?: any
  initialColorIdx?: number
  initialModelId?: string
}

type ModelGender = 'women' | 'men'

type LightMode = 'daylight' | 'golden' | 'evening'

const LIGHT_MODES: Record<LightMode, { label: string; filter: string; icon: string }> = {
  daylight: { label: 'Studio Daylight', filter: 'brightness(1) contrast(1)', icon: '☀️' },
  golden: { label: 'Golden Hour', filter: 'brightness(1.04) contrast(1.05) sepia(0.08) saturate(1.05)', icon: '🌅' },
  evening: { label: 'Royal Evening', filter: 'brightness(0.96) contrast(1.08) hue-rotate(-6deg) saturate(1.08)', icon: '🌙' },
}

export default function TryWithSIModal({
  isOpen,
  onClose,
  initialProduct,
  initialColorIdx,
  initialModelId,
}: TryWithSIModalProps) {
  const { formatCraftPrice } = useMarketCurrency()
  const [activeTab, setActiveTab] = useState<'tryon' | 'advisor'>('tryon')
  const [selectedGender, setSelectedGender] = useState<ModelGender>(
    initialProduct?.gender === 'men' ? 'men' : 'women'
  )
  const [currentProduct, setCurrentProduct] = useState<any>(
    initialProduct || CLOTHING_PRODUCTS[0] || CRAFT_PRODUCTS[0]
  )
  const [selectedColorIdx, setSelectedColorIdx] = useState(initialColorIdx ?? 0)
  const [userPhoto, setUserPhoto] = useState<string | null>(null)
  const [ambientLight, setAmbientLight] = useState<LightMode>('daylight')
  const [zoomLevel, setZoomLevel] = useState(false)
  const [addedNotice, setAddedNotice] = useState(false)
  const [isDraping, setIsDraping] = useState(false)
  const [canvasViewMode, setCanvasViewMode] = useState<'model' | 'garment'>('model')
  const [modelAngle, setModelAngle] = useState<'drape' | 'editorial' | 'detail'>('drape')

  // ─── 58-Model Agency State ──────────────────────────────────────────────────
  const [selectedModelId, setSelectedModelId] = useState<string>(() => {
    if (initialModelId) return initialModelId
    const rec = getRecommendedModelForProduct(
      initialProduct?.gender === 'men' ? 'men' : 'women',
      initialProduct?.categoryLabel
    )
    return rec.id
  })
  const [isModelDrawerOpen, setIsModelDrawerOpen] = useState(false)
  const [modelSearchQuery, setModelSearchQuery] = useState('')
  const [modelRegionFilter, setModelRegionFilter] = useState<string>('All')
  const [modelHeightFilter, setModelHeightFilter] = useState<'all' | 'petite' | 'regular' | 'tall'>('all')

  // Style Advisor state
  const [advisorQuery, setAdvisorQuery] = useState('')
  const [advisorResponse, setAdvisorResponse] = useState<{
    text: string
    recommendedProduct: any
    pairingProduct?: any
    tempRating: string
  } | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  // Reset/sync on initialProduct / open updates
  useEffect(() => {
    if (initialProduct && isOpen) {
      setCurrentProduct(initialProduct)
      const gender = initialProduct.gender === 'men' ? 'men' : 'women'
      setSelectedGender(gender)
      setSelectedColorIdx(initialColorIdx !== undefined ? initialColorIdx : 0)
      setUserPhoto(null)
      setZoomLevel(false)
      setCanvasViewMode('model')
      setModelAngle('drape')
      const rec = getRecommendedModelForProduct(gender, initialProduct.categoryLabel)
      setSelectedModelId(initialModelId || rec.id)
    }
  }, [initialProduct, isOpen, initialColorIdx, initialModelId])

  // Sync selected model gender when user toggles gender
  useEffect(() => {
    const available = getModelsByGender(selectedGender)
    if (!available.some((m) => m.id === selectedModelId)) {
      setSelectedModelId(available[0]?.id || 'mod-w-01')
    }
  }, [selectedGender, selectedModelId])

  if (!isOpen) return null

  // Active Agency Model
  const currentModel: AgencyModel =
    ALL_AGENCY_MODELS.find((m) => m.id === selectedModelId) ||
    (selectedGender === 'women' ? FEMALE_MODELS[0] : MALE_MODELS[0])

  // Filtered models for drawer / grid
  const genderModels = getModelsByGender(selectedGender)
  const filteredModels = genderModels.filter((m) => {
    const matchesSearch =
      !modelSearchQuery ||
      m.name.toLowerCase().includes(modelSearchQuery.toLowerCase()) ||
      m.city.toLowerCase().includes(modelSearchQuery.toLowerCase()) ||
      m.state.toLowerCase().includes(modelSearchQuery.toLowerCase()) ||
      m.fitType.toLowerCase().includes(modelSearchQuery.toLowerCase())

    const matchesRegion = modelRegionFilter === 'All' || m.region === modelRegionFilter

    let matchesHeight = true
    if (modelHeightFilter === 'petite') matchesHeight = m.heightCm < 169
    else if (modelHeightFilter === 'regular') matchesHeight = m.heightCm >= 169 && m.heightCm <= 178
    else if (modelHeightFilter === 'tall') matchesHeight = m.heightCm > 178

    return matchesSearch && matchesRegion && matchesHeight
  })

  // Quick 6 top models for one-click pill bar
  const quickModels = genderModels.slice(0, 6)

  // Collect pool of available products ensuring the currentProduct is present
  const allGarments = [
    ...(initialProduct ? [initialProduct] : []),
    ...CLOTHING_PRODUCTS,
    ...CRAFT_PRODUCTS,
  ].filter((p, idx, arr) => p && arr.findIndex((x) => x.id === p.id) === idx)

  // Filter garments for the selected gender
  const availableGarments = allGarments.filter(
    (p) => p.gender === selectedGender || p.gender === 'unisex' || !p.gender
  ).slice(0, 10)

  // Guarantee currentProduct is first if gender matches, else prepend
  const displayList = availableGarments.some((p) => p.id === currentProduct.id)
    ? availableGarments
    : [currentProduct, ...availableGarments.slice(0, 9)]

  // Pairing product for Complete the Look
  const complementaryProduct = currentProduct.pairWithSlug
    ? allGarments.find((p) => p.slug === currentProduct.pairWithSlug)
    : allGarments.find(
        (p) =>
          p.id !== currentProduct.id &&
          (p.gender === selectedGender || p.gender === 'unisex')
      )

  // Trigger dynamic drape simulation transition
  const triggerDrapeShift = (callback: () => void) => {
    setIsDraping(true)
    callback()
    setTimeout(() => {
      setIsDraping(false)
    }, 320)
  }

  // Active colorway image
  const currentColorway = currentProduct.colorOptions?.[selectedColorIdx]
  const activeColorImage = currentColorway?.image || currentProduct.image

  // Resolve the active agency model's actual image (Full drape vs runway editorial vs macro detail)
  const activeModelPhoto = (() => {
    if (modelAngle === 'editorial' && currentModel.editorialShot) {
      return currentModel.editorialShot
    }
    if (modelAngle === 'detail' && currentModel.detailShot) {
      return currentModel.detailShot
    }
    return currentModel.drapeImage || currentModel.avatar
  })()

  const detailOrMacroImage =
    (currentProduct as any).textureImage ||
    (currentProduct as any).detailImage ||
    activeColorImage

  // Display the selected model's drape photo by default, or garment cut when chosen
  const activeCanvasImage = userPhoto
    ? userPhoto
    : zoomLevel
    ? detailOrMacroImage
    : canvasViewMode === 'model'
    ? activeModelPhoto
    : activeColorImage

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (uploadEvent) => {
        triggerDrapeShift(() => {
          setUserPhoto(uploadEvent.target?.result as string)
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAddLookToCart = (includePairing = false) => {
    try {
      const existing = JSON.parse(localStorage.getItem('nt_cart') || '[]')
      const chosenColor = currentColorway?.name || 'Standard'
      const itemsToAdd = [
        {
          productId: currentProduct.id,
          name: `${currentProduct.name} (${chosenColor})`,
          slug: currentProduct.slug,
          mode: 'retail' as const,
          sizeLabel: currentProduct.sizes?.[0] || 'Free Size',
          unitPrice: currentProduct.price,
          quantity: 1,
          totalPrice: currentProduct.price,
          image: activeColorImage,
        },
      ]

      if (includePairing && complementaryProduct) {
        itemsToAdd.push({
          productId: complementaryProduct.id,
          name: `${complementaryProduct.name} (Paired)`,
          slug: complementaryProduct.slug,
          mode: 'retail' as const,
          sizeLabel: complementaryProduct.sizes?.[0] || 'Free Size',
          unitPrice: Math.round(complementaryProduct.price * 0.9),
          quantity: 1,
          totalPrice: Math.round(complementaryProduct.price * 0.9),
          image: complementaryProduct.image,
        })
      }

      localStorage.setItem('nt_cart', JSON.stringify([...existing, ...itemsToAdd]))
      window.dispatchEvent(new Event('nt_cart_updated'))
      window.dispatchEvent(new Event('nt_open_cart'))
      setAddedNotice(true)
      setTimeout(() => setAddedNotice(false), 3500)
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
      let rec = allGarments[0]
      let pair = allGarments[1]
      let temp = '❄️❄️ Sub-zero certified (-5°C to 5°C)'

      if (q.includes('december') || q.includes('snow') || q.includes('gulmarg') || q.includes('kashmir')) {
        rec = allGarments.find((p) => p.slug?.includes('pheran')) || allGarments[2]
        pair = allGarments.find((p) => p.slug?.includes('shawl') || p.slug?.includes('pashmina')) || allGarments[1]
        temp = '❄️❄️❄️ Heavy Winter Shield (-10°C to 0°C)'
      } else if (q.includes('wedding') || q.includes('festive') || q.includes('royal')) {
        rec = allGarments.find((p) => p.slug?.includes('banarasi') || p.slug?.includes('sherwani') || p.slug?.includes('velvet')) || allGarments[3]
        pair = allGarments.find((p) => p.slug?.includes('shawl')) || allGarments[0]
        temp = '✨ Regal Warmth (0°C to 12°C)'
      } else if (q.includes('delhi') || q.includes('noida') || q.includes('coat') || q.includes('office') || q.includes('executive')) {
        rec = allGarments.find((p) => p.slug?.includes('coat') || p.slug?.includes('trench')) || allGarments[4]
        pair = allGarments.find((p) => p.slug?.includes('stole')) || allGarments[2]
        temp = '🍂 Crisp Evening Drape (8°C to 18°C)'
      }

      setAdvisorResponse({
        text: `Based on your request ("${query}"), SI Neural Drape recommends our authentic artisanal handloom layering. Virgin fibers and high-twist weaves trap insulating air micro-chambers while draping with featherlight royal poise.`,
        recommendedProduct: rec,
        pairingProduct: pair,
        tempRating: temp,
      })
      setIsAnalyzing(false)
    }, 500)
  }

  const craftName = currentProduct.craft || currentProduct.provenance?.craftTradition || 'GI Certified Handloom'
  const originName = (currentProduct as any).state || currentProduct.provenance?.origin || 'India'

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-6 animate-fadeIn">
      <div className="relative bg-[#FAF6EE] text-[#17233B] rounded-2xl max-w-6xl w-full max-h-[94vh] overflow-hidden flex flex-col shadow-2xl border border-[#C9A45C]/30">
        
        {/* Top Header */}
        <div className="bg-[#17233B] text-[#FAF6EE] px-6 py-4 flex items-center justify-between border-b border-[#C9A45C]/20 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#176B68] flex items-center justify-center text-sm font-black text-white shadow-inner">
              SI
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-lg font-bold tracking-tight text-white">
                  Nuty Tales — Try with SI
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#C9A45C] text-[#17233B]">
                  Virtual Drape Studio &amp; Stylist
                </span>
                <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-white/10 text-stone-200">
                  58 Diverse Models
                </span>
              </div>
              <p className="text-xs text-[#FAF6EE]/70 font-light">
                Physics-based neural fabric drape, 58 diverse Indian models &amp; real-time shade switching
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* View Switcher */}
            <div className="bg-[#10192A] rounded-lg p-0.5 flex text-xs">
              <button
                onClick={() => setActiveTab('tryon')}
                className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
                  activeTab === 'tryon' ? 'bg-[#176B68] text-white' : 'text-[#FAF6EE]/60 hover:text-white'
                }`}
              >
                Try-On Studio
              </button>
              <button
                onClick={() => setActiveTab('advisor')}
                className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
                  activeTab === 'advisor' ? 'bg-[#176B68] text-white' : 'text-[#FAF6EE]/60 hover:text-white'
                }`}
              >
                Ask SI Stylist
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-lg transition-colors"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Tab 1: Try-On Studio */}
        {activeTab === 'tryon' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-y-auto">
            {/* Left Column: Visual Try-On Canvas (7 cols) */}
            <div className="lg:col-span-7 bg-stone-100 p-4 sm:p-5 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#17233B]/10 relative overflow-y-auto">
              {/* Controls bar over canvas */}
              <div className="flex items-center justify-between z-10 mb-3 flex-wrap gap-2">
                {/* View Switcher: Drape on Model vs Garment Flatlay */}
                <div className="flex items-center gap-1 bg-stone-200/90 p-0.5 rounded-xl text-xs font-semibold shadow-xs">
                  <button
                    type="button"
                    onClick={() => {
                      triggerDrapeShift(() => {
                        setCanvasViewMode('model')
                      })
                    }}
                    className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                      canvasViewMode === 'model'
                        ? 'bg-[#17233B] text-white shadow-xs'
                        : 'text-stone-700 hover:text-black'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Draped on {currentModel.name.split(' ')[0]}</span>
                    <span className="text-[10px] text-[#C9A45C] font-mono">({currentModel.height})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      triggerDrapeShift(() => {
                        setCanvasViewMode('garment')
                      })
                    }}
                    className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                      canvasViewMode === 'garment'
                        ? 'bg-[#17233B] text-white shadow-xs'
                        : 'text-stone-700 hover:text-black'
                    }`}
                  >
                    <span>🧵</span>
                    <span>Garment Cut</span>
                    {currentColorway && (
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-black/30"
                        style={{ backgroundColor: currentColorway.hex }}
                      />
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Model Angle Switcher */}
                  {canvasViewMode === 'model' && (
                    <div className="bg-white/95 p-0.5 rounded-lg border border-stone-200 flex text-[11px] font-semibold">
                      <button
                        type="button"
                        onClick={() => setModelAngle('drape')}
                        className={`px-2 py-1 rounded-md transition-all ${
                          modelAngle === 'drape' ? 'bg-[#176B68] text-white' : 'text-stone-600 hover:text-[#17233B]'
                        }`}
                      >
                        Drape
                      </button>
                      <button
                        type="button"
                        onClick={() => setModelAngle('editorial')}
                        className={`px-2 py-1 rounded-md transition-all ${
                          modelAngle === 'editorial' ? 'bg-[#176B68] text-white' : 'text-stone-600 hover:text-[#17233B]'
                        }`}
                      >
                        Editorial
                      </button>
                    </div>
                  )}

                  {/* Ambient Light Toggles */}
                  <div className="bg-white/90 p-0.5 rounded-full border border-stone-200 flex text-xs">
                    {(Object.keys(LIGHT_MODES) as LightMode[]).map((mode) => (
                      <button
                        key={mode}
                        onClick={() => setAmbientLight(mode)}
                        title={LIGHT_MODES[mode].label}
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                          ambientLight === mode
                            ? 'bg-[#17233B] text-white shadow-xs'
                            : 'text-stone-600 hover:text-[#17233B]'
                        }`}
                      >
                        {LIGHT_MODES[mode].icon}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setZoomLevel(!zoomLevel)}
                    className="bg-white/95 px-3 py-1.5 rounded-full border border-stone-200 text-xs font-semibold text-[#17233B] hover:bg-white shadow-sm transition-colors"
                  >
                    {zoomLevel ? 'Fit' : '🔍 Zoom'}
                  </button>
                </div>
              </div>

              {/* Garment / Model Visual Canvas */}
              <div className="relative aspect-[3/4] max-h-[470px] w-full max-w-sm sm:max-w-md mx-auto rounded-2xl overflow-hidden shadow-2xl border border-stone-300 bg-stone-900 group">
                <Image
                  src={activeCanvasImage}
                  alt={canvasViewMode === 'model' ? `${currentModel.name} draped in ${currentProduct.name}` : currentProduct.name}
                  fill
                  priority
                  style={{ filter: LIGHT_MODES[ambientLight]?.filter }}
                  className={`object-cover object-[center_top] transition-all duration-500 ${
                    zoomLevel ? 'scale-125' : 'scale-100'
                  }`}
                />

                {/* Drape Calibration Shimmer Overlay */}
                {isDraping && (
                  <div className="absolute inset-0 bg-[#17233B]/45 backdrop-blur-xs flex items-center justify-center z-30 animate-fadeIn">
                    <div className="bg-[#17233B]/95 text-white border border-[#C9A45C]/70 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-semibold">
                      <div className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-[#C9A45C] flex-shrink-0">
                        <Image src={currentModel.avatar} alt="" fill className="object-cover" />
                      </div>
                      <div>
                        <p className="font-bold text-white">Draping onto {currentModel.name} ({currentModel.height})</p>
                        <p className="text-[10px] text-[#C9A45C] font-mono">Calibrating {currentModel.fitType} fit in {currentModel.city} studio...</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Top-Left Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10 pointer-events-none">
                  <div className="bg-[#17233B]/85 backdrop-blur-md text-[#FAF6EE] px-3 py-1.5 rounded-md text-[11px] font-medium border border-white/10 flex items-center gap-2 shadow-sm">
                    <span>{craftName}</span>
                    {currentProduct.provenance?.giTagCertified && (
                      <span className="bg-[#C9A45C] text-[#17233B] font-bold text-[9px] px-1.5 py-0.5 rounded">
                        GI Certified
                      </span>
                    )}
                  </div>
                  <div className="bg-black/60 backdrop-blur-xs text-white px-2.5 py-1 rounded text-[10px] font-medium self-start">
                    📍 {originName}
                  </div>
                </div>

                {/* Top-Right Model HUD Pill */}
                {!userPhoto && (
                  <div className="absolute top-4 right-4 bg-[#17233B]/95 backdrop-blur-md text-white border border-white/20 px-3 py-1.5 rounded-full text-xs font-semibold shadow-md flex items-center gap-2 pointer-events-none z-10">
                    <div className="relative w-5 h-5 rounded-full overflow-hidden border border-[#C9A45C] flex-shrink-0">
                      <Image src={currentModel.avatar} alt={currentModel.name} fill className="object-cover" />
                    </div>
                    <span>{currentModel.name.split(' ')[0]}</span>
                    <span className="text-stone-300">· {currentModel.height}</span>
                    <span className="text-[#C9A45C] text-[10px]">({currentModel.fitType})</span>
                  </div>
                )}

                {/* Interactive Picture-in-Picture (PIP) Floating Lens */}
                <div
                  onClick={() => {
                    triggerDrapeShift(() => {
                      setCanvasViewMode(canvasViewMode === 'model' ? 'garment' : 'model')
                    })
                  }}
                  className="absolute bottom-28 right-4 bg-white/95 backdrop-blur-md border-2 border-[#C9A45C] hover:border-[#17233B] p-1.5 rounded-2xl shadow-xl flex items-center gap-2.5 cursor-pointer transition-all hover:scale-105 z-20 group/pip"
                  title={canvasViewMode === 'model' ? 'Click to inspect full Garment Cut' : 'Click to drape on Model'}
                >
                  <div className="relative w-12 h-14 rounded-xl overflow-hidden bg-stone-100 flex-shrink-0 border border-black/10">
                    <Image
                      src={canvasViewMode === 'model' ? activeColorImage : currentModel.avatar}
                      alt="Preview Lens"
                      fill
                      className="object-cover"
                    />
                    <span className="absolute bottom-0 inset-x-0 bg-black/75 text-[8px] text-center text-white font-mono py-0.5">
                      {canvasViewMode === 'model' ? 'GARMENT' : 'MODEL'}
                    </span>
                  </div>
                  <div className="pr-1.5 min-w-[85px]">
                    <span className="text-[9px] uppercase font-bold text-stone-500 block">
                      {canvasViewMode === 'model' ? 'Active Shade' : 'Active Model'}
                    </span>
                    <p className="font-bold text-[11px] text-[#17233B] truncate max-w-[105px] flex items-center gap-1">
                      {canvasViewMode === 'model' && (
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-black/20 flex-shrink-0"
                          style={{ backgroundColor: currentColorway?.hex || '#C9A45C' }}
                        />
                      )}
                      <span className="truncate">
                        {canvasViewMode === 'model' ? (currentColorway?.name || 'Standard') : currentModel.name.split(' ')[0]}
                      </span>
                    </p>
                    <span className="text-[9px] font-bold text-[#176B68] flex items-center gap-0.5 mt-0.5 group-hover/pip:underline">
                      <span>⇄</span>
                      <span>{canvasViewMode === 'model' ? 'View Cut' : 'View Drape'}</span>
                    </span>
                  </div>
                </div>

                {/* Bottom Overlay Card */}
                <div className="absolute bottom-4 left-4 right-4 bg-gradient-to-t from-black/95 via-black/75 to-transparent p-4 rounded-b-2xl text-white z-10">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#C9A45C]">
                      {canvasViewMode === 'model' ? 'Now Draped On' : 'Garment Studio Cut'}
                    </span>
                    <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      {currentModel.name} ({currentModel.height}) · {currentModel.state}
                    </span>
                  </div>
                  <h4 className="font-serif text-lg font-bold leading-tight">{currentProduct.name}</h4>
                  <div className="flex items-center justify-between text-xs mt-1.5 text-stone-200">
                    <span className="flex items-center gap-1.5">
                      <span>Shade:</span>
                      <strong className="text-white flex items-center gap-1.5">
                        <span
                          className="w-3.5 h-3.5 rounded-full inline-block border border-white/50 shadow-xs"
                          style={{ backgroundColor: currentColorway?.hex || '#C9A45C' }}
                        />
                        {currentColorway?.name || 'Standard Shade'}
                      </strong>
                    </span>
                    <span className="font-bold text-white text-sm">
                      {formatCraftPrice(currentProduct.price)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Quick Model Bar (6 Avatars + Browse 50+ Models Trigger) */}
              <div className="mt-4 pt-4 border-t border-stone-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-stone-700 flex items-center gap-1.5">
                    <span>✨ Select Model:</span>
                    <span className="text-stone-500 font-normal">({genderModels.length} models available)</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsModelDrawerOpen(true)}
                    className="text-xs font-bold text-[#176B68] hover:text-[#125350] hover:underline flex items-center gap-1"
                  >
                    <span>Browse All {genderModels.length} Models →</span>
                  </button>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                  {quickModels.map((m) => {
                    const isSelected = currentModel.id === m.id
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => {
                          triggerDrapeShift(() => {
                            setUserPhoto(null)
                            setSelectedModelId(m.id)
                            setCanvasViewMode('model')
                          })
                        }}
                        className={`flex items-center gap-2 px-2.5 py-1.5 rounded-full border text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
                          !userPhoto && isSelected
                            ? 'bg-[#17233B] text-white border-[#17233B] ring-2 ring-[#C9A45C] shadow-sm'
                            : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
                        }`}
                      >
                        <div className="relative w-5 h-5 rounded-full overflow-hidden border border-black/15 flex-shrink-0">
                          <Image src={m.avatar} alt={m.name} fill className="object-cover" />
                        </div>
                        <span>{m.name.split(' ')[0]}</span>
                        <span className="text-[10px] opacity-75">({m.height})</span>
                      </button>
                    )
                  })}

                  <button
                    type="button"
                    onClick={() => setIsModelDrawerOpen(true)}
                    className="px-3 py-1.5 rounded-full bg-[#176B68] hover:bg-[#125350] text-white text-xs font-bold whitespace-nowrap flex items-center gap-1 shadow-xs flex-shrink-0"
                  >
                    <span>+ {genderModels.length - quickModels.length} More Models</span>
                  </button>

                  <label className="cursor-pointer bg-white hover:bg-stone-50 text-[#176B68] font-semibold px-3 py-1.5 rounded-full border border-[#176B68]/30 shadow-xs transition-colors flex items-center gap-1 text-xs whitespace-nowrap flex-shrink-0 ml-auto">
                    <span>📸 Upload Photo</span>
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column: Customization & Complete the Look (5 cols) */}
            <div className="lg:col-span-5 p-4 sm:p-6 space-y-6 flex flex-col justify-between overflow-y-auto">
              <div className="space-y-6">
                
                {/* 1. Gender Selector & Active Model Summary */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase font-bold tracking-wider text-[#704B32]">
                      1. Wardrobe &amp; Model Gender
                    </span>
                    <div className="flex gap-1 text-[11px]">
                      <button
                        onClick={() => {
                          setSelectedGender('women')
                          const rec = getRecommendedModelForProduct('women', currentProduct.categoryLabel)
                          setSelectedModelId(rec.id)
                          setCanvasViewMode('model')
                          setSelectedColorIdx(0)
                        }}
                        className={`px-3 py-1 rounded font-semibold transition-colors ${
                          selectedGender === 'women'
                            ? 'bg-[#176B68] text-white'
                            : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                        }`}
                      >
                        Women (30)
                      </button>
                      <button
                        onClick={() => {
                          setSelectedGender('men')
                          const rec = getRecommendedModelForProduct('men', currentProduct.categoryLabel)
                          setSelectedModelId(rec.id)
                          setCanvasViewMode('model')
                          setSelectedColorIdx(0)
                        }}
                        className={`px-3 py-1 rounded font-semibold transition-colors ${
                          selectedGender === 'men'
                            ? 'bg-[#176B68] text-white'
                            : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                        }`}
                      >
                        Men (28)
                      </button>
                    </div>
                  </div>

                  {/* Active Model Mini Card */}
                  <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-2.5 shadow-xs">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-[#C9A45C] flex-shrink-0 shadow-xs">
                          <Image src={currentModel.avatar} alt={currentModel.name} fill className="object-cover" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-serif font-bold text-xs text-[#17233B] truncate">
                            {currentModel.name} ({currentModel.height})
                          </p>
                          <p className="text-[11px] text-stone-500 truncate">
                            {currentModel.city}, {currentModel.state} · {currentModel.fitType}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsModelDrawerOpen(true)}
                        className="px-3 py-1.5 rounded-lg bg-[#17233B] hover:bg-[#176B68] text-white text-[11px] font-bold whitespace-nowrap transition-colors shadow-xs"
                      >
                        Change Model ({genderModels.length})
                      </button>
                    </div>

                    {/* Quick Pick Model Chips */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pt-1 border-t border-stone-100 no-scrollbar">
                      <span className="text-[10px] uppercase font-bold text-stone-400 mr-0.5 flex-shrink-0">Quick Models:</span>
                      {genderModels.slice(0, 5).map((qm) => {
                        const isQmSelected = currentModel.id === qm.id
                        return (
                          <button
                            key={qm.id}
                            type="button"
                            onClick={() => {
                              triggerDrapeShift(() => {
                                setUserPhoto(null)
                                setSelectedModelId(qm.id)
                                setCanvasViewMode('model')
                              })
                            }}
                            className={`px-2 py-0.5 rounded-md text-[11px] font-semibold flex-shrink-0 transition-all ${
                              isQmSelected
                                ? 'bg-[#17233B] text-white ring-1 ring-[#C9A45C] font-bold'
                                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                            }`}
                          >
                            {qm.name.split(' ')[0]} ({qm.height})
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>

                {/* 2. Garment Selection in Category */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs uppercase font-bold tracking-wider text-[#704B32]">
                      2. Select Garment to Drape
                    </span>
                    <span className="text-[11px] text-stone-500">
                      {displayList.length} artisanal pieces
                    </span>
                  </div>
                  <div className="space-y-2 max-h-44 overflow-y-auto pr-1 no-scrollbar">
                    {displayList.map((prod) => (
                      <button
                        key={prod.id}
                        onClick={() => {
                          triggerDrapeShift(() => {
                            setCurrentProduct(prod)
                            setSelectedColorIdx(0)
                            setZoomLevel(false)
                          })
                        }}
                        className={`w-full p-2.5 rounded-lg border text-left flex items-center gap-3 transition-all ${
                          currentProduct.id === prod.id
                            ? 'bg-white border-[#176B68] shadow-md ring-1 ring-[#176B68]'
                            : 'bg-white/60 border-stone-200 hover:bg-white'
                        }`}
                      >
                        <div className="relative w-12 h-12 rounded-md overflow-hidden bg-stone-100 flex-shrink-0">
                          <Image src={prod.image} alt={prod.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-serif font-bold text-xs truncate text-[#17233B]">{prod.name}</p>
                          <p className="text-[11px] text-stone-500">
                            {(prod as any).state || prod.provenance?.origin || 'India'} · {prod.craft || prod.provenance?.craftTradition}
                          </p>
                        </div>
                        <span className="text-xs font-bold text-[#176B68] flex-shrink-0">
                          {formatCraftPrice(prod.price)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Colour Palette Picker (With Exact Photo Swatch Guarantee) */}
                {currentProduct.colorOptions && currentProduct.colorOptions.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase font-bold tracking-wider text-[#704B32]">
                        3. Shade &amp; Tone
                      </span>
                      <span className="text-xs font-bold text-[#17233B]">
                        {currentColorway?.name || 'Standard'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {currentProduct.colorOptions.map((col: any, idx: number) => {
                        const isSelected = selectedColorIdx === idx
                        return (
                          <button
                            key={col.name}
                            type="button"
                            onClick={() => {
                              triggerDrapeShift(() => {
                                setSelectedColorIdx(idx)
                                setZoomLevel(false)
                              })
                            }}
                            className={`p-2.5 rounded-xl border flex items-center gap-2.5 text-left transition-all ${
                              isSelected
                                ? 'bg-white border-[#17233B] ring-2 ring-[#C9A45C] shadow-sm'
                                : 'bg-white/70 border-stone-200 hover:bg-white hover:border-stone-400'
                            }`}
                          >
                            <span
                              className="w-6 h-6 rounded-full border border-black/15 shadow-xs flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                              style={{ backgroundColor: col.hex }}
                            >
                              {isSelected && '✓'}
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className={`text-xs font-semibold truncate ${isSelected ? 'text-[#17233B]' : 'text-stone-700'}`}>
                                {col.name}
                              </p>
                              <p className="text-[10px] text-stone-400 font-mono uppercase">{col.hex}</p>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* 4. Complete the Look Layering Module */}
                {complementaryProduct && (
                  <div className="p-4 rounded-xl bg-[#F0EBE1] border border-[#C9A45C]/40 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-[#704B32] flex items-center gap-1.5">
                        <span>✨ Complete the Look</span>
                        <span className="bg-[#C9A45C] text-[#17233B] text-[9px] px-1.5 py-0.2 rounded font-extrabold">
                          Save 10%
                        </span>
                      </span>
                      <span className="text-[11px] text-stone-500">SI Layering pairing</span>
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
                        <p className="text-[11px] text-stone-600 truncate">
                          {complementaryProduct.craft || complementaryProduct.provenance?.craftTradition}
                        </p>
                        <p className="text-xs font-bold text-[#176B68]">
                          {formatCraftPrice(Math.round(complementaryProduct.price * 0.9))}{' '}
                          <span className="line-through text-stone-400 font-normal text-[10px]">
                            {formatCraftPrice(complementaryProduct.price)}
                          </span>
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleAddLookToCart(true)}
                      className="w-full py-2.5 bg-[#17233B] hover:bg-[#10192A] text-white rounded-lg text-xs font-bold tracking-wider uppercase transition-colors shadow-sm"
                    >
                      Add Both to Basket (Save {formatCraftPrice(Math.round(complementaryProduct.price * 0.1))})
                    </button>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-4 border-t border-stone-200">
                {addedNotice && (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold text-center animate-fadeIn">
                    ✓ Garment added to your Shopping Basket!
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => handleAddLookToCart(false)}
                    className="flex-1 py-3 bg-[#176B68] hover:bg-[#125350] text-white rounded-lg text-xs font-bold tracking-wider uppercase transition-colors shadow-sm"
                  >
                    Add This Garment to Cart ({formatCraftPrice(currentProduct.price)})
                  </button>
                  <Link
                    href={`/crafts/product/${currentProduct.slug}`}
                    onClick={onClose}
                    className="px-4 py-3 bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 rounded-lg text-xs font-bold tracking-wider uppercase transition-colors"
                  >
                    Full Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Ask SI Stylist */}
        {activeTab === 'advisor' && (
          <div className="p-6 max-w-3xl mx-auto w-full space-y-6 flex-1 overflow-y-auto">
            <div className="text-center space-y-1">
              <span className="text-[11px] uppercase tracking-widest text-[#704B32] font-bold">
                Personalized Himalayan Wardrobe Consultant
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#17233B]">
                Ask SI — What should I wear?
              </h3>
              <p className="text-xs text-stone-600 max-w-md mx-auto">
                Tell SI your destination, travel dates, weather expectations, or special occasion.
              </p>
            </div>

            {/* Quick Inspiration Pills */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-stone-500">Popular questions:</span>
              <div className="flex flex-wrap gap-2">
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
                    className="text-xs text-left bg-white border border-stone-200 hover:border-[#176B68] p-2 rounded-lg text-[#17233B] transition-colors"
                  >
                    💬 “{promptText}”
                  </button>
                ))}
              </div>
            </div>

            {/* Query Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={advisorQuery}
                onChange={(e) => setAdvisorQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAskAdvisor()}
                placeholder="Ask SI (e.g. Planning a 4-day trip to Srinagar in January...)"
                className="flex-1 bg-white border border-stone-300 rounded-xl px-4 py-3 text-xs text-[#17233B] focus:outline-none focus:ring-2 focus:ring-[#176B68]"
              />
              <button
                onClick={() => handleAskAdvisor()}
                disabled={isAnalyzing}
                className="px-6 py-3 bg-[#176B68] hover:bg-[#125350] disabled:bg-stone-400 text-white rounded-xl text-xs font-bold tracking-wider uppercase transition-colors"
              >
                {isAnalyzing ? 'Consulting...' : 'Ask SI'}
              </button>
            </div>

            {/* Response Card */}
            {advisorResponse && (
              <div className="p-6 bg-white rounded-2xl border border-[#C9A45C]/50 shadow-md space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#176B68] text-white flex items-center justify-center text-xs font-bold">
                      SI
                    </span>
                    <span className="font-serif font-bold text-sm text-[#17233B]">
                      Curated Winter Wardrobe Recommendation
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-[#704B32] bg-[#FAF6EE] px-2.5 py-1 rounded-full border border-[#C9A45C]/30">
                    {advisorResponse.tempRating}
                  </span>
                </div>

                <p className="text-xs text-stone-700 leading-relaxed">{advisorResponse.text}</p>

                {/* Recommended Pair */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-3 bg-[#FAF6EE] rounded-xl border border-stone-200 flex items-center gap-3">
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-stone-100 flex-shrink-0">
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
                        {formatCraftPrice(advisorResponse.recommendedProduct.price)}
                      </p>
                    </div>
                  </div>

                  {advisorResponse.pairingProduct && (
                    <div className="p-3 bg-[#FAF6EE] rounded-xl border border-stone-200 flex items-center gap-3">
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-stone-100 flex-shrink-0">
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
                          {formatCraftPrice(advisorResponse.pairingProduct.price)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    onClick={() => {
                      setCurrentProduct(advisorResponse.recommendedProduct)
                      setActiveTab('tryon')
                    }}
                    className="px-4 py-2 bg-[#17233B] text-white text-xs font-bold rounded-lg uppercase tracking-wider hover:bg-[#10192A] transition-colors"
                  >
                    View in Try-On Studio →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── 58-MODEL AGENCY DRAWER MODAL ─────────────────────────────────────── */}
        {isModelDrawerOpen && (
          <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col justify-end sm:justify-center p-0 sm:p-6 animate-fadeIn">
            <div className="bg-[#FAF6EE] text-[#17233B] rounded-t-3xl sm:rounded-2xl max-w-4xl w-full mx-auto max-h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-[#C9A45C]/30">
              {/* Drawer Header */}
              <div className="bg-[#17233B] text-white p-5 flex items-center justify-between border-b border-[#C9A45C]/20">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-[#176B68] text-white flex items-center justify-center font-bold text-xs">
                    58
                  </span>
                  <div>
                    <h3 className="font-serif font-bold text-base sm:text-lg">
                      Diverse Indian Models — Virtual Fit &amp; Drape Roster
                    </h3>
                    <p className="text-xs text-stone-300">
                      Try on {selectedGender === 'women' ? '30 female' : '28 male'} real models across heights (5&apos;4&quot; - 6&apos;3&quot;), body types, and regions
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModelDrawerOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Drawer Filters Bar */}
              <div className="p-4 bg-white border-b border-stone-200 space-y-3">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={modelSearchQuery}
                      onChange={(e) => setModelSearchQuery(e.target.value)}
                      placeholder="Search by model name, city (e.g. Srinagar, Jaipur), or fit..."
                      className="w-full bg-[#FAF6EE] border border-stone-300 rounded-xl px-4 py-2 text-xs text-[#17233B] focus:outline-none focus:ring-2 focus:ring-[#176B68]"
                    />
                    {modelSearchQuery && (
                      <button
                        onClick={() => setModelSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {/* Height Filter Buttons */}
                  <div className="flex items-center gap-1 bg-[#FAF6EE] p-1 rounded-xl border border-stone-300 text-[11px]">
                    {(['all', 'petite', 'regular', 'tall'] as const).map((h) => (
                      <button
                        key={h}
                        onClick={() => setModelHeightFilter(h)}
                        className={`px-2.5 py-1 rounded-lg capitalize font-semibold transition-colors ${
                          modelHeightFilter === h
                            ? 'bg-[#17233B] text-white shadow-xs'
                            : 'text-stone-600 hover:text-[#17233B]'
                        }`}
                      >
                        {h === 'all' ? 'All Heights' : h === 'petite' ? 'Petite (<5\'6")' : h === 'regular' ? 'Mid (5\'6"-5\'9")' : 'Tall (5\'10"+)'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Region Filter Chips */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-[11px]">
                  {[
                    'All',
                    'Kashmir & Himalayas',
                    'North India',
                    'Western India',
                    'South India',
                    'Eastern India',
                    'North-East India',
                    'Central India',
                  ].map((reg) => (
                    <button
                      key={reg}
                      onClick={() => setModelRegionFilter(reg)}
                      className={`px-3 py-1 rounded-full whitespace-nowrap font-semibold border transition-all ${
                        modelRegionFilter === reg
                          ? 'bg-[#176B68] text-white border-[#176B68] shadow-xs'
                          : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
                      }`}
                    >
                      {reg === 'All' ? 'All Indian Regions' : reg}
                    </button>
                  ))}
                </div>
              </div>

              {/* Drawer Models Grid */}
              <div className="p-4 sm:p-6 overflow-y-auto max-h-[55vh] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {filteredModels.map((m) => {
                  const isSelected = currentModel.id === m.id
                  return (
                    <div
                      key={m.id}
                      onClick={() => {
                        triggerDrapeShift(() => {
                          setUserPhoto(null)
                          setSelectedModelId(m.id)
                          setCanvasViewMode('model')
                          setIsModelDrawerOpen(false)
                        })
                      }}
                      className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${
                        isSelected
                          ? 'bg-white border-[#17233B] ring-2 ring-[#C9A45C] shadow-md'
                          : 'bg-white/80 border-stone-200 hover:bg-white hover:border-[#176B68] shadow-xs'
                      }`}
                    >
                      <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-[#C9A45C]/50 flex-shrink-0 shadow-sm">
                        <Image src={m.avatar} alt={m.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <p className="font-serif font-bold text-xs text-[#17233B] truncate">
                            {m.name}
                          </p>
                          <span className="text-[10px] font-bold text-[#176B68] bg-[#176B68]/10 px-1.5 py-0.5 rounded">
                            {m.height}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-600 truncate">
                          {m.city}, {m.state}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-[9px] font-semibold text-[#704B32] bg-[#FAF6EE] px-1.5 py-0.5 rounded border border-[#C9A45C]/30">
                            {m.fitType}
                          </span>
                          <span className="text-[9px] text-stone-400">
                            B: {m.bustOrChest} · W: {m.waist}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}

                {filteredModels.length === 0 && (
                  <div className="col-span-full py-12 text-center text-stone-500 text-xs">
                    No models found matching your search. Try resetting filters.
                  </div>
                )}
              </div>

              {/* Drawer Footer */}
              <div className="p-3 bg-stone-100 border-t border-stone-200 flex items-center justify-between text-xs">
                <span className="text-stone-600">
                  Showing <strong>{filteredModels.length}</strong> of {genderModels.length} {selectedGender} models
                </span>
                <button
                  onClick={() => setIsModelDrawerOpen(false)}
                  className="px-4 py-1.5 bg-[#17233B] text-white rounded-lg font-bold text-xs hover:bg-[#10192A]"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
