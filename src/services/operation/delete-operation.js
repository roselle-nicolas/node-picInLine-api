const Operation = require('../../models/operation')
const { addLog } = require('../log')

const deleteOperation = (id) => {
    Operation.deleteOne({ _id: id })
        .then(_ => {
            const message = `The operation n°: ${id} has been deleted`
            addLog(message)
        })
        .catch(error => console.error(error))
}

module.exports = { deleteOperation }