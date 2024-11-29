const { PrismaClient } = require("@prisma/client");
const { hash } = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  try {
    // Create roles
    const roles = await Promise.all([
      prisma.role.upsert({
        where: { name: "Admin" },
        update: {},
        create: {
          name: "Admin",
          description: "Administrator role with full access",
          created_by: "admin@example.com",
        },
      }),
      prisma.role.upsert({
        where: { name: "HR" },
        update: {},
        create: {
          name: "HR",
          description: "Human Resources role",
          created_by: "admin@example.com",
        },
      }),
      prisma.role.upsert({
        where: { name: "User" },
        update: {},
        create: {
          name: "User",
          description: "Regular user role",
          created_by: "admin@example.com",
        },
      }),
    ]);

    // Create admin user
    const hashedPassword = await hash("Admin@123", 12);

    const adminUser = await prisma.user.upsert({
      where: { email: "admin@example.com" },
      update: {},
      create: {
        email: "admin@example.com",
        username: "admin",
        password: hashedPassword,
        roles: {
          create: {
            role_id: roles[0].id,
            assigned_by: "admin@example.com",
          },
        },
      },
    });

    console.log("Seed data created successfully:");
    console.log("Roles:", roles);
    console.log("Admin user:", adminUser);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
