'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/client';
import { NOTIFICATION_TYPE, label, dateTime } from '@/lib/labels';

type N = { id: string; type: string; message: string; readAt: string | Date | null; createdAt: string | Date };

export default function NotificationList({ rows }: { rows: N[] }) {
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  const unread = rows.filter(r => !r.readAt).length;

  async function run(url: string, method: string, body?: unknown) {
    setBusy(true);
    await api(url, method, body);
    setBusy(false);
    router.refresh();
  }

  if (!rows.length) return <div className="empty"><strong>Aucune notification.</strong><span>Vous serez prévenu ici à chaque étape de vos demandes et projets.</span></div>;
  return (
    <section className="panel">
      <div className="panel-head">
        <span className="muted">{unread ? `${unread} non lue${unread > 1 ? 's' : ''}` : 'Tout est lu.'}</span>
        <div className="actions">
          {unread > 0 && <button type="button" className="btn btn-quiet btn-sm" disabled={busy} onClick={() => run('/api/notifications', 'PATCH', {})}>Tout marquer comme lu</button>}
          {rows.length > unread && <button type="button" className="btn btn-quiet btn-sm" disabled={busy} onClick={() => run('/api/notifications', 'DELETE')}>Effacer les notifications lues</button>}
        </div>
      </div>
      <div className="list">
        {rows.map(n => (
          <div key={n.id} className={`notif ${n.readAt ? '' : 'unread'}`}>
            <span className="dot" />
            <div><p>{n.message}</p><small>{label(NOTIFICATION_TYPE, n.type)}, {dateTime(n.createdAt)}</small></div>
            {!n.readAt ? <button type="button" className="link small" disabled={busy} onClick={() => run('/api/notifications', 'PATCH', { id: n.id })}>Marquer comme lu</button> : <span />}
          </div>
        ))}
      </div>
    </section>
  );
}
