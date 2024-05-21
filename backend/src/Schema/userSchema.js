const Joi = require("joi");

const ValidateUser = Joi.object({
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  email: Joi.string()
    .pattern(new RegExp(/(\w+|\.+\w+){1,10}@[a-zA-Z0-9]+\.([a-zA-Z0-9]+|\.[a-zA-Z0-9]+){1,3}/))
    .required()
    .messages({
      "string.pattern.base": "Please provide a valid email address",
      "any.required": "Email is required",
    }),
  password: Joi.string()
    .required()
    .pattern(new RegExp(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/))
    .messages({
      "string.pattern.base": "Password must contain at least one letter, one number, one special character, and be at least 8 characters long",
      "any.required": "Password is required",
    }),
  profession: Joi.string().required(),
  source: Joi.string(),
});

const loginValidation = Joi.object({
  email: Joi.string()
    .pattern(new RegExp(/(\w+|\.+\w+){1,10}@[a-zA-Z0-9]+\.([a-zA-Z0-9]+|\.[a-zA-Z0-9]+){1,3}/))
    .required()
    .messages({
      "string.pattern.base": "Please provide a valid email address",
      "any.required": "Email is required",
    }),
  password: Joi.string().required(),
});

const validateEmailAndPassword = Joi.object({
  password: Joi.string()
    .required()
    .pattern(new RegExp(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/))
    .messages({
      "string.pattern.base": "Password must contain at least one letter, one number, one special character, and be at least 8 characters long",
      "any.required": "Password is required",
    }),
  email: Joi.string()
    .pattern(new RegExp(/(\w+|\.+\w+){1,10}@[a-zA-Z0-9]+\.([a-zA-Z0-9]+|\.[a-zA-Z0-9]+){1,3}/))
    .required()
    .messages({
      "string.pattern.base": "Please provide a valid email address",
      "any.required": "Email is required",
    }),
});

const updateProfileValidation = Joi.object({
  id: Joi.number().required(),
  name: Joi.string(),
  email: Joi.string()
    .pattern(new RegExp(/(\w+|\.+\w+){1,10}@[a-zA-Z0-9]+\.([a-zA-Z0-9]+|\.[a-zA-Z0-9]+){1,3}/))
    .messages({
      "string.pattern.base": "Please provide a valid email address",
    }),
  password: Joi.string()
    .pattern(new RegExp(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/))
    .messages({
      "string.pattern.base": "Password must contain at least one letter, one number, one special character, and be at least 8 characters long",
    }),
  profession: Joi.string(),
  location: Joi.string(),
  twitter_profile: Joi.string(),
  facebook_profile: Joi.string(),
  linkedin_profile: Joi.string(),
});

const userSwaggerSchema = {
  schema: {
    description: "post signup data",
    // tags: ["user", "code"],
    // summary: "qwerty",
    // params: {
    //   type: "object",
    //   properties: {
    //     id: {
    //       type: "number",
    //       description: "user id",
    //     },
    //   },
    // },
    body: {
      type: "object",
      properties: {
        first_name: { type: "string", default: "Jason"},
        last_name: { type: "string", default: "Roy" },
        email: { type: "string", default: "test@gmail.com" },
        password: { type: "string", default: "Password@12345" },
        profession: { type: "string", default: "software engineer" },
        source: { type: "string", default: "" },
        obj: {
          type: "object",
          properties: {
            some: { type: "string" },
          },
        },
      },
    },
    response: {
      201: {
        description: "Successful response",
        type: "object",
        properties: {
          hello: { type: "string" },
        },
      },
      default: {
        description: "Default response",
        type: "object",
        properties: {
          foo: { type: "string" },
        },
      },
    },
    // security: [
    //   {
    //     apiKey: [],
    //   },
    // ],
  },
};

module.exports = {
  ValidateUser,
  loginValidation,
  validateEmailAndPassword,
  updateProfileValidation,
  userSwaggerSchema
};
