import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { requireUser } from '@/lib/auth';
import { apiError } from '@/lib/api';

// Liste les images publiées dans public/images pour les choisir depuis l'admin
// sans avoir à taper les chemins à la main.
export async function GET() {
  try {
    await requireUser('ADMIN');
    const dir = path.join(process.cwd(), 'public', 'images');
    const names = await fs.readdir(dir).catch(() => [] as string[]);
    const images = names.filter(n => /\.(png|jpe?g|webp|gif|avif)$/i.test(n)).sort().map(n => `/images/${n}`);
    return NextResponse.json(images);
  } catch (e) {
    return apiError(e);
  }
}
