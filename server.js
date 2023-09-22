const app = require("./app")
const config = require("./app/config")
const MongoDB = require("./app/utils/mongodb.util")

// Try Connect DB and start server
async function startServer() {
    try {
        await MongoDB.connect(config.db.uri)
        console.log("Connected to the database!")

        const PORT = config.app.port
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}.`)
        })

    } catch(err) {
        console.log("Cannot connect to  the database!", err)
        process.exit()
    }
}

startServer()

