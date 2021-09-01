const Picture = require('../../models/picture')
const { addLogError } = require('../../services/log')

module.exports = (app) => {
    app.get('/api/picture', (req, res) => {
        // query options
        const option = {}

        if(req.query.user_id) {
            option.user_id = req.query.user_id
        }
        if( req.query.repository_id) {
            option.repository_id = req.query.repository_id
        }
        if (option.repository_id === 'null') {
            option.repository_id = '_null'
        }

        Picture.find(option)
                .then(picture => {
                    const message = `The list of images has been retrieved.`
                    res.json({ message, data: picture })
                })
                .catch(error => {
                    const message = `The list of images could not be retrieved. Try again in a few moments.`
                    addLogError(message, error)
                    res.status(500).json({ message, data: error })
                })
    })
}