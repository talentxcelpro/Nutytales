/**
 * POST /api/gsc-agent/inject-faq
 * Appends FAQ blocks to an existing SeoPageRecord (Bucket B: Page-2 boost).
 * Merges new FAQs with any existing faqBlocks — does not overwrite.
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
  const { url, query, faqs } = body;

  if (!url || !Array.isArray(faqs)) {
    return NextResponse.json({ error: 'Missing url or faqs' }, { status: 400 });
  }

  // Try to find SeoPageRecord by canonicalUrl
  const existing = await prisma.seoPageRecord.findFirst({
    where: { canonicalUrl: url },
  });

  if (!existing) {
    // No SeoPageRecord for this URL — that's OK (it's a static Next.js page).
    // We log this as a signal for future manual review.
    console.log(`[inject-faq] No SeoPageRecord found for ${url} — static page, skipping DB write.`);
    return NextResponse.json({ ok: true, skipped: true, reason: 'No SeoPageRecord for URL' });
  }

  const existingFaqs = (existing.faqBlocks as { question: string; answer: string }[]) || [];
  const existingQuestions = new Set(existingFaqs.map((f) => f.question.toLowerCase()));

  // Merge: only add FAQs with new questions
  const newFaqs = (faqs as { question: string; answer: string }[]).filter(
    (f) => !existingQuestions.has(f.question.toLowerCase())
  );

  const mergedFaqs = [
    ...existingFaqs,
    ...newFaqs.map((f) => ({
      ...f,
      sourceQuery: query,
      addedByAgent: true,
      addedAt: new Date().toISOString(),
    })),
  ];

  await prisma.seoPageRecord.update({
    where: { id: existing.id },
    data: {
      faqBlocks: mergedFaqs,
      updatedAt: new Date(),
    },
  });

  // Revalidate the page cache
  try {
    const slug = existing.slug;
    revalidatePath(`/${slug}`);
  } catch {
    // Harmless in script context
  }

  return NextResponse.json({ ok: true, merged: newFaqs.length, total: mergedFaqs.length });
}
