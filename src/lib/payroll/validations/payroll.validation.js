import Joi from "joi";
import { objectIdValidator } from "../../../utils/objectIdValidatorUtil";

export const createPayrollSchema = Joi.object({
  employee: objectIdValidator()
    .required()
    .messages({
      "any.required": "Employee ID is required.",
      "any.invalid": "Invalid Employee ID.",
    }),
  month: Joi.number()
    .integer()
    .min(1)
    .max(12)
    .required()
    .messages({
      "number.base": "Month must be a number between 1 and 12.",
      "number.min": "Month must be at least 1.",
      "number.max": "Month must be at most 12.",
      "any.required": "Month is required.",
    }),
  year: Joi.number()
    .integer()
    .min(2000)
    .required()
    .messages({
      "number.base": "Year must be a number.",
      "any.required": "Year is required.",
    }),
  presentDays: Joi.number()
    .min(0)
    .default(0),
  absentDays: Joi.number()
    .min(0)
    .default(0),
  leaveDays: Joi.number()
    .min(0)
    .default(0),
  basicSalary: Joi.number()
    .min(0)
    .required()
    .messages({
      "number.base": "Basic salary must be a number.",
      "any.required": "Basic salary is required.",
    }),
  bonuses: Joi.number()
    .min(0)
    .default(0),
  deductions: Joi.number()
    .min(0)
    .default(0),
  netSalary: Joi.number()
    .min(0)
    .required()
    .messages({
      "number.base": "Net salary must be a number.",
      "any.required": "Net salary is required.",
    }),
  status: Joi.string()
    .valid("Generated", "Paid")
    .optional(),
  generatedAt: Joi.date().optional(),
});

export const updatePayrollSchema = Joi.object({
  employee: objectIdValidator().optional(),
  month: Joi.number()
    .integer()
    .min(1)
    .max(12)
    .optional(),
  year: Joi.number()
    .integer()
    .min(2000)
    .optional(),
  presentDays: Joi.number()
    .min(0)
    .optional(),
  absentDays: Joi.number()
    .min(0)
    .optional(),
  leaveDays: Joi.number()
    .min(0)
    .optional(),
  basicSalary: Joi.number()
    .min(0)
    .optional(),
  bonuses: Joi.number()
    .min(0)
    .optional(),
  deductions: Joi.number()
    .min(0)
    .optional(),
  netSalary: Joi.number()
    .min(0)
    .optional(),
  status: Joi.string()
    .valid("Generated", "Paid")
    .optional(),
  generatedAt: Joi.date().optional(),
});
