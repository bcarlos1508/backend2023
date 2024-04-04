import express from 'express';
import * as viewsController from '../controllers/viewsController.js';

const router = express.Router();

router.get('/register', viewsController.renderRegisterView);
router.post('/register', viewsController.registerUser);
router.get('/', viewsController.renderUsersView);
router.get('/cart', viewsController.renderCartView);

export default router;
