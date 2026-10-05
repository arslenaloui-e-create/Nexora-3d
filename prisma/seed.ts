import { db } from "@/lib/db";
import { hashPassword } from "@/lib/security";

async function main() {
  const email = process.env.ADMIN_EMAIL?.toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.log(
      "ADMIN_EMAIL / ADMIN_PASSWORD absents : seed admin ignoré.",
    );

    return;
  }

  const existing = await db.user.findUnique({
    where: { email },
  });

  if (existing) {
    console.log(
      `Admin déjà présent : ${email} (inchangé)`,
    );

    return;
  }

  await db.user.create({
    data: {
      firstName: "Nexora",
      lastName: "Admin",
      email,
      passwordHash: await hashPassword(password),
      role: "ADMIN",
      status: "ACTIVE",
    },
  });

  console.log(`Admin créé : ${email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });