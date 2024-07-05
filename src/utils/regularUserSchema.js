const Joi = require('joi');

// User schema using Joi
const userSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  mobileNumber: Joi.string(),
  age: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/),
  profilePicture: Joi.string(),
  gender: Joi.string(),
  role: Joi.string().default('user'), // Default role set to 'user'
  password: Joi.string(),
  confirmPassword: Joi.string().valid(Joi.ref('password'))
}).with('password', 'confirmPassword');

// Function to validate user data against the user schema
function validateUser(newUser) {
  const { error, value } = userSchema.validate(newUser, { abortEarly: false });
  if (error) {
    const errorMessage = error.details.map((errorItem) => errorItem.message);
    return { errors: errorMessage };
  }

  // Remove the confirmPassword field before saving in the database
  delete value.confirmPassword;

  return { value }; // Return validated user data
}

module.exports = { validateUser };
