'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Notice, { type NoticeState } from '@/components/Notice';
import { api } from '@/lib/client';

type Faq = { id: string; question: string; answer: string; category: string; sortOrder: number; visible: boolean };
const blank = { question: '', answer: '', category: 'Général', sortOrder: 0, visible: true };

export default function FaqAdmin({ rows }: { rows: Faq[] }) {
  const router = useRouter();
  const [form, setForm] = useState<Omit<Faq, 'id'>>(blank);
  const [editing, setEditing] = useState<string | null>(null);
  const [notice, setNotice] = useState<NoticeState>(null);
  const [busy, setBusy] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const r = await api('/api/admin/faq', editing ? 'PATCH' : 'POST', editing ? { id: editing, ...form } : form);
    setBusy(false);
    setNotice(r.ok ? { kind: 'ok', text: editing ? 'Question modifiée.' : 'Question ajoutée.' } : { kind: 'error', text: r.error });
    if (r.ok) { setForm(blank); setEditing(null); router.refresh(); }
  }

  async function quick(f: Faq, patch: Partial<Faq>) {
    const r = await api('/api/admin/faq', 'PATCH', { ...f, ...patch });
    if (!r.ok) setNotice({ kind: 'error', text: r.error });
    router.refresh();
  }

  async function remove(f: Faq) {
    if (!confirm(`Supprimer la question « ${f.question} » ?`)) return;
    const r = await api(`/api/admin/faq?id=${f.id}`, 'DELETE');
    if (!r.ok) setNotice({ kind: 'error', text: r.error });
    if (editing === f.id) { setEditing(null); setForm(blank); }
    router.refresh();
  }

  return (
    <>
      <form className="panel form" onSubmit={save}>
        <div className="panel-head"><h2>{editing ? 'Modifier la question' : 'Ajouter une question'}</h2>{editing && <button type="button" className="btn btn-quiet btn-sm" onClick={() => { setEditing(null); setForm(blank); }}>Annuler</button>}</div>
        <div className="field"><label htmlFor="fq-q">Question</label><input id="fq-q" value={form.question} onChange={e => setForm({ ...form, question: e.target.value })} required minLength={3} maxLength={300} /></div>
        <div className="field"><label htmlFor="fq-a">Réponse</label><textarea id="fq-a" value={form.answer} onChange={e => setForm({ ...form, answer: e.target.value })} required minLength={3} maxLength={5000} /></div>
        <div className="row3">
          <div className="field"><label htmlFor="fq-c">Catégorie</label><input id="fq-c" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} maxLength={80} /></div>
          <div className="field"><label htmlFor="fq-o">Ordre d’affichage</label><input id="fq-o" type="number" value={form.sortOrder} onChange={e => setForm({ ...form, sortOrder: Number(e.target.value) || 0 })} /></div>
          <label className="check" style={{ alignSelf: 'end', minHeight: 46 }}><input type="checkbox" checked={form.visible} onChange={e => setForm({ ...form, visible: e.target.checked })} /> Visible sur le site</label>
        </div>
        <Notice value={notice} />
        <div><button className="btn btn-primary" disabled={busy}>{busy ? 'Enregistrement…' : editing ? 'Enregistrer' : 'Ajouter'}</button></div>
      </form>
      {rows.length === 0 ? <div className="empty"><strong>Aucune question.</strong></div> : (
        <div className="table-wrap">
          <table className="table stack">
            <thead><tr><th>Question</th><th>Catégorie</th><th className="num">Ordre</th><th>Visible</th><th><span className="skip">Actions</span></th></tr></thead>
            <tbody>
              {rows.map(f => (
                <tr key={f.id}>
                  <td data-label="Question"><strong>{f.question}</strong><span className="sub">{f.answer.slice(0, 120)}{f.answer.length > 120 ? '…' : ''}</span></td>
                  <td data-label="Catégorie">{f.category}</td>
                  <td data-label="Ordre" className="num">{f.sortOrder}</td>
                  <td data-label="Visible"><button type="button" className={`pill ${f.visible ? 'pill-ok' : ''}`} style={{ border: 0, cursor: 'pointer' }} onClick={() => quick(f, { visible: !f.visible })} title="Cliquer pour changer">{f.visible ? 'Visible' : 'Masquée'}</button></td>
                  <td data-label="">
                    <div className="actions">
                      <button type="button" className="btn btn-quiet btn-sm" onClick={() => { setEditing(f.id); setForm({ question: f.question, answer: f.answer, category: f.category, sortOrder: f.sortOrder, visible: f.visible }); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Modifier</button>
                      <button type="button" className="btn btn-danger btn-sm" onClick={() => remove(f)}>Supprimer</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
