const { compress } = require('compress-images/promise');
const fs = require('fs')
const path = require('path')
const { updateImage } = require('./update-image')
const { updateOperation } = require('../operation/update-operation')
const { deleteOperation } = require('../operation/delete-operation')
const { addLog, addLogError } = require('../log')
const { send } = require('../../webSockets/dataWebSocket')

const compressImage = (picture) => { 
    // compatibility inputPath and outputPath with PM2
    const inputPath = path.join(
        __dirname,
        '../../',
        'images/temp',
        picture.filename
    ).replace(/\\/g, '/')

    const outputPath = path.join(
        __dirname,
        '../../',
        'images',
        picture.user_id,
        '/'
    ).replace(/\\/g, '/')

    compress({
        source: inputPath,
        destination: outputPath,
        enginesSetup: 
        {
            jpg: { engine: 'mozjpeg', command: ['-quality', '60'] },
            png: { engine: 'pngquant', command: ['--quality=20-50', '-o'] },
            svg: { engine: "svgo", command: "--multipass" },
            gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] } 
        }
    })
        .then(({ statistics, errors }) => {
            statistics = statistics[0]
            if (statistics.err) {
                const message = `The image could not be compressed`
                console.error({ message, data: errors });
                return
            }

            const message = `The image n°: ${picture._id} has been compressed.`
            addLog(message)

            const pictureURL = `${process.env.PROTOCOL}://${process.env.HOST}:${process.env.PORT}/assets/${picture.user_id}/${picture.filename}`
            return updateImage(
                picture._id,
                {
                    url: pictureURL,
                    size_input: statistics.size_in,
                    size_output: statistics.size_output,
                    percent: Math.round(statistics.percent),
                    repository_id: '_null',
                    $inc : { __v : 1 }
                }
            )
           
        })
        // [webSocket] : send message :  compressed image
        .then(picture => {
            const wsClient = connectionClients.filter(client => client._id == picture.operation_id)[0]
            send('conpressOnePictureFinish', picture, wsClient.ws)

            return updateOperation(
                picture.operation_id,
                {
                    $inc : { __v : 1, numberOfPicturesCompress: 1 }
                }
            )
        })
        // Compression operation for all images completed ? deletion of the operation
        .then(operation => {
            if (operation != null && operation.numberOfPictures === operation.numberOfPicturesCompress) {
                deleteOperation(operation._id)
                const wsClient = connectionClients.filter(client => client._id == picture.operation_id)[0]
                send('compressAllPicturesFinish', {message: `all images have been compressed`}, wsClient.ws)
            }
        })
        // Deleting the temporary image file
        .then(_ => {
            fs.unlink(path.join(__dirname, '../../images/temp', picture.filename), (error) => {
                if (error) {
                    addLogError(`the temporary image : ${picture.filename}, could not be deleted`, error)
                    return
                }
                addLog(`The temporary image : ${picture.filename}, has been deleted`)
            })
        })
        .catch(error => {
            const message = `error during compression operations`
            console.error({ message, data: error });
        })
}

module.exports = { compressImage }