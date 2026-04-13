import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import {
  DEFAULT_PIPELINE_STAGES,
  DEFAULT_TAGS,
  BCRYPT_COST_FACTOR,
} from "@openconduit/shared";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create default pipeline stages
  for (const stage of DEFAULT_PIPELINE_STAGES) {
    await prisma.pipelineStage.upsert({
      where: { name: stage.name },
      create: { name: stage.name, order: stage.order, color: stage.color },
      update: {},
    });
  }
  console.log("Pipeline stages seeded");

  // Create default tags
  for (const tag of DEFAULT_TAGS) {
    await prisma.tag.upsert({
      where: { name: tag.name },
      create: { name: tag.name, color: tag.color },
      update: {},
    });
  }

  // Create "Unknown" tag for auto-created contacts
  await prisma.tag.upsert({
    where: { name: "Unknown" },
    create: { name: "Unknown", color: "#9ca3af" },
    update: {},
  });
  console.log("Tags seeded");

  // Create default admin user if none exists
  const adminCount = await prisma.user.count({ where: { role: "ADMIN" } });
  if (adminCount === 0) {
    const passwordHash = await bcrypt.hash("admin123", BCRYPT_COST_FACTOR);
    await prisma.user.create({
      data: {
        name: "Admin",
        email: "admin@openconduit.dev",
        passwordHash,
        role: "ADMIN",
      },
    });
    console.log("Default admin created (admin@openconduit.dev / admin123)");
    console.log("IMPORTANT: Change this password immediately after first login!");
  }

  // Create default settings if none exist
  const settingsCount = await prisma.settings.count();
  if (settingsCount === 0) {
    await prisma.settings.create({ data: {} });
    console.log("Default settings created");
  }

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
