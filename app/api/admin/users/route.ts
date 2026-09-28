import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireUser } from '@/lib/auth';
import { apiError, jsonError } from '@/lib/api';

export async function GET() {
  try {
    await requireUser('ADMIN');
    return NextResponse.json(await db.user.findMany({
      select: { id: true, firstName: true, lastName: true, email: true, phone: true, company: true, role: true, status: true, emailVerifiedAt: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
      take: 500,
    }));
  } catch (e) {
    return apiError(e);
  }
}

export async function PATCH(req: Request) {
  try {
    const me = await requireUser('ADMIN');
    const d = await req.json();
    const id = String(d.id);
    if (id === me.id) return jsonError('Vous ne pouvez pas désactiver votre propre compte.', 400);
    const status = d.status === 'DISABLED' ? 'DISABLED' : 'ACTIVE';
    const u = await db.user.update({ where: { id }, data: { status }, select: { id: true, status: true } });
    return NextResponse.json(u);
  } catch (e) {
    return apiError(e);
  }
}
