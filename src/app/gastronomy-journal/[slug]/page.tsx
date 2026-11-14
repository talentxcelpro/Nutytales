import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { JOURNAL_ARTICLES, getJournalArticleById, getAllJournalSlugs } from '@/lib/journal-data'
import ArticleDetailClient from './ArticleDetailClient'

interface ArticlePageProps {
  params: Promise<{ slug: string }>
}

export const revalidate = 86400 // 24-hour Edge ISR

export async function generateStaticParams() {
  const slugs = getAllJournalSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params
  const article = getJournalArticleById(slug)

  if (!article) {
    return {
      title: 'Monograph Not Found | The Gastronomy Journal',
      description: 'The requested archival monograph could not be found.',
    }
  }

  const canonicalUrl = `https://nutytales.com/gastronomy-journal/${article.id}`
  const title = `${article.title} | Nuty Tales Gastronomy Journal`
  const description = article.summary

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'Nuty Tales Gastronomy Journal',
      locale: 'en_IN',
      type: 'article',
      images: [
        {
          url: article.heroImage || 'https://nutytales.com/images/saffron-threads-macro.jpg',
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [article.heroImage || 'https://nutytales.com/images/saffron-threads-macro.jpg'],
    },
  }
}

export default async function GastronomyArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params
  const article = getJournalArticleById(slug)

  if (!article) {
    notFound()
  }

  const canonicalUrl = `https://nutytales.com/gastronomy-journal/${article.id}`

  // 1. Schema.org Article Structured Data
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
    headline: article.title,
    description: article.summary,
    image: [
      article.heroImage.startsWith('http')
        ? article.heroImage
        : `https://nutytales.com${article.heroImage}`,
    ],
    author: {
      '@type': 'Organization',
      name: 'Nuty Tales Himalayan Terroir & Botanical Science Archives',
      url: 'https://nutytales.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Nuty Tales',
      url: 'https://nutytales.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://nutytales.com/images/logo.jpg',
      },
    },
    datePublished: '2026-01-15T08:00:00+05:30',
    dateModified: '2026-11-14T08:00:00+05:30',
  }

  // 2. Schema.org HowTo Structured Data (for SERP rich step accordions)
  const howToJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: article.theProtocol.heading,
    description: `${article.title} — Step-by-step masterclass protocol.`,
    step: article.theProtocol.steps.map((s, idx) => ({
      '@type': 'HowToStep',
      position: idx + 1,
      name: s.stepTitle,
      text: s.instruction,
    })),
  }

  // 3. Schema.org BreadcrumbList Structured Data
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://nutytales.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'The Gastronomy Journal',
        item: 'https://nutytales.com/gastronomy-journal',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: article.title,
        item: canonicalUrl,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ArticleDetailClient article={article} />
    </>
  )
}
