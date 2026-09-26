import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireUser } from '@/lib/auth';
import { quotePdf } from '@/lib/quote';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const u = await requireUser();
    const { id } = await params;
    const q = await db.quote.findUnique({ where: { id }, include: { client: true, lines: true } });
    if (!q) return new NextResponse('Not found', { status: 404 });
    if (u.role !== 'ADMIN' && q.clientId !== u.id) return new NextResponse('Forbidden', { status: 403 });

    const s = await db.siteSettings.findUnique({ where: { id: 1 } });
    const pdf = await quotePdf(q, s);
    return new NextResponse(Buffer.from(pdf), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${q.number}.pdf"`,
      },
    });
  } catch {
    return new NextResponse('Forbidden', { status: 403 });
  }
}
