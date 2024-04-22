import express from 'express';
import * as ticketController from '../controllers/ticketController.js';
import authorize from '../middleware/authorization.js';

const router = express.Router();

router.post('/', authorize(['user']), ticketController.createTicket);

export default router;