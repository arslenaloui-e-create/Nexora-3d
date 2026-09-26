import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../lib/security';

const db = new PrismaClient();

async function main() {
  const email = (process.env.ADMIN_EMAIL || 'contactnexora3d@gmail.com').toLowerCase();
  const password = process.env.ADMIN_PASSWORD || 'Arslen.2009';

  const hash = await hashPassword(password);

  const admin = await db.user.upsert({
    where: { email },
    update: {
      role: 'ADMIN',
      status: 'ACTIVE',
      passwordHash: hash,
      emailVerifiedAt: new Date(),
    },
    create: {
      firstName: 'Nexora',
      lastName: 'Admin',
      email,
      passwordHash: hash,
      role: 'ADMIN',
      status: 'ACTIVE',
      emailVerifiedAt: new Date(),
    },
  });

  await db.siteSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      email: 'contact@nexora3d.tn',
      description: 'Ingénierie 3D & impression haute précision',
    },
  });

  const faqs = [
    [
      'Quels fichiers puis-je envoyer ?',
      'STL, STEP, STP, SLDPRT, SLDASM, OBJ, 3MF, PDF, ZIP et images sont acceptés.',
      'Fichiers',
    ],
    [
      'Comment demander un devis ?',
      'Créez votre compte puis envoyez une demande depuis la page Devis.',
      'Devis',
    ],
    [
      'Puis-je suivre mon projet ?',
      'Oui, votre espace client affiche les projets et leurs statuts.',
      'Projet',
    ],
  ];

  for (let i = 0; i < faqs.length; i++) {
    const [question, answer, category] = faqs[i];

    if (!(await db.fAQ.findFirst({ where: { question } }))) {
      await db.fAQ.create({
        data: {
          question,
          answer,
          category,
          sortOrder: i,
        },
      });
    }
  }

  console.log(`Admin configuré : ${admin.email}`);
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());