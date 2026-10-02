import Link from 'next/link';
import { db } from '@/lib/db';
import { pageUser } from '@/lib/guard';
import { REQUEST_STATUS, QUOTE_STATUS, money, date } from '@/lib/labels';
import { Empty, PageHead, Pill } from '@/components/ui';

export default async function Requests() {
  const u = await pageUser('CLIENT');
  const rows = await db.quoteRequest.findMany({
    where: { clientId: u.id },
    include: { quotes: { where: { status: { not: 'DRAFT' } }, select: { id: true, number: true, status: true } }, _count: { select: { files: true } } },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <>
      <PageHead title="Demandes de devis" text="Chaque demande envoyée, et où elle en est.">
        <Link className="btn btn-primary" href="/quote">Nouvelle demande</Link>
      </PageHead>
      {rows.length === 0 ? (
        <Empty title="Vous n’avez encore envoyé aucune demande." text="Décrivez votre pièce ou votre projet pour recevoir un devis." href="/quote" action="Demander un devis" />
      ) : (
        <div className="table-wrap">
          <table className="table stack">
            <thead><tr><th>Demande</th><th>Statut</th><th>Devis reçu</th><th>Envoyée le</th></tr></thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.id}>
                  <td data-label="Demande">
                    <strong>{r.title}</strong>
                    <span className="sub">{r.serviceType}{r.budget ? `, budget ${money(r.budget)}` : ''}{r._count.files ? `, ${r._count.files} fichier(s)` : ''}</span>
                  </td>
                  <td data-label="Statut"><Pill map={REQUEST_STATUS} value={r.status} /></td>
                  <td data-label="Devis reçu">
                    {r.quotes.length ? r.quotes.map(q => <Link key={q.id} className="link" href="/dashboard/quotes" style={{ display: 'block' }}>{q.number} ({QUOTE_STATUS[q.status].toLowerCase()})</Link>) : <span className="muted">En préparation</span>}
                  </td>
                  <td data-label="Envoyée le">{date(r.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
