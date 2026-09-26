import HomeLanding from '@/components/HomeLanding';
import { db } from '@/lib/db';

export default async function Home() {
  const settings = await db.siteSettings.findUnique({ where: { id: 1 } });
  const phone = settings?.phone || '+216 90 508 409';
  const phone2 = '+216 29 013 136';
  const email = settings?.email || 'contactnexora3d@gmail.com';
  const linkedin = settings?.linkedin || 'https://www.linkedin.com/in/arslen-aloui-137a95389/';
  const instagram = settings?.instagram || 'https://www.instagram.com/nexora_studio_3d?stkn=NzE2bXRxaW92eG91';
  const description = settings?.description || 'Conception paramétrique, ingénierie mécanique, prototypage et impression 3D haute précision à Tunis.';
  const whatsapp = '21690508409';

  return (
    <HomeLanding
      email={email}
      phone={phone}
      phone2={phone2}
      whatsapp={whatsapp}
      linkedin={linkedin}
      instagram={instagram}
      description={description}
    />
  );
}
