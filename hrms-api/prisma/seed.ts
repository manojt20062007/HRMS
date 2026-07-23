import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // Create SUPER_ADMIN role
  const superAdminRole = await prisma.role.upsert({
    where: { name: 'SUPER_ADMIN' },
    update: {},
    create: {
      name: 'SUPER_ADMIN',
      isDefault: true,
    },
  });

  console.log('Created/Verified SUPER_ADMIN role:', superAdminRole.id);

  // Hash the default password
  const hashedPassword = await bcrypt.hash('admin123', 10);

  // Create the default super admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@pmj.com' },
    update: {},
    create: {
      email: 'admin@pmj.com',
      password: hashedPassword,
      roleId: superAdminRole.id,
    },
  });

  console.log('Created/Verified default Super Admin user:', adminUser.email);
  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
