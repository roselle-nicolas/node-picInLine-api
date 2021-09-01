const Picture = require('../../models/picture')
const { addLog, addLogError } = require('../../services/log')
const { deleteImagefile } = require('../../services/image/deleteImageFile')
const isValidId = require('../../middleware/isIdValid')

module.exports = (app) => {
    app.delete('/api/picture/:_id', isValidId, (req, res) => {
        Picture.findByIdAndDelete(req.params._id)
            .then(deletedPicture => {
                if (deletedPicture === null) {
                    const message = `The image : ${req.params._id}, does not exist. Try again whith another ID.`
                    addLogError(message)
                    return res.status(404).json({ message })
                }

                const message = `The image : ${req.params._id}, hes been deleted.`
                addLog(message)
                res.json({ message, data: deletedPicture })
                
                return deletedPicture
                
            })
            // service : picture
            .then(deletedPicture => deleteImagefile(deletedPicture))
            .catch(error => addLogError(`The image : ${req.params._id}, could not deleted.`, error))
    })
}

