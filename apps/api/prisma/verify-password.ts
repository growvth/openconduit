import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@openconduit.dev";
  const user = await prisma.user.findUnique({ where: { email } });
  
  if (!user) {
    console.log("User not found");
    return;
  }

  const password = "admin123";
  const isValid = await bcrypt.compare(password, user.passwordHash);
  
  console.log(`Email: ${user.email}`);
  console.log(`Hash in DB: ${user.passwordHash}`);
  console.log(`Password 'admin123' is valid: ${isValid}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
