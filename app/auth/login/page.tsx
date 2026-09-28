import type { Metadata } from 'next';
import Link from 'next/link';
import { safeNext } from '@/lib/api';
import LoginForm from './LoginForm';

export const metadata: Metadata = { title: 'Connexion' };

type Props = { searchParams: Promise<{ next?: string; verified?: string; registered?: string }> };

export default async function Login({ searchParams }: Props) {
  const sp = await searchParams;
  const next = safeNext(sp.next);
  const info = sp.verified === '1' ? 'Adresse email confirmée. Vous pouvez vous connecter.'
    : sp.verified === 'expired' ? 'Ce lien de confirmation a expiré ou a déjà servi. Votre compte reste utilisable : connectez-vous.'
    : sp.registered ? 'Compte créé. Connectez-vous pour continuer.' : '';
  return (
    <main className="auth">
      <div className="wrap" style={{ display: 'grid', placeItems: 'center' }}>
        <div className="auth-card">
          <div style={{ display: 'grid', gap: 8 }}>
            <h1>Connexion</h1>
            <p className="muted">Accédez à vos devis, projets, fichiers et messages.</p>
          </div>
          {info && <div className="alert alert-ok" role="status">{info}</div>}
          <LoginForm next={next} />
          <div className="auth-foot">
            <Link className="link" href="/auth/forgot">Mot de passe oublié ?</Link>
            <span>Pas encore de compte ? <Link className="link" href={`/auth/register${next ? `?next=${encodeURIComponent(next)}` : ''}`}>Créer un compte</Link></span>
          </div>
        </div>
      </div>
    </main>
  );
}
