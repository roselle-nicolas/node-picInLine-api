const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const isValidUrl = require('../validators/isValidUrl')


const pictureSchema = mongoose.Schema({
    user_id: {
        type: String,
        required: [true, `User_id, is a required property and must not be empty.`],
        validate: {
            validator: user_id => mongoose.Types.ObjectId.isValid(user_id),
            message: `user_id is not valid. Use a valid ObjectId.`
        }
    },
    repository_id: {
        type: String,
        validate: {
            validator: repository_id => {
                return (mongoose.Types.ObjectId.isValid(repository_id) || repository_id === '_null')
            },
            message: `repository_id is not valid. Use a valid ObjectId.`
        }
    },
    name: {
        type: String,
        required: [true, `name, is a required property and must not be empty`],
        maxLength: [255, '<< {VALUE} >> is not valid. The name must not exceed 255 characters.'],
    },
    filename: {
        type: String,
        required: [true, `filename, is a required property and must not be empty.`],
    },
    originPath: {
        type: String,
        required: [true, `originPath, is a required property and must not be empty.`],
    },
    url: {
        type: String,
        validate: {
            validator: url => isValidUrl(url),
            message: '{VALUE} is not a URL valid.'
        }
    },
    operation_id: {
        type: String,
        required: [true, `operation_id, is a required property and must not be empty.`],
        validate: {
            validator: operation_id =>  mongoose.Types.ObjectId.isValid(operation_id),
            message: `operation_id is not valid. Use a valid ObjectId.`
        }
    },
    size_in: {
        type: Number,
        validate : {
            validator : Number.isInteger,
            message   : '{VALUE} is not an integer value.'
        }
    },
    size_output: {
        type: Number,
        validate : {
            validator : Number.isInteger,
            message   : '{VALUE} is not an integer value.'
        }
    },
    compressRatio: {
        type: Number,
        validate : {
            validator : Number.isInteger,
            message   : '{VALUE} is not an integer value.'
        }
    },
    percent: {
        type: Number,
        validate : {
            validator : Number.isInteger,
            message   : '{VALUE} is not an integer value.'
        }
    },
},
{ timestamps: { createdAt: 'created', updatedAt: 'updated' } }
)

pictureSchema.plugin(uniqueValidator, { message: `The value: << {VALUE} >> of the property << {PATH} >> already exists. Try with another value.` })


module.exports = mongoose.model('picture', pictureSchema)