import Joi from 'joi';
import { validate } from '../middlewares/validation';

export const registerSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).required().messages({
    'string.min': 'Le prénom doit contenir au moins 2 caractères',
    'string.max': 'Le prénom ne doit pas dépasser 50 caractères',
    'any.required': 'Le prénom est requis'
  }),
  lastName: Joi.string().min(2).max(50).required().messages({
    'string.min': 'Le nom doit contenir au moins 2 caractères',
    'string.max': 'Le nom ne doit pas dépasser 50 caractères',
    'any.required': 'Le nom est requis'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Veuillez entrer un email valide',
    'any.required': 'L\'email est requis'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Le mot de passe doit contenir au moins 6 caractères',
    'any.required': 'Le mot de passe est requis'
  }),
  phone: Joi.string().pattern(/^[+]?[\d\s\-.()]+$/).min(1).max(25).allow('').messages({
    'string.pattern.base': 'Veuillez entrer un numéro de téléphone valide'
  }),
  isBusiness: Joi.boolean().default(false),
  isAdmin: Joi.boolean().default(false)
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Veuillez entrer un email valide',
    'any.required': 'L\'email est requis'
  }),
  password: Joi.string().required().messages({
    'any.required': 'Le mot de passe est requis'
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
  phone: Joi.string().pattern(/^[+]?[\d\s\-.()]+$/).min(1).max(25).messages({
    'string.pattern.base': 'Please enter a valid phone number'
  })
});

// Export validation functions for middleware use
export const registerValidation = validate(registerSchema);
export const loginValidation = validate(loginSchema);
export const updateProfileValidation = validate(updateUserSchema);
