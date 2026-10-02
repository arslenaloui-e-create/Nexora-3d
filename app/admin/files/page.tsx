import { db } from '@/lib/db';
import { pageUser } from '@/lib/guard';
import { PageHead } from '@/components/ui';
import FileList from '@/components/FileList';

export default async function Files() {
  await pageUser('ADMIN');
  const rows = await db.fileAsset.findMany({
    include: { owner: { select: { firstName: true, lastName: true, role: true } }, project: { select: { title: true } }, request: { select: { title: true } } },
    orderBy: { createdAt: 'desc' },
    take: 500,
  });
  const total = rows.reduce((s, f) => s + f.size, 0);
  return (
    <>
      <PageHead title="Fichiers" text={`${rows.length} fichier${rows.length > 1 ? 's' : ''}, ${(total / 1024 / 1024).toFixed(1)} Mo au total. Pour déposer un livrable, ouvrez le projet concerné.`} />
      <FileList admin files={rows.map(f => ({
        id: f.id, originalName: f.originalName, size: f.size, createdAt: f.createdAt, mine: true, byNexora: f.owner.role === 'ADMIN',
        context: [`${f.owner.firstName} ${f.owner.lastName}`, f.project ? `projet « ${f.project.title} »` : f.request ? `demande « ${f.request.title} »` : ''].filter(Boolean).join(', '),
      }))} />
    </>
  );
}
