import request from 'supertest';
import app from '../src/server';

describe('Employee API endpoints', () => {
  let createdEmployeeId: string;

  it('should create a new employee with nested 7-modules data', async () => {
    const payload = {
      // Step 1: Personal
      firstName: 'John',
      lastName: 'Doe',
      email: `john.doe.${Date.now()}@test.com`,
      mobile: '1234567890',
      aadhaarNo: '123456789012',
      password: 'password123',
      
      // Step 2: Family
      families: [
        { name: 'Jane Doe', relation: 'Wife', bloodGroup: 'O+' }
      ],
      
      // Step 3: Bank
      bank: { bankName: 'Test Bank', accountName: 'John Doe', accountNumber: '123456789', ifscCode: 'TEST0001' },
      
      // Step 4: Address
      address: { street: '123 Main St', city: 'Techville', state: 'TS', zipCode: '12345', country: 'IN' },
      
      // Step 5: Qualifications
      qualifications: [
        { degree: 'BTech', institution: 'Tech Univ', yearOfPassing: '2020' }
      ],
      
      // Step 6: Experiences
      experienceType: 'Experienced',
      totalExperienceYears: '3',
      experiences: [
        { jobTitle: 'SDE', companyName: 'PrevCorp', startDate: '2021-01-01' }
      ],
      
      // Step 7: Certificates
      certificates: [
        { name: 'AWS Certified' }
      ],
      
      // Step 8: Professional
      employeeIdString: `EMP_${Date.now()}`,
      professionalEmail: `john.pro.${Date.now()}@company.com`,
      employmentStatus: 'Probation',
      salary: '50000',
      joiningDate: '2024-01-01'
    };

    const response = await request(app)
      .post('/api/employees')
      .set('x-tenant-id', 'pmj.com')
      .send(payload);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message', 'Employee saved successfully');
    expect(response.body.employee).toHaveProperty('id');
    expect(response.body.employee.firstName).toBe('John');
    expect(response.body.employee.professionalEmail).toBe(payload.professionalEmail);
    
    createdEmployeeId = response.body.employee.id;
  });

  it('should get all employees', async () => {
    const response = await request(app)
      .get('/api/employees')
      .set('x-tenant-id', 'pmj.com');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    // At least the one we just created should be there
    const found = response.body.find((e: any) => e.id === createdEmployeeId);
    expect(found).toBeDefined();
  });
});
