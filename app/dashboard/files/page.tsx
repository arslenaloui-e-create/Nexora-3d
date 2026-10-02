import { db } from '@/lib/db';
import { pageUser } from '@/lib/guard';
import { PageHead } from '@/components/ui';
import FileList from '@/components/FileList';
import UploadForm from '@/components/UploadForm';

export default async function Files() {
  const u = await pageUser('CLIENT');
  const [files, projects] = await Promise.all([
    db.fileAsset.findMany({
      where: { OR: [{ ownerId: u.id }, { project: { clientId: u.id } }, { request: { clientId: u.id } }] },
      include: { owner: { select: { role: true } }, project: { select: { title: true } }, request: { select: { title: true } } },
      orderBy: { createdAt: 'desc' },
      take: 300,
    }),
    db.project.findMany({ where: { clientId: u.id, status: { not: 'ARCHIVED' } }, select: { id: true, title: true }, orderBy: { updatedAt: 'desc' } }),
  ]);

  return (
    <>
      <PageHead title="Fichiers" text="Vos fichiers envoyés et les livrables déposés par Nexora 3D." />
      <section className="panel">
        <UploadForm projects={projects} label="Envoyer des fichiers" />
      </section>
      <FileList files={files.map(f => ({
        id: f.id, originalName: f.originalName, size: f.size, createdAt: f.createdAt,
        mine: f.ownerId === u.id, byNexora: f.owner.role === 'ADMIN',
        context: f.project ? `Projet : ${f.project.title}` : f.request ? `Demande : ${f.request.title}` : undefined,
      }))} />
    </>
  );
}
