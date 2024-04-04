import request from 'supertest';
import app from '../../app.js';

describe('GET /users', () => {
  it('should retrieve all users successfully', async () => {
    const res = await request(app)
      .get('/users');

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'success');
  });
});

describe('POST /users/register', () => {
  it('should register a new user successfully', async () => {
    const userData = {
      first_name: 'Test',
      last_name: 'User',
      birthDate: '1990-01-01',
      gender: 'male',
      dni: '12345678',
      email: 'test@example.com',
      password: 'testpass'
    };

    const res = await request(app)
      .post('/users/register')
      .send(userData);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('status', 'success');
  });
});

describe('PUT /users/premium/:uid', () => {
  it('should change the role of a user to premium', async () => {
    const userId = 'EXISTING_USER_ID';
    const validToken = 'VALID_TOKEN';

    const res = await request(app)
      .put(`/users/premium/${userId}`)
      .set('Cookie', `cookie=${validToken}`)
      .send({ newRole: 'premium' });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'success');
  });

  it('should not allow unauthorized users to change user roles', async () => {
    const userId = 'EXISTING_USER_ID';
    const invalidToken = 'INVALID_TOKEN';

    const res = await request(app)
      .put(`/users/premium/${userId}`)
      .set('Cookie', `cookie=${invalidToken}`)
      .send({ newRole: 'premium' });

    expect(res.statusCode).toEqual(403);
    expect(res.body).toHaveProperty('status', 'error');
  });
});
