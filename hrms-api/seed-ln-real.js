const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient({
  datasources: {
    db: { url: process.env.DATABASE_URL }
  }
});

async function main() {
  console.log('Cleaning up old dummy data...');
  
  // Clean up previous dummy data
  await prisma.employee.deleteMany({ where: { employeeIdString: { startsWith: 'EMP_00' } } });
  await prisma.user.deleteMany({ where: { email: { startsWith: 'employee' } } });
  await prisma.project.deleteMany({ where: { name: { startsWith: 'Project ' } } });
  await prisma.role.deleteMany({ where: { name: { startsWith: 'Role ' } } });
  await prisma.designation.deleteMany({ where: { name: { startsWith: 'Designation ' } } });
  await prisma.department.deleteMany({ where: { name: { startsWith: 'Department ' } } });

  console.log('Seeding real-world data into schema_ln...');

  const departmentsData = [
    'Engineering', 'Human Resources', 'Finance', 'Sales', 'Marketing', 
    'Customer Support', 'Legal', 'Operations', 'Product Management', 'Quality Assurance'
  ];

  const designationsData = [
    'Software Engineer', 'HR Business Partner', 'Financial Analyst', 'Account Executive', 
    'Marketing Specialist', 'Support Representative', 'Legal Counsel', 'Operations Manager', 
    'Product Manager', 'QA Tester'
  ];

  const rolesData = [
    'Manager', 'Employee', 'Team Lead', 'HR Admin', 'Finance Admin', 
    'Read-Only', 'Contractor', 'Director', 'VP', 'System Auditor'
  ];

  const projectsData = [
    'Mobile App Revamp', 'Q3 Marketing Campaign', 'Annual Audit 2026', 'CRM Migration', 
    'Customer Onboarding Portal', 'Employee Wellness Program', 'ISO Compliance', 
    'Website Redesign', 'Cloud Infrastructure Upgrade', 'Sales Enablement Tool'
  ];

  const employeesData = [
    { first: 'Michael', last: 'Chen', email: 'm.chen@ln.com', code: 'EMP_101' },
    { first: 'Sarah', last: 'Jenkins', email: 's.jenkins@ln.com', code: 'EMP_102' },
    { first: 'David', last: 'Rodriguez', email: 'd.rodriguez@ln.com', code: 'EMP_103' },
    { first: 'Emily', last: 'Watson', email: 'e.watson@ln.com', code: 'EMP_104' },
    { first: 'James', last: 'Carter', email: 'j.carter@ln.com', code: 'EMP_105' },
    { first: 'Olivia', last: 'Bennett', email: 'o.bennett@ln.com', code: 'EMP_106' },
    { first: 'Robert', last: 'Chang', email: 'r.chang@ln.com', code: 'EMP_107' },
    { first: 'Lisa', last: 'Patel', email: 'l.patel@ln.com', code: 'EMP_108' },
    { first: 'William', last: 'Thompson', email: 'w.thompson@ln.com', code: 'EMP_109' },
    { first: 'Jessica', last: 'Rivera', email: 'j.rivera@ln.com', code: 'EMP_110' },
  ];

  // 1. Create Departments
  await prisma.department.createMany({
    data: departmentsData.map(d => ({ name: d, description: `${d} Department` })),
    skipDuplicates: true
  });

  // 2. Create Designations
  await prisma.designation.createMany({
    data: designationsData.map(d => ({ name: d, description: `${d} Role` })),
    skipDuplicates: true
  });

  // 3. Create Roles
  await prisma.role.createMany({
    data: rolesData.map(r => ({ name: r, isDefault: r === 'Employee' })),
    skipDuplicates: true
  });

  // 4. Create Projects
  await prisma.project.createMany({
    data: projectsData.map((p, i) => ({ 
      name: p, 
      description: `Strategic initiative: ${p}`,
      status: i % 3 === 0 ? 'COMPLETED' : 'ACTIVE' 
    })),
    skipDuplicates: true
  });

  // 5. Create Employees
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  for(let i=0; i<10; i++) {
    const empInfo = employeesData[i];
    
    // Create User
    const user = await prisma.user.upsert({
      where: { email: empInfo.email },
      update: {},
      create: {
        email: empInfo.email,
        password: hashedPassword,
      }
    });

    // Create Employee Profile
    await prisma.employee.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        firstName: empInfo.first,
        lastName: empInfo.last,
        department: departmentsData[i],
        designation: designationsData[i],
        personalEmail: `${empInfo.first.toLowerCase()}.${empInfo.last.toLowerCase()}@gmail.com`,
        mobileNumber: `9876543${200 + i}`,
        joiningDate: new Date(Date.now() - Math.random() * 10000000000), // Random past date
        salary: 50000 + (Math.random() * 50000), // 50k to 100k
        employeeIdString: empInfo.code,
        employmentStatus: 'Permanent'
      }
    });
  }

  console.log('Successfully seeded REAL WORLD data into schema_ln!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
