'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import B2BShell from '@/components/b2b/B2BShell'
import EnterpriseB2BShell from '@/components/b2b/EnterpriseB2BShell'

export default function B2BRoutingShell({ children }: { children: React.ReactNode }) {
  // Always render the enterprise platform shell for business.nutytales.com
  return <EnterpriseB2BShell>{children}</EnterpriseB2BShell>
}

