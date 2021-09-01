const MIME_TYPES = require('./mime-type')

module.exports =  (file) => {
    const extension = MIME_TYPES[file.mimetype];
    const name = file.originalname.replace(/\s/g, '-').split(".").slice(0,-1).join('');
    const newFilename =`${name}-${Date.now()}.${extension}`

    return newFilename
}