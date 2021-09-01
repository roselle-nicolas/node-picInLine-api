const Repository = require('../../models/repository')
const Picture = require('../../models/picture')
const { addLog, addLogError } = require('../../services/log')
const { deleteImagefile } = require('../../services/image/deleteImageFile')
const isIdValid = require('../../middleware/isIdValid')


//deleting a repository and its sub elements
module.exports = (app) => {
    // private function
    const deletePictureOfDirectory = (repository_id) => {
        Picture.find({ repository_id })
            .then(pictures => {
                pictures.map(picture => {
                    Picture.findByIdAndDelete(picture._id)
                    .then(deletedPicture => {
                        const message = `The image : ${picture._id}, hes been deleted.`
                        addLog(message)
                      
                        return deletedPicture
                    })
                    .then(deletedPicture => deleteImagefile(deletedPicture))
                    .catch(error => addLogError(`The image : picture._id or its file, could not be deleted.`, error))
                })
            })
            .catch(error => addLogError(`No images could be found.`, error))
    }
    
    const findAllDeleteSubRepository = (repositoryId) => {
        Repository.find({ repository_parent_id : repositoryId })
            .then(repositories => {
                repositories.map(repository => {
                    Repository.deleteOne({ _id : repository._id })
                        .then(_ => addLog(`The repository : ${repository._id} has been deleted.`))
                        .catch(error => addLogError(`The repository : ${repository._id} could not be deleted.`, error))
                    deletePictureOfDirectory(repository._id)
                    // recursion : sub repository ...
                    findAllDeleteSubRepository(repository._id)
                })
            })
            .catch(error => addLogError(`The repository : ${repository._id} could not be finded.`, error))
    }
    
    app.delete('/api/repository/:_id', isIdValid, (req, res) => {
        Repository.findByIdAndDelete(req.params._id)
            .then(repositoryDeleted => {
                if (repositoryDeleted === null) {
                    const message = `The repository : ${req.params._id} does not exist. Try again whith another ID.`
                    addLogError(message)
                    return res.status(404).json({ message })
                }

                const message = `The repository : ${req.params._id} has been deleted.`
                addLog(message)
                res.json({ message, data : repositoryDeleted })
            })
            .then(_ => deletePictureOfDirectory(req.params._id))
            .then(_ => findAllDeleteSubRepository(req.params._id))
            .catch(error => {
                const message = `The repository : ${req.params._id} could not be deleted. Try again in a few moments.`
                addLogError(message, error)
                res.status(500).json({ message, data: error })
            })
    })
}