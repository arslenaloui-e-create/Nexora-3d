'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/client';

export default function UserToggle({
  id,
  active,
  name,
}: {
  id: string;
  active: boolean;
  name: string;
}) {
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function toggle() {
    if (active) {
      const confirmed = confirm(
        `Désactiver le compte de ${name} ? Il ne pourra plus se connecter.`
      );

      if (!confirmed) return;
    }

    setBusy(true);

    const r = await api('/api/admin/users', 'PATCH', {
      id,
      status: active ? 'DISABLED' : 'ACTIVE',
    });

    setBusy(false);

    if (!r.ok) {
      alert(r.error);
      return;
    }

    router.refresh();
  }

  return (
    <button
      type="button"
      className={`btn btn-sm ${active ? 'btn-danger' : 'btn-quiet'}`}
      disabled={busy}
      aria-busy={busy}
      onClick={toggle}
    >
      {busy
        ? 'Traitement…'
        : active
          ? 'Désactiver'
          : 'Réactiver'}
    </button>
  );
}