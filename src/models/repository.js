const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')


const repositorySchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, `Name, is a required property and must not be empty.`],
            maxLength: [25, '<< {VALUE} >> is not valid. The name must not exceed 25 characters.']
        },
        user_id: {
            type: String,
            required: [true, `User_id, is a required property and must not be empty.`],
            validate: {
                validator: user_id => mongoose.Types.ObjectId.isValid(user_id),
                message: `user_id is not valid. Use a valid ObjectId.`
            }
        },
        repository_parent_id : {
            type: String,
            validate: {
                validator: repository_parent_id => {
                    return (mongoose.Types.ObjectId.isValid(repository_parent_id) || repository_parent_id === null)
                },
                message: `repository_parent_id is not valid. Use a valid ObjectId.`
            }
        },
        project_id          : {
            type: String,
        }
    },
    { timestamps: { createdAt: 'created', updatedAt: 'updated' } }
)

repositorySchema.plugin(uniqueValidator, { message: `The value: << {VALUE} >> of the property << {PATH} >> already exists. Try with another value.` })

module.exports = mongoose.model('repository', repositorySchema);

