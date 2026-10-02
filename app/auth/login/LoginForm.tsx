'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Notice, { type NoticeState } from '@/components/Notice';
import { api, formJson } from '@/lib/client';

export default function LoginForm({ next }: { next: string }) {
  const [notice, setNotice] = useState<NoticeState>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setNotice(null);
    const r = await api<{ role: 'ADMIN' | 'CLIENT' }>('/api/auth/login', 'POST', formJson(e.currentTarget));
    if (!r.ok) { setLoading(false); setNotice({ kind: 'error', text: r.error }); return; }
    const home = r.data.role === 'ADMIN' ? '/admin' : '/dashboard';
    // Un client ne peut pas être renvoyé vers l'admin (et inversement) : on retombe sur son espace.
    const target = next && !(r.data.role === 'CLIENT' && next.startsWith('/admin')) && !(r.data.role === 'ADMIN' && next.startsWith('/dashboard')) ? next : home;
    router.replace(target);
    router.refresh();
  }

  return (
    <form className="form" onSubmit={submit}>
      <div className="field"><label htmlFor="l-email">Email</label><input id="l-email" name="email" type="email" autoComplete="email" required autoFocus /></div>
      <div className="field"><label htmlFor="l-pass">Mot de passe</label><input id="l-pass" name="password" type="password" autoComplete="current-password" required /></div>
      <Notice value={notice} />
      <button className="btn btn-primary btn-block" disabled={loading}>{loading ? 'Connexion…' : 'Se connecter'}</button>
    </form>
  );
}
