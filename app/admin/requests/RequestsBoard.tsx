'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/client';
import { REQUEST_STATUS, QUOTE_STATUS, money, date, fileSize, label, tone } from '@/lib/labels';

type Row = {
  id: string; title: string; description: string; serviceType: string; status: string; budget: number | null; deadline: string | null; createdAt: string;
  dimensions: string | null; quantity: number | null; material: string | null; tolerance: string | null;
  client: { id: string; firstName: string; lastName: string; email: string; phone: string | null; company: string | null };
  quotes: { id: string; number: string; status: string }[];
  files: { id: string; originalName: string; size: number }[];
};

export default function RequestsBoard({ rows }: { rows: Row[] }) {
  const [filter, setFilter] = useState<'open' | 'all'>('open');
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const open = rows.filter(r => ['NEW', 'REVIEWING', 'QUOTED'].includes(r.status));
  const shown = filter === 'open' ? open : rows;

  async function setStatus(id: string, status: string) {
    if (busy) return;

    setBusy(id);
    setError('');

    const r = await api('/api/admin/requests', 'PATCH', {
      id,
      status,
    });

    setBusy('');

    if (!r.ok) {
      setError(r.error);
      return;
    }

    router.refresh();
  }

  return (
    <>
      <div className="filters" role="group" aria-label="Filtrer">
        <button type="button" className="chip" aria-pressed={filter === 'open'} onClick={() => setFilter('open')}>À traiter<small>{open.length}</small></button>
        <button type="button" className="chip" aria-pressed={filter === 'all'} onClick={() => setFilter('all')}>Toutes<small>{rows.length}</small></button>
      </div>
      {error && <div className="alert alert-error" role="alert">{error}</div>}
      {shown.length === 0 ? <div className="empty"><strong>Aucune demande {filter === 'open' ? 'à traiter' : ''}.</strong></div> : shown.map(r => (
        <details className="project" key={r.id} id={r.id} open={r.status === 'NEW'}>
          <summary>
            <div>
              <h3>{r.title}</h3>
              <span className="muted small">{r.client.firstName} {r.client.lastName}{r.client.company ? ` (${r.client.company})` : ''}, {r.serviceType}, le {date(r.createdAt)}</span>
            </div>
            <span className={`pill pill-${tone(r.status)}`}>{label(REQUEST_STATUS, r.status)}</span>
          </summary>
          <div className="project-body">
            <p style={{ whiteSpace: 'pre-line' }}>{r.description}</p>
            <dl className="specs">
              <div><dt>Dimensions</dt><dd>{r.dimensions || '—'}</dd></div>
              <div><dt>Quantité</dt><dd>{r.quantity ?? '—'}</dd></div>
              <div><dt>Matériau</dt><dd>{r.material || '—'}</dd></div>
              <div><dt>Précision</dt><dd>{r.tolerance || '—'}</dd></div>
              <div><dt>Budget</dt><dd>{r.budget !== null ? money(r.budget) : '—'}</dd></div>
              <div><dt>Date souhaitée</dt><dd>{r.deadline ? date(r.deadline) : '—'}</dd></div>
              <div><dt>Email</dt><dd><a className="link" href={`mailto:${r.client.email}`}>{r.client.email}</a></dd></div>
              <div><dt>Téléphone</dt><dd>{r.client.phone ? <a className="link" href={`tel:${r.client.phone}`}>{r.client.phone}</a> : '—'}</dd></div>
            </dl>
            <div>
              <h4 style={{ margin: '0 0 8px' }}>Fichiers joints</h4>
              {r.files.length ? <ul style={{ margin: 0, paddingLeft: 18 }}>{r.files.map(f => <li key={f.id}><a className="link" href={`/api/files/${f.id}`}>{f.originalName}</a> <span className="muted small">({fileSize(f.size)})</span></li>)}</ul> : <p className="muted small">Aucun fichier.</p>}
            </div>
            {r.quotes.length > 0 && <p className="small">Devis liés : {r.quotes.map(q => `${q.number} (${label(QUOTE_STATUS, q.status).toLowerCase()})`).join(', ')}</p>}
            <div className="actions">
              <Link className="btn btn-primary btn-sm" href={`/admin/quotes?request=${r.id}`}>Préparer le devis</Link>
              <Link className="btn btn-quiet btn-sm" href={`/admin/messages?client=${r.client.id}`}>Écrire au client</Link>
              <label className="small" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                Statut
                <select
                  value={r.status}
                  disabled={busy === r.id}
                  aria-busy={busy === r.id}
                  onChange={e => setStatus(r.id, e.target.value)}
                  style={{
                    minHeight: 36,
                    minWidth: 150,
                    borderRadius: 4,
                    border: '1px solid var(--rule)',
                    background: '#fff',
                    padding: '0 8px',
                  }}
                >
                  {Object.entries(REQUEST_STATUS).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        </details>
      ))}
    </>
  );
}
