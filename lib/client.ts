// Appels API côté navigateur : renvoie toujours { ok, data, error } avec un message lisible,
// y compris quand le réseau tombe ou que le serveur répond autre chose que du JSON.
export type ApiResult<T = any> = { ok: boolean; status: number; data: T; error: string };

export async function api<T = any>(url: string, method = 'GET', body?: unknown): Promise<ApiResult<T>> {
  try {
    const isForm = typeof FormData !== 'undefined' && body instanceof FormData;
    const res = await fetch(url, {
      method,
      cache: 'no-store',
      headers: body && !isForm ? { 'content-type': 'application/json' } : undefined,
      body: body === undefined ? undefined : isForm ? (body as FormData) : JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    const error = res.ok ? '' : data?.error || (res.status === 401 ? 'Votre session a expiré. Reconnectez-vous.' : 'Une erreur est survenue. Réessayez.');
    return { ok: res.ok, status: res.status, data, error };
  } catch {
    return { ok: false, status: 0, data: {} as T, error: 'Connexion au serveur impossible. Vérifiez votre réseau et réessayez.' };
  }
}

export function formJson(form: HTMLFormElement) {
  return Object.fromEntries(new FormData(form)) as Record<string, string>;
}
