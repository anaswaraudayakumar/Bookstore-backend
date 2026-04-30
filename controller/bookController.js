const books = require('../models/bookModel')

//add book
exports.addBookController = async (req,res)=>{

    console.log("Inside addBoohController");
    //get book details
    const {title,author,pages,imageURL,price,discountPrice,abstract, publisher,language,isbn,category} = req.body 
    const uploadImages = req.files.map(item=>item.filename)
    const sellerMail = req.payload
    console.log(title,author,pages,imageURL,price,discountPrice,abstract, publisher,language,isbn,category,uploadImages,sellerMail);
    
    //check book existing
    const existingBook = await books.findOne({title,sellerMail})

    //if book is alredy exist: send response as denied
    if(existingBook){
        res.status(409).json("Books Already Exists... Operation denied")
    }
    //else :add book to db ,send success res to client
    else{
        const newBook = await books.create({
            title,author,pages,imageURL,price,discountPrice,abstract, publisher,language,isbn,category,uploadImages,sellerMail
        })
         res.status(200).json(newBook)
    }
}
//get latest books: get 4 latest books 

//get all users uploaded books