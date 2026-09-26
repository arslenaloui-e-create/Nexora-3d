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
      const response = await fetch('/api/auth/logout', { method: 'POST' });
      if (!response.ok) throw new Error('Logout failed');
      router.replace('/auth/login');
      router.refresh();
    } catch {
      setLoading(false);
    }
  }

  return (
    <button type="button" className="btn alt" style={{ marginTop: 12 }} onClick={logout} disabled={loading}>
      {loading ? 'Déconnexion…' : 'Déconnexion'}
    </button>
  );
}
