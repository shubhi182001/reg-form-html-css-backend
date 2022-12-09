const jwt = require("jsonwebtoken");
require('dotenv').config();
const Register = require("../models/register");


const auth = async(req, res, next ) => {
    try{
        const token = req.cookies.jwt;
        console.log(token)
        const verifyUser = jwt.verify(token,  process.env.SECRET_KEY) //They are not equal inreal but there is some process involved at back side that verifies them. 
        console.log(verifyUser);

        const user =  await Register.findOne({_id: verifyUser._id})  // We can access whole data from this id.
        console.log(user.name);

        next();


    }catch(e){ 
        res.status(401).send(e);
    }
}

module.exports = auth;