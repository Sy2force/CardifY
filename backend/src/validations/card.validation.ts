// Validations cartes - Schémas Joi pour les données de cartes professionnelles
import Joi from 'joi';
import { validate } from '../middlewares/validation';

// Schéma de validation pour la création d'une carte
export const createCardSchema = Joi.object({
  title: Joi.string().min(2).max(100).required().messages({
    'string.min': 'Le titre doit contenir au moins 2 caractères',
    'string.max': 'Le titre ne doit pas dépasser 100 caractères',
    'any.required': 'Le titre est requis'
  }),
  subtitle: Joi.string().min(2).max(100).optional().messages({
    'string.min': 'Le sous-titre doit contenir au moins 2 caractères',
    'string.max': 'Le sous-titre ne doit pas dépasser 100 caractères'
  }),
  description: Joi.string().min(2).max(1000).optional().messages({
    'string.min': 'La description doit contenir au moins 2 caractères',
    'string.max': 'La description ne doit pas dépasser 1000 caractères'
  }),
  phone: Joi.string().pattern(/^[+]?[1-9][\d]{0,15}$/).required().messages({
    'string.pattern.base': 'Veuillez entrer un numéro de téléphone valide',
    'any.required': 'Le téléphone est requis'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Veuillez entrer un email valide',
    'any.required': 'L\'email est requis'
  }),
  web: Joi.string().uri().allow('').optional().messages({
    'string.uri': 'Veuillez entrer une URL valide'
  }),
  image: Joi.object({
    url: Joi.string().uri().messages({
      'string.uri': 'Veuillez entrer une URL d\'image valide'
    }),
    alt: Joi.string().max(100).messages({
      'string.max': 'Le texte alternatif ne doit pas dépasser 100 caractères'
    })
  }).optional(), // Image optionnelle avec URL et texte alt
  address: Joi.object({
    state: Joi.string().max(50).allow('').optional().messages({
      'string.max': 'L\'\u00e9tat ne doit pas dépasser 50 caractères'
    }),
    country: Joi.string().min(2).max(50).allow('').optional().messages({
      'string.min': 'Le pays doit contenir au moins 2 caractères',
      'string.max': 'Le pays ne doit pas dépasser 50 caractères'
    }),
    city: Joi.string().min(2).max(50).allow('').optional().messages({
      'string.min': 'La ville doit contenir au moins 2 caractères',
      'string.max': 'La ville ne doit pas dépasser 50 caractères'
    }),
    street: Joi.string().min(2).max(100).allow('').optional().messages({
      'string.min': 'La rue doit contenir au moins 2 caractères',
      'string.max': 'La rue ne doit pas dépasser 100 caractères'
    }),
    houseNumber: Joi.string().min(1).max(20).allow('').optional().messages({
      'string.min': 'Le numéro de maison doit contenir au moins 1 caractère',
      'string.max': 'Le numéro de maison ne doit pas dépasser 20 caractères'
    }),
    zip: Joi.string().max(10).allow('').optional().messages({
      'string.max': 'Le code postal ne doit pas dépasser 10 caractères'
    })
  }).allow(null).optional() // Adresse complète optionnelle
});

// Schéma de validation pour la mise à jour d'une carte
export const updateCardSchema = Joi.object({
  title: Joi.string().min(2).max(100).messages({
    'string.min': 'Le titre doit contenir au moins 2 caractères',
    'string.max': 'Le titre ne doit pas dépasser 100 caractères'
  }),
  subtitle: Joi.string().min(2).max(100).messages({
    'string.min': 'Le sous-titre doit contenir au moins 2 caractères',
    'string.max': 'Le sous-titre ne doit pas dépasser 100 caractères'
  }),
  description: Joi.string().min(2).max(1000).messages({
    'string.min': 'La description doit contenir au moins 2 caractères',
    'string.max': 'La description ne doit pas dépasser 1000 caractères'
  }),
  phone: Joi.string().pattern(/^[+]?[\d\s\-.()]+$/).min(1).max(25).messages({
    'string.pattern.base': 'Veuillez entrer un numéro de téléphone valide',
    'string.min': 'Le numéro de téléphone doit contenir au moins 1 caractère',
    'string.max': 'Le numéro de téléphone ne doit pas dépasser 25 caractères'
  }),
  email: Joi.string().email().messages({
    'string.email': 'Veuillez entrer un email valide'
  }),
  web: Joi.string().allow('').optional().messages({
    'string.uri': 'Veuillez entrer une URL valide'
  }),
  image: Joi.object({
    url: Joi.string().uri().messages({
      'string.uri': 'Veuillez entrer une URL d\'image valide'
    }),
    alt: Joi.string().max(100).messages({
      'string.max': 'Le texte alternatif ne doit pas dépasser 100 caractères'
    })
  }),
  address: Joi.object({
    state: Joi.string().max(50).messages({
      'string.max': 'L\'\u00e9tat ne doit pas dépasser 50 caractères'
    }),
    country: Joi.string().max(50).messages({
      'string.max': 'Le pays ne doit pas dépasser 50 caractères'
    }),
    city: Joi.string().max(50).messages({
      'string.max': 'La ville ne doit pas dépasser 50 caractères'
    }),
    street: Joi.string().max(100).messages({
      'string.max': 'La rue ne doit pas dépasser 100 caractères'
    }),
    houseNumber: Joi.number().integer().min(1).messages({
      'number.min': 'Le numéro de maison doit être au moins 1',
      'number.integer': 'Le numéro de maison doit être un entier'
    }),
    zip: Joi.string().max(20).messages({
      'string.max': 'Le code postal ne doit pas dépasser 20 caractères'
    })
  })
});

// Export des fonctions de validation pour les middlewares
export const createCardValidation = validate(createCardSchema); // Validation création carte
export const updateCardValidation = validate(updateCardSchema); // Validation mise à jour carte
