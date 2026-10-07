'use client'

import React from 'react'

interface SizeGuideModalProps {
  isOpen: boolean
  onClose: () => void
  category?: string
}

export default function SizeGuideModal({ isOpen, onClose, category = 'pherans' }: SizeGuideModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#FAF6EE] text-[#17233B] rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#C9A45C]/30 max-h-[90vh] overflow-y-auto space-y-6">
        <div className="flex items-center justify-between border-b border-stone-200 pb-4">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#704B32] block">
              Nuty Tales Atelier Sizing
            </span>
            <h3 className="font-serif text-2xl font-bold text-[#17233B]">
              Garment Sizing &amp; Fit Guide
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-stone-200 hover:bg-stone-300 flex items-center justify-center text-stone-700 font-bold text-sm transition-colors"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Pheran Fit Philosophy Note */}
        <div className="p-4 bg-white rounded-2xl border border-stone-200 space-y-2 text-xs leading-relaxed text-stone-700">
          <span className="text-[10px] uppercase font-bold text-[#176B68] block">
            🏔️ The Kashmiri Pheran Silhouette:
          </span>
          <p>
            Traditional Kashmiri Pherans are intentionally tailored with a <strong>relaxed, roomy silhouette</strong>. Historically, this allowed holding an earthenware Kangri beneath the garment and comfortably wearing thermal underlayers.
          </p>
          <p className="text-stone-500 italic text-[11px]">
            • If you prefer the <em>authentic traditional drape</em>: Choose your standard chest size or Free Size.<br />
            • If you prefer a <em>contemporary slimmer fit</em>: We recommend sizing one step down.
          </p>
        </div>

        {/* Women's & Men's Sizing Table */}
        <div className="space-y-3">
          <h4 className="font-serif font-bold text-sm text-[#17233B]">
            Pherans, Kurtas &amp; Jackets (Inches)
          </h4>
          <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#17233B] text-white text-[10px] uppercase tracking-wider">
                <tr>
                  <th className="p-3">Size Tag</th>
                  <th className="p-3">Body Chest</th>
                  <th className="p-3">Garment Chest</th>
                  <th className="p-3">Shoulder</th>
                  <th className="p-3">Length</th>
                  <th className="p-3">Sleeve</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 text-stone-700">
                <tr className="hover:bg-stone-50">
                  <td className="p-3 font-bold text-[#17233B]">XS (36)</td>
                  <td className="p-3">32" - 34"</td>
                  <td className="p-3">40"</td>
                  <td className="p-3">15.5"</td>
                  <td className="p-3">43"</td>
                  <td className="p-3">22"</td>
                </tr>
                <tr className="hover:bg-stone-50">
                  <td className="p-3 font-bold text-[#17233B]">S (38)</td>
                  <td className="p-3">34" - 36"</td>
                  <td className="p-3">42"</td>
                  <td className="p-3">16"</td>
                  <td className="p-3">44"</td>
                  <td className="p-3">22.5"</td>
                </tr>
                <tr className="hover:bg-stone-50">
                  <td className="p-3 font-bold text-[#17233B]">M (40)</td>
                  <td className="p-3">36" - 38"</td>
                  <td className="p-3">44"</td>
                  <td className="p-3">17"</td>
                  <td className="p-3">45"</td>
                  <td className="p-3">23"</td>
                </tr>
                <tr className="hover:bg-stone-50">
                  <td className="p-3 font-bold text-[#17233B]">L (42)</td>
                  <td className="p-3">38" - 40"</td>
                  <td className="p-3">46"</td>
                  <td className="p-3">18"</td>
                  <td className="p-3">46"</td>
                  <td className="p-3">23.5"</td>
                </tr>
                <tr className="hover:bg-stone-50">
                  <td className="p-3 font-bold text-[#17233B]">XL (44)</td>
                  <td className="p-3">40" - 42"</td>
                  <td className="p-3">48"</td>
                  <td className="p-3">19"</td>
                  <td className="p-3">46"</td>
                  <td className="p-3">24"</td>
                </tr>
                <tr className="hover:bg-stone-50">
                  <td className="p-3 font-bold text-[#17233B]">XXL (46)</td>
                  <td className="p-3">42" - 44"</td>
                  <td className="p-3">50"</td>
                  <td className="p-3">19.5"</td>
                  <td className="p-3">47"</td>
                  <td className="p-3">24.5"</td>
                </tr>
                <tr className="hover:bg-stone-50 bg-[#C9A45C]/10 font-medium">
                  <td className="p-3 font-bold text-[#704B32]">Free Size</td>
                  <td className="p-3">34" - 42"</td>
                  <td className="p-3">48" (Roomy)</td>
                  <td className="p-3">18"</td>
                  <td className="p-3">46"</td>
                  <td className="p-3">23"</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Shawls & Stoles Dimensions Guide */}
        <div className="space-y-3">
          <h4 className="font-serif font-bold text-sm text-[#17233B]">
            Shawls, Stoles &amp; Mufflers Dimensions
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-white rounded-xl border border-stone-200">
              <span className="font-bold text-[#17233B] block">Standard Shawl Wrap</span>
              <p className="text-stone-600 text-[11px] mt-0.5">200 cm × 100 cm (80" × 40")</p>
              <p className="text-stone-400 text-[10px] mt-1">Full body cocoon wrap for sub-zero chills &amp; royal drape.</p>
            </div>
            <div className="p-3 bg-white rounded-xl border border-stone-200">
              <span className="font-bold text-[#17233B] block">Everyday Stole</span>
              <p className="text-stone-600 text-[11px] mt-0.5">180 cm × 70 cm (70" × 28")</p>
              <p className="text-stone-400 text-[10px] mt-1">Versatile shoulder wrap for indoor office or evening travel.</p>
            </div>
            <div className="p-3 bg-white rounded-xl border border-stone-200">
              <span className="font-bold text-[#17233B] block">Men\'s Muffler</span>
              <p className="text-stone-600 text-[11px] mt-0.5">180 cm × 35 cm (70" × 14")</p>
              <p className="text-stone-400 text-[10px] mt-1">Neat Parisian or ascot loop inside overcoats and blazers.</p>
            </div>
          </div>
        </div>

        {/* Kids Sizing Reference */}
        <div className="space-y-2 text-xs">
          <h4 className="font-serif font-bold text-sm text-[#17233B]">Kids Sizing</h4>
          <p className="text-stone-600">
            Kids pherans are designed with growth ease (+2" tolerance). Sized by age: 2-3 Yrs, 4-5 Yrs, 6-7 Yrs, 8-9 Yrs, and 10-12 Yrs.
          </p>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#17233B] hover:bg-[#176B68] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  )
}
