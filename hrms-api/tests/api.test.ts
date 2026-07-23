import request from 'supertest';
import app from '../src/server';

describe('API Endpoints Smoke Test', () => {
  const tenantId = 'pmj.com';
  const headers = { 'x-tenant-id': tenantId };

  // Helper to test an endpoint
  const expectSuccess = async (route: string) => {
    const response = await request(app).get(route).set(headers);
    if (response.status !== 200) {
      console.error(`Route ${route} failed with status ${response.status}:`, response.body);
    }
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body) || typeof response.body === 'object').toBe(true);
  };

  it('GET /api/employees', async () => await expectSuccess('/api/employees'));
  it('GET /api/settings/departments', async () => await expectSuccess('/api/settings/departments'));
  it('GET /api/settings/designations', async () => await expectSuccess('/api/settings/designations'));
  
  // Phase 3: Leave & Attendance
  it('GET /api/leave', async () => await expectSuccess('/api/leave'));
  
  // Phase 4: Travel
  it('GET /api/travel', async () => await expectSuccess('/api/travel'));
  
  // Phase 5: Resignation
  it('GET /api/resignation', async () => await expectSuccess('/api/resignation'));
  
  // Phase 6: Recruitment
  it('GET /api/recruitment/staffing', async () => await expectSuccess('/api/recruitment/staffing'));
  it('GET /api/recruitment/candidates', async () => await expectSuccess('/api/recruitment/candidates'));
  
  // Phase 7: Payroll
  // Note: /api/payroll/records requires month and year query params
  it('GET /api/payroll/records', async () => {
    const response = await request(app).get('/api/payroll/records?month=7&year=2026').set(headers);
    expect(response.status).toBe(200);
  });
  
  // Phase 8: Projects & Assets
  it('GET /api/projects', async () => await expectSuccess('/api/projects'));
  it('GET /api/assets', async () => await expectSuccess('/api/assets'));

  // Phase 9: Reports
  it('GET /api/reports/attendance', async () => await expectSuccess('/api/reports/attendance'));
  it('GET /api/reports/designation-history', async () => await expectSuccess('/api/reports/designation-history'));
  it('GET /api/reports/leave-balance', async () => await expectSuccess('/api/reports/leave-balance'));
  it('GET /api/reports/leaves', async () => await expectSuccess('/api/reports/leaves'));
  it('GET /api/reports/permissions', async () => await expectSuccess('/api/reports/permissions'));
});
