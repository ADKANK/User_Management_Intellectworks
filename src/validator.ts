import Joi from 'joi';

export const registerUserSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Email must be a valid email address.',
    'any.required': 'Email is required.',
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters long.',
    'any.required': 'Password is required.',
  }),
  name: Joi.string().min(2).required().messages({
    'string.min': 'Name must be at least 2 characters long.',
    'any.required': 'Name is required.',
  }),
});

export const editUserSchema = Joi.object({
  email: Joi.string().email().optional(),
  name: Joi.string().min(2).optional(),
}).or('email', 'name').messages({
  'object.missing': 'At least one field (email or name) must be provided for update.',
});

export const deleteUserSchema = Joi.object({
  userId: Joi.string().required().messages({
    'any.required': 'User ID is required for deletion.',
  }),
});

export const saveNoteSchema = Joi.object({
    title: Joi.string().min(1).required().messages({
        'string.empty': 'Title is required',
        'any.required': 'Title is required',
      }),
      content: Joi.string().min(1).required().messages({
        'string.empty': 'Content is required',
        'any.required': 'Content is required',
      }),
  });
