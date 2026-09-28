import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireUser } from '@/lib/auth';
import { projectCreateSchema, projectUpdateSchema } from '@/lib/validators';
import { notifyUser } from '@/lib/notify';
import { PROJECT_STATUS } from '@/lib/labels';
import { apiError, jsonError } from '@/lib/api';

const include = {
  client: { select: { id: true, firstName: true, lastName: true, email: true } },
  history: { orderBy: { createdAt: 'desc' as const } },
  files: { select: { id: true, originalName: true, size: true, createdAt: true, owner: { select: { role: true } } }, orderBy: { createdAt: 'desc' as const } },
};

export async function GET() {
  try {
    await requireUser('ADMIN');
    return NextResponse.json(await db.project.findMany({ include, orderBy: { updatedAt: 'desc' }, take: 500 }));
  } catch (e) {
    return apiError(e);
  }
}

export async function POST(req: Request) {
  try {
    await requireUser('ADMIN');
    const d = projectCreateSchema.parse(await req.json());
    const client = await db.user.findFirst({ where: { id: d.clientId, role: 'CLIENT' } });
    if (!client) return jsonError('Client introuvable.', 404);
    const p = await db.project.create({
      data: { clientId: d.clientId, title: d.title, description: d.description, status: d.status, history: { create: { status: d.status, note: 'Projet créé' } } },
      include,
    });
    await notifyUser(p.clientId, 'PROJECT', `Nouveau projet dans votre espace : « ${p.title} ».`);
    return NextResponse.json(p);
  } catch (e) {
    return apiError(e);
  }
}

export async function PATCH(req: Request) {
  try {
    await requireUser('ADMIN');
    const d = projectUpdateSchema.parse(await req.json());
    const old = await db.project.findUnique({ where: { id: d.id } });
    if (!old) return jsonError('Projet introuvable.', 404);
    const p = await db.project.update({ where: { id: d.id }, data: { title: d.title, description: d.description, status: d.status }, include });
    if (d.status && old.status !== d.status) {
      await db.projectHistory.create({ data: { projectId: p.id, status: d.status, note: d.note || null } });
      await notifyUser(p.clientId, 'PROJECT', `Projet « ${p.title} » : ${PROJECT_STATUS[d.status].toLowerCase()}.`);
    } else if (d.note) {
      await db.projectHistory.create({ data: { projectId: p.id, status: p.status, note: d.note } });
      await notifyUser(p.clientId, 'PROJECT', `Projet « ${p.title} » : ${d.note}`);
    }
    return NextResponse.json(await db.project.findUnique({ where: { id: p.id }, include }));
  } catch (e) {
    return apiError(e);
  }
}

// Les fichiers du projet ne sont pas supprimés : ils restent dans « Fichiers », détachés.
export async function DELETE(req: Request) {
  try {
    await requireUser('ADMIN');
    const id = new URL(req.url).searchParams.get('id');
    if (!id) return jsonError('Projet introuvable.', 404);
    await db.project.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return apiError(e);
  }
}
