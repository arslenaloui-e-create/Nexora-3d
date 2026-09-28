import { db } from '@/lib/db';
import { pageUser } from '@/lib/guard';
import { PageHead } from '@/components/ui';
import MessagesAdmin from './MessagesAdmin';

export default async function Messages({ searchParams }: { searchParams: Promise<{ tab?: string; client?: string }> }) {
  const me = await pageUser('ADMIN');
  const sp = await searchParams;
  const contacts = await db.contactMessage.findMany({ orderBy: { createdAt: 'desc' }, take: 300 });
  return (
    <>
      <PageHead title="Messages" text="Conversations avec les clients et messages reçus par le formulaire de contact." />
      <MessagesAdmin
        meId={me.id}
        initialTab={sp.tab === 'contact' ? 'contact' : 'chat'}
        initialClient={sp.client || ''}
        contacts={contacts.map(c => ({ ...c, createdAt: c.createdAt.toISOString() }))}
      />
    </>
  );
}
