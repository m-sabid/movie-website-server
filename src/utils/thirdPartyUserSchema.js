const Joi = require('joi');

const thirdPartyUserSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  mobileNumber: Joi.string(),
  age: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/),
  profilePicture: Joi.string(),
  gender: Joi.string(),
  role: Joi.string().default('user'),
});

module.exports = thirdPartyUserSchema;
