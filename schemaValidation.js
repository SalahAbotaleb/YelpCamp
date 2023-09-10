const baseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');
const removeHTMLvalidation = (joi) => {
    return {
        type: 'string',
        base: joi.string(),
        messages: {
            'string.noHTMLTags': '{{#label}} mustn\'t contain HTML tags'
        },
        rules: {
            validateNoHTML: {
                validate(value, helpers, args, options) {
                    const original = value;
                    const clean = sanitizeHtml(original, { allowedTags: [] });
                    console.log(original);
                    console.log(clean);
                    if (original !== clean) {
                        return helpers.error('string.noHTMLTags', { value });
                    }
                    return value;
                }
            }
        }
    }
}
const Joi = baseJoi.extend(removeHTMLvalidation);
module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().min(1).max(100).required().validateNoHTML(),
        location: Joi.string().required().validateNoHTML(),
        price: Joi.number().min(0).required(),
        description: Joi.string().required().validateNoHTML()
    }).required(),
    images: Joi.array(),
    deletedImages: Joi.array()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().min(1).max(5).required(),
        body: Joi.string().required().validateNoHTML()
    }).required()
});
