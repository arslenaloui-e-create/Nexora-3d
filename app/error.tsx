'use client';

import Link from 'next/link';

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="page">
      <div className="wrap">
        <div className="page-head">
          <h1>Un problème est survenu</h1>
          <p className="lead">La page n’a pas pu se charger. Réessayez dans un instant ; si le problème continue, écrivez-nous.</p>
        </div>
        <div className="actions">
          <button type="button" className="btn btn-primary" onClick={reset}>Réessayer</button>
          <Link className="btn btn-quiet" href="/contact">Nous contacter</Link>
        </div>
      </div>
    </main>
  );
}
