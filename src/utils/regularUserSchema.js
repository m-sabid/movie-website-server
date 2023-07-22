const Joi = require('joi');

// User schema using Joi
const userSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  mobileNumber: Joi.string().required(),
  age: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required(),
  profilePicture: Joi.string(),
  gender: Joi.string(),
  role: Joi.string().default('user'),
  password: Joi.string().required(),
  confirmPassword: Joi.string().required().valid(Joi.ref('password'))
}).with('password', 'confirmPassword');

// Function to validate user data against the user schema
function validateUser(newUser) {
  const { error } = userSchema.validate(newUser, { abortEarly: false });
  if (error) {
    const errorMessage = error.details.map((errorItem) => errorItem.message);
    return errorMessage;
  }

  // Remove the confirmPassword field before saving in the database
  delete newUser.confirmPassword;

  return null; // Return null if validation passes (no errors)
}

module.exports = { validateUser };
