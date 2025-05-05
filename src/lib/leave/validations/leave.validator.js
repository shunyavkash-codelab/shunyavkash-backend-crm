import Joi from "joi";
import { objectIdValidator } from "../../../utils/objectIdValidatorUtil";

export const createLeaveSchema = Joi.object({
  employee: objectIdValidator()
    .required()
    .messages({
      "any.required": "Employee ID is required.",
      "any.invalid": "Invalid Employee ID.",
    }),
  leaveType: Joi.string()
    .valid("Sick", "Paid", "Other")
    .required()
    .messages({
      "any.only": "Leave type must be one of: Sick, Paid, or Other.",
      "any.required": "Leave type is required.",
    }),
  startDate: Joi.date()
    .required()
    .messages({
      "any.required": "Start date is required.",
      "date.base": "Start date must be a valid date.",
    }),
  endDate: Joi.date()
    .required()
    .messages({
      "any.required": "End date is required.",
      "date.base": "End date must be a valid date.",
    }),
  reason: Joi.string()
    .optional()
    .allow("")
    .messages({
      "string.base": "Reason must be a string.",
    }),
  status: Joi.string()
    .valid("Pending", "Approved", "Rejected")
    .optional()
    .messages({
      "any.only": "Status must be one of: Pending, Approved, or Rejected.",
    }),
});

export const updateLeaveSchema = Joi.object({
  employee: objectIdValidator().optional(),
  leaveType: Joi.string()
    .valid("Sick", "Paid", "Other")
    .optional(),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
  reason: Joi.string()
    .optional()
    .allow(""),
  status: Joi.string()
    .valid("Pending", "Approved", "Rejected")
    .optional(),
});
