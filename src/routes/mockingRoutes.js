import Router from 'express';
import generateMockProducts from '../controllers/mockingController.js';
import logger from '../utils/logger.js';

const router = Router();

router.get('/mockingproducts', (req, res) => {
  try {
    logger.debug('Generando productos simulados');
    const mockProducts = generateMockProducts();
    res.status(200).json({ status: 'success', payload: mockProducts });
  } catch (error) {
    logger.error('Error al generar productos simulados', error);
    res.status(500).json({ status: 'error', message: 'Error interno del Servidor' });
  }
});

export default router;
