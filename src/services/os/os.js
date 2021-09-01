const os = require('os-utils');

const freeMemory = () => {
    const freeMemory = Math.round(os.freemem())
    const totalMemory = Math.round(os.totalmem())
    return Math.round(freeMemory/totalMemory*100)
}

const freeCpu = () => {
    return new Promise((resolve, reject) => {
        try {
            os.cpuFree(data => resolve(Math.round(data * 100)))
        } catch (error) {
            reject(null)
        }
    })
}

module.exports = { freeMemory, freeCpu}