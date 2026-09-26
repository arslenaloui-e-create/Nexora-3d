'use client';

import { useEffect, useState } from 'react';

type Message = {
  id: string;
  content: string;
  createdAt: string;
  sender: { firstName: string; lastName: string; role: string };
};

type Admin = { id: string; firstName: string; lastName: string };

export default function Messages() {
  const [rows, setRows] = useState<Message[]>([]);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [adminId, setAdminId] = useState('');
  const [message, setMessage] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false);

  async function load() {
    const [messagesResponse, adminsResponse] = await Promise.all([
      fetch('/api/messages'),
      fetch('/api/messages/contacts'),
    ]);
    const messages = await messagesResponse.json();
    const contacts = await adminsResponse.json();
    if (Array.isArray(messages)) setRows(messages);
    if (Array.isArray(contacts)) {
      setAdmins(contacts);
      setAdminId(current => current || contacts[0]?.id || '');
    }
  }

  useEffect(() => { load(); }, []);

  async function send(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!adminId || !message.trim() || loading) return;
    setLoading(true);
    setNotice('');
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ recipientId: adminId, content: message.trim() }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Envoi impossible.');
      setMessage('');
      setNotice('Message envoyé.');
      await load();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Envoi impossible.');
    } finally {
      setLoading(false);
    }
  }

  return <>
    <h1>Messages</h1>
    <div style={{ marginBottom: 20 }}>
      {rows.length ? rows.map(x => (
        <div className="notice" style={{ marginBottom: 8 }} key={x.id}>
          <strong>{x.sender.firstName} {x.sender.lastName}</strong> · {new Date(x.createdAt).toLocaleString('fr-FR')}
          <div>{x.content}</div>
        </div>
      )) : <div className="notice">Aucun message pour le moment.</div>}
    </div>
    <form className="form" onSubmit={send}>
      {admins.length > 1 && <div className="field"><label>Destinataire</label><select value={adminId} onChange={e => setAdminId(e.target.value)}>{admins.map(a => <option key={a.id} value={a.id}>{a.firstName} {a.lastName}</option>)}</select></div>}
      <div className="field"><label>Votre message</label><textarea value={message} onChange={e => setMessage(e.target.value)} required maxLength={5000} /></div>
      <button className="btn" disabled={loading || !adminId}>{loading ? 'Envoi…' : 'Envoyer'}</button>
      {notice && <div className="notice">{notice}</div>}
    </form>
  </>;
}
