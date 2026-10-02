const GMAIL_API = 'https://gmail.googleapis.com/gmail/v1/users/me/messages/send';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';

export function escapeHtml(value: unknown) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function adminInbox() {
  return process.env.ADMIN_NOTIFY_EMAIL || process.env.GMAIL_USER || '';
}

function requiredEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Variable d'environnement manquante : ${name}`);
  }

  return value;
}

function base64UrlEncode(value: string) {
  return Buffer.from(value, 'utf8')
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

function createRawEmail(
  from: string,
  to: string,
  subject: string,
  html: string,
) {
  const message = [
    `From: NEXORA 3D <${from}>`,
    `To: ${to}`,
    `Subject: ${subject}`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    '',
    html,
  ].join('\r\n');

  return base64UrlEncode(message);
}

async function getAccessToken() {
  const clientId = requiredEnv('GMAIL_CLIENT_ID');
  const clientSecret = requiredEnv('GMAIL_CLIENT_SECRET');
  const refreshToken = requiredEnv('GMAIL_REFRESH_TOKEN');

  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
    cache: 'no-store',
  });

  const data = await response.json();

  if (!response.ok || !data.access_token) {
    console.error('GMAIL TOKEN ERROR:', data);
    throw new Error('Impossible d’obtenir le token Gmail.');
  }

  return data.access_token as string;
}

/**
 * Envoie un email via Gmail API.
 *
 * Aucun SMTP n'est utilisé.
 * L'appel passe par HTTPS, ce qui évite le problème
 * "SMTP: Connection timeout" rencontré sur Railway.
 */
export async function sendMail(
  to: string,
  subject: string,
  html: string,
) {
  if (!to) {
    console.error('GMAIL: destinataire absent');
    return false;
  }

  try {
    const from = requiredEnv('GMAIL_USER');
    const accessToken = await getAccessToken();

    const raw = createRawEmail(
      from,
      to,
      subject,
      html,
    );

    const response = await fetch(GMAIL_API, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        raw,
      }),
      cache: 'no-store',
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('GMAIL SEND ERROR:', data);
      return false;
    }

    console.log(`GMAIL: email envoyé à ${to}`);

    return true;
  } catch (error) {
    console.error(
      'GMAIL:',
      error instanceof Error ? error.message : error,
    );

    return false;
  }
}