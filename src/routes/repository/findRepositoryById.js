const Repository = require('../../models/repository')
const { addLogError } = require ('../../services/log')
const isIdValid = require('../../middleware/isIdValid')

module.exports = (app) => {
    app.get('/api/repository/:_id', isIdValid, (req, res) => {
        Repository.findById(req.params._id)
            .then(repository => {
                if(repository === null) {
                    const message = `The repository does not exist. Try again with another ID.`
                    res.status(404).json({ message })
                }

                const message = `The repository has been found.`
                res.json({ message, data: repository })
            })
            .catch(error => {
                const message = `The repository not be recovered. Try again in a few moments.`
                addLogError(message, error)
                res.status(500).json({ message, data: error })
            })
    })
}
