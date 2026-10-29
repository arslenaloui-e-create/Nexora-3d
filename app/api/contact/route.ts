import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { contactSchema } from '@/lib/validators';
import { rateLimit } from '@/lib/rate-limit';
import { adminInbox, escapeHtml, sendMail } from '@/lib/mail';
import { notifyAdmins } from '@/lib/notify';
import { apiError, clientIp, jsonError } from '@/lib/api';

export async function POST(req: Request) {
  try {
    if (!rateLimit(`contact:${clientIp(req)}`, 5, 60_000)) return jsonError('Trop de messages envoyés. Réessayez dans une minute.', 429);
    const d = contactSchema.parse(await req.json());
    if (d.website) return NextResponse.json({ message: 'Message envoyé.' });
    const row = await db.contactMessage.create({ data: { name: d.name, email: d.email, phone: d.phone || null, subject: d.subject, message: d.message } });
        try {
      await notifyAdmins(
        'CONTACT',
        `Nouveau message de ${row.name} : ${row.subject}`,
      );
    } catch (error) {
      console.error('CONTACT_INTERNAL_NOTIFICATION_FAILED', {
        messageId: row.id,
      });
    }

    const emailSent = await sendMail(
      adminInbox(),
      `Contact — ${row.subject}`,
      `
        <h2>Nouveau message depuis le site Nexora 3D</h2>
        <p><strong>Nom :</strong> ${escapeHtml(row.name)}</p>
        <p><strong>E-mail :</strong> ${escapeHtml(row.email)}</p>
        ${row.phone ? `<p><strong>Téléphone :</strong> ${escapeHtml(row.phone)}</p>` : ''}
        <p><strong>Sujet :</strong> ${escapeHtml(row.subject)}</p>
        <p><strong>Message :</strong></p>
        <p style="white-space:pre-wrap">${escapeHtml(row.message)}</p>
      `,
    );

    if (!emailSent) {
      console.error('CONTACT_EMAIL_FAILED', {
        messageId: row.id,
      });
    }
    return NextResponse.json({ message: 'Message envoyé. Nous vous répondons par email, en général sous 24 h.' });
  } catch (e) {
    return apiError(e, 'Envoi impossible pour le moment.');
  }
}
