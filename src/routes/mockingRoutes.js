import Router from 'express';
import generateMockProducts from '../controllers/mockingController.js';
import logger from '../utils/logger.js';

const router = Router();

router.get('/mockingproducts', (req, res) => {
  try {
    logger.debug('Generating mocking products');
    const mockProducts = generateMockProducts();
    res.status(200).json({ status: 'success', payload: mockProducts });
  } catch (error) {
    logger.error('Error while generating mocking products', error);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
});

export default router;
