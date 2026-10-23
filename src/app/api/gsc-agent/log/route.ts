/**
 * POST /api/gsc-agent/log
 * Writes a GscOptimizationLog row and marks the URL frozen for 14 days.
 * Protected by x-gsc-agent-secret header.
 */

import { NextRequest, NextResponse } from 'next/server';
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
    url,
    property,
    bucket,
    action,
    oldTitle,
    newTitle,
    oldDescription,
    newDescription,
    faqInjected,
    pageSlug,
    ctrBefore,
    impressionsBefore,
    clicksBefore,
    positionBefore,
  } = body;

  if (!url || !property || !bucket || !action) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const frozenUntil = new Date();
  frozenUntil.setDate(frozenUntil.getDate() + 14);

  const log = await prisma.gscOptimizationLog.create({
    data: {
      url,
      property,
      bucket,
      action,
      oldTitle: oldTitle ?? null,
      newTitle: newTitle ?? null,
      oldDescription: oldDescription ?? null,
      newDescription: newDescription ?? null,
      faqInjected: faqInjected ?? undefined,
      pageSlug: pageSlug ?? null,
      ctrBefore: ctrBefore ?? null,
      impressionsBefore: impressionsBefore ?? null,
      clicksBefore: clicksBefore ?? null,
      positionBefore: positionBefore ?? null,
      outcome: 'pending',
      frozenUntil,
    },
  });

  return NextResponse.json({ ok: true, id: log.id, frozenUntil });
}
