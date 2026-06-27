const request = require('supertest');
const server = require('../index');

describe('GET /', () => {
  afterAll((done) => {
    server.close(done);
  });

  test('should return Hello World with status 200', async () => {
    const res = await request(server).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('Hello World!');
  });
});
