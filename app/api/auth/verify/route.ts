import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashToken } from '@/lib/security';

export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get('token');
  const row = token ? await db.emailVerificationToken.findUnique({ where: { tokenHash: hashToken(token) } }) : null;
  if (!row || row.usedAt || row.expiresAt < new Date()) return NextResponse.redirect(new URL('/auth/login?verified=expired', req.url));
  await db.$transaction([
    db.emailVerificationToken.update({ where: { id: row.id }, data: { usedAt: new Date() } }),
    db.user.update({ where: { id: row.userId }, data: { emailVerifiedAt: new Date() } }),
  ]);
  return NextResponse.redirect(new URL('/auth/login?verified=1', req.url));
}
