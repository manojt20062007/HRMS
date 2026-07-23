import express from 'express';
import { prisma } from '@hrms/database';
import { BadRequestError } from '@hrms/common';

const router = express.Router();

router.post('/', async (req, res) => {
  const { name, domain } = req.body;

  // Derive schema name from tenant name
  const schemaName = 'tenant_' + name.toLowerCase().replace(/[^a-z0-9]/g, '');

  const existingTenant = await prisma.tenant.findFirst({
    where: { OR: [{ name }, { schema: schemaName }, { domain }] }
  });

  if (existingTenant) {
    throw new BadRequestError('Tenant already exists with this name or domain');
  }

  // Create tenant record in public schema
  const tenant = await prisma.tenant.create({
    data: {
      name,
      schema: schemaName,
      domain,
    }
  });

  // Create PostgreSQL Schema
  await prisma.$executeRawUnsafe(`CREATE SCHEMA IF NOT EXISTS "${schemaName}";`);

  // In a real application, we would run Prisma migrations against this new schema
  // using a child process or prisma programmatic API to ensure tables are created.
  // We would also publish a 'TenantCreated' event to RabbitMQ.

  res.status(201).send(tenant);
});

router.get('/', async (req, res) => {
  const tenants = await prisma.tenant.findMany();
  res.send(tenants);
});

export { router as tenantRouter };
