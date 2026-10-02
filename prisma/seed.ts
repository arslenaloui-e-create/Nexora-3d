import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../lib/security';
import { PORTFOLIO_SEED } from '../lib/portfolio-data';

const db = new PrismaClient();

// Le seed ne contient plus aucun mot de passe : l'admin est créé seulement si
// ADMIN_EMAIL et ADMIN_PASSWORD sont fournis, et un admin existant n'est jamais
// modifié (relancer le seed ne réinitialise plus son mot de passe).
async function main() {
  const email = process.env.ADMIN_EMAIL?.toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (email && password) {
    if (password.length < 10) throw new Error('ADMIN_PASSWORD doit contenir au moins 10 caractères.');
    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      console.log(`Admin déjà présent : ${email} (inchangé)`);
    } else {
      await db.user.create({
        data: { firstName: 'Nexora', lastName: 'Admin', email, passwordHash: await hashPassword(password), role: 'ADMIN', status: 'ACTIVE', emailVerifiedAt: new Date() },
      });
      console.log(`Admin créé : ${email}`);
    }
  } else {
    console.log('ADMIN_EMAIL / ADMIN_PASSWORD absents : aucun admin créé.');
  }

  await db.siteSettings.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, email: 'contactnexora3d@gmail.com', phone: '+216 90 508 409', description: 'Conception mécanique, CAO, prototypage et impression 3D à Tunis.' },
  });

  const faqs = [
    ['Quels fichiers puis-je envoyer ?', 'STL, STEP, STP, SLDPRT, SLDASM, OBJ, 3MF, PDF, ZIP et images (PNG, JPG, WebP), jusqu’à 50 Mo par fichier.', 'Fichiers'],
    ['Comment demander un devis ?', 'Créez votre compte, puis remplissez le formulaire de la page Devis en joignant vos fichiers ou croquis. Le devis apparaît ensuite dans votre espace client.', 'Devis'],
    ['Puis-je suivre mon projet ?', 'Oui. Votre espace client affiche l’avancement de chaque projet, son historique, les fichiers échangés et les messages.', 'Projet'],
  ];
  for (let i = 0; i < faqs.length; i++) {
    const [question, answer, category] = faqs[i];
    if (!(await db.fAQ.findFirst({ where: { question } }))) {
      await db.fAQ.create({ data: { question, answer, category, sortOrder: i } });
    }
  }

  // Portfolio : n'ajoute que les réalisations absentes (comparaison par titre),
  // sans jamais toucher à celles déjà créées ou modifiées dans l'admin.
  let added = 0;
  for (let i = 0; i < PORTFOLIO_SEED.length; i++) {
    const p = PORTFOLIO_SEED[i];
    if (await db.portfolioItem.findFirst({ where: { title: p.title } })) continue;
    await db.portfolioItem.create({ data: { ...p, images: JSON.stringify(p.images), sortOrder: i, visible: true } });
    added++;
  }
  console.log(`Portfolio : ${added} réalisation(s) ajoutée(s).`);
}

main()
  .catch(e => { console.error(e); process.exitCode = 1; })
  .finally(() => db.$disconnect());
