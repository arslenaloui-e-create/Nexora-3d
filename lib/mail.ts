const GMAIL_API =
  'https://gmail.googleapis.com/gmail/v1/users/me/messages/send';

const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';

const REQUEST_TIMEOUT_MS = 10_000;

export type MailResult = {
  ok: boolean;
  provider: 'resend' | 'gmail' | 'none';
  status: 'accepted' | 'failed' | 'not_configured';
};

export function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function adminInbox(): string {
  return (
    process.env.ADMIN_NOTIFICATION_EMAIL ||
    process.env.ADMIN_NOTIFY_EMAIL ||
    process.env.GMAIL_USER ||
    ''
  );
}

function requiredEnv(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

function base64UrlEncode(value: string): string {
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
): string {
  const encodedSubject = `=?UTF-8?B?${Buffer.from(subject, 'utf8').toString('base64')}?=`;

  const message = [
    `From: NEXORA 3D <${from}>`,
    `To: ${to}`,
    `Subject: ${encodedSubject}`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    '',
    html,
  ].join('\r\n');

  return base64UrlEncode(message);
}

async function fetchWithTimeout(
  url: string,
  init: RequestInit,
): Promise<Response> {
  return fetch(url, {
    ...init,
    cache: 'no-store',
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
}

async function getAccessToken(): Promise<string> {
  const response = await fetchWithTimeout(GOOGLE_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: requiredEnv('GMAIL_CLIENT_ID'),
      client_secret: requiredEnv('GMAIL_CLIENT_SECRET'),
      refresh_token: requiredEnv('GMAIL_REFRESH_TOKEN'),
      grant_type: 'refresh_token',
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok || typeof data.access_token !== 'string') {
    throw new Error('Gmail authentication failed');
  }

  return data.access_token;
}

async function sendWithResend(
  to: string,
  subject: string,
  html: string,
): Promise<MailResult> {
  const apiKey = requiredEnv('RESEND_API_KEY');
  const from = requiredEnv('EMAIL_FROM');

  const response = await fetchWithTimeout(
    'https://api.resend.com/emails',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject,
        html,
      }),
    },
  );

  if (!response.ok) {
    // Ne pas journaliser le corps de réponse du fournisseur.
    console.error('EMAIL_PROVIDER_REJECTED', {
      provider: 'resend',
      statusCode: response.status,
    });

    return {
      ok: false,
      provider: 'resend',
      status: 'failed',
    };
  }

  // HTTP 2xx signifie accepté par le fournisseur, pas nécessairement livré.
  console.info('EMAIL_PROVIDER_ACCEPTED', {
    provider: 'resend',
  });

  return {
    ok: true,
    provider: 'resend',
    status: 'accepted',
  };
}

async function sendWithGmail(
  to: string,
  subject: string,
  html: string,
): Promise<MailResult> {
  const from = requiredEnv('GMAIL_USER');
  const accessToken = await getAccessToken();

  const response = await fetchWithTimeout(GMAIL_API, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      raw: createRawEmail(from, to, subject, html),
    }),
  });

  if (!response.ok) {
    console.error('EMAIL_PROVIDER_REJECTED', {
      provider: 'gmail',
      statusCode: response.status,
    });

    return {
      ok: false,
      provider: 'gmail',
      status: 'failed',
    };
  }

  console.info('EMAIL_PROVIDER_ACCEPTED', {
    provider: 'gmail',
  });

  return {
    ok: true,
    provider: 'gmail',
    status: 'accepted',
  };
}

export async function sendMail(
  to: string,
  subject: string,
  html: string,
): Promise<boolean> {
  if (!to?.trim()) {
    console.warn('EMAIL_NOT_SENT', {
      reason: 'missing_recipient',
    });

    return false;
  }

  if (process.env.RESEND_API_KEY) {
    try {
      const result = await sendWithResend(to, subject, html);
      return result.ok;
    } catch {
      // Pas de bascule automatique vers Gmail :
      // une erreur réseau peut survenir après acceptation par Resend.
      console.error('EMAIL_SEND_FAILED', {
        provider: 'resend',
        reason: 'request_failed',
      });

      return false;
    }
  }

  const gmailConfigured = Boolean(
    process.env.GMAIL_USER &&
      process.env.GMAIL_CLIENT_ID &&
      process.env.GMAIL_CLIENT_SECRET &&
      process.env.GMAIL_REFRESH_TOKEN,
  );

  if (gmailConfigured) {
    try {
      const result = await sendWithGmail(to, subject, html);
      return result.ok;
    } catch {
      console.error('EMAIL_SEND_FAILED', {
        provider: 'gmail',
        reason: 'request_failed',
      });

      return false;
    }
  }

  console.warn('EMAIL_NOT_SENT', {
    reason: 'provider_not_configured',
  });

  return false;
}
