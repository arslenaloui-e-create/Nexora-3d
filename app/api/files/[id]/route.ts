import {NextResponse} from 'next/server';
import {db} from '@/lib/db';
import {requireUser} from '@/lib/auth';
import {readStored, removeStored} from '@/lib/files';

export async function GET(req: Request, {params}: {params: Promise<{id: string}>}) {
  try {
    const u = await requireUser();
    const {id} = await params;
    const f = await db.fileAsset.findUnique({where: {id}, include: {project: true, request: true}});
    if (!f) return new NextResponse('Not found', {status: 404});
    if (u.role !== 'ADMIN' && f.ownerId !== u.id) return new NextResponse('Forbidden', {status: 403});
    const data = await readStored(f.storedName);
    return new NextResponse(data, {
      headers: {
        'Content-Type': f.mimeType,
        'Content-Disposition': `attachment; filename="${f.originalName.replace(/"/g, '')}"`,
      },
    });
  } catch {
    return new NextResponse('Forbidden', {status: 403});
  }
}

export async function DELETE(req: Request, {params}: {params: Promise<{id: string}>}) {
  try {
    const u = await requireUser();
    const {id} = await params;
    const f = await db.fileAsset.findUnique({where: {id}});
    if (!f) return new NextResponse('Not found', {status: 404});
    if (u.role !== 'ADMIN' && f.ownerId !== u.id) return new NextResponse('Forbidden', {status: 403});
    await removeStored(f.storedName);
    await db.fileAsset.delete({where: {id}});
    return NextResponse.json({ok: true});
  } catch {
    return new NextResponse('Forbidden', {status: 403});
  }
}
