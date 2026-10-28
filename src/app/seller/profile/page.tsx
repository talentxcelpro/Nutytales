'use client'

import React from 'react'
import { useSeller } from '../SellerContext'

export default function SellerProfilePage() {
  const { seller } = useSeller()

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between">
        <div>
          <span className="text-xs uppercase tracking-wider text-[#C5A869] font-bold">Account & Legal Identity</span>
          <h1 className="text-2xl font-serif font-bold text-[#1A3E2F] mt-1">{seller?.storeName}</h1>
          <p className="text-xs text-stone-500">
            Producer registry ID: <span className="font-mono font-semibold text-stone-700">{seller?.id}</span> · Status:{' '}
            <span className="capitalize font-bold text-emerald-800">{seller?.status}</span>
          </p>
        </div>
      </div>

      {/* Grid: Legal Info + Bank + KYC */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Business Profile */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4 text-xs">
          <h3 className="font-serif font-bold text-stone-900 text-base border-b border-stone-100 pb-2">
            Legal Business Profile
          </h3>

          <div className="space-y-3 text-stone-700">
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Legal Entity Name</span>
              <span className="font-semibold text-stone-900">{seller?.legalName}</span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Business Vertical Classification</span>
              <span className="capitalize font-semibold text-stone-900">{seller?.businessType}</span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Primary Contact Email</span>
              <span className="font-medium text-stone-900">{seller?.email}</span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Primary Contact Phone / WhatsApp</span>
              <span className="font-medium text-stone-900">{seller?.phone}</span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Warehouse Pickup Facility</span>
              <span className="text-stone-800 leading-relaxed block">{seller?.pickupAddress}</span>
              <span className="text-stone-500">{seller?.city}, {seller?.state} - {seller?.pincode}</span>
            </div>
          </div>
        </div>

        {/* Tax & Regulatory Compliance */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4 text-xs">
          <h3 className="font-serif font-bold text-stone-900 text-base border-b border-stone-100 pb-2">
            Tax & Regulatory Compliance
          </h3>

          <div className="space-y-3 text-stone-700">
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Permanent Account Number (PAN)</span>
              <span className="font-mono font-bold text-stone-900">{seller?.panNumber || 'Not provided'}</span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-stone-400 block">GSTIN Certificate</span>
              <span className="font-mono font-bold text-stone-900">{seller?.gstin || 'GST Exempt / Micro-producer'}</span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-stone-400 block">FSSAI Licence Number</span>
              <span className="font-mono font-bold text-stone-900">{seller?.fssaiNumber || 'Exempt (Handicrafts/Services)'}</span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-stone-400 block">GI Certifications / Guild Affiliation</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {seller?.giCertifications?.map((c: string, i: number) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200"
                  >
                    ✓ {c}
                  </span>
                )) || <span className="text-stone-400">None registered</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Bank & Settlement Details */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4 text-xs">
          <h3 className="font-serif font-bold text-stone-900 text-base border-b border-stone-100 pb-2">
            Settlement Bank Account
          </h3>

          <div className="space-y-3 text-stone-700">
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Bank Name</span>
              <span className="font-bold text-stone-900">{seller?.bankDetails.bankName}</span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Masked Account Number</span>
              <span className="font-mono font-bold text-stone-900">{seller?.bankDetails.accountNumberMasked}</span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-stone-400 block">IFSC Code</span>
              <span className="font-mono font-bold text-stone-900">{seller?.bankDetails.ifscCode}</span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Registered Beneficiary Name</span>
              <span className="font-semibold text-stone-900">{seller?.bankDetails.beneficiaryName}</span>
            </div>
          </div>
        </div>

        {/* Marketplace Terms & Verticals */}
        <div className="bg-[#FAF6EF] p-6 rounded-2xl border border-[#C5A869]/40 space-y-4 text-xs">
          <h3 className="font-serif font-bold text-[#1A3E2F] text-base border-b border-[#C5A869]/30 pb-2">
            Marketplace Terms & Distribution
          </h3>

          <div className="space-y-2.5 text-stone-800">
            <div className="flex justify-between py-1 border-b border-stone-200">
              <span className="text-stone-600">Standard Take-Rate:</span>
              <span className="font-bold text-emerald-800">{seller?.defaultCommissionRate}%</span>
            </div>
            <div className="flex justify-between py-1 border-b border-stone-200">
              <span className="text-stone-600">Disbursement Cycle:</span>
              <span className="font-bold">Bi-weekly (T+{seller?.settlementHoldDays} days)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-stone-200">
              <span className="text-stone-600">Account Onboarding:</span>
              <span className="font-mono text-stone-500">
                {seller?.createdAt ? new Date(seller.createdAt).toLocaleDateString('en-IN') : '2026-10-01'}
              </span>
            </div>
            <div>
              <span className="text-stone-600 block mb-1">Approved Category Hubs:</span>
              <div className="flex flex-wrap gap-1.5">
                {seller?.approvedCategories.map((c) => (
                  <span
                    key={c}
                    className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-stone-200 text-stone-800"
                  >
                    {c.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
