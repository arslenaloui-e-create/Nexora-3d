'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/client';
import { dateTime } from '@/lib/labels';

type Person = { id: string; firstName: string; lastName: string; role: 'ADMIN' | 'CLIENT' };
type Message = { id: string; content: string; createdAt: string; readAt: string | null; senderId: string; recipientId: string; sender: Person };

// Conversation client <-> Nexora. Côté admin, `clientId` désigne le client affiché.
export default function Chat({ meId, clientId, asAdmin = false, onRead }: { meId: string; clientId?: string; asAdmin?: boolean; onRead?: () => void }) {
  const [rows, setRows] = useState<Message[] | null>(null);
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const log = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const load = useCallback(async () => {
    const r = await api<Message[]>(asAdmin ? `/api/messages?client=${clientId}` : '/api/messages');
    if (!r.ok) { setError(r.error); setRows([]); return; }
    setRows(r.data);
    // Marque la conversation comme lue et met à jour les compteurs du menu.
    const unread = r.data.some(m => !m.readAt && (asAdmin ? m.sender.role === 'CLIENT' : m.recipientId === meId));
    if (unread) {
      await api('/api/messages', 'PATCH', asAdmin ? { client: clientId } : {});
      onRead?.();
      router.refresh();
    }
  }, [asAdmin, clientId, meId, onRead, router]);

  useEffect(() => { setRows(null); load(); const t = setInterval(load, 30000); return () => clearInterval(t); }, [load]);
  useEffect(() => { log.current?.scrollTo({ top: log.current.scrollHeight }); }, [rows]);

  async function send(e?: React.FormEvent) {
    e?.preventDefault();
    const content = text.trim();
    if (!content || sending) return;
    setSending(true);
    setError('');
    const r = await api<Message>('/api/messages', 'POST', { content, recipientId: asAdmin ? clientId : undefined });
    setSending(false);
    if (!r.ok) { setError(r.error); return; }
    setText('');
    setRows(v => [...(v || []), r.data]);
  }

  const mine = (m: Message) => (asAdmin ? m.sender.role === 'ADMIN' : m.senderId === meId);

  return (
    <div className="chat">
      <div className="chat-log" ref={log} aria-live="polite">
        {rows === null ? <p className="muted">Chargement…</p>
          : rows.length === 0 ? <p className="muted">{asAdmin ? 'Aucun message avec ce client. Écrivez le premier.' : 'Posez votre question ici : l’équipe Nexora 3D vous répond dans cette conversation.'}</p>
          : rows.map(m => (
            <div key={m.id} className={`msg ${mine(m) ? 'me' : ''}`}>
              {m.content}
              <small>{mine(m) ? (asAdmin ? `${m.sender.firstName}, ` : 'Vous, ') : `${m.sender.firstName} ${m.sender.lastName}, `}{dateTime(m.createdAt)}</small>
            </div>
          ))}
      </div>
      <form className="chat-form" onSubmit={send}>
        <label className="skip" htmlFor="chat-input">Votre message</label>
        <textarea id="chat-input" value={text} onChange={e => setText(e.target.value)} maxLength={5000} placeholder="Écrire un message…"
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }} />
        <button className="btn btn-primary" disabled={sending || !text.trim()}>{sending ? 'Envoi…' : 'Envoyer'}</button>
      </form>
      {error && <div className="alert alert-error" role="alert" style={{ margin: 12 }}>{error}</div>}
    </div>
  );
}
