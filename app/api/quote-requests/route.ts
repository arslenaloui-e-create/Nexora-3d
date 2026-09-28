import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireUser } from '@/lib/auth';
import { quoteRequestSchema } from '@/lib/validators';
import { adminInbox, escapeHtml, sendMail } from '@/lib/mail';
import { notifyAdmins } from '@/lib/notify';
import { rateLimit } from '@/lib/rate-limit';
import { apiError, jsonError } from '@/lib/api';

export async function POST(req: Request) {
  try {
    const u = await requireUser('CLIENT');
    if (!rateLimit(`request:${u.id}`, 10, 60 * 60_000)) return jsonError('Trop de demandes envoyées. Réessayez plus tard.', 429);
    const d = quoteRequestSchema.parse(await req.json());
    const q = await db.quoteRequest.create({
      data: {
        clientId: u.id, serviceType: d.serviceType, title: d.title, description: d.description,
        dimensions: d.dimensions || null, quantity: d.quantity ?? null, material: d.material || null, tolerance: d.tolerance || null,
        budget: d.budget ?? null, deadline: d.deadline ? new Date(`${d.deadline}T23:59:59`) : null,
      },
    });
    await notifyAdmins('QUOTE_REQUEST', `Nouvelle demande de ${u.firstName} ${u.lastName} : ${q.title}`);
    await sendMail(
      adminInbox(),
      `Nouvelle demande de devis — ${q.title}`,
      `<p><b>${escapeHtml(u.firstName)} ${escapeHtml(u.lastName)}</b> (${escapeHtml(u.email)})</p><p>${escapeHtml(q.serviceType)} — ${escapeHtml(q.title)}</p><p style="white-space:pre-wrap">${escapeHtml(q.description)}</p>`,
    );
    return NextResponse.json({ message: 'Demande envoyée.', id: q.id });
  } catch (e) {
    if (e instanceof Error && e.message === 'FORBIDDEN') return jsonError('Les demandes de devis se font depuis un compte client.', 403);
    return apiError(e, 'Impossible d’envoyer la demande pour le moment.');
  }
}
