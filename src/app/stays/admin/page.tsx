import React from 'react'
import type { Metadata } from 'next'
import StaysAdminClient from './StaysAdminClient'

export const metadata: Metadata = {
  title: 'Stays Marketplace Admin Operations | Nuty Tales',
  description: 'Manage property approvals, host deed verification, financial reconciliation, and dispute resolution.',
  robots: 'noindex,nofollow',
}

export default function StaysAdminPage() {
  return <StaysAdminClient />
}
