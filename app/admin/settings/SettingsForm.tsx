'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Notice, { type NoticeState } from '@/components/Notice';
import { api, formJson } from '@/lib/client';

type S = { email: string; phone: string; instagram: string; linkedin: string; description: string; taxRate: number };

export default function SettingsForm({ initial }: { initial: S }) {
  const [notice, setNotice] = useState<NoticeState>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const r = await api('/api/admin/settings', 'PATCH', formJson(e.currentTarget));
    setLoading(false);
    setNotice(r.ok ? { kind: 'ok', text: 'Paramètres enregistrés. Le site public est à jour.' } : { kind: 'error', text: r.error });
    if (r.ok) router.refresh();
  }

  return (
    <form
      className="panel form"
      onSubmit={save}
      aria-busy={loading}
      style={{ maxWidth: 760 }}
    >
      <fieldset
        disabled={loading}
        style={{
          border: 0,
          padding: 0,
          margin: 0,
          minWidth: 0,
        }}
      >
        <div className="row2">
          <div className="field"><label htmlFor="s-email">Email de contact</label><input id="s-email" name="email" type="email" defaultValue={initial.email} required /></div>
          <div className="field"><label htmlFor="s-phone">Téléphone</label><input id="s-phone" name="phone" defaultValue={initial.phone} /></div>
        </div>
        <div className="row2">
          <div className="field"><label htmlFor="s-ig">Lien Instagram</label><input id="s-ig" name="instagram" type="url" defaultValue={initial.instagram} /></div>
          <div className="field"><label htmlFor="s-li">Lien LinkedIn</label><input id="s-li" name="linkedin" type="url" defaultValue={initial.linkedin} /></div>
        </div>
        <div className="field"><label htmlFor="s-desc">Phrase de présentation</label><textarea id="s-desc" name="description" defaultValue={initial.description} maxLength={500} style={{ minHeight: 80 }} /><span className="hint">Affichée dans le pied de page et en en-tête des devis PDF.</span></div>
        <div className="field" style={{ maxWidth: 220 }}><label htmlFor="s-tax">TVA par défaut (%)</label><input id="s-tax" name="taxRate" type="number" step="0.01" min={0} max={100} defaultValue={initial.taxRate} required /><span className="hint">Proposée à la création d’un devis.</span></div>
        <Notice value={notice} />
        <div><button className="btn btn-primary" disabled={loading}>{loading ? 'Enregistrement…' : 'Enregistrer'}</button></div>
      </fieldset>
    </form>
  );
}
