import express from 'express';
import { sendRecoveryEmail } from '../controllers/authController.js';
import authorize from '../middleware/authorization.js';

const router = express.Router();

router.post('/recover', authorize(['admin']), sendRecoveryEmail);

export default router;