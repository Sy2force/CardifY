"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCardValidation = exports.createCardValidation = exports.updateCardSchema = exports.createCardSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const validation_1 = require("../middlewares/validation");
exports.createCardSchema = joi_1.default.object({
    title: joi_1.default.string().min(2).max(100).required().messages({
        'string.min': 'Title must be at least 2 characters',
        'string.max': 'Title must not exceed 100 characters',
        'any.required': 'Title is required'
    }),
    subtitle: joi_1.default.string().min(2).max(100).optional().messages({
        'string.min': 'Subtitle must be at least 2 characters',
        'string.max': 'Subtitle must not exceed 100 characters'
    }),
    description: joi_1.default.string().min(2).max(1000).optional().messages({
        'string.min': 'Description must be at least 2 characters',
        'string.max': 'Description must not exceed 1000 characters'
    }),
    phone: joi_1.default.string().pattern(/^[+]?[1-9][\d]{0,15}$/).required().messages({
        'string.pattern.base': 'Please enter a valid phone number',
        'any.required': 'Phone is required'
    }),
    email: joi_1.default.string().email().required().messages({
        'string.email': 'Please enter a valid email',
        'any.required': 'Email is required'
    }),
    web: joi_1.default.string().uri().allow('').optional().messages({
        'string.uri': 'Please enter a valid URL'
    }),
    image: joi_1.default.object({
        url: joi_1.default.string().uri().messages({
            'string.uri': 'Please enter a valid image URL'
        }),
        alt: joi_1.default.string().max(100).messages({
            'string.max': 'Alt text must not exceed 100 characters'
        })
    }).optional(),
    address: joi_1.default.object({
        state: joi_1.default.string().max(50).allow('').optional().messages({
            'string.max': 'State must not exceed 50 characters'
        }),
        country: joi_1.default.string().min(2).max(50).allow('').optional().messages({
            'string.min': 'Country must be at least 2 characters',
            'string.max': 'Country must not exceed 50 characters'
        }),
        city: joi_1.default.string().min(2).max(50).allow('').optional().messages({
            'string.min': 'City must be at least 2 characters',
            'string.max': 'City must not exceed 50 characters'
        }),
        street: joi_1.default.string().min(2).max(100).allow('').optional().messages({
            'string.min': 'Street must be at least 2 characters',
            'string.max': 'Street must not exceed 100 characters'
        }),
        houseNumber: joi_1.default.string().min(1).max(20).allow('').optional().messages({
            'string.min': 'House number must be at least 1 character',
            'string.max': 'House number must not exceed 20 characters'
        }),
        zip: joi_1.default.string().max(10).allow('').optional().messages({
            'string.max': 'ZIP code must not exceed 10 characters'
        })
    }).allow(null).optional()
});
exports.updateCardSchema = joi_1.default.object({
    title: joi_1.default.string().min(2).max(100).messages({
        'string.min': 'Title must be at least 2 characters',
        'string.max': 'Title must not exceed 100 characters'
    }),
    subtitle: joi_1.default.string().min(2).max(100).messages({
        'string.min': 'Subtitle must be at least 2 characters',
        'string.max': 'Subtitle must not exceed 100 characters'
    }),
    description: joi_1.default.string().min(2).max(1000).messages({
        'string.min': 'Description must be at least 2 characters',
        'string.max': 'Description must not exceed 1000 characters'
    }),
    phone: joi_1.default.string().pattern(/^[+]?[\d\s\-.()]+$/).min(1).max(25).messages({
        'string.pattern.base': 'Please enter a valid phone number',
        'string.min': 'Phone number must be at least 1 character',
        'string.max': 'Phone number must not exceed 25 characters'
    }),
    email: joi_1.default.string().email().messages({
        'string.email': 'Please enter a valid email'
    }),
    web: joi_1.default.string().allow('').optional().messages({
        'string.uri': 'Please enter a valid URL'
    }),
    image: joi_1.default.object({
        url: joi_1.default.string().uri().messages({
            'string.uri': 'Please enter a valid image URL'
        }),
        alt: joi_1.default.string().max(100).messages({
            'string.max': 'Alt text must not exceed 100 characters'
        })
    }),
    address: joi_1.default.object({
        state: joi_1.default.string().max(50).messages({
            'string.max': 'State must not exceed 50 characters'
        }),
        country: joi_1.default.string().max(50).messages({
            'string.max': 'Country must not exceed 50 characters'
        }),
        city: joi_1.default.string().max(50).messages({
            'string.max': 'City must not exceed 50 characters'
        }),
        street: joi_1.default.string().max(100).messages({
            'string.max': 'Street must not exceed 100 characters'
        }),
        houseNumber: joi_1.default.number().integer().min(1).messages({
            'number.min': 'House number must be at least 1',
            'number.integer': 'House number must be an integer'
        }),
        zip: joi_1.default.string().max(20).messages({
            'string.max': 'ZIP code must not exceed 20 characters'
        })
    })
});
exports.createCardValidation = (0, validation_1.validate)(exports.createCardSchema);
exports.updateCardValidation = (0, validation_1.validate)(exports.updateCardSchema);
