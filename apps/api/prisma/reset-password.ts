import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { BCRYPT_COST_FACTOR } from "@openconduit/shared";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@openconduit.dev";
  const password = "admin123";
  const passwordHash = await bcrypt.hash(password, BCRYPT_COST_FACTOR);

  const user = await prisma.user.upsert({
    where: { email },
    update: { passwordHash, role: "ADMIN" },
    create: {
      name: "Admin",
      email,
      passwordHash,
      role: "ADMIN",
    },
  });

  console.log(`Password reset for ${user.email} to '${password}'`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
