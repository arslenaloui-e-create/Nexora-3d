import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireUser } from '@/lib/auth';
import { notifyUser } from '@/lib/notify';
import { apiError, jsonError } from '@/lib/api';

// La messagerie est une conversation client <-> équipe Nexora : côté admin, tous les
// administrateurs voient les messages d'un client, quel que soit l'admin destinataire.
const people = { select: { id: true, firstName: true, lastName: true, role: true } };

export async function GET(req: Request) {
  try {
    const u = await requireUser();
    const clientId = u.role === 'ADMIN' ? new URL(req.url).searchParams.get('client') : u.id;
    if (!clientId) return jsonError('Client requis.');
    const rows = await db.chatMessage.findMany({
      where: { OR: [{ senderId: clientId }, { recipientId: clientId }] },
      include: { sender: people, recipient: people },
      orderBy: { createdAt: 'asc' },
      take: 500,
    });
    return NextResponse.json(rows);
  } catch (e) {
    return apiError(e);
  }
}

export async function POST(req: Request) {
  try {
    const u = await requireUser();
    const d = await req.json();
    const content = String(d.content || '').trim();
    if (!content) return jsonError('Le message est vide.');
    if (content.length > 5000) return jsonError('Message trop long (5 000 caractères maximum).');

    let recipientId = String(d.recipientId || '');
    if (u.role === 'CLIENT') {
      // Le client écrit à « Nexora » : on choisit l'admin actif le plus ancien si aucun n'est précisé.
      const admin = await db.user.findFirst({ where: { role: 'ADMIN', status: 'ACTIVE', ...(recipientId ? { id: recipientId } : {}) }, orderBy: { createdAt: 'asc' } });
      if (!admin) return jsonError('Aucun interlocuteur disponible pour le moment.', 503);
      recipientId = admin.id;
    } else {
      const client = await db.user.findFirst({ where: { id: recipientId, role: 'CLIENT' } });
      if (!client) return jsonError('Client introuvable.', 404);
    }
    const m = await db.chatMessage.create({ data: { senderId: u.id, recipientId, content }, include: { sender: people, recipient: people } });
    await notifyUser(recipientId, 'MESSAGE', `Nouveau message de ${u.firstName} ${u.lastName}.`);
    return NextResponse.json(m);
  } catch (e) {
    return apiError(e, 'Envoi impossible.');
  }
}

// Marque comme lus les messages reçus dans une conversation.
export async function PATCH(req: Request) {
  try {
    const u = await requireUser();
    const body = await req.json().catch(() => ({}));
    const where = u.role === 'ADMIN'
      ? { senderId: String(body.client || ''), recipient: { role: 'ADMIN' as const }, readAt: null }
      : { recipientId: u.id, readAt: null };
    await db.chatMessage.updateMany({ where, data: { readAt: new Date() } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return apiError(e);
  }
}
