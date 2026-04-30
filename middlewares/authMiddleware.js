const jwt = require('jsonwebtoken')

const authMiddleware = (req,res,next)=>{
    console.log('Inside Authonication middleware');
    const token =req.headers['authorization'].split(" ")[1]
    console.log(token)
    if(token){
        try{
            const jwtResponse = jwt.verify(token,process.env.JWTSECRET)
            console.log(jwtResponse);
            req.payload = jwtResponse.useremail //we use this in sellermail
            next()
            
        }catch(err){
            res.status(401).json("Invalid Token.... Please Login ")
        }
        }
        else{
            res.status(401).json("Invalid Token.... Please Login ")
        }
    
    
}

module.exports = authMiddleware