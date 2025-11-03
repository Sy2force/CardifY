import express from 'express';
import {
  createCard,
  getAllCards,
  getMyCards,
  getCardById,
  updateCard,
  deleteCard,
  likeCard
} from '../controllers/card.controller';
import { authMiddleware, businessMiddleware } from '../middlewares/auth';

const router = express.Router();

// Public routes
router.get('/', getAllCards);

// Protected routes (specific routes before parameterized routes)
router.get('/my-cards', authMiddleware, getMyCards);
router.post('/', authMiddleware, createCard);
router.patch('/:id/like', authMiddleware, likeCard);

// Parameterized routes at the end
router.get('/:id', getCardById);
router.put('/:id', authMiddleware, updateCard);
router.delete('/:id', authMiddleware, deleteCard);

export default router;
