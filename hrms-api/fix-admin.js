const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres:postgrespassword@localhost:5432/saas_hrms?schema=schema_pmj"
    }
  }
});

async function main() {
  const email = 'admin@pmj.com';
  
  console.log(`Connecting to schema_pmj...`);
  
  const user = await prisma.user.findUnique({
    where: { email },
    include: { roles: true }
  });

  if (!user) {
    console.log("User admin@pmj.com not found in schema_pmj!");
    return;
  }
  
  console.log(`Found user: ${user.id}`);
  console.log(`Current roles for user: ${user.roles.map(r => r.name).join(', ') || 'None'}`);

  const role = await prisma.role.findFirst({
    where: { name: 'SUPER_ADMIN' }
  });

  if (!role) {
    console.log("SUPER_ADMIN role not found in schema_pmj!");
    return;
  }
  
  console.log(`Found SUPER_ADMIN role: ${role.id}`);

  // Connect the role to the user
  const updatedUser = await prisma.user.update({
    where: { email },
    data: {
      roles: {
        connect: { id: role.id }
      }
    },
    include: { roles: true }
  });
  
  console.log(`Successfully updated! User now has roles: ${updatedUser.roles.map(r => r.name).join(', ')}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
