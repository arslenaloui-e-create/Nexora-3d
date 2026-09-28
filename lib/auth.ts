import { cookies } from 'next/headers';
import { jwtVerify, SignJWT } from 'jose';
import { db } from './db';
import { authSecret } from './secret';

const COOKIE = 'nexora_session';

export type Session = { id: string; role: 'ADMIN' | 'CLIENT'; email: string };

export async function createSession(s: Session) {
  const token = await new SignJWT(s).setProtectedHeader({ alg: 'HS256' }).setIssuedAt().setExpirationTime('7d').sign(authSecret());
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function getSession(): Promise<Session | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  try {
    return (await jwtVerify(token, authSecret())).payload as unknown as Session;
  } catch {
    return null;
  }
}

// Le rôle et le statut sont relus en base à chaque appel : un compte désactivé ou
// rétrogradé perd l'accès immédiatement, même avec un cookie encore valide.
export async function requireUser(role?: Session['role']) {
  const s = await getSession();
  if (!s) throw new Error('UNAUTHENTICATED');
  const u = await db.user.findUnique({ where: { id: s.id } });
  if (!u || u.status !== 'ACTIVE') throw new Error('UNAUTHENTICATED');
  if (role && u.role !== role) throw new Error('FORBIDDEN');
  return u;
}

export async function logout() {
  (await cookies()).delete(COOKIE);
}
