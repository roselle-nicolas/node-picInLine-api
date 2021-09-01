const mongoose = require('mongoose')
const { addLogError } = require('../services/log')

module.exports = (req, res, next) => {
    const isValidId = mongoose.Types.ObjectId.isValid(req.params._id)

    if (!isValidId) {
        const message = `The parameter "_id" is not valid. Try again with another.`
        addLogError(message, error)
        return res.status(400).json({ message })
    }
    // Transforms a string into objectID
    req.params._id = mongoose.Types.ObjectId(req.params._id)

    next()
}