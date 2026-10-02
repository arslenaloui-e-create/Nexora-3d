import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireUser } from '@/lib/auth';
import { apiError } from '@/lib/api';

// PATCH {} marque tout comme lu ; PATCH {id} marque une seule notification.
export async function PATCH(req: Request) {
  try {
    const u = await requireUser();
    const body = await req.json().catch(() => ({}));
    const id = typeof body?.id === 'string' ? body.id : undefined;
    await db.notification.updateMany({ where: { userId: u.id, readAt: null, ...(id ? { id } : {}) }, data: { readAt: new Date() } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return apiError(e);
  }
}

// DELETE ?id=... supprime une notification ; sans id, supprime toutes celles déjà lues.
export async function DELETE(req: Request) {
  try {
    const u = await requireUser();
    const id = new URL(req.url).searchParams.get('id');
    await db.notification.deleteMany({ where: id ? { id, userId: u.id } : { userId: u.id, readAt: { not: null } } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return apiError(e);
  }
}
