'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/client';
import { fileSize, date } from '@/lib/labels';

export type FileRow = { id: string; originalName: string; size: number; createdAt: string | Date; mine?: boolean; byNexora?: boolean; context?: string };

export default function FileList({ files, canDelete = true, onChange, admin = false }: { files: FileRow[]; canDelete?: boolean; onChange?: () => void; admin?: boolean }) {
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  async function remove(f: FileRow) {
    if (!confirm(`Supprimer « ${f.originalName} » ? Cette action est définitive.`)) return;
    setBusy(f.id);
    const r = await api(`/api/files/${f.id}`, 'DELETE');
    setBusy('');
    setError(r.ok ? '' : r.error);
    if (r.ok) { onChange?.(); router.refresh(); }
  }

  if (!files.length) return <p className="muted small">Aucun fichier pour le moment.</p>;
  return (
    <>
      {error && <div className="alert alert-error" role="alert">{error}</div>}
      <div className="table-wrap">
        <table className="table stack">
          <thead><tr><th>Fichier</th><th>Origine</th><th className="num">Taille</th><th>Date</th><th><span className="skip">Actions</span></th></tr></thead>
          <tbody>
            {files.map(f => (
              <tr key={f.id}>
                <td data-label="Fichier"><strong style={{ overflowWrap: 'anywhere' }}>{f.originalName}</strong>{f.context && <span className="sub">{f.context}</span>}</td>
                <td data-label="Origine">{f.byNexora ? <span className="pill pill-accent">Nexora 3D</span> : <span className="pill">{admin ? 'Client' : 'Vous'}</span>}</td>
                <td data-label="Taille" className="num">{fileSize(f.size)}</td>
                <td data-label="Date">{date(f.createdAt)}</td>
                <td data-label="">
                  <div className="actions">
                    <a className="btn btn-quiet btn-sm" href={`/api/files/${f.id}`}>Télécharger</a>
                    {canDelete && f.mine !== false && <button type="button" className="btn btn-danger btn-sm" disabled={busy === f.id} onClick={() => remove(f)}>{busy === f.id ? 'Suppression…' : 'Supprimer'}</button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
