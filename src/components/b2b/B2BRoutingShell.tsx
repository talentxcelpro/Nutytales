'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import B2BShell from '@/components/b2b/B2BShell'
import EnterpriseB2BShell from '@/components/b2b/EnterpriseB2BShell'

export default function B2BRoutingShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Clean path to handle subdomain rewriting or direct path
  const isPublicStorefront = pathname === '/b2b' || pathname === '/'

  if (isPublicStorefront) {
    return <B2BShell>{children}</B2BShell>
  }

  return <EnterpriseB2BShell>{children}</EnterpriseB2BShell>
}
