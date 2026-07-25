import express from 'express';
import { exec } from 'child_process';
import util from 'util';
import bcrypt from 'bcrypt';
import { systemPrisma, getTenantPrisma, resetTenantPrisma } from '../lib/prismaManager';
import { tenantMiddleware } from '../middlewares/tenant.middleware';
import { authMiddleware, requireRole } from '../middlewares/auth.middleware';

const router = express.Router();
const execPromise = util.promisify(exec);

// Create a new Tenant (Company)
router.post('/tenants', authMiddleware, requireRole('UNIVERSAL_ADMIN'), async (req, res) => {
  try {
    const { name, domain, schemaName, tenantLimit, subscriptionDate } = req.body;

    if (!name || !domain || !schemaName) {
      return res.status(400).json({ error: 'name, domain, and schemaName are required' });
    }

    // 1. Create the tenant in the public schema
    const tenant = await systemPrisma.tenant.create({
      data: { 
        name, 
        domain, 
        schemaName,
        tenantLimit: tenantLimit || 50,
        subscriptionDate: subscriptionDate ? new Date(subscriptionDate) : null,
      },
    });

    console.log(`[Tenant Provisioning] Created Tenant record: ${tenant.id}`);

    // 2. Create the physical database schema
    await systemPrisma.$executeRawUnsafe(`CREATE SCHEMA IF NOT EXISTS "${schemaName}";`);
    console.log(`[Tenant Provisioning] Created PostgreSQL schema: ${schemaName}`);

    // 3. Run Prisma migrations on the new schema
    const databaseUrl = process.env.DATABASE_URL || '';
    const urlObj = new URL(databaseUrl);
    urlObj.searchParams.set('schema', schemaName);
    const tenantDbUrl = urlObj.toString();
    
    console.log(`[Tenant Provisioning] Running migrations for ${schemaName}...`);
    
    // We use db push to sync the schema without relying on migration files
    await execPromise('npx prisma db push --skip-generate --accept-data-loss', {
      env: { ...process.env, DATABASE_URL: tenantDbUrl }
    });

    console.log(`[Tenant Provisioning] Migrations successful for ${schemaName}`);

    // 4. Seed the new tenant schema with SUPER_ADMIN
    resetTenantPrisma(schemaName);
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
        roles: { connect: { id: superAdminRole.id } },
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

// Public route to check if a tenant is active
router.get('/tenant-status/:domain', async (req, res) => {
  try {
    const tenant = await systemPrisma.tenant.findUnique({
      where: { domain: req.params.domain }
    });
    
    if (!tenant) {
      return res.status(404).json({ error: 'Tenant not found' });
    }
    
    res.json({ status: tenant.status });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// List all Tenants
router.get('/tenants', authMiddleware, requireRole('UNIVERSAL_ADMIN'), async (req, res) => {
  try {
    const tenants = await systemPrisma.tenant.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(tenants);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a Tenant
router.put('/tenants/:id', authMiddleware, requireRole('UNIVERSAL_ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;
    const { tenantLimit, subscriptionDate, status } = req.body;

    const updatedTenant = await systemPrisma.tenant.update({
      where: { id },
      data: {
        tenantLimit: parseInt(tenantLimit) || 50,
        subscriptionDate: subscriptionDate ? new Date(subscriptionDate) : null,
        status: status || 'ACTIVE',
      }
    });

    res.json({ message: 'Tenant updated successfully', tenant: updatedTenant });
  } catch (error) {
    console.error('[Tenant Update Error]', error);
    res.status(500).json({ error: 'Internal server error during tenant update' });
  }
});

export default router;
