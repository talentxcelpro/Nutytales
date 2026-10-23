import React from 'react'
import type { Metadata } from 'next'
import WishlistClient from './WishlistClient'

export const metadata: Metadata = {
  title: 'Saved Residences & Wishlist | Nuty Tales Stays',
  description: 'Saved boutique estates, ski chalets, and cedar houseboats.',
  robots: 'noindex,nofollow',
}

export default function WishlistPage() {
  return <WishlistClient />
}
