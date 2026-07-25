const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://postgres:postgrespassword@localhost:5432/saas_hrms?schema=public'
    }
  }
});

async function main() {
  const count = await prisma.tenant.updateMany({
    where: { domain: 'pmj.com' },
    data: { domain: 'pmj' }
  });
  console.log(`Updated ${count.count} tenants.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
