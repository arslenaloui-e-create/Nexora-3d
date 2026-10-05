import type { Metadata } from 'next';
import Link from 'next/link';
import { db } from '@/lib/db';

export const metadata: Metadata = { title: 'Questions fréquentes', description: 'Fichiers acceptés, devis, délais et suivi de projet chez Nexora 3D.' };

export default async function FAQ() {
  const rows = await db.fAQ.findMany({ where: { visible: true }, orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }] });
  const groups = new Map<string, typeof rows>();
  for (const r of rows) groups.set(r.category || 'Général', [...(groups.get(r.category || 'Général') || []), r]);

  return (
    <main className="page">
      <div className="wrap">
        <header className="page-head">
          <h1>Questions fréquentes</h1>
          <p className="lead">Les réponses aux questions qu’on nous pose le plus souvent. Si la vôtre n’y est pas, écrivez-nous.</p>
        </header>
        {rows.length === 0 ? (
          <div className="empty"><strong>Aucune question publiée pour le moment.</strong><Link className="btn btn-quiet btn-sm" href="/contact">Poser une question</Link></div>
        ) : [...groups].map(([category, items]) => (
          <section className="faq-group" key={category}>
            {groups.size > 1 && <h2>{category}</h2>}
            <div className="faq-list">
              {items.map(f => (
                <details key={f.id}>
                  <summary>
                    <span>{f.question}</span>
                    <span className="faq-plus" aria-hidden="true">+</span>
                  </summary>
                  <div className="faq-answer">
                    <p>{f.answer}</p>
                  </div>
                </details>
              ))}
            </div>
          </section>
        ))}
        <div className="actions" style={{ marginTop: 48 }}>
          <Link className="btn btn-primary" href="/contact">Poser une autre question</Link>
          <Link className="btn btn-quiet" href="/quote">Demander un devis</Link>
        </div>
      </div>
    </main>
  );
}
