import Joi from 'joi';
import { objectIdValidator } from '../../../utils/objectIdValidator.util.js';

export const updateInterviewSchema = Joi.object({
  candidateName: Joi.string().trim().optional(),
  candidateEmail: Joi.string().email().optional(),
  position: Joi.string().trim().optional(),
  interviewDate: Joi.date().optional(),
  interviewTime: Joi.string().trim().optional(),
  interviewer: objectIdValidator().optional().messages({
    'any.invalid': 'Invalid interviewer ID.'
  }),
  status: Joi.string().valid('Scheduled', 'Completed', 'Cancelled').optional(),
  mode: Joi.string().valid('Online', 'Offline').optional(),
  resume: Joi.object({
    name: Joi.string().optional(),
    url: Joi.string().uri().optional()
  }).optional(),
  resumePublicId: Joi.string().optional(),
  feedback: Joi.string().allow('').optional()
});
