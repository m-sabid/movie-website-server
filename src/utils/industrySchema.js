const Jio = require("jio");

const industrySchema = Jio.Object({
  industry: Joi.string().required(),
});
