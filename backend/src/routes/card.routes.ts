import { Router } from 'express';
import {
  createCard,
  getAllCards,
  getMyCards,
  getCardById,
  updateCard,
  deleteCard,
  likeCard
} from '../controllers/card.controller';
import { authMiddleware } from '../middlewares/auth';
import { cardLimiter } from '../middlewares/rateLimit';
import { createCardValidation, updateCardValidation } from '../validations/card.validation';

const router = Router();

// Public routes
router.get('/', getAllCards);

// Protected routes (specific routes before parameterized routes)
router.get('/my-cards', authMiddleware, getMyCards);
router.post('/', authMiddleware, cardLimiter, createCardValidation, createCard);
router.patch('/:id/like', authMiddleware, likeCard);

// Parameterized routes at the end
router.get('/:id', getCardById);
router.put('/:id', authMiddleware, updateCardValidation, updateCard);
router.delete('/:id', authMiddleware, deleteCard);

export default router;
