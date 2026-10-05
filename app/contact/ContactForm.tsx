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

    if (loading) return;

    const form = e.currentTarget;

    setLoading(true);
    setNotice(null);

    const r = await api('/api/contact', 'POST', formJson(form));

    if (!r.ok) {
      setLoading(false);
      setNotice({
        kind: 'error',
        text: r.error,
      });
      return;
    }

    form.reset();
    setLoading(false);

    setNotice({
      kind: 'ok',
      text: r.data.message,
    });
  }

  return (
    <form
      className="form"
      onSubmit={submit}
      aria-busy={loading}
    >
      <div className="row2">
        <div className="field">
          <label htmlFor="c-name">Nom</label>
          <input
            id="c-name"
            name="name"
            autoComplete="name"
            required
            minLength={2}
            maxLength={120}
            disabled={loading}
          />
        </div>

        <div className="field">
          <label htmlFor="c-email">Email</label>
          <input
            id="c-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            disabled={loading}
          />
        </div>
      </div>

      <div className="row2">
        <div className="field">
          <label htmlFor="c-phone">
            Téléphone <span className="opt">(facultatif)</span>
          </label>

          <input
            id="c-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            maxLength={30}
            disabled={loading}
          />
        </div>

        <div className="field">
          <label htmlFor="c-subject">Sujet</label>

          <input
            id="c-subject"
            name="subject"
            required
            minLength={2}
            maxLength={160}
            disabled={loading}
          />
        </div>
      </div>

      <div className="field">
        <label htmlFor="c-message">Message</label>

        <textarea
          id="c-message"
          name="message"
          required
          minLength={10}
          maxLength={5000}
          disabled={loading}
        />
      </div>

      <div hidden>
        <label>
          Ne pas remplir
          <input
            name="website"
            tabIndex={-1}
            autoComplete="off"
          />
        </label>
      </div>

      <Notice value={notice} />

      <div className="actions">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
          aria-disabled={loading}
        >
          {loading ? (
            <>
              <span className="btn-spinner" aria-hidden="true" />
              Envoi en cours…
            </>
          ) : (
            'Envoyer le message'
          )}
        </button>

        <Link
          className="link"
          href="/quote"
          aria-disabled={loading}
        >
          Plutôt une demande de devis ?
        </Link>
      </div>
    </form>
  );
}