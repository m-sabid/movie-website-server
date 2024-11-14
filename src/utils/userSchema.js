const Joi = require('joi');

// User schema using Joi
const userSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),  // Password should be at least 6 characters
  displayName: Joi.string().required(),
}).options({ presence: 'required' });

module.exports = { userSchema };
