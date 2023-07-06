const Joi = require('joi');
const { Schema, model } = require('mongoose');
const { handleMongooseError } = require('../helpers');

const phoneRegexp = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,9}$/;

const contactSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Set name for contact'],
    },
    email: {
        type: String,
        required: [true, 'Set email for contact'],
    },
    phone: {
        type: String,
        match: phoneRegexp,
        required: [true, 'Set phone for contact'],
    },
    favorite: {
        type: Boolean,
        default: false,
    }
}, { versionKey: false, timestamps: true });

contactSchema.post("save", handleMongooseError);

const addSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(phoneRegexp).required(),
    favorite: Joi.boolean(),
});

const updateFavoriteSchema = Joi.object({
    favorite: Joi.boolean().required()
});

const schemas = {
    addSchema,
    updateFavoriteSchema
};

const Contact = model('contact', contactSchema);

module.exports = {
    Contact,
    schemas
};
// module.exports = {
//     addSchema,
// }; 