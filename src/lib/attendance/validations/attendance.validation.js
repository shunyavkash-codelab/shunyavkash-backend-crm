import Joi from "joi";
import { objectId } from "../../../utils/objectIdValidatorUtil";

export const createAttendanceSchema = Joi.object({
  employee: Joi.string()
    .custom(objectId)
    .required()
    .messages({
      "any.required": "Employee ID is required",
      "string.base": "Employee must be a string",
    }),
  date: Joi.date()
    .optional()
    .messages({
      "date.base": "Date must be a valid date",
    }),
  checkIn: Joi.date()
    .optional()
    .messages({
      "date.base": "Check-in must be a valid date",
    }),
  checkOut: Joi.date()
    .optional()
    .messages({
      "date.base": "Check-out must be a valid date",
    }),
  status: Joi.string()
    .valid("Present", "Absent", "Leave")
    .default("Absent")
    .messages({
      "string.base": "Status must be a string",
      "any.only": "Status must be one of Present, Absent, or Leave",
    }),
  note: Joi.string()
    .optional()
    .allow("")
    .messages({
      "string.base": "Note must be a string",
    }),
});

export const updateAttendanceSchema = Joi.object({
  employee: Joi.string()
    .custom(objectId)
    .optional(),
  date: Joi.date().optional(),
  checkIn: Joi.date().optional(),
  checkOut: Joi.date().optional(),
  status: Joi.string()
    .valid("Present", "Absent", "Leave")
    .optional(),
  note: Joi.string()
    .optional()
    .allow(""),
});
