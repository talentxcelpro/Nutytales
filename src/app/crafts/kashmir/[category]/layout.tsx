import type { Metadata } from 'next'
import { CRAFT_CATEGORIES } from '@/lib/crafts-data'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>
}): Promise<Metadata> {
  const { category } = await params
  const matched = CRAFT_CATEGORIES.find((c) => c.slug === category)
  const label = matched ? matched.label : category

  return {
    title: `${label} — Kashmir Heritage Crafts | Nuty Tales Crafts`,
    description: `Browse authentic Kashmiri ${label.toLowerCase()} handcrafted by traditional master artisan guilds.`,
    alternates: {
      canonical: `https://crafts.nutytales.com/kashmir/${category}`,
    },
    openGraph: {
      title: `${label} — Kashmir Heritage Crafts`,
      url: `https://crafts.nutytales.com/kashmir/${category}`,
      siteName: 'Nuty Tales Crafts',
    },
  }
}

export default function KashmirCategoryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
