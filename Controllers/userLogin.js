const Test = require("../Model/user")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const SignUp = async (req, res) => {
    try {
        const hash = await bcrypt.hash(req.body.password, 10)
        const User = await new Test({
            username: req.body.username,
            password: hash
        })
        await User.save()
        res.status(200).json({SignUpMessage: "User created !"})
    } catch (error) {
        res.status(500).json({SignUpError: error})
    }
}

const Login = async (req, res) => {
 try {
    const {username, password} = req.body
    const FindUser = await Test.findOne({username})
    if(!FindUser){
        return res.status(401).json({NoSuchUser: "Incorrect Username"})
    }
    const CheckPassword = await bcrypt.compare(password, FindUser.password)
    if(!CheckPassword){
        return res.status(401).json({WrongPassword: "Incorrect Password"})
    }

    const token = jwt.sign({User: FindUser._id}, process.env.ACCESS_TOKEN, {expiresIn: "2m"})
    const refreshToken = jwt.sign({User: FindUser._id}, process.env.REFRESH_TOKEN, {expiresIn: "1d"})

    res.cookie("AccessToken", token, {
        httpOnly: true,
        secure: true, 
        sameSite: "None",
        maxAge: 2 * 60 * 1000,
        path: "/"
    })
    res.cookie("RefreshToken", refreshToken, {
        httpOnly: true,
        secure: true, 
        sameSite: "None",
        maxAge: 1 * 24 * 60 * 60 * 1000,
        path: "/"
    })
    res.status(200).json({Welcome: "Welcome Dear User"})
 } catch (error) {
    res.status(500).json({SignInError: "Internal Server Error !"})
 }
}

const RefreshTokenCheck = async(req, res) => {
    try {
        const { RefreshToken } = req.cookies

        if(!RefreshToken){
            return res.status(403).json({NeedRefreshToken: "Log in before, please !"})
        } else {
            jwt.verify(RefreshToken, process.env.REFRESH_TOKEN, (err, user) => {
                if(err){
                    console.log("Token Verification", err)
                } else {
                    const newAccessToken = jwt.sign({User: user._id}, process.env.ACCESS_TOKEN, {expiresIn: "2m"})
                    res.cookie("AccessToken", newAccessToken, {
                        httpOnly: true,
                        secure: true, 
                        sameSite: "None",
                        maxAge: 2 * 60 * 1000,
                        path: "/"
                    })
                    res.status(200).json({TokenRefreshed: "New token sent !"})
                }
            })
        }
    } catch (error) {
        res.status(500).json({RefreshTokenError: error})
    }
}

const HomePage = async(req, res) => {
    res.status(200).json({Home: "On the homepage !"})
}

const LogOut = async (req, res) => {
    try {

    res.clearCookie("AccessToken", {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        path: "/"
    })
    res.clearCookie("RefreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        path: "/"
    })

    res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(403).json({LogOutMes: error})
    }

}

module.exports = {SignUp, Login, RefreshTokenCheck, HomePage, LogOut}