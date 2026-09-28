import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireUser } from '@/lib/auth';
import { apiError, jsonError } from '@/lib/api';

// Messages reçus via le formulaire de contact public.
export async function GET() {
  try {
    await requireUser('ADMIN');
    return NextResponse.json(await db.contactMessage.findMany({ orderBy: { createdAt: 'desc' }, take: 500 }));
  } catch (e) {
    return apiError(e);
  }
}

export async function PATCH(req: Request) {
  try {
    await requireUser('ADMIN');
    const d = await req.json();
    if (!['NEW', 'READ', 'ARCHIVED'].includes(d.status)) return jsonError('Statut inconnu.');
    return NextResponse.json(await db.contactMessage.update({ where: { id: String(d.id) }, data: { status: d.status } }));
  } catch (e) {
    return apiError(e);
  }
}

export async function DELETE(req: Request) {
  try {
    await requireUser('ADMIN');
    const id = new URL(req.url).searchParams.get('id');
    if (!id) return jsonError('Message introuvable.', 404);
    await db.contactMessage.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return apiError(e);
  }
}
