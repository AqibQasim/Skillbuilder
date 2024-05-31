const Joi = require('joi');


const addToCartSchema = Joi.object({
    body: Joi.object({
        userId: Joi.number().required(),
        courseId: Joi.number().required()
    }).required()
});




module.exports = {
    addToCartSchema
}