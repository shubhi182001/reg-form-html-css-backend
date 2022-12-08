const jwt = require("jsonwebtoken");
const Register = require("../models/register");
const cookieParser = require("cookie-parser");
require('dotenv').config()



const auth = async (req, res, next ) => {
    try{
        const token = req.cookies.jwt();
        const verifyUser = jwt.verify(token,  process.env.SECRET_KEY )
        console.log(verifyUser);
        next();
    } catch(e){
        res.status(401).send(e);
    }
}

module.exports = auth;