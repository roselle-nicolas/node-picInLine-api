const mongoose = require('mongoose')

const urlConnectionMongoDB = process.env.URL_MONGODB

const connectBd = () => {
    mongoose.connect(
        urlConnectionMongoDB,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        }
    )
        .then(_ => console.log('Connection to MongoDB successful!'))
        .catch((error) => console.error('Connection to MongoDB failed: ', error))
}

module.exports = { connectBd }
