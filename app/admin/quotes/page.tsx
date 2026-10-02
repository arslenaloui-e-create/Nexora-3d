import { db } from '@/lib/db';
import { pageUser } from '@/lib/guard';
import { getSite } from '@/lib/site';
import { PageHead } from '@/components/ui';
import QuotesAdmin from './QuotesAdmin';

export default async function Quotes({ searchParams }: { searchParams: Promise<{ request?: string; new?: string }> }) {
  await pageUser('ADMIN');
  const sp = await searchParams;
  const [quotes, clients, requests, site] = await Promise.all([
    db.quote.findMany({ include: { client: { select: { firstName: true, lastName: true } }, request: { select: { title: true } }, lines: true }, orderBy: { createdAt: 'desc' }, take: 500 }),
    db.user.findMany({ where: { role: 'CLIENT', status: 'ACTIVE' }, select: { id: true, firstName: true, lastName: true, email: true }, orderBy: { lastName: 'asc' } }),
    db.quoteRequest.findMany({ where: { status: { notIn: ['CLOSED', 'REJECTED'] } }, select: { id: true, title: true, clientId: true, serviceType: true, quantity: true }, orderBy: { createdAt: 'desc' } }),
    getSite(),
  ]);
  const rows = quotes.map(q => ({
    id: q.id, number: q.number, status: q.status, clientName: `${q.client.firstName} ${q.client.lastName}`, requestTitle: q.request?.title || null,
    totalHT: Number(q.totalHT), totalTTC: Number(q.totalTTC), validUntil: q.validUntil.toISOString(), createdAt: q.createdAt.toISOString(), lines: q.lines.length,
  }));
  const preset = requests.find(r => r.id === sp.request) || null;
  return (
    <>
      <PageHead title="Devis" text="Préparez un devis, enregistrez-le en brouillon ou envoyez-le directement au client." />
      <QuotesAdmin rows={rows} clients={clients} requests={requests} taxRate={site.taxRate} preset={preset} startOpen={Boolean(preset || sp.new)} />
    </>
  );
}
