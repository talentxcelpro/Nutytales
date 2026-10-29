import React from 'react'
import type { Metadata } from 'next'
import SellerNav from './SellerNav'
import { SellerProvider } from './SellerContext'

export const metadata: Metadata = {
  title: 'Nutytales | Seller Central',
  description:
    'Central operations and multi-vendor portal for independent farmers, producers, artisans and gifting suppliers.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  return (
    <SellerProvider>
      <div className="min-h-screen bg-[#FAF6EF] text-stone-900 flex flex-col font-sans">
        <SellerNav />
        <main className="lg:pl-72 flex-1 flex flex-col min-w-0">
          <div className="flex-1 p-2.5 sm:p-4 md:p-6 pb-24 lg:pb-8 max-w-7xl w-full mx-auto">
            {children}
          </div>
        </main>
      </div>
    </SellerProvider>
  )
}
