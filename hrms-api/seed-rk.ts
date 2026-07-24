import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const DATABASE_URL = "postgresql://neondb_owner:npg_JX9YbTUriC3z@ep-long-sea-azgefq0j-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require&schema=schema_rk";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: DATABASE_URL,
    },
  },
});

async function main() {
  console.log("Starting cleanup of old data for RK tenant...");

  // Delete in reverse order of dependencies
  await prisma.employeeProject.deleteMany();
  await prisma.employee.deleteMany();
  await prisma.user.deleteMany();
  await prisma.rolePermission.deleteMany();
  await prisma.project.deleteMany();
  await prisma.role.deleteMany();
  await prisma.designation.deleteMany();
  await prisma.department.deleteMany();

  console.log("Cleanup complete. Starting seeding with realistic Indian IT company data...");

  const departmentsData = [
    { name: 'Engineering', description: 'Software Development and Architecture' },
    { name: 'Product Management', description: 'Product Strategy and Planning' },
    { name: 'Quality Assurance', description: 'Testing and Quality Control' },
    { name: 'Design', description: 'UI/UX and Graphic Design' },
    { name: 'Human Resources', description: 'Talent Acquisition and Management' },
    { name: 'Finance', description: 'Accounts and Payroll' },
    { name: 'Sales', description: 'B2B and B2C Sales' },
    { name: 'Marketing', description: 'Digital Marketing and Branding' },
    { name: 'IT Support', description: 'Internal IT and Infrastructure' },
    { name: 'Operations', description: 'Business Operations' }
  ];

  const designationsData = [
    { name: 'Software Engineer', description: 'Develops software solutions' },
    { name: 'Senior Software Engineer', description: 'Leads complex software projects' },
    { name: 'Tech Lead', description: 'Technical guidance and mentoring' },
    { name: 'Product Manager', description: 'Manages product lifecycle' },
    { name: 'QA Engineer', description: 'Ensures software quality' },
    { name: 'UI/UX Designer', description: 'Designs user interfaces and experiences' },
    { name: 'HR Executive', description: 'Manages HR operations' },
    { name: 'DevOps Engineer', description: 'Manages CI/CD and infrastructure' },
    { name: 'Data Scientist', description: 'Analyzes and interprets complex data' },
    { name: 'Engineering Manager', description: 'Manages engineering teams' },
    { name: 'CEO', description: 'Chief Executive Officer' }
  ];

  const rolesData = [
    { name: 'EMPLOYEE', isDefault: true },
    { name: 'HR_ADMIN', isDefault: false },
    { name: 'IT_ADMIN', isDefault: false },
    { name: 'PROJECT_MANAGER', isDefault: false },
    { name: 'FINANCE_ADMIN', isDefault: false },
    { name: 'RECRUITER', isDefault: false },
    { name: 'SUPER_ADMIN', isDefault: false },
    { name: 'MANAGEMENT', isDefault: false },
    { name: 'AUDITOR', isDefault: false },
    { name: 'HR_MANAGER', isDefault: false }
  ];

  const pages = [
    'Dashboard', 'Employees', 'Departments', 'Designations', 'Projects', 
    'Leaves', 'Attendance', 'Payroll', 'Settings', 'Reports'
  ];

  const projectsData = [
    { name: 'E-Commerce Platform Rewrite', description: 'Modernizing the legacy e-commerce platform.' },
    { name: 'Internal HRMS Portal', description: 'Building the company internal HRMS.' },
    { name: 'AI Recommendation Engine', description: 'Developing an AI-driven product recommendation engine.' },
    { name: 'Mobile App V2.0', description: 'Redesign and launch of the main iOS/Android app.' },
    { name: 'Cloud Migration (AWS)', description: 'Migrating on-premise servers to AWS cloud.' },
    { name: 'Microservices Refactoring', description: 'Breaking down the monolith into microservices.' },
    { name: 'Data Warehouse Setup', description: 'Implementing Snowflake data warehouse.' },
    { name: 'CRM Integration', description: 'Integrating Salesforce with internal tools.' },
    { name: 'Automation Testing Suite', description: 'End-to-end automation testing setup using Cypress.' },
    { name: 'Client A Backend Services', description: 'Backend development for an enterprise client.' }
  ];

  const employeesData = [
    { first: 'Manoj', last: 'T', gender: 'Male', phone: '9345632035', deptIndex: 0, desigIndex: 10, roleIndex: 6, password: '123' },
    { first: 'Aarav', last: 'Sharma', gender: 'Male', phone: '9876543210', deptIndex: 0, desigIndex: 0, roleIndex: 0 },
    { first: 'Priya', last: 'Singh', gender: 'Female', phone: '9876543211', deptIndex: 2, desigIndex: 4, roleIndex: 0 },
    { first: 'Rahul', last: 'Verma', gender: 'Male', phone: '9876543212', deptIndex: 0, desigIndex: 1, roleIndex: 0 },
    { first: 'Sneha', last: 'Iyer', gender: 'Female', phone: '9876543213', deptIndex: 1, desigIndex: 3, roleIndex: 3 },
    { first: 'Vikram', last: 'Desai', gender: 'Male', phone: '9876543214', deptIndex: 0, desigIndex: 2, roleIndex: 7 },
    { first: 'Anjali', last: 'Nair', gender: 'Female', phone: '9876543215', deptIndex: 3, desigIndex: 5, roleIndex: 0 },
    { first: 'Amit', last: 'Patel', gender: 'Male', phone: '9876543216', deptIndex: 4, desigIndex: 6, roleIndex: 1 },
    { first: 'Neha', last: 'Gupta', gender: 'Female', phone: '9876543217', deptIndex: 5, desigIndex: 8, roleIndex: 4 },
    { first: 'Rohan', last: 'Mehta', gender: 'Male', phone: '9876543218', deptIndex: 0, desigIndex: 7, roleIndex: 2 },
    { first: 'Suresh', last: 'Kumar', gender: 'Male', phone: '9876543219', deptIndex: 0, desigIndex: 9, roleIndex: 9 }
  ];

  // Seed Departments
  const departments = [];
  for (const d of departmentsData) {
    const dept = await prisma.department.create({ data: d });
    departments.push(dept);
  }
  console.log(`Seeded ${departments.length} Realistic Departments.`);

  // Seed Designations
  const designations = [];
  for (const d of designationsData) {
    const desig = await prisma.designation.create({ data: d });
    designations.push(desig);
  }
  console.log(`Seeded ${designations.length} Realistic Designations.`);

  // Seed Roles and their Permissions
  const roles = [];
  for (const r of rolesData) {
    const role = await prisma.role.create({ data: r });
    roles.push(role);
    
    // Give all permissions to SUPER_ADMIN, and some defaults to others
    const canRead = r.name === 'SUPER_ADMIN' || r.name === 'MANAGEMENT' || r.name === 'EMPLOYEE';
    const canWrite = r.name === 'SUPER_ADMIN';

    for (const pageName of pages) {
      await prisma.rolePermission.create({
        data: {
          roleId: role.id,
          pageName: pageName,
          canRead: canRead,
          canWrite: canWrite,
        }
      });
    }
  }
  console.log(`Seeded ${roles.length} Realistic Roles with Permissions.`);

  // Seed Projects
  const projects = [];
  for (const p of projectsData) {
    const proj = await prisma.project.create({
      data: { ...p, status: "ACTIVE" },
    });
    projects.push(proj);
  }
  console.log(`Seeded ${projects.length} Realistic Projects.`);

  // Seed Employees
  const defaultHashedPassword = await bcrypt.hash('password123', 10);
  for (let i = 0; i < employeesData.length; i++) {
    const empInfo = employeesData[i];
    
    // 1. Create User
    const email = `${empInfo.first.toLowerCase()}.${empInfo.last.toLowerCase()}@rk.com`;
    const password = empInfo.password ? await bcrypt.hash(empInfo.password, 10) : defaultHashedPassword;

    const user = await prisma.user.create({
      data: {
        email,
        password: password,
        roleId: roles[empInfo.roleIndex].id,
      }
    });

    // 2. Create Employee
    const employeeIdString = `RK_${String(i + 1).padStart(3, '0')}`;
    const employee = await prisma.employee.create({
      data: {
        userId: user.id,
        firstName: empInfo.first,
        lastName: empInfo.last,
        department: departments[empInfo.deptIndex].name,
        designation: designations[empInfo.desigIndex].name,
        personalEmail: `${empInfo.first.toLowerCase()}.${empInfo.last.toLowerCase()}@gmail.com`,
        mobileNumber: empInfo.phone,
        gender: empInfo.gender,
        employeeIdString,
        professionalEmail: email,
        employmentStatus: "Permanent",
        salary: 600000 + (i * 150000), 
      }
    });

    // Assign project to employee
    await prisma.employeeProject.create({
      data: {
        employeeId: employee.id,
        projectId: projects[i % projects.length].id,
        role: empInfo.roleIndex === 6 ? "Director" : "Team Member",
      }
    });
  }
  console.log(`Seeded ${employeesData.length} Employees with Indian names and assigned them to Projects.`);

}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
