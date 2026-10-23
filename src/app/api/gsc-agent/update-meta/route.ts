/**
 * POST /api/gsc-agent/update-meta
 * Updates title + metaDescription on an existing SeoPageRecord (Bucket A: CTR fix).
 * For static Next.js pages (no SeoPageRecord), stores the suggestion in GscOptimizationLog
 * for manual application.
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
  const { url, title, description } = body;

  if (!url || !title || !description) {
    return NextResponse.json({ error: 'Missing url, title, or description' }, { status: 400 });
  }

  // Try to find SeoPageRecord by canonicalUrl
  const existing = await prisma.seoPageRecord.findFirst({
    where: { canonicalUrl: url },
  });

  if (existing) {
    await prisma.seoPageRecord.update({
      where: { id: existing.id },
      data: {
        title,
        metaDescription: description,
        updatedAt: new Date(),
      },
    });

    try {
      revalidatePath(`/${existing.slug}`);
    } catch {
      // Harmless in script context
    }

    return NextResponse.json({ ok: true, updated: true, id: existing.id });
  }

  // Static page — log suggestion for manual review
  // (The GscOptimizationLog entry is already written by the /log endpoint)
  return NextResponse.json({
    ok: true,
    updated: false,
    note: 'Static Next.js page — suggestion stored in GscOptimizationLog for manual review',
    suggestedTitle: title,
    suggestedDescription: description,
  });
}
