import { PDFDocument, PDFFont, StandardFonts, rgb } from 'pdf-lib';

type Line = { description: string; quantity: unknown; unitPrice: unknown };
type QuoteForPdf = {
  number: string; createdAt: Date; validUntil: Date; discount: unknown; taxRate: unknown; totalHT: unknown; totalTTC: unknown;
  conditions: string; notes: string | null; lines: Line[];
  client: { firstName: string; lastName: string; email: string; company: string | null; phone: string | null };
};
type Settings = { email?: string | null; phone?: string | null; description?: string | null } | null;

// Les polices standard du PDF (WinAnsi) ne savent pas écrire certains caractères
// (émojis, flèches, retours à la ligne...) : sans ce nettoyage, la génération plantait.
function clean(value: unknown) {
  return String(value ?? '')
    .replace(/[‘’]/g, "'").replace(/[“”]/g, '"')
    .replace(/→/g, '->').replace(/ | /g, ' ')
    .replace(/[^\x20-\x7E -ÿ€–—…Œœ]/g, '');
}

function wrap(text: string, font: PDFFont, size: number, width: number) {
  const out: string[] = [];
  for (const paragraph of String(text).split(/\r?\n/)) {
    let line = '';
    for (const word of clean(paragraph).split(/\s+/)) {
      const next = line ? `${line} ${word}` : word;
      if (font.widthOfTextAtSize(next, size) > width && line) { out.push(line); line = word; } else line = next;
    }
    out.push(line);
  }
  return out;
}

const amount = (v: unknown) => `${Number(v || 0).toFixed(2)} TND`;

export async function quotePdf(q: QuoteForPdf, settings: Settings) {
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const ink = rgb(0.086, 0.125, 0.165);
  const grey = rgb(0.36, 0.4, 0.44);
  const blue = rgb(0.043, 0.435, 0.816);
  let page = pdf.addPage([595, 842]);
  let y = 790;

  const txt = (s: string, x: number, size = 10, f = font, color = ink) => page.drawText(clean(s), { x, y, size, font: f, color });
  const right = (s: string, xRight: number, size = 10, f = font) => page.drawText(clean(s), { x: xRight - f.widthOfTextAtSize(clean(s), size), y, size, font: f, color: ink });
  const ensure = (space: number) => { if (y - space < 60) { page = pdf.addPage([595, 842]); y = 790; } };

  txt('NEXORA 3D', 42, 22, bold);
  right(`Devis ${q.number}`, 553, 13, bold);
  y -= 16;
  txt(settings?.description || 'Ingénierie 3D & impression haute précision', 42, 9, font, grey);
  right(`Émis le ${new Date(q.createdAt).toLocaleDateString('fr-FR')}`, 553, 9);
  y -= 13;
  if (settings?.email) txt(`${settings.email}${settings.phone ? `  -  ${settings.phone}` : ''}`, 42, 9, font, grey);
  right(`Valable jusqu'au ${new Date(q.validUntil).toLocaleDateString('fr-FR')}`, 553, 9);
  y -= 34;

  txt('Client', 42, 9, bold, grey); y -= 14;
  txt(`${q.client.firstName} ${q.client.lastName}`, 42, 11, bold); y -= 14;
  if (q.client.company) { txt(q.client.company, 42, 10); y -= 13; }
  txt(q.client.email, 42, 10); y -= 13;
  if (q.client.phone) { txt(q.client.phone, 42, 10); y -= 13; }
  y -= 20;

  const header = () => {
    page.drawRectangle({ x: 42, y: y - 6, width: 511, height: 22, color: rgb(0.93, 0.94, 0.93) });
    txt('Prestation', 50, 9, bold); right('Qté', 360, 9, bold); right('Prix unitaire', 455, 9, bold); right('Total', 545, 9, bold);
    y -= 26;
  };
  header();
  for (const l of q.lines) {
    const rows = wrap(l.description, font, 10, 280);
    ensure(rows.length * 13 + 10);
    if (y === 790) header();
    right(String(Number(l.quantity)), 360); right(amount(l.unitPrice), 455); right(amount(Number(l.quantity) * Number(l.unitPrice)), 545);
    for (const r of rows) { txt(r, 50); y -= 13; }
    page.drawLine({ start: { x: 42, y: y + 6 }, end: { x: 553, y: y + 6 }, thickness: 0.5, color: rgb(0.8, 0.82, 0.8) });
    y -= 10;
  }

  ensure(110);
  y -= 16;
  const subtotal = q.lines.reduce((s, l) => s + Number(l.quantity) * Number(l.unitPrice), 0);
  const row = (a: string, b: string, f = font, size = 10) => { txt(a, 340, size, f); right(b, 545, size, f); y -= 17; };
  row('Sous-total', amount(subtotal));
  if (Number(q.discount) > 0) row('Remise', `- ${amount(q.discount)}`);
  row('Total HT', amount(q.totalHT), bold);
  row(`TVA ${Number(q.taxRate)} %`, amount(Number(q.totalTTC) - Number(q.totalHT)));
  y -= 8;
  page.drawRectangle({ x: 332, y: y - 8, width: 221, height: 24, color: blue });
  page.drawText('Total TTC', { x: 340, y, size: 11, font: bold, color: rgb(1, 1, 1) });
  const ttc = amount(q.totalTTC);
  page.drawText(ttc, { x: 545 - bold.widthOfTextAtSize(ttc, 11), y, size: 11, font: bold, color: rgb(1, 1, 1) });
  y -= 44;

  for (const [title, body] of [['Conditions', q.conditions], ['Notes', q.notes]] as const) {
    if (!body) continue;
    const rows = wrap(body, font, 9, 511);
    ensure(rows.length * 12 + 24);
    txt(title, 42, 10, bold); y -= 15;
    for (const r of rows) { ensure(12); txt(r, 42, 9); y -= 12; }
    y -= 14;
  }
  return pdf.save();
}
