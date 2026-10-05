'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Notice, { type NoticeState } from '@/components/Notice';
import { api, formJson } from '@/lib/client';

export default function RegisterForm({
  next,
}: {
  next: string;
}) {
  const [notice, setNotice] =
    useState<NoticeState>(null);

  const [loading, setLoading] =
    useState(false);

  const router = useRouter();

  async function submit(
    e: React.FormEvent<HTMLFormElement>,
  ) {
    e.preventDefault();

    if (loading) return;

    const form = e.currentTarget;
    const data = formJson(form);

    if (data.password !== data.confirmPassword) {
      setNotice({
        kind: 'error',
        text:
          'Les deux mots de passe ne correspondent pas.',
      });

      return;
    }

    setLoading(true);
    setNotice(null);

    const r = await api(
      '/api/auth/register',
      'POST',
      data,
    );

    if (!r.ok) {
      setLoading(false);

      setNotice({
        kind: 'error',
        text: r.error,
      });

      return;
    }

    router.replace(
      `/auth/login?registered=1${
        next
          ? `&next=${encodeURIComponent(next)}`
          : ''
      }`,
    );
  }

  return (
    <form
      className="form"
      onSubmit={submit}
      aria-busy={loading}
    >
      <div className="row2">
        <div className="field">
          <label htmlFor="r-first">
            Prénom
          </label>

          <input
            id="r-first"
            name="firstName"
            autoComplete="given-name"
            required
            minLength={2}
            maxLength={60}
            disabled={loading}
          />
        </div>

        <div className="field">
          <label htmlFor="r-last">
            Nom
          </label>

          <input
            id="r-last"
            name="lastName"
            autoComplete="family-name"
            required
            minLength={2}
            maxLength={60}
            disabled={loading}
          />
        </div>
      </div>

      <div className="field">
        <label htmlFor="r-email">
          Email
        </label>

        <input
          id="r-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          disabled={loading}
        />
      </div>

      <div className="row2">
        <div className="field">
          <label htmlFor="r-phone">
            Téléphone{' '}
            <span className="opt">
              (facultatif)
            </span>
          </label>

          <input
            id="r-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            maxLength={30}
            disabled={loading}
          />
        </div>

        <div className="field">
          <label htmlFor="r-company">
            Entreprise{' '}
            <span className="opt">
              (facultatif)
            </span>
          </label>

          <input
            id="r-company"
            name="company"
            autoComplete="organization"
            maxLength={160}
            disabled={loading}
          />
        </div>
      </div>

      <div className="row2">
        <div className="field">
          <label htmlFor="r-pass">
            Mot de passe
          </label>

          <input
            id="r-pass"
            name="password"
            type="password"
            minLength={8}
            maxLength={100}
            autoComplete="new-password"
            required
            disabled={loading}
          />

          <span className="hint">
            8 caractères minimum.
          </span>
        </div>

        <div className="field">
          <label htmlFor="r-pass2">
            Confirmer le mot de passe
          </label>

          <input
            id="r-pass2"
            name="confirmPassword"
            type="password"
            minLength={8}
            maxLength={100}
            autoComplete="new-password"
            required
            disabled={loading}
          />
        </div>
      </div>

      <Notice value={notice} />

      <button
        type="submit"
        className="btn btn-primary btn-block"
        disabled={loading}
        aria-disabled={loading}
      >
        {loading ? (
          <>
            <span
              className="btn-spinner"
              aria-hidden="true"
            />
            Création du compte…
          </>
        ) : (
          'Créer mon compte'
        )}
      </button>
    </form>
  );
}