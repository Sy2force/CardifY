"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const auth_1 = require("../middlewares/auth");
// import { validate } from '../middlewares/validation';
const rateLimit_1 = require("../middlewares/rateLimit");
const user_validation_1 = require("../validations/user.validation");
const router = express_1.default.Router();
// Public routes
router.post('/register', rateLimit_1.authLimiter, user_validation_1.registerValidation, user_controller_1.register);
router.post('/login', rateLimit_1.authLimiter, user_validation_1.loginValidation, user_controller_1.login);
// Protected routes
router.get('/profile', auth_1.authMiddleware, user_controller_1.getProfile);
router.put('/profile', auth_1.authMiddleware, user_validation_1.updateProfileValidation, user_controller_1.updateProfile);
// Admin only routes
router.get('/', auth_1.authMiddleware, auth_1.adminMiddleware, user_controller_1.getAllUsers);
router.delete('/:id', auth_1.authMiddleware, auth_1.adminMiddleware, user_controller_1.deleteProfile);
exports.default = router;
