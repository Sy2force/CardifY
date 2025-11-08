"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfileValidation = exports.loginValidation = exports.registerValidation = exports.updateUserSchema = exports.loginSchema = exports.registerSchema = void 0;
// User validations - Joi schemas for input data
const joi_1 = __importDefault(require("joi"));
const validation_1 = require("../middlewares/validation");
// Validation schema for user registration
exports.registerSchema = joi_1.default.object({
    firstName: joi_1.default.string().min(2).max(50).required().messages({
        'string.min': 'First name must be at least 2 characters',
        'string.max': 'First name must not exceed 50 characters',
        'any.required': 'First name is required'
    }),
    lastName: joi_1.default.string().min(2).max(50).required().messages({
        'string.min': 'Last name must be at least 2 characters',
        'string.max': 'Last name must not exceed 50 characters',
        'any.required': 'Last name is required'
    }),
    email: joi_1.default.string().email().required().messages({
        'string.email': 'Please enter a valid email',
        'any.required': 'Email is required'
    }),
    password: joi_1.default.string().min(6).required().messages({
        'string.min': 'Password must be at least 6 characters',
        'any.required': 'Password is required'
    }),
    phone: joi_1.default.string().pattern(/^[+]?[\d\s\-.()]+$/).min(1).max(25).allow('').messages({
        'string.pattern.base': 'Please enter a valid phone number'
    }),
    isBusiness: joi_1.default.boolean().default(false), // Business account defaults to false
    isAdmin: joi_1.default.boolean().default(false) // Admin defaults to false
});
// Validation schema for user login
exports.loginSchema = joi_1.default.object({
    email: joi_1.default.string().email().required().messages({
        'string.email': 'Please enter a valid email',
        'any.required': 'Email is required'
    }),
    password: joi_1.default.string().required().messages({
        'any.required': 'Password is required'
    })
});
// Validation schema for profile updates
exports.updateUserSchema = joi_1.default.object({
    firstName: joi_1.default.string().min(2).max(50).messages({
        'string.min': 'First name must be at least 2 characters',
        'string.max': 'First name must not exceed 50 characters'
    }),
    lastName: joi_1.default.string().min(2).max(50).messages({
        'string.min': 'Last name must be at least 2 characters',
        'string.max': 'Last name must not exceed 50 characters'
    }),
    phone: joi_1.default.string().pattern(/^[+]?[\d\s\-.()]+$/).min(1).max(25).messages({
        'string.pattern.base': 'Please enter a valid phone number'
    })
});
// Export validation functions for middleware use
exports.registerValidation = (0, validation_1.validate)(exports.registerSchema); // Registration validation
exports.loginValidation = (0, validation_1.validate)(exports.loginSchema); // Login validation
exports.updateProfileValidation = (0, validation_1.validate)(exports.updateUserSchema); // Profile update validation
