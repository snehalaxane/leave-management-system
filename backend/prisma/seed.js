const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const users = require("./seedData");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  const hashedPassword = await bcrypt.hash("Password@123", 10);

  for (const user of users) {
    await prisma.employee.upsert({
      where: {
        email: user.email,
      },
      update: {},
      create: {
        ...user,
        password: hashedPassword,
      },
    });
  }

  console.log("✅ Database seeded successfully!");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
