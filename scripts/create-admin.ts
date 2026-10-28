import { db } from "../lib/db";
import { hashPassword } from "../lib/security";

const [
  ,
  ,
  email,
  firstName = "Nexora",
  lastName = "Admin",
  password,
] = process.argv;

if (!email || !password) {
  console.error(
    "Usage : npm run admin:create -- email prenom nom motdepasse",
  );

  process.exit(1);
}

async function main() {
  const normalizedEmail = email.toLowerCase().trim();
  const passwordHash = await hashPassword(password);

  const user = await db.user.upsert({
    where: {
      email: normalizedEmail,
    },

    update: {
      firstName,
      lastName,
      passwordHash,
      role: "ADMIN",
      status: "ACTIVE",
    },

    create: {
      email: normalizedEmail,
      firstName,
      lastName,
      passwordHash,
      role: "ADMIN",
      status: "ACTIVE",
    },
  });

  console.log(
    `Administrateur configuré : ${user.email}`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });