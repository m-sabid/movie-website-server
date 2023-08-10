const Jio = require("jio");


const languageSchema = Jio.Object({
    language: Joi.string().required(),
})