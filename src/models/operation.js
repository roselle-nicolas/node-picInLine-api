const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')


const operationSchema = mongoose.Schema({
    user_id: {
        type: String,
        required: [true, `User_id, is a required property and must not be empty.`],
        validate: {
            validator: user_id => mongoose.Types.ObjectId.isValid(user_id),
            message: `user_id is not valid. Use a valid ObjectId.`
        }
    },
    numberOfPictures: {
        type: Number,
        required: [true, `numbersOfPicture, is a required property and must not be empty.`],
        min: [1, `He must have at least 1 image to upload.`],
        validate : {
            validator : Number.isInteger,
            message   : '<< {VALUE} >> is not an integer value.'
        }
    },
    numberOfPicturesUpload: {
        type: Number,
        required: [true, `numbersOfPicture, is a required property and must not be empty.`],
        validate : {
            validator : Number.isInteger,
            message   : '{VALUE} is not an integer value.'
        }
    },
    numberOfPicturesCompress: {
        type: Number,
        required: [true, `numbersOfPicture, is a required property and must not be empty.`],
        validate : {
            validator : Number.isInteger,
            message   : '{VALUE} is not an integer value.'
        }
    }
},
{ timestamps: { createdAt: 'created', updatedAt: 'updated' } }
)

operationSchema.plugin(uniqueValidator, { message: `The value: << {VALUE} >> of the property << {PATH} >> already exists. Try with another value.` })


module.exports = mongoose.model('operation', operationSchema)