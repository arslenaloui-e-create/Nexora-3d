import type { Metadata } from 'next';
import Link from 'next/link';
import { getSession } from '@/lib/auth';
import { ACCEPT } from '@/lib/files';
import QuoteForm from './QuoteForm';

export const metadata: Metadata = { title: 'Demander un devis', description: 'Décrivez votre pièce ou votre projet et joignez vos fichiers : Nexora 3D vous répond avec un devis.' };

export default async function Quote() {
  const session = await getSession();
  return (
    <main className="page">
      <div className="wrap">
        <header className="page-head">
          <h1>Demander un devis</h1>
          <p className="lead">Décrivez la pièce ou le projet. Plus il y a de détails (cotes, usage, matériau, fichiers), plus le devis sera précis.</p>
        </header>
        <div className="quote-layout">
          <div>
            {!session && (
              <div className="empty" style={{ marginBottom: 24 }}>
                <strong>Un compte client est nécessaire pour envoyer une demande.</strong>
                <span>Il sert à vous transmettre le devis, les fichiers et l’avancement du projet. La création prend une minute.</span>
                <div className="actions">
                  <Link className="btn btn-primary" href="/auth/register?next=/quote">Créer mon compte</Link>
                  <Link className="btn btn-quiet" href="/auth/login?next=/quote">J’ai déjà un compte</Link>
                </div>
              </div>
            )}
            {session?.role === 'ADMIN' ? (
              <div className="alert alert-info">Vous êtes connecté en administrateur. Les devis se créent depuis <Link href="/admin/quotes">Administration › Devis</Link>.</div>
            ) : (
              <QuoteForm loggedIn={Boolean(session)} accept={ACCEPT} maxMb={Number(process.env.MAX_UPLOAD_MB || 50)} />
            )}
          </div>
          <aside className="quote-aside">
            <h2 style={{ fontSize: '1.3rem' }}>Ce qui se passe ensuite</h2>
            <ol>
              <li>Nous étudions votre demande et revenons vers vous si une précision manque.</li>
              <li>Le devis arrive dans votre espace client, en PDF.</li>
              <li>Vous l’acceptez en un clic, et le projet démarre.</li>
            </ol>
            <p className="muted small">Pas de fichier ? Une photo ou un croquis coté suffit pour commencer.</p>
          </aside>
        </div>
      </div>
    </main>
  );
}
