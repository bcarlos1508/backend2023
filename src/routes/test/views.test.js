import request from 'supertest';
import app from '../../app.js';

describe('GET /views/register', () => {
  it('should render the register view successfully', async () => {
    const res = await request(app)
      .get('/views/register');

    expect(res.statusCode).toEqual(200);
  });
});

describe('GET /views/', () => {
  it('should render the users view successfully', async () => {
    const res = await request(app)
      .get('/views/');

    expect(res.statusCode).toEqual(200);
  });
});

describe('GET /views/cart', () => {
  it('should render the cart view successfully', async () => {
    const validToken = 'VALID_TOKEN';

    const res = await request(app)
      .get('/views/cart')
      .set('Cookie', `cookie=${validToken}`);

    expect(res.statusCode).toEqual(200);
  });

  it('should return 404 if cart not found', async () => {
    const invalidToken = 'INVALID_TOKEN';

    const res = await request(app)
      .get('/views/cart')
      .set('Cookie', `cookie=${invalidToken}`);

    expect(res.statusCode).toEqual(404);
  });
});
