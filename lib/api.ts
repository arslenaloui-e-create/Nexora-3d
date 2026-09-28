import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';

export function jsonError(error: string, status = 400) {
  return NextResponse.json({ error }, { status });
}

// Traduit les erreurs courantes en réponses HTTP propres au lieu d'une erreur 500 brute.
export function apiError(e: unknown, fallback = 'Une erreur est survenue.') {
  if (e instanceof Error && e.message === 'UNAUTHENTICATED') return jsonError('Connexion requise.', 401);
  if (e instanceof Error && e.message === 'FORBIDDEN') return jsonError('Accès refusé.', 403);
  if (e instanceof ZodError) return jsonError(e.issues[0]?.message || 'Données invalides.', 400);
  if (e instanceof SyntaxError) return jsonError('Requête invalide.', 400);
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    if (e.code === 'P2025') return jsonError('Élément introuvable.', 404);
    if (e.code === 'P2002') return jsonError('Cet élément existe déjà.', 409);
    if (e.code === 'P2003') return jsonError('Référence invalide.', 400);
  }
  console.error(e);
  return jsonError(fallback, 500);
}

export function clientIp(req: Request) {
  return (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || req.headers.get('x-real-ip') || 'unknown';
}

// N'accepte qu'un chemin interne ("/dashboard/...") pour éviter les redirections ouvertes.
export function safeNext(value: unknown) {
  const s = typeof value === 'string' ? value : '';
  return s.startsWith('/') && !s.startsWith('//') && !s.startsWith('/\\') ? s : '';
}
