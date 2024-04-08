import request from 'supertest';
import app from '../../app.js';

describe('GET /views/register', () => {
  it('Debería representar la vista de registro correctamente', async () => {
    const res = await request(app)
      .get('/views/register');

    expect(res.statusCode).toEqual(200);
  });
});

describe('GET /views/', () => {
  it('Debería mostrar la vista de los usuarios correctamente', async () => {
    const res = await request(app)
      .get('/views/');

    expect(res.statusCode).toEqual(200);
  });
});

describe('GET /views/cart', () => {
  it('Debería representar la vista del carrito correctamente', async () => {
    const validToken = 'VALID_TOKEN';

    const res = await request(app)
      .get('/views/cart')
      .set('Cookie', `cookie=${validToken}`);

    expect(res.statusCode).toEqual(200);
  });

  it('Debe devolver 404 si no se encuentra el carrito', async () => {
    const invalidToken = 'INVALID_TOKEN';

    const res = await request(app)
      .get('/views/cart')
      .set('Cookie', `cookie=${invalidToken}`);

    expect(res.statusCode).toEqual(404);
  });
});
