const webSocket = require("ws")
const https = require('https')

let wss = undefined
let server = undefined

if (process.env.NODE_ENV === 'production') {
    const fs = require('fs')
    server = https.createServer({
        cert: fs.readFileSync(process.env.FULLCHAIN),
        key: fs.readFileSync(process.env.PRIVKEY)
    });
    wss = new webSocket.Server({ server });
}else {
    wss = new webSocket.Server({ port: 3001 })
}

const connectWS = () => {
    global.connectionClients = []
    wss.on("connection", (ws) => {
        console.log("[websocket]: client connection")

        //Routes dataWebSocket
        require('./routes-sockets/startCompressFiles')(ws)

        ws.on("close", (e) => {
            console.log("[WebSocket]: client disconnection, code: ", e)
        })
    })
}

const saveConnectionClient = (_id, ws) => {
    connectionClients.push({ _id, ws })
}

if (process.env.NODE_ENV === 'production') {
    server.listen(3001);
}

module.exports = { connectWS, saveConnectionClient }
