const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({datasources: {db: {url: 'postgresql://postgres:postgrespassword@localhost:5432/saas_hrms?schema=schema_manoj'}}});
prisma.tenant.findMany().then(console.log).finally(() => prisma.$disconnect());
