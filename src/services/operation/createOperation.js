
const Operation = require('../../models/operation')
const { addLog, addLogError } = require('../log')
const { saveConnectionClient } = require('../../webSockets/ws')

const createOperation = (operation, ws) => {
    return new Promise((resolve, reject) => {
        const newOperation = new Operation(operation)

        newOperation.save()
            .then(operationSaved => {
                addLog(`The operation : ${newOperation._id}, has been ceated`)
                saveConnectionClient(newOperation._id , ws)
                resolve(operationSaved)
            })
            .catch(error => {
                addLogError(`The operation : ${newOperation._id} could not be created`, error)
                reject(error)
            })
    })
}

module.exports = { createOperation }