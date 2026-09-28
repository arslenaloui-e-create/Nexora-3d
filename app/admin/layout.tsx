import { db } from '@/lib/db';
import { pageUser } from '@/lib/guard';
import AppNav from '@/components/AppNav';
import LogoutButton from '@/components/LogoutButton';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Administration', robots: { index: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const u = await pageUser('ADMIN');
  const [requests, contacts, chats, notifications] = await Promise.all([
    db.quoteRequest.count({ where: { status: 'NEW' } }),
    db.contactMessage.count({ where: { status: 'NEW' } }),
    db.chatMessage.count({ where: { readAt: null, recipient: { role: 'ADMIN' } } }),
    db.notification.count({ where: { userId: u.id, readAt: null } }),
  ]);
  return (
    <div className="app">
      <aside className="app-side">
        <div className="who"><strong>Administration</strong><span>{u.firstName} {u.lastName}</span></div>
        <AppNav root="/admin" items={[
          { href: '/admin', label: 'Tableau de bord' },
          { href: '/admin/requests', label: 'Demandes', count: requests },
          { href: '/admin/quotes', label: 'Devis' },
          { href: '/admin/projects', label: 'Projets' },
          { href: '/admin/files', label: 'Fichiers' },
          { href: '/admin/messages', label: 'Messages', count: chats + contacts },
          { href: '/admin/clients', label: 'Clients' },
          { href: '/admin/users', label: 'Utilisateurs' },
          { href: '/admin/portfolio', label: 'Portfolio' },
          { href: '/admin/faq', label: 'FAQ' },
          { href: '/admin/notifications', label: 'Notifications', count: notifications },
          { href: '/admin/statistics', label: 'Statistiques' },
          { href: '/admin/settings', label: 'Paramètres' },
        ]} />
        <LogoutButton />
      </aside>
      <main className="app-main">{children}</main>
    </div>
  );
}
