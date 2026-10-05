'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Chat from '@/components/Chat';
import { api } from '@/lib/client';
import { CONTACT_STATUS, dateTime, label, tone } from '@/lib/labels';

type Client = { id: string; firstName: string; lastName: string; email: string; company: string | null; unread: number; lastAt: number };
type Contact = { id: string; name: string; email: string; phone: string | null; subject: string; message: string; status: string; createdAt: string };

export default function MessagesAdmin({ meId, initialTab, initialClient, contacts }: { meId: string; initialTab: 'chat' | 'contact'; initialClient: string; contacts: Contact[] }) {
  const [tab, setTab] = useState(initialTab);
  const [clients, setClients] = useState<Client[] | null>(null);
  const [current, setCurrent] = useState(initialClient);
  const [busy, setBusy] = useState('');
  const router = useRouter();

  const loadClients = useCallback(async () => {
    const r = await api<Client[]>('/api/messages/contacts');
    if (r.ok) setClients(r.data);
  }, []);
  useEffect(() => { loadClients(); }, [loadClients]);
  useEffect(() => { if (!current && clients?.length) setCurrent(clients[0].id); }, [clients, current]);

  async function setStatus(c: Contact, status: string) {
    setBusy(c.id);
    await api('/api/admin/messages', 'PATCH', { id: c.id, status });
    setBusy('');
    router.refresh();
  }

  const newContacts = contacts.filter(c => c.status === 'NEW').length;
  const unreadChats = clients?.reduce((s, c) => s + c.unread, 0) || 0;
  const who = clients?.find(c => c.id === current);

  return (
    <>
      <div className="tabs" role="tablist">
        <button type="button" role="tab" aria-selected={tab === 'chat'} onClick={() => setTab('chat')}>Clients{unreadChats ? ` (${unreadChats})` : ''}</button>
        <button type="button" role="tab" aria-selected={tab === 'contact'} onClick={() => setTab('contact')}>Formulaire de contact{newContacts ? ` (${newContacts})` : ''}</button>
      </div>

      {tab === 'chat' ? (
        clients === null ? (
          <div className="chat-loading" role="status">
            <span className="btn-spinner" aria-hidden="true" />
            <span>Chargement des conversations…</span>
          </div>
        ) : clients.length === 0 ? <div className="empty"><strong>Aucun client inscrit.</strong></div> : (
          <div className="inbox">
            <div className="inbox-list" role="list">
              {clients.map(c => (
                <button key={c.id} type="button" aria-pressed={c.id === current} onClick={() => setCurrent(c.id)}>
                  <span><strong>{c.firstName} {c.lastName}</strong><small>{c.company || c.email}</small></span>
                  {c.unread > 0 && <span className="count">{c.unread}</span>}
                </button>
              ))}
            </div>
            <div style={{ display: 'grid', gap: 10 }}>
              {who && <p className="muted small">Conversation avec <strong>{who.firstName} {who.lastName}</strong> ({who.email})</p>}
              {current && <Chat key={current} meId={meId} clientId={current} asAdmin onRead={loadClients} />}
            </div>
          </div>
        )
      ) : contacts.length === 0 ? <div className="empty"><strong>Aucun message reçu par le formulaire de contact.</strong></div> : (
        <div style={{ display: 'grid', gap: 12 }}>
          {contacts.map(c => (
            <article key={c.id} className="panel" style={{ opacity: c.status === 'ARCHIVED' ? 0.65 : 1 }}>
              <div className="panel-head">
                <div><h3>{c.subject}</h3><span className="muted small">{c.name}, {dateTime(c.createdAt)}</span></div>
                <span className={`pill pill-${c.status === 'NEW' ? 'accent' : tone(c.status)}`}>{label(CONTACT_STATUS, c.status)}</span>
              </div>
              <p style={{ whiteSpace: 'pre-line' }}>{c.message}</p>
              <div className="actions">
                <a className="btn btn-primary btn-sm" href={`mailto:${c.email}?subject=${encodeURIComponent(`Re: ${c.subject}`)}`} onClick={() => c.status === 'NEW' && setStatus(c, 'READ')}>Répondre par email</a>
                {c.phone && <a className="btn btn-quiet btn-sm" href={`tel:${c.phone}`}>Appeler {c.phone}</a>}
                {c.status === 'NEW' && <button type="button" className="btn btn-quiet btn-sm" disabled={busy === c.id} onClick={() => setStatus(c, 'READ')}>Marquer comme lu</button>}
                {c.status !== 'ARCHIVED' && <button type="button" className="btn btn-quiet btn-sm" disabled={busy === c.id} onClick={() => setStatus(c, 'ARCHIVED')}>Archiver</button>}
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
