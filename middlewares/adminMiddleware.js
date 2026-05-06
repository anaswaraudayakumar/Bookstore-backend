const jwt = require('jsonwebtoken')

const adminMiddleware = (req,res,next)=>{
    console.log('Inside Admin Authonication middleware');
    const token =req.headers['authorization'].split(" ")[1]
    console.log(token)
    if(token){
        try{
            const jwtResponse = jwt.verify(token,process.env.JWTSECRET)
            console.log(jwtResponse);
            req.payload = jwtResponse.useremail //this is admin
            const role = jwtResponse.role
            if(role=="admin"){
            next()
        }else{
              res.status(401).json("Authorization failed.... Unauthorised user")
        }
            
        }catch(err){
            res.status(401).json("Invalid Token.... Please Login ")
        }
        }
        else{
            res.status(401).json("Authorization failed.... Please Login ")
        }
    
    
}

module.exports = adminMiddleware