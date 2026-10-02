import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireUser } from '@/lib/auth';
import { apiError } from '@/lib/api';

export async function GET() {
  try {
    const u = await requireUser();
    const where = u.role === 'ADMIN' ? {} : { OR: [{ ownerId: u.id }, { project: { clientId: u.id } }, { request: { clientId: u.id } }] };
    const rows = await db.fileAsset.findMany({
      where,
      include: { project: { select: { id: true, title: true } }, request: { select: { id: true, title: true } }, owner: { select: { id: true, role: true } } },
      orderBy: { createdAt: 'desc' },
      take: 300,
    });
    return NextResponse.json(rows.map(({ storedName: _s, ...r }) => ({ ...r, mine: r.ownerId === u.id })));
  } catch (e) {
    return apiError(e);
  }
}
