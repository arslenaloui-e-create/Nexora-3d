import Link from 'next/link';
import { db } from '@/lib/db';
import { pageUser } from '@/lib/guard';
import { PROJECT_STATUS, NOTIFICATION_TYPE, label, money, date, dateTime } from '@/lib/labels';
import { Empty, PageHead, Pill, Progress } from '@/components/ui';

export default async function Dashboard() {
  const u = await pageUser('CLIENT');
  const [projects, pendingQuotes, requests, notifications] = await Promise.all([
    db.project.findMany({ where: { clientId: u.id, status: { notIn: ['ARCHIVED'] } }, orderBy: { updatedAt: 'desc' }, take: 4 }),
    db.quote.findMany({ where: { clientId: u.id, status: 'SENT' }, orderBy: { createdAt: 'desc' } }),
    db.quoteRequest.count({ where: { clientId: u.id, status: { in: ['NEW', 'REVIEWING'] } } }),
    db.notification.findMany({ where: { userId: u.id }, orderBy: { createdAt: 'desc' }, take: 5 }),
  ]);
  const active = projects.filter(p => p.status !== 'COMPLETED').length;
  const isNew = !projects.length && !pendingQuotes.length && !requests;

  return (
    <>
      <PageHead title={`Bonjour ${u.firstName}`} text="Voici où en sont vos projets.">
        <Link className="btn btn-primary" href="/quote">Nouvelle demande de devis</Link>
      </PageHead>

      {isNew ? (
        <div className="panel">
          <h2>Bienvenue dans votre espace</h2>
          <p className="muted">Pour commencer, décrivez votre projet. Le devis, puis l’avancement, les fichiers et nos messages apparaîtront ici.</p>
          <div><Link className="btn btn-primary" href="/quote">Décrire mon projet</Link></div>
        </div>
      ) : (
        <div className="kpis">
          <Link className="kpi" href="/dashboard/projects"><span>Projets en cours</span><strong>{active}</strong></Link>
          <Link className="kpi" href="/dashboard/quotes"><span>Devis à valider</span><strong>{pendingQuotes.length}</strong></Link>
          <Link className="kpi" href="/dashboard/requests"><span>Demandes en étude</span><strong>{requests}</strong></Link>
        </div>
      )}

      {pendingQuotes.length > 0 && (
        <section className="panel">
          <div className="panel-head"><h2>Devis en attente de votre réponse</h2></div>
          <div className="list">
            {pendingQuotes.map(q => (
              <div className="item-row" key={q.id}>
                <div><strong>Devis {q.number}</strong><span className="sub muted small"> — {money(q.totalTTC)} TTC, valable jusqu’au {date(q.validUntil)}</span></div>
                <Link className="btn btn-primary btn-sm" href="/dashboard/quotes">Voir et répondre</Link>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="grid-2">
        <section className="panel">
          <div className="panel-head"><h2>Projets</h2><Link className="link small" href="/dashboard/projects">Tous les projets</Link></div>
          {projects.length ? (
            <div className="list">
              {projects.map(p => (
                <Link key={p.id} href="/dashboard/projects" style={{ textDecoration: 'none', display: 'grid', gap: 8 }}>
                  <div className="item-row"><strong>{p.title}</strong><Pill map={PROJECT_STATUS} value={p.status} /></div>
                  <Progress status={p.status} />
                </Link>
              ))}
            </div>
          ) : <Empty title="Aucun projet pour l’instant." text="Un projet est créé dès que votre devis est accepté." />}
        </section>
        <section className="panel">
          <div className="panel-head"><h2>Dernières nouvelles</h2><Link className="link small" href="/dashboard/notifications">Tout voir</Link></div>
          {notifications.length ? (
            <div className="list">
              {notifications.map(n => (
                <div key={n.id} className={`notif ${n.readAt ? '' : 'unread'}`}>
                  <span className="dot" />
                  <div><p>{n.message}</p><small>{label(NOTIFICATION_TYPE, n.type)}, {dateTime(n.createdAt)}</small></div>
                  <span />
                </div>
              ))}
            </div>
          ) : <p className="muted">Rien de nouveau.</p>}
        </section>
      </div>
    </>
  );
}
