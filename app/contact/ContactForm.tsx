'use client';

import { useState } from 'react';
import Link from 'next/link';
import Notice, { type NoticeState } from '@/components/Notice';
import { api, formJson } from '@/lib/client';

export default function ContactForm() {
  const [notice, setNotice] = useState<NoticeState>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setLoading(true);
    setNotice(null);
    const r = await api('/api/contact', 'POST', formJson(form));
    setLoading(false);
    setNotice(r.ok ? { kind: 'ok', text: r.data.message } : { kind: 'error', text: r.error });
    if (r.ok) form.reset();
  }

  return (
    <form className="form" onSubmit={submit}>
      <div className="row2">
        <div className="field"><label htmlFor="c-name">Nom</label><input id="c-name" name="name" autoComplete="name" required minLength={2} maxLength={120} /></div>
        <div className="field"><label htmlFor="c-email">Email</label><input id="c-email" name="email" type="email" autoComplete="email" required /></div>
      </div>
      <div className="row2">
        <div className="field"><label htmlFor="c-phone">Téléphone <span className="opt">(facultatif)</span></label><input id="c-phone" name="phone" type="tel" autoComplete="tel" maxLength={30} /></div>
        <div className="field"><label htmlFor="c-subject">Sujet</label><input id="c-subject" name="subject" required minLength={2} maxLength={160} /></div>
      </div>
      <div className="field"><label htmlFor="c-message">Message</label><textarea id="c-message" name="message" required minLength={10} maxLength={5000} /></div>
      <div hidden><label>Ne pas remplir <input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      <Notice value={notice} />
      <div className="actions">
        <button className="btn btn-primary" disabled={loading}>{loading ? 'Envoi…' : 'Envoyer le message'}</button>
        <Link className="link" href="/quote">Plutôt une demande de devis ?</Link>
      </div>
    </form>
  );
}
