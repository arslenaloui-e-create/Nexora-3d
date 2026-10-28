'use client';

import { useState } from 'react';
import Link from 'next/link';
import Notice, { type NoticeState } from '@/components/Notice';
import { api, formJson } from '@/lib/client';

export default function Forgot() {
  const [notice, setNotice] =
    useState<NoticeState>(null);

  const [loading, setLoading] =
    useState(false);

  async function submit(
    e: React.FormEvent<HTMLFormElement>,
  ) {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setNotice(null);

    const r = await api(
      '/api/auth/forgot',
      'POST',
      formJson(e.currentTarget),
    );

    setLoading(false);

    setNotice(
      r.ok
        ? {
            kind: 'ok',
            text: r.data.message,
          }
        : {
            kind: 'error',
            text: r.error,
          },
    );
  }

  return (
    <main className="auth">
      <div
        className="wrap"
        style={{
          display: 'grid',
          placeItems: 'center',
        }}
      >
        <div className="auth-card">
          <div
            style={{
              display: 'grid',
              gap: 8,
            }}
          >
            <h1>Mot de passe oublié</h1>

            <p className="muted">
              Indiquez l’email de votre compte :
              nous vous envoyons un lien pour
              choisir un nouveau mot de passe.
            </p>
          </div>

          <form
            className="form"
            onSubmit={submit}
            aria-busy={loading}
          >
            <div className="field">
              <label htmlFor="f-email">
                Email
              </label>

              <input
                id="f-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                disabled={loading}
              />
            </div>

            <Notice value={notice} />

            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span
                    className="btn-spinner"
                    aria-hidden="true"
                  />
                  Envoi…
                </>
              ) : (
                'Envoyer le lien'
              )}
            </button>
          </form>

          <div className="auth-foot">
            <Link
              className="link"
              href="/auth/login"
            >
              Retour à la connexion
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}