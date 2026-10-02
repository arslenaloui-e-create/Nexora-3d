import Link from 'next/link';
import { db } from '@/lib/db';
import { pageUser } from '@/lib/guard';
import { date } from '@/lib/labels';
import { Empty, PageHead } from '@/components/ui';

export default async function Clients() {
  await pageUser('ADMIN');
  const rows = await db.user.findMany({
    where: { role: 'CLIENT' },
    include: { _count: { select: { projects: true, quoteRequests: true, quotes: true, files: true } } },
    orderBy: { createdAt: 'desc' },
  });
  return (
    <>
      <PageHead title="Clients" text={`${rows.length} compte${rows.length > 1 ? 's' : ''} client.`}>
        <Link className="btn btn-quiet" href="/admin/users">Activer ou désactiver un compte</Link>
      </PageHead>
      {rows.length === 0 ? <Empty title="Aucun client inscrit pour le moment." /> : (
        <div className="table-wrap">
          <table className="table stack">
            <thead><tr><th>Client</th><th>Contact</th><th className="num">Demandes</th><th className="num">Devis</th><th className="num">Projets</th><th className="num">Fichiers</th><th>Inscrit le</th><th><span className="skip">Actions</span></th></tr></thead>
            <tbody>
              {rows.map(c => (
                <tr key={c.id}>
                  <td data-label="Client"><strong>{c.firstName} {c.lastName}</strong>{c.company && <span className="sub">{c.company}</span>}{c.status === 'DISABLED' && <span className="pill pill-danger">Désactivé</span>}</td>
                  <td data-label="Contact"><a className="link" href={`mailto:${c.email}`}>{c.email}</a>{c.phone && <span className="sub">{c.phone}</span>}</td>
                  <td data-label="Demandes" className="num">{c._count.quoteRequests}</td>
                  <td data-label="Devis" className="num">{c._count.quotes}</td>
                  <td data-label="Projets" className="num">{c._count.projects}</td>
                  <td data-label="Fichiers" className="num">{c._count.files}</td>
                  <td data-label="Inscrit le">{date(c.createdAt)}</td>
                  <td data-label=""><Link className="btn btn-quiet btn-sm" href={`/admin/messages?client=${c.id}`}>Écrire</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
