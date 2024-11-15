
const jwt=require('jsonwebtoken')
const secretKey="Hello@234"

const fetchuser=function(req,res,next){
    // console.log("In fetch user")
    let token= req.headers['auth-token']
    // console.log(token)
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    let decode=jwt.verify(token,secretKey)
    req.body._id=decode._id
    
    // console.log(req.body)

    next() 
}

module.exports=fetchuser