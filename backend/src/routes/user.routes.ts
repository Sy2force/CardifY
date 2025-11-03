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

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);

// Admin only routes
router.get('/', authMiddleware, adminMiddleware, getAllUsers);
router.delete('/:id', authMiddleware, adminMiddleware, deleteUser);

export default router;
