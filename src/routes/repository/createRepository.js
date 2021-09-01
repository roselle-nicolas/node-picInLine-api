const Repository = require('../../models/repository')
const { addLog, addLogError } = require('../../services/log')

module.exports = (app) => {
    app.post('/api/repository', (req, res) => {
        const newRepository = new Repository(req.body)

        newRepository.save()
            .then(repository => {
                const message = `The repository: ${newRepository._id}, has been successfully created.`
                addLog(message)
                res.status(201).json({ message, data: repository })
            })
            .catch(error => {
                if(error.name === 'ValidationError') {
                    addLogError(error.message, error)
                    return res.status(400).json({ message: error.message, data: error })
                }

                const message = `The repository : ${req.body.name}, could not be added. Try again in a few moments.`
                addLogError(message, error)
                res.status(500).json({ message, data : error })
            })
    })
}