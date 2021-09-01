const data  = require('../dataWebSocket')
const { createOperation } = require('../../services/operation/createOperation')
const { addLogError } = require('../../services/log')

module.exports = (ws) => {
    data.receive('startCompressFiles', ws)
        .then(newData => {
            const newOperation = {
                ...newData,
                numberOfPicturesCompress: 0,
                numberOfPicturesUpload: 0
            }

            return createOperation(newOperation, ws)
        })
        .then(newOperation => {
            data.send('startCompressFiles', newOperation, ws)
        })
        .catch(error => addLogError(`error startCompressFilles`, error))
}