const express = require("express")
const Auth = require("../Middlewares/CookiesAuth")
const { SignUp, Login, RefreshTokenCheck, HomePage, LogOut } = require("../Controllers/userLogin")
const router = express.Router()

router.post("/signup", SignUp)
router.post("/login", Login)
router.post("/refreshtoken", RefreshTokenCheck)
router.get("/home", Auth, HomePage)
router.post("/logout", Auth, LogOut)

module.exports = router

