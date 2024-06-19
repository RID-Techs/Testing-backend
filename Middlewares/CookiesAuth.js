const jwt = require("jsonwebtoken")

const Cookies_Auth = (req, res, next) => {
    const {AccessToken} = req.cookies; 
    
    if (!AccessToken) {
        return res.status(401).json({ NoTokenMes: "Log in Before !" });
    } else {

        jwt.verify(AccessToken, process.env.ACCESS_TOKEN, (err, user) => {
            if (err) {
                console.error('Token verification error:', err);
                return res.status(401).json({ AuthMes: "No new Acess Token !" });
            } else {
                console.log('Authenticated user:', user);
                req.user = user
                next();
            }
        });
    }
}

module.exports = Cookies_Auth;