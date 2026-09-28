'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Notice, { type NoticeState } from '@/components/Notice';
import { api } from '@/lib/client';

export default function QuoteActions({ id, canAnswer }: { id: string; canAnswer: boolean }) {
  const [notice, setNotice] = useState<NoticeState>(null);
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function answer(action: 'accept' | 'reject') {
    const question = action === 'accept' ? 'Accepter ce devis ? Nexora 3D sera prévenu et lancera le projet.' : 'Refuser ce devis ?';
    if (!confirm(question)) return;
    setBusy(true);
    const r = await api(`/api/quotes/${id}`, 'PATCH', { action });
    setBusy(false);
    setNotice(r.ok ? { kind: 'ok', text: r.data.message } : { kind: 'error', text: r.error });
    if (r.ok) router.refresh();
  }

  return (
    <>
      <Notice value={notice} />
      <div className="actions">
        <a className="btn btn-quiet btn-sm" href={`/api/quotes/${id}`}>Télécharger le PDF</a>
        {canAnswer && <>
          <button type="button" className="btn btn-primary btn-sm" disabled={busy} onClick={() => answer('accept')}>Accepter le devis</button>
          <button type="button" className="btn btn-danger btn-sm" disabled={busy} onClick={() => answer('reject')}>Refuser</button>
        </>}
      </div>
    </>
  );
}
