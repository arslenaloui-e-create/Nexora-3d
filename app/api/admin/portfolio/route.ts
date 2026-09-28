import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireUser } from '@/lib/auth';
import { apiError, jsonError } from '@/lib/api';

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

// Seuls les chemins du site (/images/...) et les URL https sont acceptés comme images.
function imageList(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === 'string')
    .map(item => item.trim())
    .filter(item => /^\/(?!\/)[^\s"'<>]+$/.test(item) || /^https:\/\/[^\s"'<>]+$/.test(item))
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
    sortOrder: Number.isFinite(Number(data.sortOrder)) ? Math.trunc(Number(data.sortOrder)) : 0,
  };
}

function handle(error: unknown) {
  if (error instanceof Error && error.message === 'TITLE_AND_DESCRIPTION_REQUIRED') return jsonError('Le titre et la description sont obligatoires.');
  return apiError(error);
}

export async function GET() {
  try {
    await requireUser('ADMIN');
    return NextResponse.json(await db.portfolioItem.findMany({ orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }] }));
  } catch (e) {
    return handle(e);
  }
}

export async function POST(req: Request) {
  try {
    await requireUser('ADMIN');
    return NextResponse.json(await db.portfolioItem.create({ data: payloadData(await req.json()) }));
  } catch (e) {
    return handle(e);
  }
}

export async function PATCH(req: Request) {
  try {
    await requireUser('ADMIN');
    const body = (await req.json()) as Payload;
    if (!body.id || typeof body.id !== 'string') return jsonError('Réalisation introuvable.', 404);
    return NextResponse.json(await db.portfolioItem.update({ where: { id: body.id }, data: payloadData(body) }));
  } catch (e) {
    return handle(e);
  }
}

export async function DELETE(req: Request) {
  try {
    await requireUser('ADMIN');
    const id = new URL(req.url).searchParams.get('id');
    if (!id) return jsonError('Réalisation introuvable.', 404);
    await db.portfolioItem.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return handle(e);
  }
}
