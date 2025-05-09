import mongoose from 'mongoose';
import Joi from 'joi';

export const objectIdValidator = () =>
  Joi.string().custom((value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      return helpers.error('any.invalid');
    }
    return value;
  }, 'ObjectId validation');
