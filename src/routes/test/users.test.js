import request from 'supertest';
import app from '../../app.js';

describe('GET /users', () => {
  it('Debería recuperar todos los usuarios con éxito', async () => {
    const res = await request(app)
      .get('/users');

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'success');
  });
});

describe('POST /users/register', () => {
  it('Debería registrar un nuevo usuario con éxito.', async () => {
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
  it('Debería cambiar el rol de un usuario a Premium', async () => {
    const userId = 'EXISTING_USER_ID';
    const validToken = 'VALID_TOKEN';

    const res = await request(app)
      .put(`/users/premium/${userId}`)
      .set('Cookie', `cookie=${validToken}`)
      .send({ newRole: 'premium' });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'success');
  });

  it('No debe permitir que usuarios no autorizados cambien los roles de usuario', async () => {
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
