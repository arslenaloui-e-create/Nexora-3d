import { db } from '@/lib/db';
import { pageUser } from '@/lib/guard';
import { PageHead } from '@/components/ui';
import RequestsBoard from './RequestsBoard';

export default async function Requests() {
  await pageUser('ADMIN');
  const rows = await db.quoteRequest.findMany({
    include: {
      client: { select: { id: true, firstName: true, lastName: true, email: true, phone: true, company: true } },
      quotes: { select: { id: true, number: true, status: true } },
      files: { select: { id: true, originalName: true, size: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 500,
  });
  const data = rows.map(r => ({ ...r, budget: r.budget === null ? null : Number(r.budget), createdAt: r.createdAt.toISOString(), deadline: r.deadline?.toISOString() || null, updatedAt: r.updatedAt.toISOString() }));
  return (
    <>
      <PageHead title="Demandes de devis" text="Ouvrez une demande pour voir le détail, les fichiers joints et préparer le devis." />
      <RequestsBoard rows={data} />
    </>
  );
}
