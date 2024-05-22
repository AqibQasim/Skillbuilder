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


// Route: /contact-us
const contactUsSchema = {
  schema: {
    description: "Contact us",
    tags: ["contact"],
    summary: "Contact Us",
    body: {
      type: "object",
      properties: {
        firstName: { type: "string" },
        lastName: { type: "string" },
        email: { type: "string", format: "email" },
        phone: { type: "string" },
        subject: { type: "string" },
        text: { type: "string" },
        source: { type: "string" }
      },
      required: ["firstName", "lastName", "email", "phone", "subject", "text", "source"]
    },
    response: {
      200: {
        description: "Message successfully sent",
        type: "object",
        properties: {
          success: { type: "boolean" },
          message: { type: "string" }
        }
      },
      default: {
        description: "Unexpected error",
        type: "object",
        properties: {
          message: { type: "string" }
        }
      }
    }
  }
};



module.exports = { ValidateContactUs, contactUsSchema };
