const Joi = require("joi");

const adminSchema = Joi.object({
  username: Joi.string()
    .min(3)
    .max(30)
    .required()
    .pattern(new RegExp("^[a-zA-Z0-9_ ]+$"))
    .messages({
      "string.pattern.base":
        "Username can only contain letters, numbers, spaces and underscores",
      "string.min": "Username must be at least 3 characters long",
      "string.max": "Username cannot be longer than 30 characters",
      "any.required": "Username is required",
    }),
  password: Joi.string()
    .required()
    .min(8)
    .pattern(
      new RegExp(
        /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-])[A-Za-z\d!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]{8,}$/
      )
    )
    .messages({
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one number, one special character, and be at least 8 characters long",
      "string.min": "Password must be at least 8 characters long",
      "any.required": "Password is required",
    }),
});

const updateInstructorRightsSchema = Joi.object({
  instructor_id: Joi.number().required(),
  rights: Joi.object({
    courses_rights: Joi.boolean().optional(),
    live_session_rights: Joi.boolean().optional(),
    career_counselling_rights: Joi.boolean().optional(),
  })
    .required()
    .min(1)
    .messages({
      "object.unknown":
        "Only courses_rights, live_session_rights, and career_counselling_rights can be updated",
      "object.min": "At least one right must be specified",
    }),
});

module.exports = {
  adminSchema,
  updateInstructorRightsSchema,
};
