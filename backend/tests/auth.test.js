const request = require('supertest');
const app = require('../server');
const User = require('../models/User');

describe('Auth API', () => {
  beforeEach(async () => {
    await User.deleteMany();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123'
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('email', 'test@example.com');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login existing user', async () => {
      await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');
    });
  });
});