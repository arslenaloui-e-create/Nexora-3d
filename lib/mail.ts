import nodemailer from 'nodemailer';

const enabled = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD);

export function escapeHtml(value: unknown) {
  return String(value ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

export function adminInbox() {
  return process.env.ADMIN_NOTIFY_EMAIL || process.env.SMTP_USER || '';
}

// Un email qui échoue ne doit jamais faire échouer l'action de l'utilisateur
// (inscription, demande de devis...) : l'erreur est journalisée et on continue.
export async function sendMail(to: string, subject: string, html: string) {
  if (!enabled || !to) return false;
  try {
    const port = Number(process.env.SMTP_PORT || 587);
    const t = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
    });
    await t.sendMail({ from: process.env.SMTP_FROM || process.env.SMTP_USER, to, subject, html });
    return true;
  } catch (e) {
    console.error('SMTP:', e instanceof Error ? e.message : e);
    return false;
  }
}
