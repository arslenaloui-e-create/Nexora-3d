import { redirect } from 'next/navigation';
import { requireUser } from './auth';

// Pour les pages serveur : au lieu d'afficher une page d'erreur, on renvoie vers la
// connexion (session expirée, compte désactivé) ou vers le bon espace (mauvais rôle).
export async function pageUser(role: 'ADMIN' | 'CLIENT') {
  try {
    return await requireUser(role);
  } catch (e) {
    if (e instanceof Error && e.message === 'FORBIDDEN') redirect(role === 'ADMIN' ? '/dashboard' : '/admin');
    redirect('/auth/login');
  }
}
