
import express from 'express';
import { createOrder } from '../controllers/orderController.js';
import authorize from '../middleware/authorization.js';

const router = express.Router();

router.post('/', authorize, createOrder);

export default router;
