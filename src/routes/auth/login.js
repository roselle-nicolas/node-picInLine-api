const User = require('../../models/user')
const { addLog, addLogError } = require('../../services/log')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

module.exports = (app) => {
    app.post('/api/auth/login', (req, res) => {
        User.findOne({ $or: [ { username: req.body.username }, {email: req.body.username } ] })
            .then(user => {
                if (!user) {
                    const message = `The user with the username : ${req.body.username} does not exist.`
                    addLogError(message)
                    return res.status(404).json({ message })
                }

                return bcrypt.compare(req.body.password, user.password).then(isPasswordValid => {
                    if(!isPasswordValid) {
                        const message = `The password for the username ${req.body.username} is incorrect.`
                        addLogError(message)
                        return res.status(401).json({ message })
                    };
    
                    const token = jwt.sign(
                        { userId: user.id },
                        process.env.RANDOM_TOKEN_SECRET,
                        { expiresIn: '1h' }
                    );
    
                    const message = `User with username : ${req.body.username} has been successfully login.`
                    addLog(message)
                    return res.json({ message, data: user, token })
                })

            })
            .catch(error => {
                const message = `The user with username ${req.body.username} could not be logged in. Try again in a few moments.`
                addLogError(message, error)
                res.status(500).json({ message, data: error })
            });
    })
}