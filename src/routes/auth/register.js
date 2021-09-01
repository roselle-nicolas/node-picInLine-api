
const User = require('../../models/user')
const { addLog, addLogError } = require('../../services/log')
const password = require('../../middleware/password')


module.exports = (app) => {
    app.post('/api/auth/register', password, (req, res) => {
        req.body.avatar = `${process.env.PROTOCOL}://${process.env.HOST}:${process.env.PORT}/avatar/user-avatar.png`
        const newUser = new User(req.body)

        return newUser.save().then(user => {
            const message = `The user: ${req.body.username}, has been successfully created.`
            addLog(message)
            res.status(201).json({ message, data: user })
        })
        .catch(error => {
            if(error.name === 'ValidationError') {
                addLogError(error.message, error)
                return res.status(400).json({ message: error.message, data: error })
            }

            const message = `The user could not be added. Try again in a few moments.`
            addLogError(message, error)
            res.status(500).json({ message, data : error })
        })
    })
}