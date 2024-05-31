const Joi = require("joi");

const ValidateCourse = Joi.object({
  instructor_id: Joi.string().required(),
  title: Joi.string().required(),
  creation_duration_hours: Joi.string().required(),
  learning_outcomes: Joi.string().required(),
  category: Joi.string().required(),
  modules: Joi.number().required(),
  discount: Joi.number(),
  image: Joi.string().required(),
  rating: Joi.string().required(),
});

module.exports = ValidateCourse;
