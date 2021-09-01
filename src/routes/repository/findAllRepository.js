const Repository = require('../../models/repository')
const { addLogError } = require('../../services/log')

module.exports = (app) => {
    app.get('/api/repository', (req, res) => {

        // query options
        const option = {}

        if(req.query.user_id) {
            option.user_id = req.query.user_id
        }
        if( req.query.repository_parent_id) {
            option.repository_parent_id = req.query.repository_parent_id
        }
        if (option.repository_parent_id === 'null') {
            option.repository_parent_id = null
        }

        Repository.find(option)
                .then(repository => {
                    const message = `The list of repository has been retrieved.`
                    res.json({ message, data: repository })
                })
                .catch(error => {
                    const message = `The list of repository could not be retrieved. Try again in a few moments.`
                    addLogError(message, error)
                    res.status(500).json({ message, data: error })
                })
    })
}