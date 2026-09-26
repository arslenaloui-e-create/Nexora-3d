'use client';

import { FormEvent, useEffect, useState } from 'react';

type Row = {
  id: string;
  title: string;
  description: string;
  category: string;
  technologies: string;
  tags: string;
  images: string;
  visible: boolean;
  sortOrder: number;
};

const empty = { title: '', description: '', category: 'Général', technologies: '', tags: '', images: '', sortOrder: 0, visible: true };

function imagesToText(value: string) {
  try {
    const parsed = JSON.parse(value || '[]');
    return Array.isArray(parsed) ? parsed.join('\n') : '';
  } catch {
    return '';
  }
}

export default function PortfolioAdmin() {
  const [rows, setRows] = useState<Row[]>([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function load() {
    const response = await fetch('/api/admin/portfolio', { cache: 'no-store' });
    if (!response.ok) {
      setMessage('Impossible de charger le portfolio.');
      return;
    }
    setRows(await response.json());
  }

  useEffect(() => { load(); }, []);

  function edit(row: Row) {
    setEditingId(row.id);
    setForm({
      title: row.title,
      description: row.description,
      category: row.category,
      technologies: row.technologies,
      tags: row.tags,
      images: imagesToText(row.images),
      sortOrder: row.sortOrder,
      visible: row.visible,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function reset() {
    setEditingId(null);
    setForm(empty);
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    const payload = {
      ...form,
      images: form.images.split('\n').map(x => x.trim()).filter(Boolean),
    };

    const response = await fetch('/api/admin/portfolio', {
      method: editingId ? 'PATCH' : 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(editingId ? { id: editingId, ...payload } : payload),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      setMessage(data.error || 'Une erreur est survenue.');
      setLoading(false);
      return;
    }

    setMessage(editingId ? 'Projet portfolio mis à jour.' : 'Projet portfolio créé.');
    reset();
    await load();
    setLoading(false);
  }

  async function remove(id: string) {
    if (!confirm('Supprimer ce projet ?')) return;
    const response = await fetch(`/api/admin/portfolio?id=${id}`, { method: 'DELETE' });
    if (!response.ok) {
      setMessage('La suppression a échoué.');
      return;
    }
    if (editingId === id) reset();
    await load();
  }

  return (
    <>
      <div className="topbar">
        <div>
          <div className="eyebrow">NEXORA / ADMIN</div>
          <h1>Portfolio</h1>
        </div>
        <span className="muted">{rows.length} réalisation{rows.length > 1 ? 's' : ''}</span>
      </div>

      <form className="card form" onSubmit={save}>
        <div className="sectionHeader">
          <div>
            <div className="eyebrow">{editingId ? 'Modification' : 'Nouvelle réalisation'}</div>
            <h2>{editingId ? 'Modifier le projet' : 'Ajouter une réalisation'}</h2>
          </div>
          {editingId && <button className="btn btn-secondary" type="button" onClick={reset}>Annuler</button>}
        </div>

        <div className="field"><label htmlFor="portfolio-title">Titre</label><input id="portfolio-title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required /></div>
        <div className="field"><label htmlFor="portfolio-description">Description</label><textarea id="portfolio-description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required /></div>
        <div className="split">
          <div className="field"><label htmlFor="portfolio-category">Catégorie</label><input id="portfolio-category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} /></div>
          <div className="field"><label htmlFor="portfolio-tech">Technologies</label><input id="portfolio-tech" value={form.technologies} onChange={e => setForm({ ...form, technologies: e.target.value })} placeholder="SolidWorks, PLA, FDM" /></div>
        </div>
        <div className="field"><label htmlFor="portfolio-tags">Tags</label><input id="portfolio-tags" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} placeholder="prototype, mécanique" /></div>
        <div className="field">
          <label htmlFor="portfolio-images">Images — une URL ou un chemin par ligne</label>
          <textarea id="portfolio-images" value={form.images} onChange={e => setForm({ ...form, images: e.target.value })} placeholder={"/images/projet-01.png\n/images/projet-02.webp"} rows={5} />
          <small className="muted">Les formats JPG, PNG, WebP et autres formats servis par votre hébergement sont acceptés côté affichage.</small>
        </div>
        <div className="split">
          <div className="field"><label htmlFor="portfolio-order">Ordre d'affichage</label><input id="portfolio-order" value={form.sortOrder} onChange={e => setForm({ ...form, sortOrder: Number(e.target.value) || 0 })} type="number" /></div>
          <label className="field"><span>Publication</span><span><input checked={form.visible} onChange={e => setForm({ ...form, visible: e.target.checked })} type="checkbox" /> Visible publiquement</span></label>
        </div>
        <button className="btn btn-primary" disabled={loading}>{loading ? 'Enregistrement…' : editingId ? 'Enregistrer les modifications' : 'Ajouter au portfolio'}</button>
        {message && <div className="notice">{message}</div>}
      </form>

      <div className="tableWrap" style={{ marginTop: 20 }}>
        <table className="table">
          <thead><tr><th>Projet</th><th>Catégorie</th><th>Ordre</th><th>Visibilité</th><th>Actions</th></tr></thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan={5}>Aucune réalisation enregistrée.</td></tr>
            ) : rows.map(row => (
              <tr key={row.id}>
                <td><strong>{row.title}</strong></td>
                <td>{row.category}</td>
                <td>{row.sortOrder}</td>
                <td>{row.visible ? 'Oui' : 'Non'}</td>
                <td>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <button className="btn btn-secondary" type="button" onClick={() => edit(row)}>Modifier</button>
                    <button className="btn danger" type="button" onClick={() => remove(row.id)}>Supprimer</button>
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
