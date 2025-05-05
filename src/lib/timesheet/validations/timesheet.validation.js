import Joi from "joi";
import { objectIdValidator } from "../../../utils/objectIdValidatorUtil";

export const createTimesheetSchema = Joi.object({
  user: objectIdValidator()
    .required()
    .messages({
      "any.required": "User ID is required.",
      "any.invalid": "Invalid User ID.",
    }),
  employee: objectIdValidator()
    .optional()
    .messages({
      "any.invalid": "Invalid Employee ID.",
    }),
  project: objectIdValidator()
    .required()
    .messages({
      "any.required": "Project ID is required.",
      "any.invalid": "Invalid Project ID.",
    }),
  date: Joi.date()
    .required()
    .messages({
      "any.required": "Date is required.",
    }),
  hoursWorked: Joi.number()
    .min(0)
    .required()
    .messages({
      "any.required": "Hours worked is required.",
      "number.min": "Hours worked cannot be negative.",
    }),
  description: Joi.array()
    .items(Joi.string())
    .default([])
    .optional(),
  status: Joi.string()
    .valid("pending", "approved", "rejected")
    .default("pending")
    .optional(),
  isFinalized: Joi.boolean()
    .default(false)
    .optional(),
  createdAt: Joi.date().optional(),
});

export const updateTimesheetSchema = Joi.object({
  user: objectIdValidator().optional(),
  employee: objectIdValidator()
    .optional()
    .messages({
      "any.invalid": "Invalid Employee ID.",
    }),
  project: objectIdValidator().optional(),
  date: Joi.date().optional(),
  hoursWorked: Joi.number()
    .min(0)
    .optional()
    .messages({
      "number.min": "Hours worked cannot be negative.",
    }),
  description: Joi.array()
    .items(Joi.string())
    .optional(),
  status: Joi.string()
    .valid("pending", "approved", "rejected")
    .optional(),
  isFinalized: Joi.boolean().optional(),
  createdAt: Joi.date().optional(),
});
