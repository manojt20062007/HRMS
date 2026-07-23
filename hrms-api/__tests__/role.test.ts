import request from 'supertest';
import app from '../src/server';

describe('Role API endpoints', () => {
  it('should fetch roles for valid tenant', async () => {
    const response = await request(app)
      .get('/api/roles')
      .set('x-tenant-id', 'pmj.com');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    
    // By default SUPER_ADMIN is seeded
    const hasSuperAdmin = response.body.some((r: any) => r.name === 'SUPER_ADMIN');
    expect(hasSuperAdmin).toBe(true);
  });
});
