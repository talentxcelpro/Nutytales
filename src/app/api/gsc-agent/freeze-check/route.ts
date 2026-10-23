/**
 * GET /api/gsc-agent/freeze-check?url=<url>
 * Returns { frozen: true/false } for the 14-day freeze rule.
 * Protected by x-gsc-agent-secret header.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function isAuthorized(req: NextRequest): boolean {
  const secret = process.env.GSC_AGENT_SECRET;
  if (!secret) return true; // Not configured = allow (dev mode)
  return req.headers.get('x-gsc-agent-secret') === secret;
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url = req.nextUrl.searchParams.get('url');
  if (!url) {
    return NextResponse.json({ error: 'Missing url param' }, { status: 400 });
  }

  const now = new Date();

  const existing = await prisma.gscOptimizationLog.findFirst({
    where: {
      url,
      frozenUntil: { gt: now },
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ frozen: existing !== null, frozenUntil: existing?.frozenUntil ?? null });
}
