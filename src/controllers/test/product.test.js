import request from 'supertest';
import app from '../../app.js';

describe('GET /products', () => {
  it('Deberia devolver todos los productos correctamente', async () => {
    const res = await request(app)
      .get('/products');

    expect(res.statusCode).toEqual(200);
  });
});

describe('POST /products', () => {
  it('Debería crear un nuevo producto con éxito', async () => {
    const newProductData = {
      title: 'Nuevo Producto',
      description: 'Descripcion del nuevo producto',
      price: 100,
    };

    const res = await request(app)
      .post('/products')
      .send(newProductData);

    expect(res.statusCode).toEqual(201);
  });
});

describe('PUT /products/:id', () => {
  it('Debe actualizar un producto existente con éxito', async () => {
    const validProductId = 'VALID_PRODUCT_ID';
    const updatedProductData = {
      title: 'Título del producto actualizado',
      description: 'Descripción del producto actualizada',
      price: 150,
    };

    const res = await request(app)
      .put(`/products/${validProductId}`)
      .send(updatedProductData);

    expect(res.statusCode).toEqual(200);
  });
});

describe('DELETE /products/:id', () => {
  it('Debería eliminar un producto existente con éxito', async () => {
    const validProductId = 'VALID_PRODUCT_ID';

    const res = await request(app)
      .delete(`/products/${validProductId}`);

    expect(res.statusCode).toEqual(200);
  });
});
