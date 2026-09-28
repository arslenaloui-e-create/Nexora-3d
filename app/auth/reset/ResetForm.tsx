'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Notice, { type NoticeState } from '@/components/Notice';
import { api, formJson } from '@/lib/client';

export default function ResetForm({ token }: { token: string }) {
  const [notice, setNotice] = useState<NoticeState>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = formJson(e.currentTarget);
    if (d.password !== d.confirm) { setNotice({ kind: 'error', text: 'Les deux mots de passe ne correspondent pas.' }); return; }
    setLoading(true);
    const r = await api('/api/auth/reset', 'POST', { token, password: d.password });
    setLoading(false);
    setNotice(r.ok ? { kind: 'ok', text: r.data.message } : { kind: 'error', text: r.error });
    if (r.ok) setTimeout(() => router.push('/auth/login'), 1200);
  }

  return (
    <form className="form" onSubmit={submit}>
      <div className="field"><label htmlFor="n-pass">Nouveau mot de passe</label><input id="n-pass" name="password" type="password" minLength={8} autoComplete="new-password" required /><span className="hint">8 caractères minimum.</span></div>
      <div className="field"><label htmlFor="n-pass2">Confirmer</label><input id="n-pass2" name="confirm" type="password" minLength={8} autoComplete="new-password" required /></div>
      <Notice value={notice} />
      <button className="btn btn-primary btn-block" disabled={loading}>{loading ? 'Enregistrement…' : 'Enregistrer le mot de passe'}</button>
    </form>
  );
}
