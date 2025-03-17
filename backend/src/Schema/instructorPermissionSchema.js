const Joi = require("joi");

const createPermissionSchema = Joi.object({
  instructor_id: Joi.number().required().messages({
    "number.base": "Instructor ID must be a number",
    "any.required": "Instructor ID is required",
  }),
  type: Joi.string()
    .valid("courses", "live_sessions", "career_counselling")
    .required()
    .messages({
      "string.base": "Type must be a string",
      "any.only":
        "Type must be one of: courses, live_sessions, career_counselling",
      "any.required": "Type is required",
    }),
});

const updatePermissionSchema = Joi.object({
  id: Joi.number().required().messages({
    "number.base": "Permission ID must be a number",
    "any.required": "Permission ID is required",
  }),
});

const historyRequestSchema = Joi.object({
  instructor_id: Joi.number().required().messages({
    "number.base": "Instructor ID must be a number",
    "any.required": "Instructor ID is required",
  }),
  type: Joi.string()
    .valid("courses", "live_sessions", "career_counselling")
    .required()
    .messages({
      "string.base": "Type must be a string",
      "any.only":
        "Type must be one of: courses, live_sessions, career_counselling",
      "any.required": "Type is required",
    }),
});

module.exports = {
  createPermissionSchema,
  updatePermissionSchema,
  historyRequestSchema,
};
