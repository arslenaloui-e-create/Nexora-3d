'use client';

import { useState } from 'react';
import Link from 'next/link';
import Notice, { type NoticeState } from '@/components/Notice';
import { api } from '@/lib/client';

const services = [
  'Conception 3D (CAO)',
  'Conception et impression 3D',
  'Impression 3D d’un fichier existant',
  'Prototypage',
  'Accompagnement technique',
  'Autre',
];

export default function QuoteForm({
  loggedIn,
  accept,
  maxMb,
}: {
  loggedIn: boolean;
  accept: string;
  maxMb: number;
}) {
  const [notice, setNotice] = useState<NoticeState>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (loading || !loggedIn) return;

    const form = e.currentTarget;
    const fd = new FormData(form);

    const files = fd
      .getAll('files')
      .filter(
        (x): x is File =>
          x instanceof File && x.size > 0,
      );

    const tooBig = files.find(
      (file) => file.size > maxMb * 1024 * 1024,
    );

    if (tooBig) {
      setNotice({
        kind: 'error',
        text: `${tooBig.name} dépasse ${maxMb} Mo.`,
      });
      return;
    }

    const body = Object.fromEntries(
      [...fd.entries()].filter(
        ([key]) => key !== 'files',
      ),
    );

    setLoading(true);
    setNotice(null);

    const request = await api<{ id: string }>(
      '/api/quote-requests',
      'POST',
      body,
    );

    if (!request.ok) {
      setLoading(false);
      setNotice({
        kind: 'error',
        text: request.error,
      });
      return;
    }

    if (files.length) {
      const upload = new FormData();

      upload.append(
        'requestId',
        request.data.id,
      );

      files.forEach((file) => {
        upload.append('files', file);
      });

      const result = await api(
        '/api/files',
        'POST',
        upload,
      );

      if (!result.ok) {
        setLoading(false);

        setNotice({
          kind: 'error',
          text:
            `Demande envoyée, mais les fichiers n’ont pas pu être joints : ` +
            `${result.error} Vous pouvez les ajouter depuis Mon espace › Fichiers.`,
        });

        form.reset();

        return;
      }
    }

    form.reset();
    setLoading(false);
    setDone(true);
  }

  if (done) {
    return (
      <div className="panel quote-success">
        <div className="success-mark" aria-hidden="true">
          ✓
        </div>

        <div>
          <h2>Demande envoyée</h2>

          <p className="muted">
            Nous l’étudions et vous préviendrons dans
            votre espace client dès que le devis est prêt.
          </p>
        </div>

        <div className="actions">
          <Link
            className="btn btn-primary"
            href="/dashboard/requests"
          >
            Suivre ma demande
          </Link>

          <button
            type="button"
            className="btn btn-quiet"
            onClick={() => {
              setDone(false);
              setNotice(null);
            }}
          >
            Faire une autre demande
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      className="form"
      onSubmit={submit}
      aria-disabled={!loggedIn}
      aria-busy={loading}
    >
      <fieldset disabled={!loggedIn || loading}>
        <legend>Le projet</legend>

        <div className="field">
          <label htmlFor="q-service">
            Type de prestation
          </label>

          <select
            id="q-service"
            name="serviceType"
            required
            defaultValue=""
          >
            <option value="" disabled>
              Choisir…
            </option>

            {services.map((service) => (
              <option key={service}>
                {service}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="q-title">Titre</label>

          <input
            id="q-title"
            name="title"
            required
            minLength={2}
            maxLength={160}
            placeholder="Ex. Support de capteur pour drone"
          />
        </div>

        <div className="field">
          <label htmlFor="q-desc">
            Description du besoin
          </label>

          <textarea
            id="q-desc"
            name="description"
            required
            minLength={10}
            maxLength={10000}
            placeholder="À quoi sert la pièce, où elle se monte, quelles contraintes elle subit…"
          />
        </div>
      </fieldset>

      <fieldset
        disabled={!loggedIn || loading}
        className="fieldset-rule"
      >
        <legend>
          Caractéristiques{' '}
          <span className="opt muted small">
            (si vous les connaissez)
          </span>
        </legend>

        <div className="row2">
          <div className="field">
            <label htmlFor="q-dim">
              Dimensions
            </label>

            <input
              id="q-dim"
              name="dimensions"
              maxLength={160}
              placeholder="Ex. 120 × 80 × 35 mm"
            />
          </div>

          <div className="field">
            <label htmlFor="q-qty">
              Quantité
            </label>

            <input
              id="q-qty"
              name="quantity"
              type="number"
              min={1}
              step={1}
              inputMode="numeric"
            />
          </div>
        </div>

        <div className="row2">
          <div className="field">
            <label htmlFor="q-mat">
              Matériau
            </label>

            <input
              id="q-mat"
              name="material"
              maxLength={120}
              placeholder="Ex. PLA, PETG, TPU…"
            />
          </div>

          <div className="field">
            <label htmlFor="q-tol">
              Précision attendue
            </label>

            <input
              id="q-tol"
              name="tolerance"
              maxLength={120}
              placeholder="Ex. ±0,1 mm"
            />
          </div>
        </div>

        <div className="row2">
          <div className="field">
            <label htmlFor="q-budget">
              Budget indicatif (TND)
            </label>

            <input
              id="q-budget"
              name="budget"
              type="number"
              min={0}
              step="0.01"
              inputMode="decimal"
            />
          </div>

          <div className="field">
            <label htmlFor="q-deadline">
              Date souhaitée
            </label>

            <input
              id="q-deadline"
              name="deadline"
              type="date"
              min={new Date()
                .toISOString()
                .slice(0, 10)}
            />
          </div>
        </div>
      </fieldset>

      <fieldset
        disabled={!loggedIn || loading}
        className="fieldset-rule"
      >
        <legend>Fichiers</legend>

        <div className="field">
          <label htmlFor="q-files">
            Plans, modèles, photos ou croquis{' '}
            <span className="opt">
              (facultatif)
            </span>
          </label>

          <input
            id="q-files"
            name="files"
            type="file"
            multiple
            accept={accept}
          />

          <span className="hint">
            STL, STEP, SLDPRT, SLDASM, OBJ, 3MF,
            PDF, ZIP, PNG, JPG ou WebP, {maxMb} Mo
            maximum par fichier.
          </span>
        </div>
      </fieldset>

      <Notice value={notice} />

      <div className="actions">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading || !loggedIn}
        >
          {loading ? (
            <>
              <span
                className="btn-spinner"
                aria-hidden="true"
              />
              Envoi en cours…
            </>
          ) : (
            'Envoyer la demande'
          )}
        </button>

        {!loggedIn && (
          <span className="muted small">
            Connectez-vous pour envoyer la demande.
          </span>
        )}
      </div>
    </form>
  );
}