import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireUser } from '@/lib/auth';
import { apiError } from '@/lib/api';

// Côté admin : liste des clients avec le nombre de messages non lus et le dernier échange.
export async function GET() {
  try {
    await requireUser('ADMIN');
    const clients = await db.user.findMany({
      where: { role: 'CLIENT' },
      select: { id: true, firstName: true, lastName: true, email: true, company: true },
      orderBy: { createdAt: 'desc' },
      take: 500,
    });
    const [unread, last] = await Promise.all([
      db.chatMessage.groupBy({ by: ['senderId'], where: { readAt: null, recipient: { role: 'ADMIN' } }, _count: true }),
      db.chatMessage.groupBy({ by: ['senderId', 'recipientId'], _max: { createdAt: true } }),
    ]);
    const unreadBy = new Map(unread.map(r => [r.senderId, r._count]));
    const lastBy = new Map<string, number>();
    for (const r of last) {
      const t = r._max.createdAt?.getTime() || 0;
      for (const id of [r.senderId, r.recipientId]) lastBy.set(id, Math.max(lastBy.get(id) || 0, t));
    }
    const rows = clients
      .map(c => ({ ...c, unread: unreadBy.get(c.id) || 0, lastAt: lastBy.get(c.id) || 0 }))
      .sort((a, b) => b.unread - a.unread || b.lastAt - a.lastAt);
    return NextResponse.json(rows);
  } catch (e) {
    return apiError(e);
  }
}
