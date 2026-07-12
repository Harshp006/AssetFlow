import { PrismaClient } from "../src/generated/prisma";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("Admin@123", 10);

  // Clear existing data (start from scratch)
  console.log("Clearing existing data...");
  await prisma.notification.deleteMany();
  await prisma.assetRequest.deleteMany();
  await prisma.maintenance.deleteMany();
  await prisma.asset.deleteMany();
  // Keep users or recreate them
  await prisma.user.deleteMany();

  console.log("Database reset to zero level successfully! (Completely Empty)");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

