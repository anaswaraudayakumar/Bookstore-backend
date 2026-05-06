const express = require('express')
const userController = require('../controller/userController')
const authMiddleware =require('../middlewares/authMiddleware')
const multerMiddleware = require('../middlewares/multerMiddleware')
const bookController = require('../controller/bookController')
const adminMiddleware = require('../middlewares/adminMiddleware')
// to set up routes outside express server, create object for Router class of express
const router = new express.Router()

// register
router.post('/register',userController.registerController)
//login 
router.post('/login',userController.loginController)
//googleLogin
router.post('/google-login',userController.googleloginController)
//homebooks
router.get('/home-books',bookController.getHomePageBookController)


//------------------------------------Aythorised user----------------------------------------------------
//user edit
router.put('/user/:id',authMiddleware,multerMiddleware.single('picture'),userController.userEditController)
//add book
router.post('/books',authMiddleware,multerMiddleware.array('uploadImages',3),bookController.addBookController)
//get booksPage
router.get('/all-books',authMiddleware,bookController.getBooksPageController)
//get user upload books
router.get('/user-books',authMiddleware,bookController.getUserBooksController)
//get user bought books
router.get('/bought-books',authMiddleware,bookController.getUserBoughtBooksController)
//delete book
router.delete('/books/:id',authMiddleware,bookController.removeUserUploadBooksController)

// get single book to view
router.get('/books/:id',authMiddleware,bookController.getSingleBookViewController)
// get single book to view
router.put('/books/:id/buy',authMiddleware,bookController.bookPaymentController)

//------------------------------------Aythorised user Admin----------------------------------------------------

//admin profile edit

router.put('/profile/:id',adminMiddleware,multerMiddleware.single('picture'),userController.userEditController)


module.exports = router