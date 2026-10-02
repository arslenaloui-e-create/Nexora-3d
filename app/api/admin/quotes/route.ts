import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { db } from '@/lib/db';
import { requireUser } from '@/lib/auth';
import { quoteCreateSchema, quoteStatus } from '@/lib/validators';
import { escapeHtml, sendMail } from '@/lib/mail';
import { notifyUser } from '@/lib/notify';
import { apiError, jsonError } from '@/lib/api';

const include = {
  client: { select: { id: true, firstName: true, lastName: true, email: true } },
  request: { select: { id: true, title: true } },
  lines: { orderBy: { position: 'asc' as const } },
};

export async function GET() {
  try {
    await requireUser('ADMIN');
    return NextResponse.json(await db.quote.findMany({ include, orderBy: { createdAt: 'desc' }, take: 500 }));
  } catch (e) {
    return apiError(e);
  }
}

// Numérotation lisible et continue par année : NX-2026-0001, NX-2026-0002...
async function nextNumber() {
  const prefix = `NX-${new Date().getFullYear()}-`;
  const last = await db.quote.findFirst({ where: { number: { startsWith: prefix } }, orderBy: { number: 'desc' }, select: { number: true } });
  const n = last ? Number(last.number.slice(prefix.length)) || 0 : 0;
  return `${prefix}${String(n + 1).padStart(4, '0')}`;
}

async function announce(q: { id: string; number: string; clientId: string; requestId: string | null }) {
  await notifyUser(q.clientId, 'QUOTE', `Votre devis ${q.number} est disponible.`);
  if (q.requestId) await db.quoteRequest.update({ where: { id: q.requestId }, data: { status: 'QUOTED' } });
  const c = await db.user.findUnique({ where: { id: q.clientId } });
  if (c) {
    const url = `${process.env.APP_URL || ''}/dashboard/quotes`;
    await sendMail(c.email, `Votre devis Nexora 3D ${q.number}`, `<p>Bonjour ${escapeHtml(c.firstName)},</p><p>Votre devis ${q.number} est disponible dans votre espace client : <a href="${url}">${url}</a></p>`);
  }
}

export async function POST(req: Request) {
  try {
    await requireUser('ADMIN');
    const d = quoteCreateSchema.parse(await req.json());
    const client = await db.user.findFirst({ where: { id: d.clientId, role: 'CLIENT' } });
    if (!client) return jsonError('Client introuvable.', 404);
    if (d.requestId) {
      const r = await db.quoteRequest.findUnique({ where: { id: d.requestId } });
      if (!r || r.clientId !== d.clientId) return jsonError('Cette demande n’appartient pas à ce client.');
    }
    const lines = d.lines.map((x, i) => ({ ...x, position: i }));
    const subtotal = lines.reduce((s, x) => s + x.quantity * x.unitPrice, 0);
    const ht = Math.max(0, subtotal - d.discount);
    const ttc = ht * (1 + d.taxRate / 100);
    const round = (v: number) => Math.round(v * 100) / 100;

    let q;
    for (let attempt = 0; ; attempt++) {
      try {
        q = await db.quote.create({
          data: {
            number: await nextNumber(), clientId: d.clientId, requestId: d.requestId || null,
            discount: d.discount, taxRate: d.taxRate, totalHT: round(ht), totalTTC: round(ttc),
            validUntil: new Date(`${d.validUntil}T23:59:59`), status: d.send ? 'SENT' : 'DRAFT',
            conditions: d.conditions || 'Paiement selon accord entre les parties.', notes: d.notes || null,
            lines: { create: lines },
          },
          include,
        });
        break;
      } catch (e) {
        if (attempt < 3 && e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') continue;
        throw e;
      }
    }
    if (d.send) await announce(q);
    return NextResponse.json(q);
  } catch (e) {
    return apiError(e);
  }
}

// { id, status } change le statut. Passer de Brouillon à Envoyé prévient le client.
export async function PATCH(req: Request) {
  try {
    await requireUser('ADMIN');
    const body = await req.json();
    const status = quoteStatus.parse(body.status);
    const old = await db.quote.findUnique({ where: { id: String(body.id) } });
    if (!old) return jsonError('Devis introuvable.', 404);
    const q = await db.quote.update({ where: { id: old.id }, data: { status }, include });
    if (old.status === 'DRAFT' && status === 'SENT') await announce(q);
    return NextResponse.json(q);
  } catch (e) {
    return apiError(e);
  }
}

export async function DELETE(req: Request) {
  try {
    await requireUser('ADMIN');
    const id = new URL(req.url).searchParams.get('id') || '';
    const q = await db.quote.findUnique({ where: { id } });
    if (!q) return jsonError('Devis introuvable.', 404);
    if (q.status !== 'DRAFT') return jsonError('Seul un brouillon peut être supprimé. Un devis envoyé reste dans l’historique du client.', 409);
    await db.quote.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return apiError(e);
  }
}
