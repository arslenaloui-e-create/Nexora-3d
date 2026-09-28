import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireUser } from '@/lib/auth';
import { hashPassword, verifyPassword } from '@/lib/security';
import { profileSchema } from '@/lib/validators';
import { apiError, jsonError } from '@/lib/api';

export async function GET() {
  try {
    const u = await requireUser();
    return NextResponse.json({ id: u.id, firstName: u.firstName, lastName: u.lastName, email: u.email, phone: u.phone, company: u.company });
  } catch (e) {
    return apiError(e);
  }
}

export async function PATCH(req: Request) {
  try {
    const u = await requireUser();
    const d = profileSchema.parse(await req.json());
    const data: { firstName: string; lastName: string; phone: string | null; company: string | null; passwordHash?: string } = {
      firstName: d.firstName, lastName: d.lastName, phone: d.phone || null, company: d.company || null,
    };
    if (d.newPassword) {
      if (!d.currentPassword || !(await verifyPassword(d.currentPassword, u.passwordHash))) return jsonError('Le mot de passe actuel est incorrect.', 400);
      data.passwordHash = await hashPassword(d.newPassword);
    }
    await db.user.update({ where: { id: u.id }, data });
    return NextResponse.json({ message: d.newPassword ? 'Profil et mot de passe enregistrés.' : 'Profil enregistré.' });
  } catch (e) {
    return apiError(e, 'Enregistrement impossible.');
  }
}
