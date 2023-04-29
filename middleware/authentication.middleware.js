const jwt = require("jsonwebtoken")
require("dotenv").config()

const authenticate=async (ask,give,next)=>{
    let token=ask.headers.authorization;
    try {
        let decoded=await jwt.verify(token,process.env.secret)
        next()
    } catch (error) {
     give.status(401).send("Not Authorized!")   
    }
}

module.exports={
    authenticate
}