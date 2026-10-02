import { db } from '@/lib/db';
import { pageUser } from '@/lib/guard';
import { getSite } from '@/lib/site';
import { PageHead } from '@/components/ui';
import SettingsForm from './SettingsForm';

export default async function Settings() {
  await pageUser('ADMIN');
  const [s, site] = await Promise.all([db.siteSettings.findUnique({ where: { id: 1 } }), getSite()]);
  return (
    <>
      <PageHead title="Paramètres" text="Coordonnées affichées sur le site et sur les devis PDF." />
      <SettingsForm initial={{
        email: s?.email || site.email,
        phone: s?.phone || site.phone,
        instagram: s?.instagram || site.instagram,
        linkedin: s?.linkedin || site.linkedin,
        description: s?.description || site.description,
        taxRate: Number(s?.taxRate ?? 19),
      }} />
    </>
  );
}
