import express from 'express';
import * as sessionController from '../controllers/sessionController.js';

const router = express.Router();

router.post('/register', sessionController.registerUser);
router.post('/login', sessionController.loginUser);
router.get('/current', sessionController.getCurrentUser);
router.post('/admin/endpoint', sessionController.isAdmin, sessionController.adminEndpoint);

export default router;
