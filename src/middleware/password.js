const passwordValidator = require('password-validator');
const bcrypt = require('bcrypt')


module.exports = (req, res, next) => {
    if (!req.body.password) {
        const message = `Password is required property and must not be empty`
        return res.status(400).json({ message })
    }

    const Password = new passwordValidator()
        .is().min(8)
        .is().max(16)
        .has().uppercase()
        .has().lowercase()
        .has().digits()
        .has().not().spaces()
        .has().symbols()

    const passwordErrors = Password.validate(req.body.password, { list: true })

    const allMessagesErrors = {
        min      : ' min 8',
        max      : ' max 16',
        uppercase: ' Add uppercase',
        lowercase: ' Add lowercase',
        digits   : ' Add a number',
        spaces   : ' Not space',
        symbols  : ' Add a symbols'
    }

    if (passwordErrors.length !== 0) {
        const messageErrors = passwordErrors.map(error => allMessagesErrors[error])
        const message = `the password is not valid. Instruction:${messageErrors.toString()}`

        return res.status(400).json({ message,  passwordErrors })
    }

    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            req.body.password = hash
            next()
        })
        .catch(error => {
            const message = `The password could not be encrypted. Try again in a few moments.`
            res.status(500).json({ message, data: error })
        })
}