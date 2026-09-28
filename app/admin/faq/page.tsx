import { db } from '@/lib/db';
import { pageUser } from '@/lib/guard';
import { PageHead } from '@/components/ui';
import FaqAdmin from './FaqAdmin';

export default async function FAQAdmin() {
  await pageUser('ADMIN');
  const rows = await db.fAQ.findMany({ orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }] });
  return (
    <>
      <PageHead title="FAQ" text="Les questions visibles apparaissent sur la page FAQ et les 4 premières sur l’accueil." />
      <FaqAdmin rows={rows.map(r => ({ id: r.id, question: r.question, answer: r.answer, category: r.category, sortOrder: r.sortOrder, visible: r.visible }))} />
    </>
  );
}
