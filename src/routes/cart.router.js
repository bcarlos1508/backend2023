import express from 'express';
import authorize from '../middleware/authorization.js';
import * as cartController from '../controllers/cartController.js';
import logger from '../utils/logger.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    logger.debug('Obteniendo todos los productos');
    await cartController.getAllProducts(req, res);
  } catch (error) {
    logger.error('Error al recuperar todos los productos', error);
    res.status(500).json({ status: 'error', message: 'Error interno del Servidor' });
  }
});

router.put('/current', authorize(['user']), async (req, res) => {
  try {
    logger.debug('Modificando el carrito del usuario');
    await cartController.modifyCurrentCart(req, res);
  } catch (error) {
    logger.error('Error al modificar el carrito del usuario', error);
    res.status(500).json({ status: 'error', message: 'Error interno del Servidor' });
  }
});

router.post('/', authorize(['admin']), async (req, res) => {
  try {
    logger.debug('Creando un nuevo producto');
    await cartController.createProduct(req, res);
  } catch (error) {
    logger.error('Error al crear un nuevo producto', error);
    res.status(500).json({ status: 'error', message: 'Error interno del Servidor' });
  }
});

router.post('/addToCart', authorize(['user']), async (req, res) => {
  try {
    logger.debug('Agregar producto al carrito');
    await cartController.addToCart(req, res);
  } catch (error) {
    logger.error('Error al agregar producto al carrito', error);
    res.status(500).json({ status: 'error', message: 'Error interno del Servidor' });
  }
});

export default router;
