import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireUser } from '@/lib/auth';
import { settingsSchema } from '@/lib/validators';
import { apiError } from '@/lib/api';

export async function GET() {
  try {
    await requireUser('ADMIN');
    return NextResponse.json(await db.siteSettings.findUnique({ where: { id: 1 } }));
  } catch (e) {
    return apiError(e);
  }
}

export async function PATCH(req: Request) {
  try {
    await requireUser('ADMIN');
    const d = settingsSchema.parse(await req.json());
    const data = { email: d.email, phone: d.phone || null, instagram: d.instagram || null, linkedin: d.linkedin || null, description: d.description, taxRate: d.taxRate };
    return NextResponse.json(await db.siteSettings.upsert({ where: { id: 1 }, create: { id: 1, ...data }, update: data }));
  } catch (e) {
    return apiError(e);
  }
}
