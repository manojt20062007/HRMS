const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient({
  datasources: {
    db: { url: process.env.DATABASE_URL }
  }
});

async function main() {
  console.log('Seeding fake data into schema_ln...');

  // 1. Create Departments
  await prisma.department.createMany({
    data: [
      { name: 'Engineering', description: 'Tech team' },
      { name: 'Human Resources', description: 'HR and recruitment' },
      { name: 'Sales', description: 'Sales and marketing' }
    ],
    skipDuplicates: true
  });

  // 2. Create Designations
  await prisma.designation.createMany({
    data: [
      { name: 'Software Engineer', description: 'Backend and frontend' },
      { name: 'HR Manager', description: 'Manages HR' },
      { name: 'Account Executive', description: 'Sales rep' }
    ],
    skipDuplicates: true
  });

  // 3. Create a fake standard user
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const fakeUser = await prisma.user.upsert({
    where: { email: 'john.doe@ln.com' },
    update: {},
    create: {
      email: 'john.doe@ln.com',
      password: hashedPassword,
    }
  });

  // 4. Create an Employee record for the fake user
  await prisma.employee.upsert({
    where: { userId: fakeUser.id },
    update: {},
    create: {
      userId: fakeUser.id,
      firstName: 'John',
      lastName: 'Doe',
      department: 'Engineering',
      designation: 'Software Engineer',
      personalEmail: 'john.personal@gmail.com',
      mobileNumber: '9876543210',
      joiningDate: new Date(),
      salary: 50000,
      employeeIdString: 'LN_001',
      employmentStatus: 'Permanent'
    }
  });

  console.log('Successfully seeded sample data into schema_ln!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
