'use client';

import { FormEvent, useEffect, useState } from 'react';
import Notice, { type NoticeState } from '@/components/Notice';
import { api } from '@/lib/client';

type Row = { id: string; title: string; description: string; category: string; technologies: string; tags: string; images: string; visible: boolean; sortOrder: number };
type Form = { title: string; description: string; category: string; technologies: string; tags: string; images: string[]; sortOrder: number; visible: boolean };

const empty: Form = { title: '', description: '', category: 'CAO', technologies: 'SolidWorks', tags: '', images: [], sortOrder: 0, visible: true };


function parse(value: string) {
  try { const v = JSON.parse(value || '[]'); return Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : []; } catch { return []; }
}

export default function PortfolioAdmin() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [library, setLibrary] = useState<string[]>([]);
  const [form, setForm] = useState<Form>(empty);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [notice, setNotice] = useState<NoticeState>(null);
  const [loading, setLoading] = useState(false);
  const [manual, setManual] = useState('');
  const [actionId, setActionId] = useState('');

  async function load() {
    const [r, l] = await Promise.all([api<Row[]>('/api/admin/portfolio'), api<string[]>('/api/admin/portfolio/images')]);
    if (!r.ok) { setNotice({ kind: 'error', text: r.error }); setRows([]); return; }
    setRows(r.data);
    if (l.ok) setLibrary(l.data);
  }
  useEffect(() => { load(); }, []);

  function edit(row: Row) {
    setEditingId(row.id);
    setForm({ title: row.title, description: row.description, category: row.category, technologies: row.technologies, tags: row.tags, images: parse(row.images), sortOrder: row.sortOrder, visible: row.visible });
    setNotice(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function reset() { setEditingId(null); setForm(empty); }
  function toggleImage(src: string) {
    setForm(f => ({ ...f, images: f.images.includes(src) ? f.images.filter(x => x !== src) : [...f.images, src] }));
  }
  function move(i: number, d: number) {
    setForm(f => { const a = [...f.images]; const j = i + d; if (j < 0 || j >= a.length) return f;[a[i], a[j]] = [a[j], a[i]]; return { ...f, images: a }; });
  }

  async function save(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    const r = await api('/api/admin/portfolio', editingId ? 'PATCH' : 'POST', editingId ? { id: editingId, ...form } : form);
    setLoading(false);
    if (!r.ok) { setNotice({ kind: 'error', text: r.error }); return; }
    setNotice({ kind: 'ok', text: editingId ? 'Réalisation mise à jour.' : 'Réalisation ajoutée au portfolio.' });
    reset();
    load();
  }

  async function quick(row: Row, visible: boolean) {
    if (actionId) return;

    setActionId(row.id);

    const r = await api('/api/admin/portfolio', 'PATCH', {
      ...row,
      images: parse(row.images),
      visible,
    });

    setActionId('');

    if (!r.ok) {
      setNotice({ kind: 'error', text: r.error });
      return;
    }

    await load();
  }

  async function remove(row: Row) {
    if (
      !confirm(
        `Supprimer « ${row.title} » du portfolio ? Les images restent sur le serveur. Pour simplement la cacher, utilisez « Masquer ».`
      )
    ) {
      return;
    }

    if (actionId) return;

    setActionId(row.id);

    const r = await api(
      `/api/admin/portfolio?id=${row.id}`,
      'DELETE'
    );

    setActionId('');

    if (!r.ok) {
      setNotice({ kind: 'error', text: r.error });
      return;
    }

    if (editingId === row.id) {
      reset();
    }

    await load();
  }

  return (
    <>
      <div className="app-head">
        <div><h1>Portfolio</h1><p className="muted">Les réalisations visibles s’affichent sur l’accueil et la page Réalisations, dans l’ordre choisi ici.</p></div>
        <a className="btn btn-quiet" href="/portfolio" target="_blank" rel="noopener noreferrer">Voir la page publique</a>
      </div>

      <form className="panel form" onSubmit={save}>
        <div className="panel-head"><h2>{editingId ? 'Modifier la réalisation' : 'Ajouter une réalisation'}</h2>{editingId && <button className="btn btn-quiet btn-sm" type="button" onClick={reset}>Annuler</button>}</div>
        <div className="field"><label htmlFor="pf-title">Titre</label><input id="pf-title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required maxLength={160} /></div>
        <div className="field"><label htmlFor="pf-desc">Description</label><textarea id="pf-desc" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required maxLength={5000} /></div>
        <div className="row3">
          <div className="field"><label htmlFor="pf-cat">Domaine</label><input id="pf-cat" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} list="pf-cats" maxLength={80} /><datalist id="pf-cats">{[...new Set((rows || []).map(r => r.category))].map(c => <option key={c} value={c} />)}</datalist></div>
          <div className="field"><label htmlFor="pf-tech">Outils</label><input id="pf-tech" value={form.technologies} onChange={e => setForm({ ...form, technologies: e.target.value })} placeholder="SolidWorks, FDM" maxLength={500} /></div>
          <div className="field"><label htmlFor="pf-tags">Thèmes</label><input id="pf-tags" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} placeholder="naval, maquette" maxLength={500} /></div>
        </div>

        <fieldset className="fieldset-rule">
          <legend>Images <span className="opt muted small">(la première sert de vignette)</span></legend>
          {form.images.length > 0 ? (
            <div className="chosen">
              {form.images.map((src, i) => (
                <figure key={src}>
                  <img src={src} alt="" />
                  <button type="button" aria-label="Retirer cette image" onClick={() => toggleImage(src)}>×</button>
                  <div style={{ position: 'absolute', bottom: -2, left: 0, right: 0, display: 'flex', justifyContent: 'space-between' }}>
                    <button type="button" style={{ position: 'static', width: 22, height: 22 }} aria-label="Avancer" disabled={i === 0} onClick={() => move(i, -1)}>‹</button>
                    <button type="button" style={{ position: 'static', width: 22, height: 22 }} aria-label="Reculer" disabled={i === form.images.length - 1} onClick={() => move(i, 1)}>›</button>
                  </div>
                </figure>
              ))}
            </div>
          ) : <p className="muted small">Aucune image choisie. Cliquez sur les images ci-dessous.</p>}
          <div className="thumb-grid" aria-label="Images disponibles dans public/images">
            {library.map(src => {
              const i = form.images.indexOf(src);
              return (
                <button key={src} type="button" aria-pressed={i >= 0} title={src.replace('/images/', '')} onClick={() => toggleImage(src)}>
                  <img src={src} alt={src.replace('/images/', '')} loading="lazy" />
                  {i >= 0 && <b>{i + 1}</b>}
                </button>
              );
            })}
          </div>
          <div className="row2">
            <div className="field">
              <label htmlFor="pf-manual">Ajouter une image par son chemin ou son URL</label>
              <input id="pf-manual" value={manual} onChange={e => setManual(e.target.value)} placeholder="/images/ma-piece.png ou https://…" />
            </div>
            <div style={{ alignSelf: 'end' }}><button type="button" className="btn btn-quiet" disabled={!manual.trim()} onClick={() => { toggleImage(manual.trim()); setManual(''); }}>Ajouter</button></div>
          </div>
          <span className="hint">Pour une nouvelle image : ajoutez le fichier dans le dossier <code>public/images</code> du projet, puis redéployez. Elle apparaîtra dans la liste ci-dessus.</span>
        </fieldset>

        <div className="row2">
          <div className="field"><label htmlFor="pf-order">Ordre d’affichage</label><input id="pf-order" type="number" value={form.sortOrder} onChange={e => setForm({ ...form, sortOrder: Number(e.target.value) || 0 })} /><span className="hint">Le plus petit nombre s’affiche en premier. La première réalisation illustre aussi l’accueil.</span></div>
          <label className="check" style={{ alignSelf: 'center' }}><input type="checkbox" checked={form.visible} onChange={e => setForm({ ...form, visible: e.target.checked })} /> Visible sur le site</label>
        </div>
        <Notice value={notice} />
        <div><button className="btn btn-primary" disabled={loading}>{loading ? 'Enregistrement…' : editingId ? 'Enregistrer les modifications' : 'Ajouter au portfolio'}</button></div>
      </form>

      {rows === null ? <p className="muted">Chargement…</p> : rows.length === 0 ? (
        <div className="empty"><strong>Le portfolio est vide.</strong><span>Lancez <code>npm run db:seed</code> pour importer les 11 réalisations d’origine, ou ajoutez-en une ci-dessus.</span></div>
      ) : (
        <div className="table-wrap">
          <table className="table stack">
            <thead><tr><th>Réalisation</th><th>Domaine</th><th className="num">Vues</th><th className="num">Ordre</th><th>Visibilité</th><th><span className="skip">Actions</span></th></tr></thead>
            <tbody>
              {rows.map(row => {
                const imgs = parse(row.images);
                return (
                  <tr key={row.id}>
                    <td data-label="Réalisation">
                      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                        {imgs[0] ? <img src={imgs[0]} alt="" style={{ width: 56, height: 42, objectFit: 'contain', background: 'var(--paper)', flex: 'none' }} /> : null}
                        <strong>{row.title}</strong>
                      </div>
                    </td>
                    <td data-label="Domaine">{row.category}</td>
                    <td data-label="Vues" className="num">{imgs.length}</td>
                    <td data-label="Ordre" className="num">{row.sortOrder}</td>
                    <td data-label="Visibilité"><span className={`pill ${row.visible ? 'pill-ok' : ''}`}>{row.visible ? 'Visible' : 'Masquée'}</span></td>
                    <td data-label="">
                      <div className="actions">
                        <button className="btn btn-quiet btn-sm" type="button" onClick={() => edit(row)}>Modifier</button>
                        <button
                          className="btn btn-quiet btn-sm"
                          type="button"
                          disabled={actionId === row.id}
                          onClick={() => quick(row, !row.visible)}
                        >
                          {actionId === row.id
                            ? 'Traitement…'
                            : row.visible
                              ? 'Masquer'
                              : 'Afficher'}
                        </button>

                        <button
                          className="btn btn-danger btn-sm"
                          type="button"
                          disabled={actionId === row.id}
                          onClick={() => remove(row)}
                        >
                          {actionId === row.id ? 'Traitement…' : 'Supprimer'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
