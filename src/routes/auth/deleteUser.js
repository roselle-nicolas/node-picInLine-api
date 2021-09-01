const User = require("../../models/user")
const { addLog, addLogError } = require('../../services/log')
const isIdValid = require('../../middleware/isIdValid')

// to do : delete user folder and these images

module.exports = (app) => {
    app.delete('/api/auth/:_id', isIdValid, (req, res) => {

        User.findByIdAndDelete(req.params._id)
            .then(userDeleted => {
                if(userDeleted === null) {
                    const message = `The user n°: ${req.params._id} does not exist. Try again with another user ID.`
                    addLogError(message)
                    return res.status(404).json({ message })
                }

                message = `The user with the user ID: ${userDeleted.id} has been deleted.`
                addLog(message)
                res.json({ message })
            })
            .catch(error => {
                const message = `The user could not be deleted. Try again in a few moments.`
                addLogError(message, error)
                res.status(500).json({ message, data: error })
            })
    })
}