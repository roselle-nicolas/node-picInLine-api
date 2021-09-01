const { isUri } = require('valid-url')

module.exports = (url) => {
    return !!isUri(url)
}