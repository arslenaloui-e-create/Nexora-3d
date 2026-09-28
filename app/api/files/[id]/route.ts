import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireUser } from '@/lib/auth';
import { readStored, removeStored } from '@/lib/files';
import { apiError, jsonError } from '@/lib/api';

type Ctx = { params: Promise<{ id: string }> };

// Un client voit ses propres fichiers ET ceux déposés par Nexora sur ses projets/demandes.
async function canRead(fileId: string, user: { id: string; role: string }) {
  const f = await db.fileAsset.findUnique({ where: { id: fileId }, include: { project: { select: { clientId: true } }, request: { select: { clientId: true } } } });
  if (!f) return { f: null, ok: false };
  const ok = user.role === 'ADMIN' || f.ownerId === user.id || f.project?.clientId === user.id || f.request?.clientId === user.id;
  return { f, ok };
}

export async function GET(_req: Request, { params }: Ctx) {
  try {
    const u = await requireUser();
    const { id } = await params;
    const { f, ok } = await canRead(id, u);
    if (!f) return jsonError('Fichier introuvable.', 404);
    if (!ok) return jsonError('Accès refusé.', 403);
    const data = await readStored(f.storedName).catch(() => null);
    if (!data) return jsonError('Le fichier n’est plus disponible sur le serveur.', 410);
    return new NextResponse(new Uint8Array(data), {
      headers: {
        'Content-Type': f.mimeType,
        'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(f.originalName)}`,
        'X-Content-Type-Options': 'nosniff',
        'Cache-Control': 'private, no-store',
      },
    });
  } catch (e) {
    return apiError(e);
  }
}

// Seul l'auteur du dépôt (ou un admin) peut supprimer un fichier.
export async function DELETE(_req: Request, { params }: Ctx) {
  try {
    const u = await requireUser();
    const { id } = await params;
    const f = await db.fileAsset.findUnique({ where: { id } });
    if (!f) return jsonError('Fichier introuvable.', 404);
    if (u.role !== 'ADMIN' && f.ownerId !== u.id) return jsonError('Vous ne pouvez supprimer que vos propres fichiers.', 403);
    await db.fileAsset.delete({ where: { id } });
    await removeStored(f.storedName);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return apiError(e);
  }
}
