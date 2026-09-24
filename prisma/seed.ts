// Creates the first admin account from ADMIN_EMAIL / ADMIN_PASSWORD in .env,
// plus sensible default rows for SiteSettings and HomepageContent.
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD in .env before seeding.");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.admin.upsert({
    where: { email },
    update: {},
    create: { email, passwordHash, name: "Amirmhmd Bagheri" },
  });

  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton" },
  });

  await prisma.homepageContent.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      aboutBody:
        "از پشت دوربین شروع کردم، اما چیزی که همیشه دنبالش بودم قاب نبود؛ احساس بود.",
    },
  });

  console.log(`Seeded admin: ${email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
