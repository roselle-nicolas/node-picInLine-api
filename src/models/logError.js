const mongoose = require('mongoose')


const logErrorSchema = mongoose.Schema(
    {
        message  : {
            type: String,
            required: [true, `message, is a required property and must not be empty.`],
            maxLength: [255, '<< {VALUE} >> is not valid. The username must not exceed 255 characters.']
        },
        error: { type : String }
    },
    { timestamps: { createdAt: 'created', updatedAt: false } }
)

module.exports = mongoose.model('logError', logErrorSchema)