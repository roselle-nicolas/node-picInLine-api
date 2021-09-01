const Picture = require('../../models/picture')
const { compressImage } = require('../../services/image/compress-image')
const { updateOperation }  = require('../../services/operation/update-operation')
const { addLog, addLogError } = require('../../services/log')
const uploadPicture = require('../../middleware/multer/multer')

module.exports = (app) => {
    app.post('/api/picture', uploadPicture, (req, res) => {
        // picture copied
        if (req.query.copy) {
            const newPicture = new Picture(req.body)

            newPicture.save()
                .then(picture => {
                    const message = `The image ${req.body.filename} has been copied.`
                    addLog(message)
                    return res.status(201).json({ message, data : picture  })
                })
                .catch(error => {
                    const message = `The image : ${req.body.filename}, could not be copied. Try again in a few moments.`
                    addLogError(message, error)
                    res.status(500).json({ message, data: error })
                })
        // picture created        
        }else {
            let name = req.file.filename.split('-').slice(0,-1).join('-')

            const newPicture = new Picture({
                user_id      : req.body.user_id,
                filename     : req.file.filename,
                name,
                originPath   : req.file.path.replace(/\\/g, '/'),
                operation_id : req.body.compressPictureId,
                size_in      : req.file.size,
                size_output  : 0,
                compressRatio: req.body.compressRatio,
                percent      : 0,
            })
            // service : operation
            updateOperation(
                req.body.compressPictureId,
                { $inc : { __v : 1, numberOfPicturesUpload : 1} }
            )

            newPicture.save()
                .then(picture => {
                    const message = `The image ${req.file.originalname} has been uploaded.`
                    addLog(message)
                    res.status(201).json({ message, data : picture  })
                    return picture
                })
                .then(picture => {
                    // to do: listen to server performance
                    // service : picture
                    compressImage(picture)
                })
                .catch(error => {
                    const message = `The image : ${req.file.filename}, could not be saved. Try again in a few moments.`
                    addLogError(message, error)
                    res.status(500).json({ message, data: error })
                })
        }


        
    })
}