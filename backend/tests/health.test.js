const request = require('supertest');

// Mock the database pool
jest.mock('../src/config/database', () => ({
  query: jest.fn().mockResolvedValue({ rows: [] }),
  on: jest.fn()
}));

// Mock redis
jest.mock('../src/config/redis', () => ({
  get: jest.fn(),
  setEx: jest.fn(),
  connect: jest.fn(),
  on: jest.fn()
}));

const app = require('../src/index');

describe('Health Check', () => {
  it('should return healthy status', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('healthy');
  });
});
