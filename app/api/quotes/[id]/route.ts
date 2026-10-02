import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireUser } from '@/lib/auth';
import { quotePdf } from '@/lib/quote';
import { notifyAdmins } from '@/lib/notify';
import { apiError, jsonError } from '@/lib/api';

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  try {
    const u = await requireUser();
    const { id } = await params;
    const q = await db.quote.findUnique({ where: { id }, include: { client: true, lines: { orderBy: { position: 'asc' } } } });
    // Un brouillon n'existe pas encore pour le client.
    if (!q || (u.role !== 'ADMIN' && (q.clientId !== u.id || q.status === 'DRAFT'))) return jsonError('Devis introuvable.', 404);
    const s = await db.siteSettings.findUnique({ where: { id: 1 } });
    const pdf = await quotePdf(q, s);
    return new NextResponse(Buffer.from(pdf), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="devis-${q.number}.pdf"`,
        'Cache-Control': 'private, no-store',
      },
    });
  } catch (e) {
    return apiError(e, 'Impossible de générer le PDF.');
  }
}

// Réponse du client : { action: 'accept' | 'reject' } sur un devis envoyé et encore valable.
export async function PATCH(req: Request, { params }: Ctx) {
  try {
    const u = await requireUser('CLIENT');
    const { id } = await params;
    const { action } = await req.json();
    if (action !== 'accept' && action !== 'reject') return jsonError('Action inconnue.');
    const q = await db.quote.findFirst({ where: { id, clientId: u.id } });
    if (!q || q.status === 'DRAFT') return jsonError('Devis introuvable.', 404);
    if (q.status !== 'SENT') return jsonError('Ce devis a déjà reçu une réponse.', 409);
    if (q.validUntil < new Date()) {
      await db.quote.update({ where: { id }, data: { status: 'EXPIRED' } });
      return jsonError('Ce devis a expiré. Demandez-en une nouvelle version dans la messagerie.', 409);
    }
    const status = action === 'accept' ? 'ACCEPTED' : 'REJECTED';
    await db.$transaction([
      db.quote.update({ where: { id }, data: { status } }),
      ...(q.requestId ? [db.quoteRequest.update({ where: { id: q.requestId }, data: { status } })] : []),
    ]);
    await notifyAdmins('QUOTE', `${u.firstName} ${u.lastName} a ${action === 'accept' ? 'accepté' : 'refusé'} le devis ${q.number}.`);
    return NextResponse.json({ message: action === 'accept' ? 'Devis accepté. Nous revenons vers vous pour lancer le projet.' : 'Devis refusé.' });
  } catch (e) {
    return apiError(e);
  }
}
