const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({datasources: {db: {url: 'postgresql://postgres:postgrespassword@localhost:5432/saas_hrms?schema=public'}}});
prisma.$queryRawUnsafe("SELECT table_name FROM information_schema.tables WHERE table_schema = 'schema_enl';").then(console.log).finally(() => prisma.$disconnect());
