import type { Metadata } from 'next';
import Link from 'next/link';
import { safeNext } from '@/lib/api';
import RegisterForm from './RegisterForm';

export const metadata: Metadata = { title: 'Créer un compte' };

export default async function Register({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const next = safeNext((await searchParams).next);
  return (
    <main className="auth">
      <div className="wrap" style={{ display: 'grid', placeItems: 'center' }}>
        <div className="auth-card wide">
          <div style={{ display: 'grid', gap: 8 }}>
            <h1>Créer un compte</h1>
            <p className="muted">Votre espace client regroupe vos demandes de devis, projets, fichiers et messages.</p>
          </div>
          <RegisterForm next={next} />
          <div className="auth-foot">
            <span>Déjà un compte ? <Link className="link" href={`/auth/login${next ? `?next=${encodeURIComponent(next)}` : ''}`}>Se connecter</Link></span>
          </div>
        </div>
      </div>
    </main>
  );
}
