import path from 'path';
import fs from 'fs/promises';
import crypto from 'crypto';
import { safeName } from './security';

// STORAGE_DIR permet de pointer vers un volume persistant (ex. volume Railway monté
// sur /app/storage). Sans volume, les fichiers disparaissent à chaque redéploiement.
const root = process.env.STORAGE_DIR ? path.resolve(process.env.STORAGE_DIR) : path.join(process.cwd(), 'storage');

// Sur Vercel, configurez Supabase Storage pour éviter le disque éphémère.
// Le stockage local reste disponible pour le développement.
function supabaseStorageConfig() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'client-files';
return url && key ? { url: url.replace(/\/$/, ''), key, bucket } : null;

}

export const allowed = new Set(['.stl', '.step', '.stp', '.sldprt', '.sldasm', '.obj', '.3mf', '.pdf', '.zip', '.png', '.jpg', '.jpeg', '.webp']);
export const ACCEPT = [...allowed].join(',');

const MIME: Record<string, string> = {
  '.pdf': 'application/pdf',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.zip': 'application/zip',
};

export function validateUpload(file: File) {
  const ext = path.extname(file.name).toLowerCase();
  if (!allowed.has(ext)) throw new Error('TYPE_NOT_ALLOWED');
  const max = Number(process.env.MAX_UPLOAD_MB || 50) * 1024 * 1024;
  if (file.size > max) throw new Error('FILE_TOO_LARGE');
  if (file.size === 0) throw new Error('FILE_EMPTY');
  return ext;
}

export async function saveUpload(file: File) {
  const ext = validateUpload(file);
  const stored = `${crypto.randomUUID()}-${safeName(file.name)}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  const config = supabaseStorageConfig();
  if (config) {
    const response = await fetch(`${config.url}/storage/v1/object/${encodeURIComponent(config.bucket)}/${stored.split('/').map(encodeURIComponent).join('/')}`, {
      method: 'POST',
      headers: { apikey: config.key, Authorization: `Bearer ${config.key}`, 'Content-Type': MIME[ext] || 'application/octet-stream', 'x-upsert': 'false' },
      body: bytes,
      cache: 'no-store',
    });
    if (!response.ok) {
      console.error('Supabase Storage upload failed:', response.status, await response.text().catch(() => ''));
      throw new Error('STORAGE_UPLOAD_FAILED');
    }
  } else {
    await fs.mkdir(root, { recursive: true });
    await fs.writeFile(path.join(root, stored), bytes);
  }
  // Le type MIME vient de l'extension vérifiée, jamais de ce que déclare le navigateur.
  return { storedName: stored, originalName: file.name.slice(0, 200), mimeType: MIME[ext] || 'application/octet-stream', size: file.size };
}

export async function readStored(name: string) {
  const safe = path.basename(name);
  const config = supabaseStorageConfig();
  if (config) {
    const response = await fetch(`${config.url}/storage/v1/object/${encodeURIComponent(config.bucket)}/${encodeURIComponent(safe)}`, {
      headers: { apikey: config.key, Authorization: `Bearer ${config.key}` },
      cache: 'no-store',
    });
    if (!response.ok) throw new Error('STORAGE_READ_FAILED');
    return Buffer.from(await response.arrayBuffer());
  }
  return fs.readFile(path.join(root, safe));
}

export async function removeStored(name: string) {
  const safe = path.basename(name);
  const config = supabaseStorageConfig();
  if (config) {
    try {
      const response = await fetch(`${config.url}/storage/v1/object/${encodeURIComponent(config.bucket)}/${encodeURIComponent(safe)}`, {
        method: 'DELETE', headers: { apikey: config.key, Authorization: `Bearer ${config.key}` }, cache: 'no-store',
      });
      if (!response.ok) console.error('Supabase Storage delete failed:', response.status);
    } catch (error) { console.error('Supabase Storage delete failed:', error); }
    return;
  }
  try { await fs.unlink(path.join(root, safe)); } catch {}
}

export function uploadError(e: unknown) {
  const m = e instanceof Error ? e.message : '';
  if (m === 'TYPE_NOT_ALLOWED') return 'Format non accepté. Formats possibles : STL, STEP, STP, SLDPRT, SLDASM, OBJ, 3MF, PDF, ZIP, PNG, JPG, WebP.';
  if (m === 'FILE_TOO_LARGE') return `Fichier trop lourd (${process.env.MAX_UPLOAD_MB || 50} Mo maximum par fichier).`;
  if (m === 'FILE_EMPTY') return 'Le fichier est vide.';
  return '';
}
