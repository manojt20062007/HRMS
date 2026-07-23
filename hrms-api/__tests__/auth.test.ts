import request from 'supertest';
import app from '../src/server';

describe('Auth API endpoints', () => {
  it('should reject login without domain', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@test.com', password: 'password' });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Missing x-tenant-id header');
  });

  it('should reject login with wrong credentials on valid tenant', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .set('x-tenant-id', 'pmj.com')
      .send({ email: 'wrong@pmj.com', password: 'wrong' });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error', 'Invalid credentials');
  });
});
