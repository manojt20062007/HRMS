import { PrismaClient } from '@prisma/client';
import { exec } from 'child_process';
import util from 'util';
import bcrypt from 'bcrypt';

const execPromise = util.promisify(exec);
const systemPrisma = new PrismaClient();

const DATABASE_URL = "postgresql://neondb_owner:npg_JX9YbTUriC3z@ep-long-sea-azgefq0j-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

async function provisionTenant(name: string, domain: string, schemaName: string) {
  console.log(`\n--- Provisioning Tenant: ${name} (${domain}) ---`);
  
  // 1. Create Tenant Record in public schema
  const tenant = await systemPrisma.tenant.upsert({
    where: { domain },
    update: {},
    create: { name, domain, schemaName }
  });
  console.log(`Tenant record verified/created: ${tenant.id}`);

  // 2. Create physical schema
  await systemPrisma.$executeRawUnsafe(`CREATE SCHEMA IF NOT EXISTS "${schemaName}";`);
  console.log(`Created PostgreSQL schema: ${schemaName}`);

  // 3. Run prisma migrations on the schema
  const tenantDbUrl = `${DATABASE_URL}&schema=${schemaName}`;
  console.log(`Running migrations for schema: ${schemaName}...`);
  await execPromise('npx prisma db push --schema=./hrms-api/prisma/schema.prisma', {
    env: { ...process.env, DATABASE_URL: tenantDbUrl }
  });
  console.log(`Database tables synchronized for schema: ${schemaName}`);

  // 4. Create roles and user in the tenant schema
  const tenantPrisma = new PrismaClient({
    datasources: {
      db: {
        url: tenantDbUrl,
      },
    },
  });

  const superAdminRole = await tenantPrisma.role.upsert({
    where: { name: 'SUPER_ADMIN' },
    update: {},
    create: {
      name: 'SUPER_ADMIN',
      isDefault: true
    }
  });

  const hashedPassword = await bcrypt.hash('admin123', 10);
  const adminEmail = `admin@${domain}`;

  await tenantPrisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: hashedPassword,
      roleId: superAdminRole.id
    }
  });
  console.log(`Created default Super Admin user: ${adminEmail} (password: admin123)`);
  
  await tenantPrisma.$disconnect();
}

async function main() {
  await provisionTenant("PMJ", "pmj.com", "schema_pmj");
  await provisionTenant("RK", "rk.com", "schema_rk");
  console.log("\nAll tenants seeded successfully!");
}

main()
  .catch(err => {
    console.error("Failed to seed tenants:", err);
  })
  .finally(() => {
    systemPrisma.$disconnect();
  });
