import Link from 'next/link';
import { db } from '@/lib/db';
import { pageUser } from '@/lib/guard';
import { money, date, dateTime } from '@/lib/labels';
import { PageHead } from '@/components/ui';

export default async function Admin() {
  await pageUser('ADMIN');
  const [newRequests, contacts, unreadChats, sentQuotes, activeProjects, clients] = await Promise.all([
    db.quoteRequest.findMany({ where: { status: 'NEW' }, include: { client: { select: { firstName: true, lastName: true } } }, orderBy: { createdAt: 'desc' }, take: 6 }),
    db.contactMessage.findMany({ where: { status: 'NEW' }, orderBy: { createdAt: 'desc' }, take: 5 }),
    db.chatMessage.count({ where: { readAt: null, recipient: { role: 'ADMIN' } } }),
    db.quote.findMany({ where: { status: 'SENT' }, include: { client: { select: { firstName: true, lastName: true } } }, orderBy: { createdAt: 'desc' }, take: 6 }),
    db.project.count({ where: { status: { in: ['DRAFT', 'IN_PROGRESS', 'REVIEW'] } } }),
    db.user.count({ where: { role: 'CLIENT' } }),
  ]);

  return (
    <>
      <PageHead title="Tableau de bord" text="Ce qui attend une action de votre part.">
        <Link className="btn btn-primary" href="/admin/quotes?new=1">Nouveau devis</Link>
      </PageHead>
      <div className="kpis">
        <Link className="kpi" href="/admin/requests"><span>Nouvelles demandes</span><strong>{newRequests.length}</strong></Link>
        <Link className="kpi" href="/admin/messages"><span>Messages non lus</span><strong>{unreadChats + contacts.length}</strong></Link>
        <Link className="kpi" href="/admin/quotes"><span>Devis en attente client</span><strong>{sentQuotes.length}</strong></Link>
        <Link className="kpi" href="/admin/projects"><span>Projets en cours</span><strong>{activeProjects}</strong></Link>
        <Link className="kpi" href="/admin/clients"><span>Clients</span><strong>{clients}</strong></Link>
      </div>
      <div className="grid-2">
        <section className="panel">
          <div className="panel-head"><h2>Demandes à traiter</h2><Link className="link small" href="/admin/requests">Toutes les demandes</Link></div>
          {newRequests.length ? (
            <div className="list">
              {newRequests.map(r => (
                <Link key={r.id} className="item-row" href={`/admin/requests#${r.id}`}>
                  <div><strong>{r.title}</strong><span className="sub muted small">{r.client.firstName} {r.client.lastName}, {r.serviceType}</span></div>
                  <span className="muted small">{date(r.createdAt)}</span>
                </Link>
              ))}
            </div>
          ) : <p className="muted">Aucune nouvelle demande.</p>}
        </section>
        <section className="panel">
          <div className="panel-head"><h2>Formulaire de contact</h2><Link className="link small" href="/admin/messages?tab=contact">Tous les messages</Link></div>
          {contacts.length ? (
            <div className="list">
              {contacts.map(c => (
                <Link key={c.id} className="item-row" href="/admin/messages?tab=contact">
                  <div><strong>{c.subject}</strong><span className="sub muted small">{c.name}, {c.email}</span></div>
                  <span className="muted small">{dateTime(c.createdAt)}</span>
                </Link>
              ))}
            </div>
          ) : <p className="muted">Aucun nouveau message.</p>}
        </section>
      </div>
      <section className="panel">
        <div className="panel-head"><h2>Devis envoyés, en attente de réponse</h2><Link className="link small" href="/admin/quotes">Tous les devis</Link></div>
        {sentQuotes.length ? (
          <div className="list">
            {sentQuotes.map(q => (
              <div key={q.id} className="item-row">
                <div><strong>{q.number}</strong><span className="sub muted small">{q.client.firstName} {q.client.lastName}, valable jusqu’au {date(q.validUntil)}</span></div>
                <strong className="nowrap">{money(q.totalTTC)}</strong>
              </div>
            ))}
          </div>
        ) : <p className="muted">Aucun devis en attente.</p>}
      </section>
    </>
  );
}
