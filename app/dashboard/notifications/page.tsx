import { db } from '@/lib/db';
import { pageUser } from '@/lib/guard';
import { PageHead } from '@/components/ui';
import NotificationList from '@/components/NotificationList';

export default async function Notifications() {
  const u = await pageUser('CLIENT');
  const rows = await db.notification.findMany({ where: { userId: u.id }, orderBy: { createdAt: 'desc' }, take: 100 });
  return (
    <>
      <PageHead title="Notifications" />
      <NotificationList rows={rows} />
    </>
  );
}
