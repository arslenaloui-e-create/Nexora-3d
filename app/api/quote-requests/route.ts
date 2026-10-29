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
        try {
      await notifyAdmins(
        'QUOTE_REQUEST',
        `Nouvelle demande de ${u.firstName} ${u.lastName} : ${q.title}`,
      );
    } catch {
      console.error('QUOTE_INTERNAL_NOTIFICATION_FAILED', {
        quoteRequestId: q.id,
      });
    }

    const adminEmailSent = await sendMail(
      adminInbox(),
      `Nouvelle demande de devis — ${q.title}`,
      `
        <h2>Nouvelle demande de devis</h2>
        <p><strong>Client :</strong> ${escapeHtml(u.firstName)} ${escapeHtml(u.lastName)}</p>
        <p><strong>E-mail :</strong> ${escapeHtml(u.email)}</p>
        <p><strong>Service :</strong> ${escapeHtml(q.serviceType)}</p>
        <p><strong>Titre :</strong> ${escapeHtml(q.title)}</p>
        <p><strong>Description :</strong></p>
        <p style="white-space:pre-wrap">${escapeHtml(q.description)}</p>
        ${q.dimensions ? `<p><strong>Dimensions :</strong> ${escapeHtml(q.dimensions)}</p>` : ''}
        ${q.quantity != null ? `<p><strong>Quantité :</strong> ${q.quantity}</p>` : ''}
        ${q.material ? `<p><strong>Matériau :</strong> ${escapeHtml(q.material)}</p>` : ''}
        ${q.budget != null ? `<p><strong>Budget :</strong> ${q.budget}</p>` : ''}
      `,
    );

    if (!adminEmailSent) {
      console.error('QUOTE_ADMIN_EMAIL_FAILED', {
        quoteRequestId: q.id,
      });
    }

    const clientEmailSent = await sendMail(
      u.email,
      'Confirmation de votre demande de devis — Nexora 3D',
      `
        <h2>Nous avons bien reçu votre demande !</h2>
        <p>Bonjour ${escapeHtml(u.firstName)},</p>
        <p>Votre demande de devis a été enregistrée avec succès.</p>
        <p><strong>Référence :</strong> ${escapeHtml(q.id)}</p>
        <p><strong>Projet :</strong> ${escapeHtml(q.title)}</p>
        <p>Notre équipe examinera votre demande et reviendra vers vous.</p>
        <p>Merci de faire confiance à Nexora 3D.</p>
      `,
    );

    if (!clientEmailSent) {
      console.error('QUOTE_CLIENT_EMAIL_FAILED', {
        quoteRequestId: q.id,
      });
    }
    return NextResponse.json({ message: 'Demande envoyée.', id: q.id });
  } catch (e) {
    if (e instanceof Error && e.message === 'FORBIDDEN') return jsonError('Les demandes de devis se font depuis un compte client.', 403);
    return apiError(e, 'Impossible d’envoyer la demande pour le moment.');
  }
}
