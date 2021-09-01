const LogError = require('../models/logError')
const Log = require('../models/log')
const {serializeError} = require('serialize-error')


const addLog = (message) => {
    const newLog = new Log({ message })

    newLog.save()
        .then(log => {
            process.env.NODE_ENV === 'development' ? console.log('Log entry: ', log.message) : false
        })
        .catch(error => {
            const message = `The message could not be added to the log.`
            console.error({ message, data: error })
        })
}

const addLogError = (message, error = null) => {
    error = error? JSON.stringify(serializeError(error)) : null
    const newLogError = error ? new LogError({ message, error }) : new LogError({ message })

    newLogError.save()
        .then(logError => {
            process.env.NODE_ENV === 'development' ? console.log('LogError entry: ', logError.message, error) : false
        })
        .catch(error => {
            const message = `The message could not be added to the log.`
            console.error({ message, data: error })
        })
}

module.exports = { addLog, addLogError }