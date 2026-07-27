const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient({
  datasources: {
    db: { url: process.env.DATABASE_URL }
  }
});

async function main() {
  console.log('Seeding 10 of each entity into schema_ln...');

  // 1. Create 10 Departments
  const deps = [];
  for(let i=1; i<=10; i++) deps.push({ name: `Department ${i}`, description: `Desc for Dept ${i}` });
  await prisma.department.createMany({ data: deps, skipDuplicates: true });

  // 2. Create 10 Designations
  const desigs = [];
  for(let i=1; i<=10; i++) desigs.push({ name: `Designation ${i}`, description: `Desc for Desig ${i}` });
  await prisma.designation.createMany({ data: desigs, skipDuplicates: true });

  // 3. Create 10 Roles
  const roles = [];
  for(let i=1; i<=10; i++) {
    // Avoid conflicting with SUPER_ADMIN or UNIVERSAL_ADMIN
    roles.push({ name: `Role ${i}`, isDefault: i === 1 });
  }
  await prisma.role.createMany({ data: roles, skipDuplicates: true });

  // 4. Create 10 Projects
  const projs = [];
  for(let i=1; i<=10; i++) {
    projs.push({ 
      name: `Project ${i}`, 
      description: `Description for Project ${i}`,
      status: i % 2 === 0 ? 'ACTIVE' : 'COMPLETED'
    });
  }
  await prisma.project.createMany({ data: projs, skipDuplicates: true });

  // 5. Create 10 Employees (and their User accounts)
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  for(let i=1; i<=10; i++) {
    const email = `employee${i}@ln.com`;
    
    // Create User
    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        password: hashedPassword,
      }
    });

    // Create Employee Profile
    await prisma.employee.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        firstName: `First${i}`,
        lastName: `Last${i}`,
        department: `Department ${i}`,
        designation: `Designation ${i}`,
        personalEmail: `personal${i}@gmail.com`,
        mobileNumber: `987654321${i % 10}`,
        joiningDate: new Date(),
        salary: 40000 + (i * 5000),
        employeeIdString: `EMP_00${i}`,
        employmentStatus: 'Permanent'
      }
    });
  }

  console.log('Successfully seeded 10 of each entity into schema_ln!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
