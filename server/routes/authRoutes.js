import express from 'express';
import { loginUser, getMe, registerUser } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', loginUser);
router.post('/register', protect, registerUser); // Solo un usuario autenticado puede crear cuentas nuevas
router.get('/me', protect, getMe);

export default router;