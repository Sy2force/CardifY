import request from 'supertest';
import app from '../server';

describe('Auth Endpoints', () => {
  describe('POST /api/users/login', () => {
    it('should return 200 for valid credentials', async () => {
      const response = await request(app)
        .post('/api/users/login')
        .send({
          email: 'admin@cardify.com',
          password: 'admin123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
    });

    it('should return 400 for invalid credentials', async () => {
      const response = await request(app)
        .post('/api/users/login')
        .send({
          email: 'invalid@example.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/health', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/api/health');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'OK');
    });
  });
});
