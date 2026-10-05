'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Notice, { type NoticeState } from './Notice';
import { api, formJson } from '@/lib/client';

type User = { firstName: string; lastName: string; email: string; phone: string | null; company: string | null };

export default function ProfileForm({ user }: { user: User }) {
  const [notice, setNotice] = useState<NoticeState>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const d = formJson(form);
    if (d.newPassword && d.newPassword !== d.confirmPassword) { setNotice({ kind: 'error', text: 'Les deux nouveaux mots de passe ne correspondent pas.' }); return; }
    setLoading(true);
    const r = await api('/api/profile', 'PATCH', d);
    setLoading(false);
    setNotice(r.ok ? { kind: 'ok', text: r.data.message } : { kind: 'error', text: r.error });
    if (r.ok) {
      (['currentPassword', 'newPassword', 'confirmPassword'] as const).forEach(n => { const el = form.elements.namedItem(n) as HTMLInputElement | null; if (el) el.value = ''; });
      router.refresh();
    }
  }

  return (
    <form
      className="panel form"
      onSubmit={submit}
      aria-busy={loading}
      style={{ maxWidth: 720 }}
    >
      <fieldset disabled={loading}>
        <legend>Coordonnées</legend>
        <div className="row2">
          <div className="field"><label htmlFor="p-first">Prénom</label><input id="p-first" name="firstName" defaultValue={user.firstName} required minLength={2} maxLength={60} autoComplete="given-name" /></div>
          <div className="field"><label htmlFor="p-last">Nom</label><input id="p-last" name="lastName" defaultValue={user.lastName} required minLength={2} maxLength={60} autoComplete="family-name" /></div>
        </div>
        <div className="field"><label htmlFor="p-email">Email</label><input id="p-email" value={user.email} disabled /><span className="hint">Pour changer d’email, écrivez-nous dans la messagerie.</span></div>
        <div className="row2">
          <div className="field"><label htmlFor="p-phone">Téléphone</label><input id="p-phone" name="phone" defaultValue={user.phone || ''} maxLength={30} autoComplete="tel" /></div>
          <div className="field"><label htmlFor="p-company">Entreprise <span className="opt">(facultatif)</span></label><input id="p-company" name="company" defaultValue={user.company || ''} maxLength={160} autoComplete="organization" /></div>
        </div>
      </fieldset>
      <fieldset className="fieldset-rule" disabled={loading}>
        <legend>Mot de passe <span className="opt muted small">(laisser vide pour ne pas le changer)</span></legend>
        <div className="field"><label htmlFor="p-current">Mot de passe actuel</label><input id="p-current" name="currentPassword" type="password" autoComplete="current-password" /></div>
        <div className="row2">
          <div className="field"><label htmlFor="p-new">Nouveau mot de passe</label><input id="p-new" name="newPassword" type="password" minLength={8} autoComplete="new-password" /></div>
          <div className="field"><label htmlFor="p-new2">Confirmer</label><input id="p-new2" name="confirmPassword" type="password" minLength={8} autoComplete="new-password" /></div>
        </div>
      </fieldset>
      <Notice value={notice} />
      <div><button className="btn btn-primary" disabled={loading}>{loading ? 'Enregistrement…' : 'Enregistrer'}</button></div>
    </form>
  );
}
