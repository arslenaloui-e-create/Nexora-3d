import { db } from '@/lib/db';
import { pageUser } from '@/lib/guard';
import { QUOTE_STATUS, money, date } from '@/lib/labels';
import { Empty, PageHead, Pill } from '@/components/ui';
import QuoteActions from './QuoteActions';

export default async function Quotes() {
  const u = await pageUser('CLIENT');
  // Les brouillons restent invisibles tant que Nexora ne les a pas envoyés.
  const rows = await db.quote.findMany({
    where: { clientId: u.id, status: { not: 'DRAFT' } },
    include: { lines: { orderBy: { position: 'asc' } }, request: { select: { title: true } } },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <>
      <PageHead title="Mes devis" text="Consultez le détail, téléchargez le PDF et donnez votre réponse." />
      {rows.length === 0 ? (
        <Empty title="Aucun devis pour le moment." text="Dès qu’un devis est prêt, il apparaît ici et vous êtes prévenu." href="/quote" action="Demander un devis" />
      ) : rows.map(q => {
        const expired = q.status === 'SENT' && q.validUntil < new Date();
        return (
          <section className="panel" key={q.id}>
            <div className="panel-head">
              <div>
                <h2>Devis {q.number}</h2>
                <span className="muted small">{q.request?.title ? `Pour « ${q.request.title} », ` : ''}émis le {date(q.createdAt)}, valable jusqu’au {date(q.validUntil)}</span>
              </div>
              <Pill map={QUOTE_STATUS} value={expired ? 'EXPIRED' : q.status} />
            </div>
            <div className="table-wrap">
              <table className="table stack quote-lines">
                <thead>
                  <tr>
                    <th>Prestation</th>
                    <th className="num">Qté</th>
                    <th className="num">Prix unitaire</th>
                    <th className="num">Total</th>
                  </tr>
                </thead>

                <tbody>
                  {q.lines.map(l => (
                    <tr key={l.id}>
                      <td data-label="Prestation">
                        <strong>{l.description}</strong>
                      </td>

                      <td data-label="Qté" className="num">
                        {Number(l.quantity)}
                      </td>

                      <td data-label="Prix unitaire" className="num">
                        {money(l.unitPrice)}
                      </td>

                      <td data-label="Total" className="num">
                        <strong>
                          {money(Number(l.quantity) * Number(l.unitPrice))}
                        </strong>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="totals">
              {Number(q.discount) > 0 && <span>Remise : − {money(q.discount)}</span>}
              <span>Total HT : {money(q.totalHT)}</span>
              <span>TVA {Number(q.taxRate)} % : {money(Number(q.totalTTC) - Number(q.totalHT))}</span>
              <strong>Total TTC : {money(q.totalTTC)}</strong>
            </div>
            {q.conditions && <p className="muted small" style={{ whiteSpace: 'pre-line' }}>{q.conditions}</p>}
            <QuoteActions id={q.id} canAnswer={q.status === 'SENT' && !expired} />
          </section>
        );
      })}
    </>
  );
}
