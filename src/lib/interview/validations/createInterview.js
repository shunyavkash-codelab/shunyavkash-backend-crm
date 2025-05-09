import Joi from 'joi';
import { objectIdValidator } from '../../../utils/objectIdValidator.util.js';

export const createInterviewSchema = Joi.object({
  candidateName: Joi.string().trim().required().messages({
    'string.empty': 'Candidate name is required.'
  }),
  candidateEmail: Joi.string().email().required().messages({
    'string.empty': 'Candidate email is required.',
    'string.email': 'Please provide a valid email.'
  }),
  position: Joi.string().trim().required().messages({
    'string.empty': 'Position is required.'
  }),
  interviewDate: Joi.date().required().messages({
    'date.base': 'Invalid interview date.',
    'any.required': 'Interview date is required.'
  }),
  interviewTime: Joi.string().trim().required().messages({
    'string.empty': 'Interview time is required.'
  }),
  interviewer: objectIdValidator().required().messages({
    'any.invalid': 'Invalid interviewer ID.',
    'any.required': 'Interviewer ID is required.'
  }),
  status: Joi.string().valid('Scheduled', 'Completed', 'Cancelled').optional(),
  mode: Joi.string().valid('Online', 'Offline').required().messages({
    'any.required': 'Interview mode is required.',
    'any.only': 'Mode must be Online or Offline.'
  }),
  resume: Joi.object({
    name: Joi.string().optional(),
    url: Joi.string().uri().optional()
  }).optional(),
  resumePublicId: Joi.string().optional(),
  feedback: Joi.string().allow('').optional()
});
