const multer = require('multer')
const makeFilename = require('./makeFilename')
const path = require('path')
const outputPath = path.join(__dirname, '../../', 'images/temp')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, outputPath)
    },
    filename: (req, file, cb) => {
        cb(null, makeFilename(file))
    }
})

module.exports = multer({ storage: storage }).single('image')