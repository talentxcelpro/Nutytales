'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { ClothingProduct } from '@/lib/clothing-data'

interface GarmentViewer3DModalProps {
  product: ClothingProduct | null
  isOpen: boolean
  onClose: () => void
  onAddToCart?: (product: ClothingProduct) => void
}

export default function GarmentViewer3DModal({
  product,
  isOpen,
  onClose,
  onAddToCart,
}: GarmentViewer3DModalProps) {
  if (!isOpen || !product) return null

  const [activeAngle, setActiveAngle] = useState<'front' | 'back' | 'embroidery' | 'texture'>('front')
  const [selectedColorIdx, setSelectedColorIdx] = useState(0)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [rotationDeg, setRotationDeg] = useState(0)

  const currentColor = product.colorOptions[selectedColorIdx] || product.colorOptions[0]

  const getImageForAngle = () => {
    switch (activeAngle) {
      case 'front':
        return product.image
      case 'back':
        return product.secondaryImage || product.image
      case 'embroidery':
        return product.detailImage || product.image
      case 'texture':
        return product.textureImage || product.image
      default:
        return product.image
    }
  }

  const handleRotateLeft = () => setRotationDeg((prev) => (prev - 45 + 360) % 360)
  const handleRotateRight = () => setRotationDeg((prev) => (prev + 45) % 360)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#FAF6EE] text-[#17233B] rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border border-[#C9A45C]/30 max-h-[92vh] flex flex-col justify-between overflow-y-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#17233B] text-[#C9A45C] text-[10px] font-extrabold uppercase tracking-widest">
              <span>✦</span> 3D ATELIER INSPECTION
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#17233B] mt-1">
              {product.name}
            </h3>
            <p className="text-xs text-[#704B32]">
              {product.craft} · {product.material} · Origin: {product.provenance.origin}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-stone-200 hover:bg-stone-300 flex items-center justify-center text-stone-700 font-bold text-sm transition-colors"
          >
            ✕
          </button>
        </div>

        {/* 3D Visualizer Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main Inspection Canvas */}
          <div className="lg:col-span-8 relative aspect-[4/5] rounded-2xl overflow-hidden bg-white border border-stone-300 shadow-inner flex items-center justify-center">
            <div
              className="relative w-full h-full transition-transform duration-500 ease-out"
              style={{
                transform: `scale(${zoomLevel}) rotate(${rotationDeg}deg)`,
              }}
            >
              <Image
                src={getImageForAngle()}
                alt={product.name}
                fill
                className="object-contain p-4"
                sizes="(max-width: 1024px) 100vw, 60vw"
                priority
              />
            </div>

            {/* Interactive Stage Controls Floating Overlay */}
            <div className="absolute bottom-4 inset-x-4 flex items-center justify-between pointer-events-none">
              <div className="flex items-center gap-2 pointer-events-auto bg-[#17233B]/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 text-white text-xs">
                <button
                  type="button"
                  onClick={handleRotateLeft}
                  title="Rotate Left"
                  className="hover:text-[#C9A45C] px-1 font-bold"
                >
                  ↺ 45°
                </button>
                <span className="text-stone-400">|</span>
                <button
                  type="button"
                  onClick={handleRotateRight}
                  title="Rotate Right"
                  className="hover:text-[#C9A45C] px-1 font-bold"
                >
                  ↻ 45°
                </button>
                <span className="text-stone-400">|</span>
                <button
                  type="button"
                  onClick={() => setZoomLevel(zoomLevel === 1 ? 1.5 : 1)}
                  className="hover:text-[#C9A45C] px-1 font-bold"
                >
                  {zoomLevel === 1 ? '🔍 Zoom In' : '🔎 Reset'}
                </button>
              </div>

              <span className="text-[10px] text-[#17233B] bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-stone-200 font-bold shadow-xs pointer-events-auto">
                {activeAngle.toUpperCase()} VIEW
              </span>
            </div>
          </div>

          {/* Right Controls & Specs */}
          <div className="lg:col-span-4 space-y-5 text-xs">
            {/* View Angle Tabs */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#704B32] block">
                Inspection Angle
              </span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'front', label: 'Front Drape' },
                  { id: 'back', label: 'Back / Reverse' },
                  { id: 'embroidery', label: 'Needlework Close-Up' },
                  { id: 'texture', label: 'Fabric Weave' },
                ].map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => {
                      setActiveAngle(a.id as any)
                      setRotationDeg(0)
                    }}
                    className={`py-2 px-2.5 rounded-xl text-[11px] font-bold transition-all border ${
                      activeAngle === a.id
                        ? 'bg-[#17233B] text-white border-[#17233B] shadow-sm'
                        : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-300'
                    }`}
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Colour Switcher */}
            {product.colorOptions && product.colorOptions.length > 0 && (
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#704B32] block">
                  Colorway: {currentColor.name}
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.colorOptions.map((c, i) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setSelectedColorIdx(i)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all ${
                        selectedColorIdx === i
                          ? 'border-[#17233B] bg-white ring-2 ring-[#17233B]/20 font-bold'
                          : 'border-stone-300 bg-white hover:bg-stone-50 text-stone-600'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/20"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span className="text-[10px]">{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Authenticity Certificate Stamp */}
            <div className="p-3.5 bg-white rounded-2xl border border-stone-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-[#176B68]">
                  Verified Craft Provenance
                </span>
                {product.provenance.giTagCertified && (
                  <span className="text-[9px] font-extrabold text-[#704B32] bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    GI TAG CERTIFIED
                  </span>
                )}
              </div>
              <p className="text-[11px] text-stone-600">
                <strong>Artisan Guild:</strong> {product.provenance.artisanGroup}
              </p>
              <p className="text-[11px] text-stone-600">
                <strong>Handcrafted:</strong> ~{product.provenance.artisanHours} artisan hours
              </p>
              {product.provenance.giCertificateNo && (
                <p className="font-mono text-[10px] text-stone-500 pt-0.5">
                  Reg No: {product.provenance.giCertificateNo}
                </p>
              )}
            </div>

            {/* Commercial CTA */}
            <div className="pt-2 space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="font-serif font-bold text-xl text-[#17233B]">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-stone-400 line-through">
                  ₹{product.mrp.toLocaleString('en-IN')}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (onAddToCart) onAddToCart(product)
                  onClose()
                }}
                className="w-full py-3 bg-[#17233B] hover:bg-[#176B68] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-md"
              >
                Add to Bag from 3D View
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
