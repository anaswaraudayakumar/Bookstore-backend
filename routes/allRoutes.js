const express = require('express')
const userController = require('../controller/userController')

// to set up routes outside express server, create object for Router class of express
const router = new express.Router()

// register
router.post('/register',userController.registerController)
//login 
router.post('/login',userController.loginController)
//googleLogin
router.post('/google-login',userController.googleloginController)
module.exports = router