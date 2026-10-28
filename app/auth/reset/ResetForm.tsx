'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Notice, { type NoticeState } from '@/components/Notice';
import { api, formJson } from '@/lib/client';

export default function ResetForm({
  token,
}: {
  token: string;
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

    const data = formJson(e.currentTarget);

    if (data.password !== data.confirm) {
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
      '/api/auth/reset',
      'POST',
      {
        token,
        password: data.password,
      },
    );

    if (!r.ok) {
      setLoading(false);

      setNotice({
        kind: 'error',
        text: r.error,
      });

      return;
    }

    setLoading(false);

    setNotice({
      kind: 'ok',
      text: r.data.message,
    });

    window.setTimeout(() => {
      router.push('/auth/login');
    }, 1200);
  }

  return (
    <form
      className="form"
      onSubmit={submit}
      aria-busy={loading}
    >
      <div className="field">
        <label htmlFor="n-pass">
          Nouveau mot de passe
        </label>

        <input
          id="n-pass"
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
        <label htmlFor="n-pass2">
          Confirmer
        </label>

        <input
          id="n-pass2"
          name="confirm"
          type="password"
          minLength={8}
          maxLength={100}
          autoComplete="new-password"
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
            Enregistrement…
          </>
        ) : (
          'Enregistrer le mot de passe'
        )}
      </button>
    </form>
  );
}