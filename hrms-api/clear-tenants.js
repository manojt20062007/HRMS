const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: { url: 'postgresql://postgres:postgrespassword@localhost:5432/saas_hrms?schema=schema_manoj' }
  }
});

async function main() {
  const tenants = await prisma.tenant.findMany();
  
  for (const t of tenants) {
    if (t.domain === 'pmj') {
      console.log(`Skipping primary tenant: pmj`);
      continue;
    }
    
    // Delete tenant record
    await prisma.tenant.delete({ where: { id: t.id } });
    console.log(`Deleted tenant record for: ${t.domain}`);

    // Drop the schema
    try {
      await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${t.schemaName}" CASCADE;`);
      console.log(`Dropped schema: ${t.schemaName}`);
    } catch (e) {
      console.error(`Failed to drop schema ${t.schemaName}`, e);
    }
  }
  
  console.log("All extra tenants cleared!");
}

main().finally(() => prisma.$disconnect());
