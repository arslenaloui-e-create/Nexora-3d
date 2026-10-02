import { db } from './db';

// Prévient tous les administrateurs actifs (et pas seulement le premier trouvé).
export async function notifyAdmins(type: string, message: string) {
  const admins = await db.user.findMany({ where: { role: 'ADMIN', status: 'ACTIVE' }, select: { id: true } });
  if (!admins.length) return;
  await db.notification.createMany({ data: admins.map(a => ({ userId: a.id, type, message })) });
}

export function notifyUser(userId: string, type: string, message: string) {
  return db.notification.create({ data: { userId, type, message } });
}
