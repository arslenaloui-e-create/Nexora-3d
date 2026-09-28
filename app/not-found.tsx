import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="page">
      <div className="wrap">
        <div className="page-head">
          <h1>Page introuvable</h1>
          <p className="lead">Cette adresse n’existe pas ou plus. La réalisation a peut-être été retirée du portfolio.</p>
        </div>
        <div className="actions">
          <Link className="btn btn-primary" href="/">Retour à l’accueil</Link>
          <Link className="btn btn-quiet" href="/portfolio">Voir les réalisations</Link>
        </div>
      </div>
    </main>
  );
}
