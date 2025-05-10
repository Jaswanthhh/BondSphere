const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const Community = require('../models/Community');
const User = require('../models/User');

describe('Community Endpoints', () => {
  let authToken;
  let testUser;
  let testCommunity;

  beforeAll(async () => {
    // Create test user
    testUser = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });

    // Login to get token
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });
    
    authToken = loginRes.body.token;
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  describe('POST /api/communities', () => {
    it('should create a new community', async () => {
      const communityData = {
        name: 'Test Community',
        description: 'A test community',
        tags: ['test', 'community']
      };

      const res = await request(app)
        .post('/api/communities')
        .set('Authorization', `Bearer ${authToken}`)
        .send(communityData);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('name', communityData.name);
      testCommunity = res.body;
    });

    it('should not create community with existing name', async () => {
      const res = await request(app)
        .post('/api/communities')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Community',
          description: 'Another test community'
        });

      expect(res.statusCode).toBe(400);
    });
  });

  describe('GET /api/communities', () => {
    it('should get all communities', async () => {
      const res = await request(app)
        .get('/api/communities')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBeGreaterThan(0);
    });

    it('should get community by id', async () => {
      const res = await request(app)
        .get(`/api/communities/${testCommunity._id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('name', testCommunity.name);
    });
  });

  describe('PUT /api/communities/:id', () => {
    it('should update community', async () => {
      const updateData = {
        description: 'Updated description'
      };

      const res = await request(app)
        .put(`/api/communities/${testCommunity._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('description', updateData.description);
    });
  });

  describe('POST /api/communities/:id/join', () => {
    it('should allow user to join community', async () => {
      const res = await request(app)
        .post(`/api/communities/${testCommunity._id}/join`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.members).toContainEqual(
        expect.objectContaining({
          user: testUser._id.toString()
        })
      );
    });
  });
}); 