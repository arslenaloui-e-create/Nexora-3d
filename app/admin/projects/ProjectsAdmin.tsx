'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Notice, { type NoticeState } from '@/components/Notice';
import FileList from '@/components/FileList';
import UploadForm from '@/components/UploadForm';
import { api, formJson } from '@/lib/client';
import { PROJECT_STATUS, PROJECT_PROGRESS, label, tone, date, dateTime } from '@/lib/labels';

type Row = {
  id: string; title: string; description: string; status: string; updatedAt: string;
  client: { id: string; firstName: string; lastName: string };
  history: { id: string; status: string; note: string | null; createdAt: string }[];
  files: { id: string; originalName: string; size: number; createdAt: string; byNexora: boolean }[];
};
type Client = { id: string; firstName: string; lastName: string; email: string };

function ProjectCard({ p }: { p: Row }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [notice, setNotice] = useState<NoticeState>(null);
  const [busy, setBusy] = useState(false);

  async function update(body: Record<string, unknown>) {
    setBusy(true);
    const r = await api('/api/admin/projects', 'PATCH', { id: p.id, ...body });
    setBusy(false);
    setNotice(r.ok ? { kind: 'ok', text: 'Projet mis à jour, le client est prévenu.' } : { kind: 'error', text: r.error });
    if (r.ok) { setEditing(false); router.refresh(); }
    return r.ok;
  }

  async function remove() {
    if (!confirm(`Supprimer le projet « ${p.title} » et son historique ? Les fichiers restent disponibles dans « Fichiers ».`)) return;
    setBusy(true);
    const r = await api(`/api/admin/projects?id=${p.id}`, 'DELETE');
    setBusy(false);
    if (!r.ok) setNotice({ kind: 'error', text: r.error }); else router.refresh();
  }

  return (
    <details className="project" id={p.id}>
      <summary>
        <div><h3>{p.title}</h3><span className="muted small">{p.client.firstName} {p.client.lastName}, mis à jour le {date(p.updatedAt)}</span></div>
        <span className="actions"><span className="small muted">{PROJECT_PROGRESS[p.status]} %</span><span className={`pill pill-${tone(p.status)}`}>{label(PROJECT_STATUS, p.status)}</span></span>
        <div className="progress" style={{ gridColumn: '1 / -1' }}><span style={{ width: `${PROJECT_PROGRESS[p.status]}%` }} /></div>
      </summary>
      <div className="project-body">
        {editing ? (
          <form className="form" onSubmit={e => { e.preventDefault(); update(formJson(e.currentTarget)); }}>
            <div className="field"><label htmlFor={`t-${p.id}`}>Titre</label><input id={`t-${p.id}`} name="title" defaultValue={p.title} required minLength={2} maxLength={160} /></div>
            <div className="field"><label htmlFor={`d-${p.id}`}>Description</label><textarea id={`d-${p.id}`} name="description" defaultValue={p.description} required /></div>
            <div className="actions"><button className="btn btn-primary btn-sm" disabled={busy}>Enregistrer</button><button type="button" className="btn btn-quiet btn-sm" onClick={() => setEditing(false)}>Annuler</button></div>
          </form>
        ) : <p style={{ whiteSpace: 'pre-line' }}>{p.description}</p>}

        <form className="form" onSubmit={async e => { e.preventDefault(); const form = e.currentTarget; if (await update(formJson(form))) form.reset(); }}>
          <div className="row2">
            <div className="field">
              <label htmlFor={`s-${p.id}`}>Statut</label>
              <select id={`s-${p.id}`} name="status" defaultValue={p.status}>
                {Object.entries(PROJECT_STATUS).map(([k, v]) => <option key={k} value={k}>{v} ({PROJECT_PROGRESS[k]} %)</option>)}
              </select>
            </div>
            <div className="field"><label htmlFor={`n-${p.id}`}>Note pour le client <span className="opt">(facultatif)</span></label><input id={`n-${p.id}`} name="note" maxLength={500} placeholder="Ex. Modèle validé, impression lancée" /></div>
          </div>
          <div><button className="btn btn-primary btn-sm" disabled={busy}>Mettre à jour l’avancement</button></div>
        </form>
        <Notice value={notice} />

        <div className="grid-2">
          <div style={{ display: 'grid', gap: 10, alignContent: 'start' }}>
            <h4 style={{ margin: 0 }}>Historique</h4>
            <ol className="timeline">
              {p.history.map(h => <li key={h.id}><strong>{label(PROJECT_STATUS, h.status)}</strong>{h.note && <> — {h.note}</>}<br /><small>{dateTime(h.createdAt)}</small></li>)}
            </ol>
          </div>
          <div style={{ display: 'grid', gap: 10, alignContent: 'start' }}>
            <h4 style={{ margin: 0 }}>Fichiers</h4>
            <FileList admin files={p.files.map(f => ({ ...f, mine: true }))} />
            <UploadForm projectId={p.id} label="Déposer un livrable pour le client" />
          </div>
        </div>
        <div className="actions">
          <button type="button" className="btn btn-quiet btn-sm" onClick={() => setEditing(v => !v)}>Modifier le titre ou la description</button>
          <button type="button" className="btn btn-danger btn-sm" disabled={busy} onClick={remove}>Supprimer le projet</button>
        </div>
      </div>
    </details>
  );
}

export default function ProjectsAdmin({ rows, clients }: { rows: Row[]; clients: Client[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [notice, setNotice] = useState<NoticeState>(null);
  const [busy, setBusy] = useState(false);
  const [filter, setFilter] = useState<'active' | 'all'>('active');
  const active = rows.filter(r => !['COMPLETED', 'ARCHIVED'].includes(r.status));
  const shown = filter === 'active' ? active : rows;

  async function create(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setBusy(true);
    const r = await api('/api/admin/projects', 'POST', formJson(form));
    setBusy(false);
    setNotice(r.ok ? { kind: 'ok', text: 'Projet créé. Il apparaît maintenant dans l’espace du client.' } : { kind: 'error', text: r.error });
    if (r.ok) { form.reset(); router.refresh(); }
  }

  return (
    <>
      <section className="panel">
        <div className="panel-head"><h2>Nouveau projet</h2><button type="button" className="btn btn-quiet btn-sm" aria-expanded={open} onClick={() => setOpen(v => !v)}>{open ? 'Replier' : 'Créer un projet'}</button></div>
        {open && (
          <form className="form" onSubmit={create}>
            <div className="row2">
              <div className="field">
                <label htmlFor="np-client">Client</label>
                <select id="np-client" name="clientId" required defaultValue="">
                  <option value="" disabled>Choisir un client…</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.firstName} {c.lastName} ({c.email})</option>)}
                </select>
              </div>
              <div className="field"><label htmlFor="np-title">Titre</label><input id="np-title" name="title" required minLength={2} maxLength={160} /></div>
            </div>
            <div className="field"><label htmlFor="np-desc">Description</label><textarea id="np-desc" name="description" required /></div>
            <div className="field" style={{ maxWidth: 320 }}>
              <label htmlFor="np-status">Statut de départ</label>
              <select id="np-status" name="status" defaultValue="DRAFT">{Object.entries(PROJECT_STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
            </div>
            <div><button className="btn btn-primary" disabled={busy}>{busy ? 'Création…' : 'Créer le projet'}</button></div>
          </form>
        )}
        <Notice value={notice} />
      </section>
      <div className="filters" role="group" aria-label="Filtrer">
        <button type="button" className="chip" aria-pressed={filter === 'active'} onClick={() => setFilter('active')}>En cours<small>{active.length}</small></button>
        <button type="button" className="chip" aria-pressed={filter === 'all'} onClick={() => setFilter('all')}>Tous<small>{rows.length}</small></button>
      </div>
      {shown.length === 0 ? <div className="empty"><strong>Aucun projet {filter === 'active' ? 'en cours' : ''}.</strong><span>Créez un projet quand un devis est accepté.</span></div> : shown.map(p => <ProjectCard key={p.id} p={p} />)}
    </>
  );
}
