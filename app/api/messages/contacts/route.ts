import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await requireUser('CLIENT');
    const admins = await db.user.findMany({
      where: { role: 'ADMIN', status: 'ACTIVE' },
      select: { id: true, firstName: true, lastName: true },
      orderBy: { createdAt: 'asc' },
      take: 20,
    });
    return NextResponse.json(admins.filter(admin => admin.id !== user.id));
  } catch {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
}
