const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient({
  datasources: {
    db: { url: process.env.DATABASE_URL }
  }
});

async function main() {
  // 1. Create the tenant record in the Tenant table itself
  const tenant = await prisma.tenant.upsert({
    where: { domain: 'pmj' },
    update: {},
    create: {
      name: 'PMJ Master System',
      domain: 'pmj',
      schemaName: 'schema_pmj',
    },
  });

  // 2. Create the Roles
  const superAdminRole = await prisma.role.upsert({
    where: { name: 'SUPER_ADMIN' },
    update: {},
    create: { name: 'SUPER_ADMIN', isDefault: true },
  });
  
  const universalAdminRole = await prisma.role.upsert({
    where: { name: 'UNIVERSAL_ADMIN' },
    update: {},
    create: { name: 'UNIVERSAL_ADMIN', isDefault: false },
  });

  // 3. Create admin@pmj.com and assign BOTH roles
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const adminEmail = 'admin@pmj.com';
  
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      roles: {
        connect: [{ id: superAdminRole.id }, { id: universalAdminRole.id }]
      }
    },
    create: {
      email: adminEmail,
      password: hashedPassword,
      roles: {
        connect: [{ id: superAdminRole.id }, { id: universalAdminRole.id }]
      },
    },
  });

  console.log(`Successfully seeded schema_pmj with ${adminEmail} (SUPER_ADMIN + UNIVERSAL_ADMIN)`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
