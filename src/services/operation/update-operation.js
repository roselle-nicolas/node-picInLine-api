const Operation = require('../../models/operation')
const { addLog, addLogError } = require('../log')

const updateOperation = (id, updateOperation) => {
    return new Promise((resolve, reject) => {
        return Operation.findByIdAndUpdate(
            id,
            updateOperation,
            { new: true, runValidators: true, context: 'query' }
        )
            .then(operation => {
                const message = `The operation n°: ${operation._id} has been updated !`
                addLog(message)
                resolve(operation)
            })
            .catch(error => {
                const message = `The operation : ${id} could not be updated.`
                addLogError(message, error)
                reject(error)
            })
    })
}

module.exports = { updateOperation }