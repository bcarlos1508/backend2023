import express from 'express';
import * as usersController from '../controllers/usersController.js';
import upload from '../config/multer.config.js';
import authorize from '../middleware/authorization.js';

const router = express.Router();

router.get('/', authorize(['admin']), usersController.getAllUsers);
router.post('/register', usersController.registerUser);
router.put('/premium/:uid', usersController.changeUserRole);
router.post('/:uid/documents', upload.fields([
  { name: "document", maxCount: 3 },
  { name: "profileImage", maxCount: 1 },
  { name: "productImage", maxCount: 3 },
]), usersController.addDocumentToUser);
router.delete('/inactive-users', authorize(['admin']), usersController.deleteInactiveUsers);

export default router;