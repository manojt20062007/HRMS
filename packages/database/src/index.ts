import { PrismaClient } from '@prisma/client';

export * from '@prisma/client';

// Global Prisma instance for system-level queries (e.g., Tenant resolution)
export const prisma = new PrismaClient();

// Function to get a tenant-specific Prisma client
export const getTenantPrisma = (tenantSchema: string) => {
  return prisma.$extends({
    query: {
      $allModels: {
        async $allOperations({ args, query }) {
          // Wrap the operation in a transaction that sets the search_path
          // This ensures the query executes against the correct tenant schema
          const [, result] = await prisma.$transaction([
            prisma.$executeRawUnsafe(`SET search_path TO "${tenantSchema}"`),
            query(args) as any,
          ]);
          return result;
        },
      },
    },
  });
};
