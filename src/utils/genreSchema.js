const Jio = require("jio");


const genreSchema = Jio.Object({
    genre: Joi.string().required(),
})