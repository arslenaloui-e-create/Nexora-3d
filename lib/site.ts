import { db } from './db';

// Coordonnées publiques : les valeurs de la table SiteSettings (Admin > Paramètres)
// priment ; les valeurs ci-dessous sont celles qui étaient déjà codées dans le site.
export async function getSite() {
  const s = await db.siteSettings.findUnique({ where: { id: 1 } }).catch(() => null);
  return {
    email: s?.email && s.email !== 'contact@nexora3d.tn' ? s.email : 'contactnexora3d@gmail.com',
    phone: s?.phone || '+216 90 508 409',
    phone2: '+216 29 013 136',
    whatsapp: '21690508409',
    linkedin: s?.linkedin || 'https://www.linkedin.com/in/arslen-aloui-137a95389/',
    instagram: s?.instagram || 'https://www.instagram.com/nexora_studio_3d',
    description: s?.description || 'Conception mécanique, CAO, prototypage et impression 3D à Tunis.',
    logoPath: s?.logoPath || '/logo.jpg',
    taxRate: Number(s?.taxRate ?? 19),
  };
}

export type Site = Awaited<ReturnType<typeof getSite>>;
