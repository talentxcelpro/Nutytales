/**
 * POST /api/gsc-agent/create-page
 * Inserts a new SeoPageRecord (Bucket C: new acquisition page).
 * Protected by x-gsc-agent-secret header.
 */

import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';

function isAuthorized(req: NextRequest): boolean {
  const secret = process.env.GSC_AGENT_SECRET;
  if (!secret) return true;
  return req.headers.get('x-gsc-agent-secret') === secret;
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const {
    business,
    slug,
    canonicalUrl,
    title,
    metaDescription,
    h1,
    intro,
    faqBlocks,
    commercialCta,
    sourceQuery,
    impressions,
  } = body;

  if (!slug || !canonicalUrl || !title || !h1) {
    return NextResponse.json({ error: 'Missing required fields: slug, canonicalUrl, title, h1' }, { status: 400 });
  }

  // Check for existing slug to avoid duplicates
  const existing = await prisma.seoPageRecord.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json({ ok: true, skipped: true, reason: 'Slug already exists', id: existing.id });
  }

  const page = await prisma.seoPageRecord.create({
    data: {
      business: business || 'root',
      pageType: 'acquisition',
      intentType: 'transactional',
      slug,
      canonicalUrl,
      title,
      metaDescription: metaDescription || '',
      h1,
      intro: intro || null,
      faqBlocks: faqBlocks || undefined,
      commercialCta: commercialCta || undefined,
      // Store source query in contentBlocks for transparency / audit
      contentBlocks: {
        sourceQuery,
        impressionsAtCreation: impressions,
        generatedByAgent: 'gsc-acquisition-agent',
        generatedAt: new Date().toISOString(),
      },
      indexabilityStatus: 'published',
      robotsDirective: 'index,follow',
      canonicalStatus: 'canonical',
      publishedAt: new Date(),
      qualityScore: 60, // AI-generated baseline; improves after human review
      demandScore: Math.min(100, Math.round((impressions || 0) / 10)),
      commercialScore: 70,
      language: 'en',
      currency: 'INR',
    },
  });

  // Revalidate the dynamic SEO page route immediately
  try {
    revalidatePath(`/${slug}`);
  } catch {
    // revalidatePath may not work in script context — harmless
  }

  return NextResponse.json({ ok: true, id: page.id, slug, canonicalUrl });
}
