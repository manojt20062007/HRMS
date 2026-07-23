import express from 'express';
import { exec } from 'child_process';
import util from 'util';
import bcrypt from 'bcrypt';
import { systemPrisma, getTenantPrisma } from '../lib/prismaManager';

const router = express.Router();
const execPromise = util.promisify(exec);

// Create a new Tenant (Company)
router.post('/tenants', async (req, res) => {
  try {
    const { name, domain, schemaName } = req.body;

    if (!name || !domain || !schemaName) {
      return res.status(400).json({ error: 'name, domain, and schemaName are required' });
    }

    // 1. Create the tenant in the public schema
    const tenant = await systemPrisma.tenant.create({
      data: { name, domain, schemaName },
    });

    console.log(`[Tenant Provisioning] Created Tenant record: ${tenant.id}`);

    // 2. Create the physical database schema
    await systemPrisma.$executeRawUnsafe(`CREATE SCHEMA IF NOT EXISTS "${schemaName}";`);
    console.log(`[Tenant Provisioning] Created PostgreSQL schema: ${schemaName}`);

    // 3. Run Prisma migrations on the new schema
    const databaseUrl = process.env.DATABASE_URL;
    const tenantDbUrl = `${databaseUrl}?schema=${schemaName}`;
    
    console.log(`[Tenant Provisioning] Running migrations for ${schemaName}...`);
    
    // We use migrate deploy because we just want to apply existing migrations to the new schema
    await execPromise('npx prisma migrate deploy', {
      env: { ...process.env, DATABASE_URL: tenantDbUrl }
    });

    console.log(`[Tenant Provisioning] Migrations successful for ${schemaName}`);

    // 4. Seed the new tenant schema with SUPER_ADMIN
    const tenantPrisma = getTenantPrisma(schemaName);
    
    const superAdminRole = await tenantPrisma.role.create({
      data: {
        name: 'SUPER_ADMIN',
        isDefault: true,
      },
    });

    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Create default super admin for this tenant based on their domain
    const adminEmail = `admin@${domain}`;
    await tenantPrisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        roleId: superAdminRole.id,
      },
    });

    console.log(`[Tenant Provisioning] Seeded ${schemaName} with ${adminEmail}`);

    res.status(201).json({
      message: 'Tenant successfully provisioned',
      tenant,
      defaultAdmin: adminEmail
    });

  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Domain or schema name already exists' });
    }
    console.error('[Tenant Provisioning] Error:', error);
    res.status(500).json({ error: 'Internal server error during tenant provisioning' });
  }
});

// List all Tenants
router.get('/tenants', async (req, res) => {
  try {
    const tenants = await systemPrisma.tenant.findMany();
    res.json(tenants);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
