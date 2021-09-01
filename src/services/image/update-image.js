const Picture = require('../../models/picture')
const { addLog, addLogError } = require('../log')

const updateImage = (id, updatePicture) => {
    return new Promise((resolve, reject) => {
        Picture.findByIdAndUpdate(
            id,
            updatePicture,
            { new: true, runValidators: true, context: 'query' }
        )
            .then(picture => {
                const message = `The picture n°: ${picture._id} has been updated !`
                addLog(message)
                resolve(picture)
            })
            .catch(error => {
                const message = `The piture could not be updated.`
                addLogError(message, error)
                reject(error)
            })
    })
}

module.exports = { updateImage }