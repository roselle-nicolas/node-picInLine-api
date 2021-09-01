const { validate } = require("email-validator")

module.exports = (email) => {
    return validate(email)
}