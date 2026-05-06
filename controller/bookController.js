const books = require('../models/bookModel')
const stripe = require('stripe')(process.env.STRIPE_SK);


//add book
exports.addBookController = async (req, res) => {

    console.log("Inside addBoohController");
    //get book details
    const { title, author, pages, imageURL, price, discountPrice, abstract, publisher, language, isbn, category } = req.body
    const uploadImages = req.files.map(item => item.filename)
    const sellerMail = req.payload
    console.log(title, author, pages, imageURL, price, discountPrice, abstract, publisher, language, isbn, category, uploadImages, sellerMail);

    //check book existing
    const existingBook = await books.findOne({ title, sellerMail })

    //if book is alredy exist: send response as denied
    if (existingBook) {
        res.status(409).json("Books Already Exists... Operation denied")
    }
    //else :add book to db ,send success res to client
    else {
        const newBook = await books.create({
            title, author, pages, imageURL, price, discountPrice, abstract, publisher, language, isbn, category, uploadImages, sellerMail
        })
        res.status(200).json(newBook)
    }
}
//get latest books: get 4 latest books 
exports.getHomePageBookController = async (req, res) => {
    console.log("Inside getHomePageBoookController");
    const homeBooks = await books.find().sort({ _id: 1 }).limit(4)
    res.status(200).json(homeBooks)
}

//get all users uploaded books apart from the login user :dispaly all books ignoring logined user 
exports.getBooksPageController = async (req, res) => {
    console.log("Inside getBooksPageController");
    const loginUserMail = req.payload
    //const allBooks = await books.find({sellerMail :{$ne:loginUserMail}})
    const searchKey = req.query.search
    const allBooks = await books.find({ sellerMail: { $ne: loginUserMail }, title: { $regex: searchKey, $options: "i" } })
    res.status(200).json(allBooks)
}

//get user profile books : display books uploaded by logined user 
exports.getUserBooksController = async (req, res) => {
    console.log("Inside getUserBooksController");
    const loginUserMail = req.payload
    const userUploadBooks = await books.find({ sellerMail: loginUserMail })
    res.status(200).json(userUploadBooks)
}

//get user bought books: display book bought by logined user
exports.getUserBoughtBooksController = async (req, res) => {
    console.log("Inside getUserBooksController");
    const loginUserMail = req.payload
    const userBoughtBooks = await books.find({ buyerMail: loginUserMail })
    res.status(200).json(userBoughtBooks)
}


//remove book by a user : logined user can delete uploaded book 
exports.removeUserUploadBooksController = async (req, res) => {
    console.log("Inside removeUserUploadBooksController");
    const loginUserMail = req.payload
    const { id } = req.params
    const removeBook = await books.findByIdAndDelete({ _id: id })
    res.status(200).json(removeBook)
}


//get single book to view 
exports.getSingleBookViewController = async (req, res) => {
    console.log("Inside getSingleBookViewController");
    const { id } = req.params
    const book = await books.findById({ _id: id })
    res.status(200).json(book)
}

//get all books : at admin resource page
exports.bookPaymentController = async (req, res) => {
    console.log("Inside bookPaymentController");
    const buyerMail = req.payload
    const { id } = req.params
    const bookDetails = await books.findById({ _id: id })
    bookDetails.status = "sold"
    bookDetails.buyerMail = buyerMail
    
    //create stripe checkout session
    const line_items = [{
        price_data: {
            currency: 'usd',
            product_data: {
                name: bookDetails.title,
                description: `${bookDetails.author},${bookDetails.publisher}`,
                images: bookDetails.uploadImages,
                metadata: {
                    title: bookDetails.title, author: bookDetails.author, price: bookDetails.discountPrice
                }
            },
            unit_amount: Math.round(bookDetails.discountPrice * 100)
        },
        quantity: 1
    }]
    const session = await stripe.checkout.sessions.create({
        success_url: 'http://localhost:5173/success',
        cancel_url: 'http://localhost:5173/cancel',
        line_items,
        mode: 'payment',
        payment_method_types:['card']
    });
    console.log(session);
      session.url && await bookDetails.save()
      res.status(200).json({checkOutURL:session.url})
  
    
    

}

//update book status :at admin part