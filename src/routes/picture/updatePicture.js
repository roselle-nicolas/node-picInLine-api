const Picture = require('../../models/picture')
const { addLog, addLogError } = require('../../services/log')
const isValidId = require('../../middleware/isIdValid')

module.exports = (app) => {
    app.put('/api/picture/:_id', isValidId, (req, res) => {
        delete req.body.__v
        const updatedPicture = {...req.body, _id: req.params._id, $inc : { __v : 1 }} 

        Picture.findByIdAndUpdate(
            req.params._id,
            updatedPicture,
            { new: true, runValidators: true, context: 'query' }
        )
            .then(modifiedPicture => {
                if (modifiedPicture === null) {
                    const message = `The image : ${req.params._id}, does not exist. Try again with another ID.`
                    addLogError(message)
                    return res.status(404).json({ message })
                }

                const message = `The image : ${req.params._id}, has been succesfully updated.`
                addLog(message)
                res.json({ message, data : modifiedPicture })
            })
            .catch(error => {
                if(error.name === 'ValidationError') {
                    addLogError(error.message, error)
                    return res.status(400).json({ message: error.message, data: error })
                }

                const message = `the image : ${req.params._id}, could not be changed. Try again in a few moments.`
                addLogError(message, error)
                res.status(500).json({ message, data: error })
            })
    })
}