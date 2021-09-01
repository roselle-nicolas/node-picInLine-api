const User = require('../../models/user')
const { addLog, addLogError } = require('../../services/log')
const isIdValid = require('../../middleware/isIdValid')
const password = require('../../middleware/password')


module.exports = (app) => {
    app.put('/api/auth/:_id', isIdValid, password, (req, res) => {
        delete req.body.__v
        const updatedUser = { ...req.body, _id : req.params._id, $inc: { __v: 1} }

        User.findByIdAndUpdate(
            req.params._id,
            updatedUser,
            { new: true, runValidators: true, context: 'query' }
        )
            .then(modifiedUser => {
                if (modifiedUser === null) {
                    const message = `The user : ${req.params._id} does not exist. Try again with another ID.`
                    addLogError(message)
                    return res.status(404).json({ message })
                }
                const message = `The user : ${req.body.username}, has been successfully updated.`
                addLog(message)
                res.json({ message, data: modifiedUser })
            })
            .catch(error => {
                if(error.name === 'ValidationError') {
                    addLogError(error.message, error)
                    return res.status(400).json({ message: error.message, data: error })
                }

                const message = `The user : ${req.params._id} could not be modified. Try again in a few moments.`
                addLogError(message, error)
                res.status(500).json({ message, data: error })
            })
    })
}