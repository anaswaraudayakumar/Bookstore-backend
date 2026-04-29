const express = require('express')
const userController = require('../controller/userController')
const authMiddleware =require('../middlewares/authMiddleware')
const multerMiddleware = require('../middlewares/multerMiddleware')
// to set up routes outside express server, create object for Router class of express
const router = new express.Router()

// register
router.post('/register',userController.registerController)
//login 
router.post('/login',userController.loginController)
//googleLogin
router.post('/google-login',userController.googleloginController)

//------------------------------------Aythorised user----------------------------------------------------
//user edit
router.put('/user/:id',authMiddleware,multerMiddleware.single('picture'),userController.userEditController)


//user edit 


module.exports = router