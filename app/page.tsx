import HomeLanding from '@/components/HomeLanding';
import { db } from '@/lib/db';
import { getSite } from '@/lib/site';
import { getPortfolio } from '@/lib/portfolio';

export default async function Home() {
  const [site, items, faqs] = await Promise.all([
    getSite(),
    getPortfolio(),
    db.fAQ.findMany({ where: { visible: true }, orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }], take: 4, select: { id: true, question: true, answer: true } }),
  ]);
  return <HomeLanding items={items} total={items.length} faqs={faqs} site={site} />;
}
