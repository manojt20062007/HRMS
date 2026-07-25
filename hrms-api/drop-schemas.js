const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: { url: 'postgresql://postgres:postgrespassword@localhost:5432/saas_hrms?schema=public' }
  }
});

async function main() {
  const schemasToDrop = [
    'schema_pmj',
    'schema_manoj'
  ];

  for (const schema of schemasToDrop) {
    try {
      await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schema}" CASCADE;`);
      console.log(`Successfully dropped schema: "${schema}"`);
    } catch (err) {
      console.error(`Failed to drop schema "${schema}":`, err.message);
    }
  }

  console.log("Cleanup complete!");
}

main().finally(() => prisma.$disconnect());
