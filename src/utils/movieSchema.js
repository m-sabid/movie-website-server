const Joi = require('joi');

// Movie schema using Joi
const movieSchema = Joi.object({
  movieName: Joi.string().required(),
  directedBy: Joi.string().required(),
  releaseDate: Joi.date().iso().required(),
  language: Joi.array().items(Joi.string().required()).required(),
  industry: Joi.string().required(),
  country: Joi.string().required(),
  starCast: Joi.string().required(),
  imdbRating: Joi.number().min(0).max(10).required(),
  poster: Joi.string().required(),
  downloadLink: Joi.string().required(),
  screenShort: Joi.string().required(),
  plot: Joi.string().required(),
}).options({ presence: 'required' });

module.exports = { movieSchema };
