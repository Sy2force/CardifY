import express from 'express';
import {
  register,
  login,
  getProfile,
  updateProfile,
  getAllUsers,
  deleteUser
} from '../controllers/user.controller';
import { authMiddleware, adminMiddleware } from '../middlewares/auth';
import { validate } from '../middlewares/validation';
import { authLimiter } from '../middlewares/rateLimit';
import { registerValidation, loginValidation, updateProfileValidation } from '../validations/user.validation';

const router = express.Router();

// Public routes
router.post('/register', authLimiter, registerValidation, register);
router.post('/login', authLimiter, loginValidation, login);

// Protected routes
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfileValidation, updateProfile);

// Admin only routes
router.get('/', authMiddleware, adminMiddleware, getAllUsers);
router.delete('/:id', authMiddleware, adminMiddleware, deleteUser);

export default router;
