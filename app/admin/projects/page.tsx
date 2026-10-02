import { db } from '@/lib/db';
import { pageUser } from '@/lib/guard';
import { PageHead } from '@/components/ui';
import ProjectsAdmin from './ProjectsAdmin';

export default async function Projects() {
  await pageUser('ADMIN');
  const [projects, clients] = await Promise.all([
    db.project.findMany({
      include: {
        client: { select: { id: true, firstName: true, lastName: true } },
        history: { orderBy: { createdAt: 'desc' } },
        files: { include: { owner: { select: { role: true } } }, orderBy: { createdAt: 'desc' } },
      },
      orderBy: { updatedAt: 'desc' },
      take: 500,
    }),
    db.user.findMany({ where: { role: 'CLIENT', status: 'ACTIVE' }, select: { id: true, firstName: true, lastName: true, email: true }, orderBy: { lastName: 'asc' } }),
  ]);
  const rows = projects.map(p => ({
    id: p.id, title: p.title, description: p.description, status: p.status, updatedAt: p.updatedAt.toISOString(),
    client: p.client,
    history: p.history.map(h => ({ id: h.id, status: h.status, note: h.note, createdAt: h.createdAt.toISOString() })),
    files: p.files.map(f => ({ id: f.id, originalName: f.originalName, size: f.size, createdAt: f.createdAt.toISOString(), byNexora: f.owner.role === 'ADMIN' })),
  }));
  return (
    <>
      <PageHead title="Projets" text="Chaque changement de statut est ajouté à l’historique et notifié au client." />
      <ProjectsAdmin rows={rows} clients={clients} />
    </>
  );
}
