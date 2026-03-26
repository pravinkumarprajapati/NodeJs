const mongoose = require('mongoose');
const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
});

beforeEach(async () => {
  const { collections } = mongoose.connection;
  await Promise.all(Object.values(collections).map((collection) => collection.deleteMany({})));
});

describe('auth + todos flow', () => {
  test('register, login, and CRUD todo', async () => {
    const registerRes = await request(app)
      .post('/auth/register')
      .send({ email: 'user@example.com', password: 'password123' });

    expect(registerRes.status).toBe(201);
    expect(registerRes.body.email).toBe('user@example.com');

    const loginRes = await request(app)
      .post('/auth/login')
      .send({ email: 'user@example.com', password: 'password123' });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body.token).toBeTruthy();

    const token = loginRes.body.token;

    const createRes = await request(app)
      .post('/todos')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Write tests' });

    expect(createRes.status).toBe(201);
    expect(createRes.body.title).toBe('Write tests');
    expect(createRes.body.completed).toBe(false);

    const todoId = createRes.body._id;

    const updateRes = await request(app)
      .patch(`/todos/${todoId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ completed: true });

    expect(updateRes.status).toBe(200);
    expect(updateRes.body.completed).toBe(true);

    const listRes = await request(app)
      .get('/todos')
      .set('Authorization', `Bearer ${token}`);

    expect(listRes.status).toBe(200);
    expect(listRes.body).toHaveLength(1);

    const deleteRes = await request(app)
      .delete(`/todos/${todoId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(deleteRes.status).toBe(204);

    const afterDeleteRes = await request(app)
      .get('/todos')
      .set('Authorization', `Bearer ${token}`);

    expect(afterDeleteRes.body).toHaveLength(0);
  });
});
