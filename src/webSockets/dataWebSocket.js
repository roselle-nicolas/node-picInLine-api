const receive = (routeData, ws) => {
    return new Promise((resolve, reject) => {
        try {
            ws.on("message", (data) => {
                dataParse = JSON.parse(data)
                resolve(dataParse[routeData])
            })
        } catch (error) {
            const message = `the web sockets service fails to retrieve the data: ${routeData}. Try again in a few moments`
            reject({message, routeData,  data: error})
        }
    })
}

const send = (routeData, data, ws) => {
    const newData = { [routeData] : data }

    ws.send(JSON.stringify(newData))
}

module.exports = { receive, send }