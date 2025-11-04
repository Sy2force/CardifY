import Joi from 'joi';
import { validate } from '../middlewares/validation';

export const createCardSchema = Joi.object({
  title: Joi.string().min(2).max(100).required().messages({
    'string.min': 'Title must be at least 2 characters',
    'string.max': 'Title must not exceed 100 characters',
    'any.required': 'Title is required'
  }),
  subtitle: Joi.string().min(2).max(100).optional().messages({
    'string.min': 'Subtitle must be at least 2 characters',
    'string.max': 'Subtitle must not exceed 100 characters'
  }),
  description: Joi.string().min(2).max(1000).optional().messages({
    'string.min': 'Description must be at least 2 characters',
    'string.max': 'Description must not exceed 1000 characters'
  }),
  phone: Joi.string().pattern(/^[\+]?[1-9][\d]{0,15}$/).required().messages({
    'string.pattern.base': 'Please enter a valid phone number',
    'any.required': 'Phone is required'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Please enter a valid email',
    'any.required': 'Email is required'
  }),
  web: Joi.string().uri().allow('').optional().messages({
    'string.uri': 'Please enter a valid URL'
  }),
  image: Joi.object({
    url: Joi.string().uri().messages({
      'string.uri': 'Please enter a valid image URL'
    }),
    alt: Joi.string().max(100).messages({
      'string.max': 'Alt text must not exceed 100 characters'
    })
  }).optional(),
  address: Joi.object({
    state: Joi.string().max(50).allow('').optional().messages({
      'string.max': 'State must not exceed 50 characters'
    }),
    country: Joi.string().min(2).max(50).allow('').optional().messages({
      'string.min': 'Country must be at least 2 characters',
      'string.max': 'Country must not exceed 50 characters'
    }),
    city: Joi.string().min(2).max(50).allow('').optional().messages({
      'string.min': 'City must be at least 2 characters',
      'string.max': 'City must not exceed 50 characters'
    }),
    street: Joi.string().min(2).max(100).allow('').optional().messages({
      'string.min': 'Street must be at least 2 characters',
      'string.max': 'Street must not exceed 100 characters'
    }),
    houseNumber: Joi.string().min(1).max(20).allow('').optional().messages({
      'string.min': 'House number must be at least 1 character',
      'string.max': 'House number must not exceed 20 characters'
    }),
    zip: Joi.string().max(10).allow('').optional().messages({
      'string.max': 'ZIP code must not exceed 10 characters'
    })
  }).allow(null).optional()
});

export const updateCardSchema = Joi.object({
  title: Joi.string().min(2).max(100).messages({
    'string.min': 'Title must be at least 2 characters',
    'string.max': 'Title must not exceed 100 characters'
  }),
  subtitle: Joi.string().min(2).max(100).messages({
    'string.min': 'Subtitle must be at least 2 characters',
    'string.max': 'Subtitle must not exceed 100 characters'
  }),
  description: Joi.string().min(2).max(1000).messages({
    'string.min': 'Description must be at least 2 characters',
    'string.max': 'Description must not exceed 1000 characters'
  }),
  phone: Joi.string().pattern(/^[\+]?[\d\s\-\.\(\)]+$/).min(1).max(25).messages({
    'string.pattern.base': 'Please enter a valid phone number',
    'string.min': 'Phone number must be at least 1 character',
    'string.max': 'Phone number must not exceed 25 characters'
  }),
  email: Joi.string().email().messages({
    'string.email': 'Please enter a valid email'
  }),
  web: Joi.string().allow('').optional().messages({
    'string.uri': 'Please enter a valid URL'
  }),
  image: Joi.object({
    url: Joi.string().uri().messages({
      'string.uri': 'Please enter a valid image URL'
    }),
    alt: Joi.string().max(100).messages({
      'string.max': 'Alt text must not exceed 100 characters'
    })
  }),
  address: Joi.object({
    state: Joi.string().max(50).messages({
      'string.max': 'State must not exceed 50 characters'
    }),
    country: Joi.string().max(50).messages({
      'string.max': 'Country must not exceed 50 characters'
    }),
    city: Joi.string().max(50).messages({
      'string.max': 'City must not exceed 50 characters'
    }),
    street: Joi.string().max(100).messages({
      'string.max': 'Street must not exceed 100 characters'
    }),
    houseNumber: Joi.number().integer().min(1).messages({
      'number.min': 'House number must be at least 1',
      'number.integer': 'House number must be an integer'
    }),
    zip: Joi.string().max(20).messages({
      'string.max': 'ZIP code must not exceed 20 characters'
    })
  })
});

// Export validation functions for middleware use
export const createCardValidation = validate(createCardSchema);
export const updateCardValidation = validate(updateCardSchema);
