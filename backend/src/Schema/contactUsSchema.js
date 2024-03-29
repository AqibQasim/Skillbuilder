const Joi = require('joi');

const ValidateContactUs = Joi.object({
  FirstName: Joi.string().required(),
  LastName: Joi.string().required(),
  email: Joi.string().email().required(),
  Phone: Joi.string().pattern(new RegExp(/^\d{11}$/)).required().messages({
    'string.pattern.base': 'Please provide a valid 11-digit phone number',
    'any.required': 'Phone number is required'
  }),
  Subject: Joi.string().required(),
  Text: Joi.string().required(),
  Here_From: Joi.string().required()
});

module.exports = ValidateContactUs;
