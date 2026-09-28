import { db } from '@/lib/db';
import { pageUser } from '@/lib/guard';
import { PROJECT_STATUS, PROJECT_PROGRESS, label, date, dateTime } from '@/lib/labels';
import { Empty, PageHead, Pill, Progress } from '@/components/ui';
import FileList from '@/components/FileList';
import UploadForm from '@/components/UploadForm';

export default async function Projects() {
  const u = await pageUser('CLIENT');
  const rows = await db.project.findMany({
    where: { clientId: u.id },
    include: {
      history: { orderBy: { createdAt: 'desc' } },
      files: { include: { owner: { select: { role: true } } }, orderBy: { createdAt: 'desc' } },
    },
    orderBy: { updatedAt: 'desc' },
  });

  return (
    <>
      <PageHead title="Mes projets" text="L’avancement, l’historique et les fichiers de chaque projet." />
      {rows.length === 0 ? (
        <Empty title="Aucun projet pour l’instant." text="Un projet est créé par Nexora 3D quand votre devis est accepté. Vous pouvez commencer par une demande." href="/quote" action="Demander un devis" />
      ) : rows.map((p, i) => (
        <details className="project" key={p.id} open={i === 0}>
          <summary>
            <div><h3>{p.title}</h3><span className="muted small">Mis à jour le {date(p.updatedAt)}</span></div>
            <span className="actions"><span className="small muted">{PROJECT_PROGRESS[p.status]} %</span><Pill map={PROJECT_STATUS} value={p.status} /></span>
            <Progress status={p.status} />
          </summary>
          <div className="project-body">
            <p style={{ whiteSpace: 'pre-line' }}>{p.description}</p>
            <div className="grid-2">
              <div style={{ display: 'grid', gap: 12, alignContent: 'start' }}>
                <h4 style={{ margin: 0 }}>Historique</h4>
                <ol className="timeline">
                  {p.history.map(h => (
                    <li key={h.id}><strong>{label(PROJECT_STATUS, h.status)}</strong>{h.note && <> — {h.note}</>}<br /><small>{dateTime(h.createdAt)}</small></li>
                  ))}
                </ol>
              </div>
              <div style={{ display: 'grid', gap: 12, alignContent: 'start' }}>
                <h4 style={{ margin: 0 }}>Fichiers du projet</h4>
                <FileList files={p.files.map(f => ({ id: f.id, originalName: f.originalName, size: f.size, createdAt: f.createdAt, mine: f.ownerId === u.id, byNexora: f.owner.role === 'ADMIN' }))} />
                <UploadForm projectId={p.id} label="Ajouter un fichier à ce projet" />
              </div>
            </div>
          </div>
        </details>
      ))}
    </>
  );
}
