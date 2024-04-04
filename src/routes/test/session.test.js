import request from 'supertest';
import app from '../../app.js';

describe('POST /session/register', () => {
  it('should register a user successfully', async () => {
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

describe('POST /session/login', () => {
  it('should log in a user successfully', async () => {
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
  it('should retrieve the current user', async () => {
    const token = 'YOUR_VALID_TOKEN';

    const res = await request(app)
      .get('/session/current')
      .set('Cookie', `cookie=${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'success');
  });
});

describe('POST /session/admin/endpoint', () => {
  it('should deny access to non-admin users', async () => {
    const nonAdminToken = 'NON_ADMIN_VALID_TOKEN';

    const res = await request(app)
      .post('/session/admin/endpoint')
      .set('Cookie', `cookie=${nonAdminToken}`);

    expect(res.statusCode).toEqual(403);
    expect(res.body).toHaveProperty('status', 'error');
  });

  it('should allow access to admin users', async () => {
    const adminToken = 'ADMIN_VALID_TOKEN';

    const res = await request(app)
      .post('/session/admin/endpoint')
      .set('Cookie', `cookie=${adminToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'success');
  });
});
