// Libellés français des statuts stockés en base (les valeurs techniques restent inchangées).

export const PROJECT_STATUS = {
  DRAFT: 'En préparation',
  IN_PROGRESS: 'En cours',
  REVIEW: 'En validation',
  COMPLETED: 'Terminé',
  ARCHIVED: 'Archivé',
} as const;

// Progression affichée au client, déduite du statut du projet.
export const PROJECT_PROGRESS: Record<string, number> = {
  DRAFT: 10,
  IN_PROGRESS: 50,
  REVIEW: 85,
  COMPLETED: 100,
  ARCHIVED: 100,
};

export const REQUEST_STATUS = {
  NEW: 'Nouvelle',
  REVIEWING: 'En étude',
  QUOTED: 'Devis envoyé',
  ACCEPTED: 'Acceptée',
  REJECTED: 'Refusée',
  CLOSED: 'Clôturée',
} as const;

export const QUOTE_STATUS = {
  DRAFT: 'Brouillon',
  SENT: 'En attente de réponse',
  ACCEPTED: 'Accepté',
  REJECTED: 'Refusé',
  EXPIRED: 'Expiré',
} as const;

export const CONTACT_STATUS = {
  NEW: 'Nouveau',
  READ: 'Lu',
  ARCHIVED: 'Archivé',
} as const;

export const NOTIFICATION_TYPE: Record<string, string> = {
  PROJECT: 'Projet',
  QUOTE: 'Devis',
  QUOTE_REQUEST: 'Demande de devis',
  REQUEST_STATUS: 'Demande de devis',
  MESSAGE: 'Message',
  CONTACT: 'Contact',
  FILE: 'Fichier',
};

export const ROLE = { ADMIN: 'Administrateur', CLIENT: 'Client' } as const;
export const USER_STATUS = { ACTIVE: 'Actif', DISABLED: 'Désactivé' } as const;

export function label(map: Record<string, string>, value: string | null | undefined) {
  return (value && map[value]) || value || '—';
}

// Couleur de la pastille de statut (classe CSS .pill-*).
export function tone(value: string) {
  if (['COMPLETED', 'ACCEPTED', 'ACTIVE'].includes(value)) return 'ok';
  if (['REJECTED', 'DISABLED', 'EXPIRED'].includes(value)) return 'danger';
  if (['NEW', 'SENT', 'REVIEW', 'QUOTED'].includes(value)) return 'accent';
  if (['IN_PROGRESS', 'REVIEWING'].includes(value)) return 'warn';
  return 'muted';
}

export function money(value: unknown) {
  return `${Number(value || 0).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} TND`;
}

export function fileSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} Ko`;
  return `${(bytes / 1024 / 1024).toFixed(1)} Mo`;
}

export function date(value: Date | string) {
  return new Date(value).toLocaleDateString('fr-FR');
}

export function dateTime(value: Date | string) {
  return new Date(value).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' });
}
