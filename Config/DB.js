const mongoose = require("mongoose")

const connectingDB = async () => {
    try {
        const connecting  = await mongoose.connect(process.env.CONNECT_DB)
            console.log("You are linked to the Database :", 
            connecting.connection.host, connecting.connection.name)
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

module.exports = connectingDB;