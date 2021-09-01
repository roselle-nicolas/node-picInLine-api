const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const isValidUrl = require('../validators/isValidUrl')
const isEmailValid = require('../validators/isEmailValid')


const userSchema = mongoose.Schema({
    username  : {
        type: String,
        required : [true, `Username is a required property and must not be empty.`],
        maxLength: [25, '<< {VALUE} >> is not valid. The username must not exceed 25 characters.'],
        unique: true
    },
    email   : {
        type: String,
        required: [true, `Email is required property and must not be empty.`],
        validate: {
            validator: email => isEmailValid(email),
            message: `Use a valid email. Example : contact@contact.com.`
        },
        unique: true
    },
    // validation and encrytion by the middleware : password
    password: {
        type: String
    },
    avatar  : { 
        type: String,
        required  : [true, `Avatar is required property and must not be empty.`],
        validate: {
            validator: url => isValidUrl(url),
            message: `Use a valid URL for the avatar`
        }
     }
},
{ timestamps: { createdAt: 'created', updatedAt: 'updated' } }
)

userSchema.plugin(uniqueValidator, { message: `The value: << {VALUE} >> of the property << {PATH} >> already exists. Try with another value.` })


module.exports = mongoose.model('user', userSchema)