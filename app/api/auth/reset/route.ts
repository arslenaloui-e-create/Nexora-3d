import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword, hashToken } from '@/lib/security';
import { resetSchema } from '@/lib/validators';
import { apiError, jsonError } from '@/lib/api';

export async function POST(req: Request) {
  try {
    const d = resetSchema.parse(await req.json());
    const t = await db.passwordResetToken.findUnique({ where: { tokenHash: hashToken(d.token) } });
    if (!t || t.usedAt || t.expiresAt < new Date()) return jsonError('Ce lien a expiré ou a déjà servi. Demandez-en un nouveau.', 400);
    const hash = await hashPassword(d.password);
    await db.$transaction([
      db.passwordResetToken.update({ where: { id: t.id }, data: { usedAt: new Date() } }),
      db.user.update({ where: { id: t.userId }, data: { passwordHash: hash } }),
    ]);
    return NextResponse.json({ message: 'Mot de passe modifié. Vous pouvez vous connecter.' });
  } catch (e) {
    return apiError(e);
  }
}
