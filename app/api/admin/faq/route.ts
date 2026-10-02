import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireUser } from '@/lib/auth';
import { faqSchema } from '@/lib/validators';
import { apiError, jsonError } from '@/lib/api';

export async function GET() {
  try {
    await requireUser('ADMIN');
    return NextResponse.json(await db.fAQ.findMany({ orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }] }));
  } catch (e) {
    return apiError(e);
  }
}

export async function POST(req: Request) {
  try {
    await requireUser('ADMIN');
    const d = faqSchema.parse(await req.json());
    return NextResponse.json(await db.fAQ.create({ data: { ...d, category: d.category || 'Général' } }));
  } catch (e) {
    return apiError(e);
  }
}

export async function PATCH(req: Request) {
  try {
    await requireUser('ADMIN');
    const body = await req.json();
    if (typeof body.id !== 'string') return jsonError('Question introuvable.', 404);
    const d = faqSchema.parse(body);
    return NextResponse.json(await db.fAQ.update({ where: { id: body.id }, data: { ...d, category: d.category || 'Général' } }));
  } catch (e) {
    return apiError(e);
  }
}

export async function DELETE(req: Request) {
  try {
    await requireUser('ADMIN');
    const id = new URL(req.url).searchParams.get('id');
    if (!id) return jsonError('Question introuvable.', 404);
    await db.fAQ.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return apiError(e);
  }
}
