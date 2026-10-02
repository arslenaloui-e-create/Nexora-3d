import { db } from '@/lib/db';
import { pageUser } from '@/lib/guard';
import { PageHead } from '@/components/ui';
import NotificationList from '@/components/NotificationList';

export default async function AdminNotifications() {
  const u = await pageUser('ADMIN');
  const rows = await db.notification.findMany({ where: { userId: u.id }, orderBy: { createdAt: 'desc' }, take: 150 });
  return (
    <>
      <PageHead title="Notifications" text="Nouvelles demandes, messages, réponses aux devis." />
      <NotificationList rows={rows} />
    </>
  );
}
