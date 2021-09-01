require('dotenv').config()
const express = require('express')
const path = require('path')
const cors = require('cors')
const { connectBd } = require('./src/db/mongoose')
const { connectWS } = require('./src/webSockets/ws')
const auth = require('./src/middleware/auth')

const app = express()
const port = process.env.PORT | 3000

const messageCreateServer = () => {
    console.log(`the api started on the port: ${port}`)
}

connectBd()
connectWS()

app
    .use(express.json())
    .use(cors())

if(process.env.NODE_ENV === 'development') {
    const morgan = require('morgan')
    app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))
}

// ENPOINTS

    // PUBLIC

        //static server
app.use('/assets', express.static(path.join(__dirname, 'src/images')));

        // auth
require('./src/routes/auth/login')(app)
require('./src/routes/auth/register')(app)

app.use(auth) // middleware : token handler

    // PROTECTED

        // auth
require('./src/routes/auth/findUserById')(app)
require('./src/routes/auth/deleteUser')(app)
require('./src/routes/auth/updateUser')(app)

        //repository
require('./src/routes/repository/findAllRepository')(app)
require('./src/routes/repository/createRepository')(app)
require('./src/routes/repository/updateRepository')(app)
require('./src/routes/repository/findRepositoryById')(app)
require('./src/routes/repository/deleteRepository')(app)

        //picture
require('./src/routes/picture/createAndCompressPicture')(app)
require('./src/routes/picture/findAllPictures')(app)
require('./src/routes/picture/updatePicture')(app)
require('./src/routes/picture/deletePicture')(app)

// **END** ENPOINTS 

//error 404
app.use(({res}) => {
    const message = 'Could not find the requested resource! You can try another URL.'
    res.status(404).json({message})
})


if (process.env.NODE_ENV === 'development') {
    const http = require('http')

    http.createServer(app).listen(port, () => messageCreateServer())
    
} else if (process.env.NODE_ENV === 'production') {
    const fs = require('fs')
    const https = require('https')
    const options = {
        key: fs.readFileSync(process.env.PRIVKEY),
        cert: fs.readFileSync(process.env.FULLCHAIN)
    }
    
    https.createServer(options, app).listen(port, () => messageCreateServer())
}
