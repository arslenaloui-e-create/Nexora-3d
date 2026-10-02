import { pageUser } from '@/lib/guard';
import { PageHead } from '@/components/ui';
import Chat from '@/components/Chat';

export default async function Messages() {
  const u = await pageUser('CLIENT');
  return (
    <>
      <PageHead title="Messages" text="Votre conversation avec l’équipe Nexora 3D. Entrée pour envoyer, Maj + Entrée pour aller à la ligne." />
      <Chat meId={u.id} />
    </>
  );
}
