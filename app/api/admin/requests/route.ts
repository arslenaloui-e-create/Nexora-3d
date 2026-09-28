import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireUser } from '@/lib/auth';
import { requestStatus } from '@/lib/validators';
import { REQUEST_STATUS } from '@/lib/labels';
import { notifyUser } from '@/lib/notify';
import { apiError } from '@/lib/api';

export async function GET() {
  try {
    await requireUser('ADMIN');
    return NextResponse.json(await db.quoteRequest.findMany({
      include: {
        client: { select: { id: true, firstName: true, lastName: true, email: true, phone: true, company: true } },
        quotes: { select: { id: true, number: true, status: true } },
        files: { select: { id: true, originalName: true, size: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 500,
    }));
  } catch (e) {
    return apiError(e);
  }
}

export async function PATCH(req: Request) {
  try {
    await requireUser('ADMIN');
    const d = await req.json();
    const status = requestStatus.parse(d.status);
    const r = await db.quoteRequest.update({ where: { id: String(d.id) }, data: { status } });
    await notifyUser(r.clientId, 'REQUEST_STATUS', `Votre demande « ${r.title} » : ${REQUEST_STATUS[status].toLowerCase()}.`);
    return NextResponse.json(r);
  } catch (e) {
    return apiError(e);
  }
}
