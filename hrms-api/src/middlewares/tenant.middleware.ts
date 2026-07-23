import { Request, Response, NextFunction } from 'express';
import { systemPrisma, getTenantPrisma } from '../lib/prismaManager';

export const tenantMiddleware = async (req: Request | any, res: Response, next: NextFunction) => {
  // We can identify the tenant from a custom header or a subdomain
  // For this implementation, we'll use a custom header: x-tenant-id
  const tenantId = req.headers['x-tenant-id'] as string;

  if (!tenantId) {
    return res.status(400).json({ error: 'Missing x-tenant-id header' });
  }

  try {
    // Look up the tenant by domain or ID in the public schema
    const tenant = await systemPrisma.tenant.findUnique({
      where: { domain: tenantId } // Using domain as the identifier here
    });

    if (!tenant) {
      return res.status(404).json({ error: 'Tenant not found' });
    }

    // Attach the correct Prisma Client and Tenant Info to the request object
    req.prisma = getTenantPrisma(tenant.schemaName);
    req.tenant = tenant;

    next();
  } catch (error) {
    console.error('Tenant middleware error details:', error);
    res.status(500).json({ error: `Internal server error identifying tenant: ${error instanceof Error ? error.message : String(error)}` });
  }
};
