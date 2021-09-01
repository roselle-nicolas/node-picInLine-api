const User = require('../../models/user')
const { addLog, addLogError } = require('../../services/log')
const isIdValid = require('../../middleware/isIdValid')

module.exports = (app) => {
    app.get('/api/user/:_id', isIdValid, (req, res) => {
        User.findById(req.params._id)
            .then(user => {
                if (user === null) {
                    const message = `The user n° : ${req.params._id} does not exist. Try again with another ID.`
                    addLogError(message)
                    return res.status(404).json({ message })
                }

                const message = `A user has been found.`
                addLog(message)
                res.json({ message, data: user})
            })
            .catch(error => {
                const message = `The user could not be recovered. Try again in a few moments.`
                addLogError(message, error)
                res.status(500).json({ message, data: error })
            });
    })
}