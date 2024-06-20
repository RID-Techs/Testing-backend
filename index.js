const express = require("express")
require("dotenv").config()
const app = express()
const cors = require("cors")
const cookieParser = require("cookie-parser")
const lunchDB = require("./Config/DB")
const Login_Routes = require("./Routes/LoginRoutes")
const port =process.env.PORT || 9003
lunchDB() 

app.use(cors({
    origin: "https://testing-front-ti8z.onrender.com",
    credentials: true
}))

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use("/back", Login_Routes)

app.listen(port, () => {
    console.log("Server is running on the port", port)
})