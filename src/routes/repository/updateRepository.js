const Repository = require('../../models/repository')
const { addLog, addLogError } = require('../../services/log')
const isIdValid = require('../../middleware/isIdValid')

module.exports = (app) => {
    app.put('/api/repository/:_id', isIdValid, (req, res) => {
        delete req.body.__v
        const updatedRepository = { ...req.body, _id : req.params._id, $inc: { __v : 1 } }

        Repository.findByIdAndUpdate(
            req.params._id,
            updatedRepository,
            { new: true, runValidators: true, context: 'query' }
        )
            .then(modifiedRepository => {
                if (modifiedRepository === null) {
                    const message = `The repository : ${req.params._id}, does not exist. Try again with another ID.`
                    addLogError(message)
                    return res.status(404).json({ message })
                }

                const message = `The repository ${req.body.name} : ${req.params._id}, has been succesfully updated.`
                addLog(message)
                res.json({ message, data : modifiedRepository })
            })
            .catch(error => {
                if(error.name === 'ValidationError') {
                    addLogError(error.message, error)
                    return res.status(400).json({ message: error.message, data: error })
                }

                const message = `the repository : ${req.params._id}, could not be changed. Try again in a few moments.`
                addLogError(message, error)
                res.status(500).json({ message, data: error })
            })
    })
}
