import request from 'supertest';
import app from '../../app.js';

describe('POST /session/register', () => {
  it('Debe registrar un usuario con éxito', async () => {
    const res = await request(app)
      .post('/session/register')
      .send({
        username: 'testuser',
        password: 'testpass',
        first_name: 'Test',
        last_name: 'User',
        email: 'test@example.com'
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'success');
  });
});

describe('POST /sessions/login', () => {
  it('Debe iniciar sesión como usuario exitosamente', async () => {
    const res = await request(app)
      .post('/session/login')
      .send({
        username: 'testuser',
        password: 'testpass'
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'success');
    expect(res.headers).toHaveProperty('set-cookie');
  });
});

describe('GET /session/current', () => {
  it('Debería recuperar el usuario actual', async () => {
    const token = 'YOUR_VALID_TOKEN';

    const res = await request(app)
      .get('/session/current')
      .set('Cookie', `cookie=${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'success');
  });
});

describe('POST /session/admin/endpoint', () => {
  it('Debería negar el acceso a usuarios que no sean administradores', async () => {
    const nonAdminToken = 'NON_ADMIN_VALID_TOKEN';

    const res = await request(app)
      .post('/session/admin/endpoint')
      .set('Cookie', `cookie=${nonAdminToken}`);

    expect(res.statusCode).toEqual(403);
    expect(res.body).toHaveProperty('status', 'error');
  });

  it('Debería permitir el acceso a los usuarios administradores', async () => {
    const adminToken = 'ADMIN_VALID_TOKEN';

    const res = await request(app)
      .post('/session/admin/endpoint')
      .set('Cookie', `cookie=${adminToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'success');
  });
});
