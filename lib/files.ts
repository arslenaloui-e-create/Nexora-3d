import path from 'path';
import fs from 'fs/promises';
import crypto from 'crypto';
import { safeName } from './security';

// STORAGE_DIR permet de pointer vers un volume persistant (ex. volume Railway monté
// sur /app/storage). Sans volume, les fichiers disparaissent à chaque redéploiement.
const root = process.env.STORAGE_DIR ? path.resolve(process.env.STORAGE_DIR) : path.join(process.cwd(), 'storage');

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
  await fs.mkdir(root, { recursive: true });
  const stored = `${crypto.randomUUID()}-${safeName(file.name)}`;
  await fs.writeFile(path.join(root, stored), Buffer.from(await file.arrayBuffer()));
  // Le type MIME vient de l'extension vérifiée, jamais de ce que déclare le navigateur.
  return { storedName: stored, originalName: file.name.slice(0, 200), mimeType: MIME[ext] || 'application/octet-stream', size: file.size };
}

export async function readStored(name: string) {
  return fs.readFile(path.join(root, path.basename(name)));
}

export async function removeStored(name: string) {
  try { await fs.unlink(path.join(root, path.basename(name))); } catch {}
}

export function uploadError(e: unknown) {
  const m = e instanceof Error ? e.message : '';
  if (m === 'TYPE_NOT_ALLOWED') return 'Format non accepté. Formats possibles : STL, STEP, STP, SLDPRT, SLDASM, OBJ, 3MF, PDF, ZIP, PNG, JPG, WebP.';
  if (m === 'FILE_TOO_LARGE') return `Fichier trop lourd (${process.env.MAX_UPLOAD_MB || 50} Mo maximum par fichier).`;
  if (m === 'FILE_EMPTY') return 'Le fichier est vide.';
  return '';
}
