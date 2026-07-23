import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
import bcrypt from 'bcrypt';

const systemPrisma = new PrismaClient();

async function main() {
  const schemaName = 'schema_pmj';
  const domain = 'pmj.com';
  
  // 1. Create Tenant
  const tenant = await systemPrisma.tenant.upsert({
    where: { domain },
    update: {},
    create: { name: 'PMJ Company', domain, schemaName }
  });
  console.log('Created tenant in public schema:', tenant);

  // 2. Create physical schema
  await systemPrisma.$executeRawUnsafe(`CREATE SCHEMA IF NOT EXISTS "${schemaName}";`);
  console.log('Created schema:', schemaName);

  // 3. Migrate using proper URL
  const baseUrl = process.env.DATABASE_URL || '';
  const url = new URL(baseUrl);
  url.searchParams.set('schema', schemaName);
  const tenantDbUrl = url.toString();

  console.log('Pushing schema to:', tenantDbUrl);
  execSync(`npx prisma db push --accept-data-loss`, {
    env: { ...process.env, DATABASE_URL: tenantDbUrl },
    stdio: 'inherit'
  });

  // 4. Seed
  const tenantPrisma = new PrismaClient({ datasources: { db: { url: tenantDbUrl } } });
  
  const superAdminRole = await tenantPrisma.role.upsert({
    where: { name: 'SUPER_ADMIN' },
    update: {},
    create: { name: 'SUPER_ADMIN', isDefault: true },
  });

  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  await tenantPrisma.user.upsert({
    where: { email: 'admin@pmj.com' },
    update: { password: hashedPassword },
    create: {
      email: 'admin@pmj.com',
      password: hashedPassword,
      roleId: superAdminRole.id,
    }
  });

  console.log('Seeded tenant schema successfully!');
}

main().catch(console.error).finally(() => systemPrisma.$disconnect());
