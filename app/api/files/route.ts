import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireUser } from '@/lib/auth';
import { removeStored, saveUpload, uploadError, validateUpload } from '@/lib/files';
import { notifyUser } from '@/lib/notify';
import { apiError, jsonError } from '@/lib/api';

export async function POST(req: Request) {
  const saved: string[] = [];
  try {
    const u = await requireUser();
    const fd = await req.formData();
    const projectId = String(fd.get('projectId') || '');
    const requestId = String(fd.get('requestId') || '');
    let project: { id: string; clientId: string; title: string } | null = null;
    if (projectId) {
      project = await db.project.findUnique({ where: { id: projectId }, select: { id: true, clientId: true, title: true } });
      if (!project || (u.role !== 'ADMIN' && project.clientId !== u.id)) return jsonError('Ce projet n’est pas accessible.', 403);
    }
    if (requestId) {
      const r = await db.quoteRequest.findUnique({ where: { id: requestId }, select: { clientId: true } });
      if (!r || (u.role !== 'ADMIN' && r.clientId !== u.id)) return jsonError('Cette demande n’est pas accessible.', 403);
    }
    const files = fd.getAll('files').filter((x): x is File => x instanceof File && x.size > 0);
    if (!files.length) return jsonError('Choisissez au moins un fichier.');
    if (files.length > 20) return jsonError('20 fichiers maximum par envoi.');

    // Tous les fichiers sont vérifiés avant d'en écrire un seul : pas d'envoi à moitié fait.
    for (const f of files) {
      try { validateUpload(f); } catch (e) { return jsonError(`${f.name} : ${uploadError(e)}`); }
    }
    for (const f of files) {
      const s = await saveUpload(f);
      saved.push(s.storedName);
      await db.fileAsset.create({ data: { ...s, ownerId: u.id, projectId: projectId || null, requestId: requestId || null } });
    }
    if (project && u.role === 'ADMIN') {
      await notifyUser(project.clientId, 'FILE', `${files.length} fichier(s) ajouté(s) au projet « ${project.title} ».`);
    }
    return NextResponse.json({ message: files.length > 1 ? `${files.length} fichiers envoyés.` : 'Fichier envoyé.' });
  } catch (e) {
    for (const name of saved) {
      await removeStored(name);
      await db.fileAsset.deleteMany({ where: { storedName: name } }).catch(() => {});
    }
    return apiError(e, 'Envoi impossible pour le moment.');
  }
}
