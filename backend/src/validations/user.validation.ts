import Joi from 'joi';

export const registerSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).required().messages({
    'string.min': 'First name must be at least 2 characters',
    'string.max': 'First name must not exceed 50 characters',
    'any.required': 'First name is required'
  }),
  lastName: Joi.string().min(2).max(50).required().messages({
    'string.min': 'Last name must be at least 2 characters',
    'string.max': 'Last name must not exceed 50 characters',
    'any.required': 'Last name is required'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Please enter a valid email',
    'any.required': 'Email is required'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters',
    'any.required': 'Password is required'
  }),
  phone: Joi.string().pattern(/^[\+]?[\d\s\-\.\(\)]+$/).min(1).max(25).messages({
    'string.pattern.base': 'Please enter a valid phone number'
  }),
  isBusiness: Joi.boolean().default(false)
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please enter a valid email',
    'any.required': 'Email is required'
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required'
  })
});

export const updateUserSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).messages({
    'string.min': 'First name must be at least 2 characters',
    'string.max': 'First name must not exceed 50 characters'
  }),
  lastName: Joi.string().min(2).max(50).messages({
    'string.min': 'Last name must be at least 2 characters',
    'string.max': 'Last name must not exceed 50 characters'
  }),
  phone: Joi.string().pattern(/^[\+]?[\d\s\-\.\(\)]+$/).min(1).max(25).messages({
    'string.pattern.base': 'Please enter a valid phone number'
  })
});
