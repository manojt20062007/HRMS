const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const tenantPrisma = new PrismaClient({
  datasources: {
    db: { url: 'postgresql://postgres:postgrespassword@localhost:5432/saas_hrms?schema=schema_enl' }
  }
});

async function main() {
  const superAdminRole = await tenantPrisma.role.create({
    data: {
      name: 'SUPER_ADMIN',
      isDefault: true,
    },
  });

  const hashedPassword = await bcrypt.hash('admin123', 10);
  const adminEmail = 'admin@enl';
  
  await tenantPrisma.user.create({
    data: {
      email: adminEmail,
      password: hashedPassword,
      roles: { connect: { id: superAdminRole.id } },
    },
  });

  console.log(`Successfully created ${adminEmail} in schema_enl`);
}

main().catch(console.error).finally(() => tenantPrisma.$disconnect());
