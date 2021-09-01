const jwt = require('jsonwebtoken')
 
module.exports = (req, res, next) => {
  const authorizationHeader = req.headers.authorization
 
  if(!authorizationHeader) {
    const message = `You did not provide an authentication token. Add one to the request header.`
    return res.status(401).json({ message })
  }
   
    const token = authorizationHeader.split(' ')[1]
    jwt.verify(token, process.env.RANDOM_TOKEN_SECRET, (error, decodedToken) => {
        if(error) {
            const message = `The user is not authorized to access this data.`
            return res.status(401).json({ message, data: error })
        }
    
        const userId = decodedToken.userId
        if (req.body.userId && req.body.userId !== userId) {
            const message = `User ID is invalid.`
            res.status(401).json({ message })
        } else {
            next()
        }
    })
}