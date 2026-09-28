import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashToken, randomToken } from '@/lib/security';
import { sendMail } from '@/lib/mail';
import { rateLimit } from '@/lib/rate-limit';
import { apiError, clientIp, jsonError } from '@/lib/api';

// Même réponse que le compte existe ou non, pour ne pas révéler quels emails sont inscrits.
const MESSAGE = 'Si un compte existe avec cet email, un lien de réinitialisation vient d’être envoyé.';

export async function POST(req: Request) {
  try {
    if (!rateLimit(`forgot:${clientIp(req)}`, 5, 15 * 60_000)) return jsonError('Trop de demandes. Réessayez dans quelques minutes.', 429);
    const { email } = await req.json();
    const u = await db.user.findUnique({ where: { email: String(email || '').toLowerCase().trim() } });
    if (u && u.status === 'ACTIVE') {
      const raw = randomToken();
      await db.passwordResetToken.create({ data: { userId: u.id, tokenHash: hashToken(raw), expiresAt: new Date(Date.now() + 3600000) } });
      const url = `${process.env.APP_URL || 'http://localhost:3000'}/auth/reset?token=${raw}`;
      await sendMail(u.email, 'Réinitialisation de votre mot de passe Nexora 3D', `<p>Ce lien est valable une heure :</p><p><a href="${url}">${url}</a></p><p>Si vous n’êtes pas à l’origine de cette demande, ignorez cet email.</p>`);
    }
    return NextResponse.json({ message: MESSAGE });
  } catch (e) {
    return apiError(e);
  }
}
