const Joi = require('joi');

const ValidateContactUs = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(new RegExp(/^\d{11}$/)).required().messages({
    'string.pattern.base': 'Please provide a valid 11-digit phone number',
    'any.required': 'Phone number is required'
  }),
  subject: Joi.string().required(),
  text: Joi.string().required(),
  source: Joi.string().required()
});

module.exports = ValidateContactUs;
