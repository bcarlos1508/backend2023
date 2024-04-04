import { use, expect } from 'chai';
import chaiHttp from 'chai-http';
import server from '../../app.js';
import supertest from 'supertest';
import { describe, it, before, after } from 'mocha';

const server = use("chai-http")
chai.use(chaiHttp);
const { expect } = chai;
const request = supertest(server);

let userToken = '';

before(async () => {
    const response = await request.post('/auth/login').send({
      email: 'user@example.com',
      password: 'password'
    });
  
    userToken = response.body.token;
  });
  
  describe('Cart Operations', () => {
    it('should add a product to the cart', async () => {
      const res = await request.post('/cart/addToCart')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          productId: 'ID_DEL_PRODUCTO_AÑADIDO',
          userId: 'ID_DEL_USUARIO'
        });
      
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('message', 'Product added to cart');
    });
  
    it('should successfully purchase the cart items', async () => {
      const res = await request.post('/cart/purchase')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          cartId: 'ID_DEL_CARRITO'
        });
      
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('message', 'Purchase completed successfully');
    });
  });
  
  after(async () => {
    try {
        await User.deleteOne({ email: 'user@example.com' });
        await ShoppingCart.deleteOne({ userId: 'ID_DEL_USUARIO_DE_PRUEBA' });
        await Product.deleteMany({ createdBy: 'ID_DEL_USUARIO_DE_PRUEBA' });
    
      } catch (error) {
        console.error('Error cleaning up test data:', error);
      }
        mongoose.disconnect();
    });