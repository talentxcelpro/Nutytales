import type { Metadata } from 'next'
import WeddingWorkspaceClient from './WeddingWorkspaceClient'

export const metadata: Metadata = {
  title: 'Destination Wedding Budget & Planning Workspace | Nuty Tales Weddings',
  description:
    'Interactive 6-milestone budget planner and concierge intake for destination weddings in Kashmir and luxury hubs. Direct venue and trousseau favor scoping.',
  alternates: {
    canonical: 'https://weddings.nutytales.com/workspace',
  },
  openGraph: {
    title: 'Destination Wedding Budget & Planning Workspace | Nuty Tales Weddings',
    description:
      'Interactive 6-milestone budget planner and concierge intake for destination weddings.',
    url: 'https://weddings.nutytales.com/workspace',
    siteName: 'Nuty Tales Weddings',
    locale: 'en_IN',
    type: 'website',
  },
}

export default function WeddingWorkspacePage() {
  return <WeddingWorkspaceClient />
}
