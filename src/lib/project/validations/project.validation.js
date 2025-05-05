import Joi from "joi";
import { objectIdValidator } from "../../../utils/objectIdValidatorUtil";

const assignedEmployeeSchema = Joi.object({
  employee: objectIdValidator()
    .required()
    .messages({
      "any.required": "Employee ID is required for assignment.",
      "any.invalid": "Invalid Employee ID.",
    }),
  role: Joi.string()
    .allow("")
    .optional(),
});

export const createProjectSchema = Joi.object({
  client: objectIdValidator()
    .required()
    .messages({
      "any.required": "Client ID is required.",
      "any.invalid": "Invalid Client ID.",
    }),
  title: Joi.string()
    .required()
    .messages({
      "any.required": "Title is required.",
    }),
  description: Joi.string()
    .allow("")
    .optional(),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
  priority: Joi.string()
    .valid("urgent", "high", "normal", "low")
    .default("normal"),
  status: Joi.string()
    .valid("pending", "ongoing", "completed")
    .default("pending"),
  assignedEmployees: Joi.array()
    .items(assignedEmployeeSchema)
    .optional(),
  isArchived: Joi.boolean().optional(),
  createdAt: Joi.date().optional(),
});

export const updateProjectSchema = Joi.object({
  client: objectIdValidator().optional(),
  title: Joi.string().optional(),
  description: Joi.string()
    .allow("")
    .optional(),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
  priority: Joi.string()
    .valid("urgent", "high", "normal", "low")
    .optional(),
  status: Joi.string()
    .valid("pending", "ongoing", "completed")
    .optional(),
  assignedEmployees: Joi.array()
    .items(assignedEmployeeSchema)
    .optional(),
  isArchived: Joi.boolean().optional(),
  createdAt: Joi.date().optional(),
});
