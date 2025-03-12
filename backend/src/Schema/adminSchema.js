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

module.exports = { adminSchema };
