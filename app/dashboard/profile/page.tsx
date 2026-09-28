import { pageUser } from '@/lib/guard';
import { PageHead } from '@/components/ui';
import ProfileForm from '@/components/ProfileForm';

export default async function Profile() {
  const u = await pageUser('CLIENT');
  return (
    <>
      <PageHead title="Profil" text="Vos coordonnées apparaissent sur les devis." />
      <ProfileForm user={{ firstName: u.firstName, lastName: u.lastName, email: u.email, phone: u.phone, company: u.company }} />
    </>
  );
}
