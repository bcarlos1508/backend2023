import request from 'supertest';
import app from '../../app.js';

describe('GET /products', () => {
  it('should return all products successfully', async () => {
    const res = await request(app)
      .get('/products');

    expect(res.statusCode).toEqual(200);
  });
});

describe('POST /products', () => {
  it('should create a new product successfully', async () => {
    const newProductData = {
      title: 'New Product',
      description: 'Description of the new product',
      price: 100,
    };

    const res = await request(app)
      .post('/products')
      .send(newProductData);

    expect(res.statusCode).toEqual(201);
  });
});

describe('PUT /products/:id', () => {
  it('should update an existing product successfully', async () => {
    const validProductId = 'VALID_PRODUCT_ID';
    const updatedProductData = {
      title: 'Updated Product Title',
      description: 'Updated product description',
      price: 150,
    };

    const res = await request(app)
      .put(`/products/${validProductId}`)
      .send(updatedProductData);

    expect(res.statusCode).toEqual(200);
  });
});

describe('DELETE /products/:id', () => {
  it('should delete an existing product successfully', async () => {
    const validProductId = 'VALID_PRODUCT_ID';

    const res = await request(app)
      .delete(`/products/${validProductId}`);

    expect(res.statusCode).toEqual(200);
  });
});
