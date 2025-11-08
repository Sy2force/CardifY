"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const card_controller_1 = require("../controllers/card.controller");
const auth_1 = require("../middlewares/auth");
const rateLimit_1 = require("../middlewares/rateLimit");
const card_validation_1 = require("../validations/card.validation");
const router = (0, express_1.Router)();
// Public routes
router.get('/', card_controller_1.getAllCards);
// Protected routes (specific routes before parameterized routes)
router.get('/my-cards', auth_1.authMiddleware, card_controller_1.getMyCards);
router.post('/', auth_1.authMiddleware, rateLimit_1.cardLimiter, card_validation_1.createCardValidation, card_controller_1.createCard);
router.patch('/:id/like', auth_1.authMiddleware, card_controller_1.likeCard);
// Parameterized routes at the end
router.get('/:id', card_controller_1.getCardById);
router.put('/:id', auth_1.authMiddleware, card_validation_1.updateCardValidation, card_controller_1.updateCard);
router.delete('/:id', auth_1.authMiddleware, card_controller_1.deleteCard);
exports.default = router;
