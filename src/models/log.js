const mongoose = require('mongoose')


const logSchema = mongoose.Schema({
    message  : {
        type: String,
        required: [true, `message, is a required property and must not be empty.`],
        maxLength: [255, '<< {VALUE} >> is not valid. The username must not exceed 255 characters.']
    }
},
{ timestamps: { createdAt: 'created', updatedAt: false } }
)

module.exports = mongoose.model('log', logSchema)