import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireUser } from '@/lib/auth';

type Payload = {
  id?: string;
  title?: unknown;
  description?: unknown;
  category?: unknown;
  technologies?: unknown;
  tags?: unknown;
  images?: unknown;
  visible?: unknown;
  sortOrder?: unknown;
};

function text(value: unknown, max: number) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function imageList(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === 'string')
    .map(item => item.trim())
    .filter(Boolean)
    .slice(0, 30);
}

function payloadData(data: Payload) {
  const title = text(data.title, 160);
  const description = text(data.description, 5000);
  if (!title || !description) throw new Error('TITLE_AND_DESCRIPTION_REQUIRED');

  return {
    title,
    description,
    category: text(data.category, 80) || 'Général',
    technologies: text(data.technologies, 500),
    tags: text(data.tags, 500),
    images: JSON.stringify(imageList(data.images)),
    visible: data.visible !== false,
    sortOrder: Number.isFinite(Number(data.sortOrder)) ? Number(data.sortOrder) : 0,
  };
}

export async function GET() {
  await requireUser('ADMIN');
  const rows = await db.portfolioItem.findMany({
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
  });
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  await requireUser('ADMIN');
  try {
    const data = payloadData(await req.json());
    return NextResponse.json(await db.portfolioItem.create({ data }));
  } catch (error) {
    if (error instanceof Error && error.message === 'TITLE_AND_DESCRIPTION_REQUIRED') {
      return NextResponse.json({ error: 'Titre et description requis.' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Impossible de créer le projet.' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  await requireUser('ADMIN');
  try {
    const body = await req.json() as Payload;
    if (!body.id || typeof body.id !== 'string') {
      return NextResponse.json({ error: 'Identifiant du projet requis.' }, { status: 400 });
    }
    const data = payloadData(body);
    return NextResponse.json(await db.portfolioItem.update({ where: { id: body.id }, data }));
  } catch (error) {
    if (error instanceof Error && error.message === 'TITLE_AND_DESCRIPTION_REQUIRED') {
      return NextResponse.json({ error: 'Titre et description requis.' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Impossible de mettre à jour le projet.' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  await requireUser('ADMIN');
  const id = new URL(req.url).searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Identifiant du projet requis.' }, { status: 400 });

  try {
    await db.portfolioItem.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Projet introuvable ou déjà supprimé.' }, { status: 404 });
  }
}
