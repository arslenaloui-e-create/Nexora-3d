import { db } from '@/lib/db';
import { pageUser } from '@/lib/guard';
import AppNav from '@/components/AppNav';
import LogoutButton from '@/components/LogoutButton';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Espace client', robots: { index: false } };

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const u = await pageUser('CLIENT');
  const [notifications, messages, quotes] = await Promise.all([
    db.notification.count({ where: { userId: u.id, readAt: null } }),
    db.chatMessage.count({ where: { recipientId: u.id, readAt: null } }),
    db.quote.count({ where: { clientId: u.id, status: 'SENT' } }),
  ]);
  return (
    <div className="app">
      <aside className="app-side">
        <div className="who"><strong>{u.firstName} {u.lastName}</strong><span>{u.company || 'Espace client'}</span></div>
        <AppNav root="/dashboard" items={[
          { href: '/dashboard', label: 'Vue d’ensemble' },
          { href: '/dashboard/projects', label: 'Projets' },
          { href: '/dashboard/requests', label: 'Demandes de devis' },
          { href: '/dashboard/quotes', label: 'Devis', count: quotes },
          { href: '/dashboard/files', label: 'Fichiers' },
          { href: '/dashboard/messages', label: 'Messages', count: messages },
          { href: '/dashboard/notifications', label: 'Notifications', count: notifications },
          { href: '/dashboard/profile', label: 'Profil' },
        ]} />
        <LogoutButton />
      </aside>
      <main className="app-main">{children}</main>
    </div>
  );
}
