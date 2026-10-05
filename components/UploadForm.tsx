'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Notice, { type NoticeState } from './Notice';
import { api } from '@/lib/client';

const ACCEPT = '.stl,.step,.stp,.sldprt,.sldasm,.obj,.3mf,.pdf,.zip,.png,.jpg,.jpeg,.webp';

type Target = { id: string; title: string };

export default function UploadForm({ projectId, projects, label = 'Ajouter des fichiers', onDone }: { projectId?: string; projects?: Target[]; label?: string; onDone?: () => void }) {
  const [notice, setNotice] = useState<NoticeState>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    if (projectId) fd.set('projectId', projectId);
    setLoading(true);
    setNotice(null);
    const r = await api('/api/files', 'POST', fd);
    setLoading(false);
    setNotice(r.ok ? { kind: 'ok', text: r.data.message } : { kind: 'error', text: r.error });
    if (r.ok) { form.reset(); onDone?.(); router.refresh(); }
  }

  return (
    <form className="form" onSubmit={submit} aria-busy={loading}>
      <fieldset disabled={loading} style={{ border: 0, padding: 0, margin: 0, minWidth: 0 }}>
        <div className={projects?.length ? 'row2' : undefined} style={{ display: projects?.length ? undefined : 'grid' }}>
          <div className="field">
            <label htmlFor={`up-${projectId || 'all'}`}>{label}</label>
            <input id={`up-${projectId || 'all'}`} name="files" type="file" multiple accept={ACCEPT} required />
            <span className="hint">STL, STEP, SolidWorks, OBJ, 3MF, PDF, ZIP ou images. 50 Mo maximum par fichier.</span>
          </div>
          {!projectId && projects && projects.length > 0 && (
            <div className="field">
              <label htmlFor="up-project">Rattacher à un projet <span className="opt">(facultatif)</span></label>
              <select id="up-project" name="projectId" defaultValue="">
                <option value="">Aucun projet</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
              </select>
            </div>
          )}
        </div>
        <Notice value={notice} />
        <div><button className="btn btn-primary btn-sm" disabled={loading}>{loading ? 'Envoi…' : 'Envoyer'}</button></div>
      </fieldset>
    </form>
  );
}
