'use client';

import { useMemo, useState } from 'react';
import Plate from './Plate';
import type { PortfolioEntry } from '@/lib/portfolio';

export default function PortfolioBrowser({ items }: { items: PortfolioEntry[] }) {
  const categories = useMemo(() => Array.from(new Set(items.map(i => i.category.trim()).filter(Boolean))), [items]);
  const [category, setCategory] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter(i =>
      (!category || i.category === category) &&
      (!q || [i.title, i.description, i.category, i.technologies, i.tags].join(' ').toLowerCase().includes(q)));
  }, [items, category, query]);

  const reset = () => { setCategory(null); setQuery(''); };

  return (
    <>
      <div className="toolbar">
        <div className="filters" role="group" aria-label="Filtrer par domaine">
          <button type="button" className="chip" aria-pressed={!category} onClick={() => setCategory(null)}>Tout<small>{items.length}</small></button>
          {categories.map(c => (
            <button key={c} type="button" className="chip" aria-pressed={category === c} onClick={() => setCategory(c)}>
              {c}<small>{items.filter(i => i.category === c).length}</small>
            </button>
          ))}
        </div>
        <label className="search">
          <span className="muted" aria-hidden="true">⌕</span>
          <input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Rechercher : drone, moteur, naval…" aria-label="Rechercher une réalisation" />
        </label>
      </div>
      <p className="muted small" aria-live="polite" style={{ marginBottom: 16 }}>
        {filtered.length} réalisation{filtered.length > 1 ? 's' : ''}{category ? ` en ${category}` : ''}{query ? ` pour « ${query} »` : ''}
      </p>
      {filtered.length ? (
        <div className="plates">{filtered.map((item, i) => <Plate key={item.id || i} item={item} />)}</div>
      ) : (
        <div className="empty">
          <strong>Aucune réalisation ne correspond.</strong>
          <span>Essayez un autre mot ou affichez tout le portfolio.</span>
          <button type="button" className="btn btn-quiet btn-sm" onClick={reset}>Tout afficher</button>
        </div>
      )}
    </>
  );
}
