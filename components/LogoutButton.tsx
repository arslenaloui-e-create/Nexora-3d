'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function logout() {
    if (loading) return;
    setLoading(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      // Même si l'appel échoue, on quitte l'espace : le cookie expiré ne donne plus accès.
      router.replace('/auth/login');
      router.refresh();
    }
  }

  return (
    <div className="logout">
      <button type="button" className="btn btn-quiet btn-sm" onClick={logout} disabled={loading}>{loading ? 'Déconnexion…' : 'Se déconnecter'}</button>
    </div>
  );
}
