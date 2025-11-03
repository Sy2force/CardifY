import Joi from 'joi';

export const createCardSchema = Joi.object({
  title: Joi.string().min(2).max(100).required().messages({
    'string.min': 'Title must be at least 2 characters',
    'string.max': 'Title must not exceed 100 characters',
    'any.required': 'Title is required'
  }),
  subtitle: Joi.string().min(2).max(100).required().messages({
    'string.min': 'Subtitle must be at least 2 characters',
    'string.max': 'Subtitle must not exceed 100 characters',
    'any.required': 'Subtitle is required'
  }),
  description: Joi.string().min(2).max(1000).required().messages({
    'string.min': 'Description must be at least 2 characters',
    'string.max': 'Description must not exceed 1000 characters',
    'any.required': 'Description is required'
  }),
  phone: Joi.string().pattern(/^[\+]?[1-9][\d]{0,15}$/).required().messages({
    'string.pattern.base': 'Please enter a valid phone number',
    'any.required': 'Phone is required'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Please enter a valid email',
    'any.required': 'Email is required'
  }),
  web: Joi.string().uri().messages({
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
    country: Joi.string().min(2).max(50).required().messages({
      'string.min': 'Country must be at least 2 characters',
      'string.max': 'Country must not exceed 50 characters',
      'any.required': 'Country is required'
    }),
    city: Joi.string().min(2).max(50).required().messages({
      'string.min': 'City must be at least 2 characters',
      'string.max': 'City must not exceed 50 characters',
      'any.required': 'City is required'
    }),
    street: Joi.string().min(2).max(100).required().messages({
      'string.min': 'Street must be at least 2 characters',
      'string.max': 'Street must not exceed 100 characters',
      'any.required': 'Street is required'
    }),
    houseNumber: Joi.string().min(1).max(20).required().messages({
      'string.min': 'House number is required',
      'string.max': 'House number must not exceed 20 characters',
      'any.required': 'House number is required'
    }),
    zip: Joi.string().max(10).messages({
      'string.max': 'ZIP code must not exceed 10 characters'
    })
  }).required()
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
  phone: Joi.string().pattern(/^[\+]?[1-9][\d]{0,15}$/).messages({
    'string.pattern.base': 'Please enter a valid phone number'
  }),
  email: Joi.string().email().messages({
    'string.email': 'Please enter a valid email'
  }),
  web: Joi.string().uri().messages({
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
    country: Joi.string().min(2).max(50).messages({
      'string.min': 'Country must be at least 2 characters',
      'string.max': 'Country must not exceed 50 characters'
    }),
    city: Joi.string().min(2).max(50).messages({
      'string.min': 'City must be at least 2 characters',
      'string.max': 'City must not exceed 50 characters'
    }),
    street: Joi.string().min(2).max(100).messages({
      'string.min': 'Street must be at least 2 characters',
      'string.max': 'Street must not exceed 100 characters'
    }),
    houseNumber: Joi.string().min(1).max(20).messages({
      'string.min': 'House number is required',
      'string.max': 'House number must not exceed 20 characters'
    }),
    zip: Joi.string().max(10).messages({
      'string.max': 'ZIP code must not exceed 10 characters'
    })
  })
});
