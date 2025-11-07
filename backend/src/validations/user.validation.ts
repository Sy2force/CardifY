// Validations utilisateur - Schémas Joi pour les données d'entrée
import Joi from 'joi';
import { validate } from '../middlewares/validation';

// Schéma de validation pour l'inscription
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
  isBusiness: Joi.boolean().default(false), // Compte business par défaut false
  isAdmin: Joi.boolean().default(false)     // Admin par défaut false
});

// Schéma de validation pour la connexion
export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Veuillez entrer un email valide',
    'any.required': 'L\'email est requis'
  }),
  password: Joi.string().required().messages({
    'any.required': 'Le mot de passe est requis'
  })
});

// Schéma de validation pour la mise à jour du profil
export const updateUserSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).messages({
    'string.min': 'Le prénom doit contenir au moins 2 caractères',
    'string.max': 'Le prénom ne doit pas dépasser 50 caractères'
  }),
  lastName: Joi.string().min(2).max(50).messages({
    'string.min': 'Le nom doit contenir au moins 2 caractères',
    'string.max': 'Le nom ne doit pas dépasser 50 caractères'
  }),
  phone: Joi.string().pattern(/^[+]?[\d\s\-.()]+$/).min(1).max(25).messages({
    'string.pattern.base': 'Veuillez entrer un numéro de téléphone valide'
  })
});

// Export des fonctions de validation pour les middlewares
export const registerValidation = validate(registerSchema);     // Validation inscription
export const loginValidation = validate(loginSchema);           // Validation connexion
export const updateProfileValidation = validate(updateUserSchema); // Validation mise à jour
