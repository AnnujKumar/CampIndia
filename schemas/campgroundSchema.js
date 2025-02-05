const BaseJoi = require("joi");
const sanitizeHtml = require("sanitize-html");
const extension = (joi) => ({
        type: 'string',
        base: joi.string(),
        messages: {
            'string.escapeHTML': '{{#label}} must not include HTML!'
        },
        rules: {
            escapeHTML: {
                validate(value, helpers) {
                    const clean = sanitizeHtml(value, {
                        allowedTags: [],
                        allowedAttributes: {},
                    });
                    if (clean !== value) return helpers.error('string.escapeHTML', { value })
                    return clean;
                }
            }
        }
    });
const Joi = BaseJoi.extend(extension)
const campgroundSchema =  Joi.object({
        title: Joi.string().required().escapeHTML(),
        location: Joi.string().required().escapeHTML(),
        price: Joi.number().required(),
        description:Joi.string().required().escapeHTML()
})
const reviewsSchema = Joi.object({
        review:Joi.object({
                body:Joi.string().required().escapeHTML(),
                rating:Joi.number().required()
        }).required()
})
module.exports.campgroundSchema  = campgroundSchema;
module.exports.reviewsSchema = reviewsSchema;