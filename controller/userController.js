const users = require("../models/userModel");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

//register
exports.registerController = async (req,res)=>{
    console.log("Inside registerController");
    console.log(req.body);
    const {username,email,password} =req.body
     //check email in db
     const existingUser = await users.findOne({email})
     if (existingUser){
         //if present,send response as please login 
         res.status(409).json('User Already Exists... please login')
     }else{
        //if not present ,addall details to db send respose as newly insertesd document 
        let encryptPassWord = await bcrypt.hash(password,10)
        const newUser = await users.create({
            username,email,password: encryptPassWord
        })
        res.status(201).json(newUser)
     }

}

 //res.status(201).json("Register request received")
//login
exports.loginController = async (req,res)=>{
    console.log("Inside loginController");
    
    const {email,password} =req.body
     //check email in db
     const existingUser = await users.findOne({email})
     if (existingUser){
         //if present, check password
         const isPasswordMatch = await bcrypt.compare(password,existingUser.password)
         if(isPasswordMatch){
            const token = jwt.sign({useremail:email,role:existingUser.role},process.env.JWTSECRET)
            res.status(200).json({user:existingUser,token})
         }else{
            res.status(409).json("invalid Email or password!!!")
         }

     }else{
        //if not present ,
        res.status(409).json("invalid Email.. Please register to access bookstore!!!")
     }

}

//google Login Controller 
exports.googleloginController = async (req,res)=>{
    console.log("Inside googleLoginController");
    
    const {email,password,username,picture} =req.body
     //check email in db
     const existingUser = await users.findOne({email})
     if (existingUser){
         //if present, check password
        
            const token = jwt.sign({useremail:existingUser.email,role:existingUser.role},process.env.JWTSECRET)
            res.status(200).json({user:existingUser,token})
        

     }else{
        //if not present ,
        let encryptPassWord = await bcrypt.hash(password,10)
        const newUser = await users.create({
            username,email,password: encryptPassWord,picture
        })
        const token = jwt.sign({useremail:newUser.email,role:newUser.role},process.env.JWTSECRET)
        res.status(200).json({user:newUser,token})

     }

}

//user edit
exports.userEditController = async (req,res)=>{
    console.log("Inside userEditController");
    const {id} = req.params
    const email = req.payload
    const{username,password,bio,picture,role} = req.body
    const encryptedPassWord = await bcrypt.hash(password,10)
    const updatePicture = req.file?req.file.filename:picture
    const updateUser = await users.findByIdAndUpdate({_id:id},{
        username,email,password:encryptedPassWord,picture:updatePicture,bio,role
    },{new:true})
    
    res.status(200).json(updateUser)
    
}
//admin edit