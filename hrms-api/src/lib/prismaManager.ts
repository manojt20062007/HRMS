import { PrismaClient } from '@prisma/client';

// The global instance connected to the default "public" schema
export const systemPrisma = new PrismaClient();

// Cache to hold tenant PrismaClients so we don't create a new one on every request
const tenantClients: Record<string, PrismaClient> = {};

export const getTenantPrisma = (schemaName: string): PrismaClient => {
  if (!tenantClients[schemaName]) {
    const baseUrl = process.env.DATABASE_URL;
    if (!baseUrl) {
      throw new Error('DATABASE_URL is not set');
    }

    // Append ?schema=schemaName to the URL
    const url = new URL(baseUrl);
    url.searchParams.set('schema', schemaName);
    const tenantUrl = url.toString();

    console.log(`[PrismaManager] Creating new connection pool for schema: ${schemaName}`);
    
    tenantClients[schemaName] = new PrismaClient({
      datasources: {
        db: {
          url: tenantUrl,
        },
      },
    });
  }

  return tenantClients[schemaName];
};
