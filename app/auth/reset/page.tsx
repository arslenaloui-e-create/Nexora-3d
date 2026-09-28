import type { Metadata } from 'next';
import Link from 'next/link';
import ResetForm from './ResetForm';

export const metadata: Metadata = { title: 'Nouveau mot de passe' };

export default async function Reset({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const token = (await searchParams).token || '';
  return (
    <main className="auth">
      <div className="wrap" style={{ display: 'grid', placeItems: 'center' }}>
        <div className="auth-card">
          <h1>Nouveau mot de passe</h1>
          {token ? <ResetForm token={token} /> : (
            <div className="alert alert-error">Ce lien est incomplet. Ouvrez le lien reçu par email, ou <Link href="/auth/forgot">demandez-en un nouveau</Link>.</div>
          )}
        </div>
      </div>
    </main>
  );
}
