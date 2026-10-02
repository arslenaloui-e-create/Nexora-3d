import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../lib/security';

const db = new PrismaClient();
const [, , email, firstName = 'Nexora', lastName = 'Admin', password] = process.argv;

async function main() {
  if (!email || !password) {
    console.error('Usage : npm run admin:create -- email prenom nom motdepasse');
    process.exitCode = 1;
    return;
  }
  if (password.length < 10) {
    console.error('Le mot de passe doit contenir au moins 10 caractères.');
    process.exitCode = 1;
    return;
  }
  const passwordHash = await hashPassword(password);
  await db.user.upsert({
    where: { email: email.toLowerCase() },
    update: { firstName, lastName, passwordHash, role: 'ADMIN', status: 'ACTIVE', emailVerifiedAt: new Date() },
    create: { email: email.toLowerCase(), firstName, lastName, passwordHash, role: 'ADMIN', emailVerifiedAt: new Date() },
  });
  console.log('Admin créé ou mis à jour.');
}

main().catch(e => { console.error(e); process.exitCode = 1; }).finally(() => db.$disconnect());
