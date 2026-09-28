import { db } from '@/lib/db';
import { pageUser } from '@/lib/guard';
import { PROJECT_STATUS, QUOTE_STATUS, REQUEST_STATUS, money } from '@/lib/labels';
import { PageHead } from '@/components/ui';

function Breakdown({ title, map, rows }: { title: string; map: Record<string, string>; rows: { key: string; n: number }[] }) {
  const total = rows.reduce((s, r) => s + r.n, 0);
  return (
    <section className="panel">
      <div className="panel-head"><h2>{title}</h2><span className="muted">{total} au total</span></div>
      <div className="list">
        {Object.entries(map).map(([key, name]) => {
          const n = rows.find(r => r.key === key)?.n || 0;
          return (
            <div key={key} style={{ display: 'grid', gap: 6 }}>
              <div className="item-row"><span>{name}</span><strong>{n}</strong></div>
              <div className="progress"><span style={{ width: `${total ? (n / total) * 100 : 0}%` }} /></div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default async function Statistics() {
  await pageUser('ADMIN');
  const since = new Date(Date.now() - 30 * 86400000);
  const [clients, newClients, files, contacts, requests, quotes, projects, accepted] = await Promise.all([
    db.user.count({ where: { role: 'CLIENT' } }),
    db.user.count({ where: { role: 'CLIENT', createdAt: { gte: since } } }),
    db.fileAsset.aggregate({ _count: true, _sum: { size: true } }),
    db.contactMessage.count(),
    db.quoteRequest.groupBy({ by: ['status'], _count: true }),
    db.quote.groupBy({ by: ['status'], _count: true }),
    db.project.groupBy({ by: ['status'], _count: true }),
    db.quote.aggregate({ where: { status: 'ACCEPTED' }, _sum: { totalTTC: true } }),
  ]);
  const sentOrAnswered = quotes.filter(q => ['SENT', 'ACCEPTED', 'REJECTED', 'EXPIRED'].includes(q.status)).reduce((s, q) => s + q._count, 0);
  const acceptedCount = quotes.find(q => q.status === 'ACCEPTED')?._count || 0;

  return (
    <>
      <PageHead title="Statistiques" text="Chiffres tirés directement de la base de données." />
      <div className="kpis">
        <div className="kpi"><span>Clients</span><strong>{clients}</strong></div>
        <div className="kpi"><span>Nouveaux clients (30 j)</span><strong>{newClients}</strong></div>
        <div className="kpi"><span>Devis acceptés (TTC)</span><strong style={{ fontSize: '1.6rem' }}>{money(accepted._sum.totalTTC)}</strong></div>
        <div className="kpi"><span>Taux d’acceptation</span><strong>{sentOrAnswered ? Math.round((acceptedCount / sentOrAnswered) * 100) : 0} %</strong></div>
        <div className="kpi"><span>Fichiers stockés</span><strong>{files._count}</strong><span className="small">{((files._sum.size || 0) / 1024 / 1024).toFixed(1)} Mo</span></div>
        <div className="kpi"><span>Messages de contact</span><strong>{contacts}</strong></div>
      </div>
      <div className="grid-2">
        <Breakdown title="Demandes" map={REQUEST_STATUS} rows={requests.map(r => ({ key: r.status, n: r._count }))} />
        <Breakdown title="Devis" map={QUOTE_STATUS} rows={quotes.map(r => ({ key: r.status, n: r._count }))} />
        <Breakdown title="Projets" map={PROJECT_STATUS} rows={projects.map(r => ({ key: r.status, n: r._count }))} />
      </div>
    </>
  );
}
