import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Quality & Certificates Document Centre | Nuty Tales Business',
  description:
    'Traceable digital lot records, NABL analytical assays, GI Tag certifications, and FSSAI Central audit records for bulk procurement.',
  alternates: {
    canonical: 'https://business.nutytales.com/b2b/certificates',
  },
}

export default function CertificatesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
