'use client'

import React from 'react'
import dynamic from 'next/dynamic'

const CartDrawer = dynamic(() => import('@/components/cart/CartDrawer'), { ssr: false })
const SIFloatingAssistant = dynamic(() => import('@/components/si/SIFloatingAssistant'), { ssr: false })
const AuthModal = dynamic(() => import('@/components/auth/AuthModal'), { ssr: false })

export default function ClientInteractiveOverlays() {
  return (
    <>
      <CartDrawer />
      <SIFloatingAssistant />
      <AuthModal />
    </>
  )
}
