const Joi = require('joi');
module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().min(1).max(100).required(),
        location: Joi.string().required(),
        image: Joi.string().required(),
        price: Joi.number().min(0).required(),
        description: Joi.string().required()
    }).required()
}).required();