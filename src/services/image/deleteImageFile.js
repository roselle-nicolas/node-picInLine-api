const Picture = require('../../models/picture')
const { addLog, addLogError } = require('../../services/log')
const fs = require('fs')
const path = require('path')

const deleteImagefile = (picture) => {
    const pathCompressPicture = path.join(__dirname, '../../images', picture.user_id, picture.filename)
    const pathDownloadPicture = path.join(__dirname, '../../images/temp', picture.filename)

    // Duplicated image verification... Before deleting the image file
    Picture.find({ url: picture.url })
        .then(dataPictures => {
            if (dataPictures.length === 0) {
                // Delete the compressed image file if it exists
                if (fs.existsSync(pathCompressPicture)) {
                    fs.unlink(pathCompressPicture, (error) => {
                        if (!error) {
                            addLog(`The Image file : ${picture.filename}, has been deleted from the folder : ${picture.user_id}.`)
                        }else {
                            addLogError(`The image file: ${picture.filename}, could not be deleted from the folder : ${picture.user_id}`, error)
                        }
                    });
                }

                // Delete the original image file if it exists
                if (fs.existsSync(pathDownloadPicture)) {
                        fs.unlink(pathDownloadPicture, (error) => {
                            if (!error) {
                                addLog(`The Image file : ${picture.filename}, has been deleted from the folder : temp.`)
                            }else {
                                addLogError(`The image file: ${picture.filename}, could not be deleted from the folder : temp`, error)
                            }
                        });
                }
            }
        })
        .catch(error => addLogError(`The image with url : ${picture.url}, could not finded`, error));
};

module.exports = { deleteImagefile }