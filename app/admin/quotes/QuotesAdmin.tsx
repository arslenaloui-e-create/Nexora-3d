'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Notice, { type NoticeState } from '@/components/Notice';
import { api } from '@/lib/client';
import { QUOTE_STATUS, money, date, label, tone } from '@/lib/labels';

type Row = { id: string; number: string; status: string; clientName: string; requestTitle: string | null; totalHT: number; totalTTC: number; validUntil: string; createdAt: string; lines: number };
type Client = { id: string; firstName: string; lastName: string; email: string };
type Req = { id: string; title: string; clientId: string; serviceType: string; quantity: number | null };
type Line = { description: string; quantity: string; unitPrice: string };

const in30days = () => new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10);

export default function QuotesAdmin({ rows, clients, requests, taxRate, preset, startOpen }: { rows: Row[]; clients: Client[]; requests: Req[]; taxRate: number; preset: Req | null; startOpen: boolean }) {
  const router = useRouter();
  const [open, setOpen] = useState(startOpen);
  const [clientId, setClientId] = useState(preset?.clientId || '');
  const [requestId, setRequestId] = useState(preset?.id || '');
  const [lines, setLines] = useState<Line[]>([{ description: preset ? `${preset.serviceType} — ${preset.title}` : '', quantity: String(preset?.quantity || 1), unitPrice: '' }]);
  const [discount, setDiscount] = useState('0');
  const [tax, setTax] = useState(String(taxRate));
  const [validUntil, setValidUntil] = useState(in30days());
  const [conditions, setConditions] = useState('Paiement selon accord entre les parties.');
  const [notes, setNotes] = useState('');
  const [notice, setNotice] = useState<NoticeState>(null);
  const [saving, setSaving] = useState(false);
  const [busy, setBusy] = useState('');
  const [listError, setListError] = useState('');

  const clientRequests = requests.filter(r => r.clientId === clientId);
  const totals = useMemo(() => {
    const sub = lines.reduce((s, l) => s + (Number(l.quantity) || 0) * (Number(l.unitPrice) || 0), 0);
    const ht = Math.max(0, sub - (Number(discount) || 0));
    return { sub, ht, ttc: ht * (1 + (Number(tax) || 0) / 100) };
  }, [lines, discount, tax]);

  const setLine = (i: number, patch: Partial<Line>) => setLines(v => v.map((l, j) => (j === i ? { ...l, ...patch } : l)));

  async function save(send: boolean) {
    if (send && !confirm('Envoyer ce devis au client ? Il sera prévenu dans son espace (et par email si le SMTP est configuré).')) return;
    setSaving(true);
    setNotice(null);
    const r = await api<{ number: string }>('/api/admin/quotes', 'POST', {
      clientId, requestId, lines, discount, taxRate: tax, validUntil, conditions, notes, send,
    });
    setSaving(false);
    if (!r.ok) { setNotice({ kind: 'error', text: r.error }); return; }
    setNotice({ kind: 'ok', text: `Devis ${r.data.number} ${send ? 'envoyé au client' : 'enregistré en brouillon'}.` });
    setLines([{ description: '', quantity: '1', unitPrice: '' }]);
    setRequestId(''); setNotes(''); setDiscount('0');
    router.replace('/admin/quotes');
    router.refresh();
  }

  async function act(id: string, method: 'PATCH' | 'DELETE', status?: string) {
    if (method === 'DELETE' && !confirm('Supprimer ce brouillon ?')) return;
    if (status === 'SENT' && !confirm('Envoyer ce devis au client ?')) return;
    setBusy(id);
    const r = method === 'DELETE' ? await api(`/api/admin/quotes?id=${id}`, 'DELETE') : await api('/api/admin/quotes', 'PATCH', { id, status });
    setBusy('');
    setListError(r.ok ? '' : r.error);
    router.refresh();
  }

  return (
    <>
      <section className="panel">
        <div className="panel-head">
          <h2>Nouveau devis</h2>
          <button type="button" className="btn btn-quiet btn-sm" onClick={() => setOpen(v => !v)} aria-expanded={open}>{open ? 'Replier' : 'Préparer un devis'}</button>
        </div>
        {open && (
          <form
            className="form"
            aria-busy={saving}
            onSubmit={e => {
              e.preventDefault();
              save(false);
            }}
          >
            <fieldset
              disabled={saving}
              style={{
                border: 0,
                padding: 0,
                margin: 0,
                minWidth: 0,
              }}
            >
              <div className="row2">
                <div className="field">
                  <label htmlFor="qa-client">Client</label>
                  <select id="qa-client" value={clientId} onChange={e => { setClientId(e.target.value); setRequestId(''); }} required>
                    <option value="">Choisir un client…</option>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.firstName} {c.lastName} ({c.email})</option>)}
                  </select>
                  {!clients.length && <span className="hint">Aucun client actif : le client doit d’abord créer son compte.</span>}
                </div>
                <div className="field">
                  <label htmlFor="qa-request">Demande liée <span className="opt">(facultatif)</span></label>
                  <select id="qa-request" value={requestId} onChange={e => setRequestId(e.target.value)} disabled={!clientId}>
                    <option value="">Aucune</option>
                    {clientRequests.map(r => <option key={r.id} value={r.id}>{r.title}</option>)}
                  </select>
                </div>
              </div>
              <fieldset className="fieldset-rule">
                <legend>Lignes</legend>
                <div className="lines">
                  {lines.map((l, i) => (
                    <div className="line" key={i}>
                      <div className="field"><label htmlFor={`qa-d${i}`}>Prestation</label><input id={`qa-d${i}`} value={l.description} onChange={e => setLine(i, { description: e.target.value })} required maxLength={300} /></div>
                      <div className="field"><label htmlFor={`qa-q${i}`}>Qté</label><input id={`qa-q${i}`} type="number" step="0.01" min="0.01" value={l.quantity} onChange={e => setLine(i, { quantity: e.target.value })} required /></div>
                      <div className="field"><label htmlFor={`qa-p${i}`}>Prix unitaire HT</label><input id={`qa-p${i}`} type="number" step="0.01" min="0" value={l.unitPrice} onChange={e => setLine(i, { unitPrice: e.target.value })} required /></div>
                      <button type="button" className="btn btn-quiet btn-sm" style={{ minHeight: 46 }} aria-label={`Retirer la ligne ${i + 1}`} disabled={lines.length === 1} onClick={() => setLines(v => v.filter((_, j) => j !== i))}>×</button>
                    </div>
                  ))}
                </div>
                <div><button type="button" className="btn btn-quiet btn-sm" onClick={() => setLines(v => [...v, { description: '', quantity: '1', unitPrice: '' }])}>Ajouter une ligne</button></div>
              </fieldset>
              <div className="row3 fieldset-rule">
                <div className="field"><label htmlFor="qa-disc">Remise (TND)</label><input id="qa-disc" type="number" step="0.01" min="0" value={discount} onChange={e => setDiscount(e.target.value)} /></div>
                <div className="field"><label htmlFor="qa-tax">TVA (%)</label><input id="qa-tax" type="number" step="0.01" min="0" max="100" value={tax} onChange={e => setTax(e.target.value)} /></div>
                <div className="field"><label htmlFor="qa-valid">Valable jusqu’au</label><input id="qa-valid" type="date" value={validUntil} onChange={e => setValidUntil(e.target.value)} required /></div>
              </div>
              <div className="totals">
                <span>Sous-total : {money(totals.sub)}</span>
                <span>Total HT : {money(totals.ht)}</span>
                <strong>Total TTC : {money(totals.ttc)}</strong>
              </div>
              <div className="field"><label htmlFor="qa-cond">Conditions</label><textarea id="qa-cond" value={conditions} onChange={e => setConditions(e.target.value)} maxLength={3000} style={{ minHeight: 80 }} /></div>
              <div className="field"><label htmlFor="qa-notes">Notes pour le client <span className="opt">(facultatif)</span></label><textarea id="qa-notes" value={notes} onChange={e => setNotes(e.target.value)} maxLength={3000} style={{ minHeight: 70 }} /></div>
              <Notice value={notice} />
              <div className="actions">
                <button type="button" className="btn btn-primary" disabled={saving || !clientId} onClick={() => save(true)}>{saving ? 'Enregistrement…' : 'Envoyer au client'}</button>
                <button className="btn btn-quiet" disabled={saving || !clientId}>Enregistrer en brouillon</button>
              </div>
            </fieldset>
          </form>
        )}
        {!open && notice && <Notice value={notice} />}
      </section>

      {listError && <div className="alert alert-error" role="alert">{listError}</div>}
      {rows.length === 0 ? <div className="empty"><strong>Aucun devis pour le moment.</strong></div> : (
        <div className="table-wrap">
          <table className="table stack">
            <thead><tr><th>Numéro</th><th>Client</th><th>Statut</th><th className="num">TTC</th><th>Validité</th><th><span className="skip">Actions</span></th></tr></thead>
            <tbody>
              {rows.map(q => (
                <tr key={q.id}>
                  <td data-label="Numéro"><strong>{q.number}</strong>{q.requestTitle && <span className="sub">{q.requestTitle}</span>}</td>
                  <td data-label="Client">{q.clientName}</td>
                  <td data-label="Statut"><span className={`pill pill-${tone(q.status)}`}>{label(QUOTE_STATUS, q.status)}</span></td>
                  <td data-label="TTC" className="num">{money(q.totalTTC)}</td>
                  <td data-label="Validité">{date(q.validUntil)}</td>
                  <td data-label="">
                    <div className="actions">
                      <a className="btn btn-quiet btn-sm" href={`/api/quotes/${q.id}`}>PDF</a>
                      {q.status === 'DRAFT' && <>
                        <button type="button" className="btn btn-primary btn-sm" disabled={busy === q.id} onClick={() => act(q.id, 'PATCH', 'SENT')}>Envoyer</button>
                        <button type="button" className="btn btn-danger btn-sm" disabled={busy === q.id} onClick={() => act(q.id, 'DELETE')}>Supprimer</button>
                      </>}
                      {q.status === 'SENT' && <button type="button" className="btn btn-quiet btn-sm" disabled={busy === q.id} onClick={() => act(q.id, 'PATCH', 'EXPIRED')}>Marquer expiré</button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
