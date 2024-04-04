import express from 'express';
import authorize from '../middleware/authorization.js';
import * as cartController from '../controllers/cartController.js';
import logger from '../utils/logger.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    logger.debug('Fetching all products');
    await cartController.getAllProducts(req, res);
  } catch (error) {
    logger.error('Error while fetching all products', error);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
});

router.post('/', authorize(['admin']), async (req, res) => {
  try {
    logger.debug('Creating a new product');
    await cartController.createProduct(req, res);
  } catch (error) {
    logger.error('Error while creating a new product', error);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
});

router.post('/addToCart', authorize(['user']), async (req, res) => {
  try {
    logger.debug('Adding product to cart');
    await cartController.addToCart(req, res);
  } catch (error) {
    logger.error('Error while adding product to cart', error);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
});

export default router;
