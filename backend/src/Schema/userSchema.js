const Joi = require('joi');

const ValidateUser = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().pattern(new RegExp(/(\w+|\.+\w+){1,10}@[a-zA-Z0-9]+\.([a-zA-Z0-9]+|\.[a-zA-Z0-9]+){1,3}/)).required().messages({
        'string.pattern.base': 'Please provide a valid email address',
        'any.required': 'Email is required'
    }),
    password: Joi.string().required().pattern(new RegExp(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)).messages({
        'string.pattern.base': 'Password must contain at least one letter, one number, one special character, and be at least 8 characters long',
        'any.required': 'Password is required'
    }),
    profession: Joi.string().required(),
    source: Joi.string()
});

const loginValidation = Joi.object({
    email: Joi.string().pattern(new RegExp(/(\w+|\.+\w+){1,10}@[a-zA-Z0-9]+\.([a-zA-Z0-9]+|\.[a-zA-Z0-9]+){1,3}/)).required().messages({
        'string.pattern.base': 'Please provide a valid email address',
        'any.required': 'Email is required'
    }),
    password: Joi.string().required()
})

module.exports = {ValidateUser, loginValidation};
