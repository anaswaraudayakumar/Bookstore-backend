//import all packages
//loads .env file contents into process.env by default.
require('dotenv').config()
const express = require('express')
const cors =require('cors')
const routes =require('./routes/allRoutes')
require('./config/db')

//create server using express package
const server = express()
//Enable cors in server 
server.use(cors())
// parse json to js content
server.use(express.json())
// use routes in server
server.use(routes)
//handling static file/folder
server.use('/uploads',express.static('./uploads'))
//setup a port to run server in internet
const PORT = process.env.PORT
///start server to  listen client request to that port/available server in internet
server.listen(PORT,()=>{
    console.log('Server started & waiting for the client request');
})
//handling global error in server using application specific middle ware 
server.use((err,req,res,next)=>{
    res.status(500).json(err.message)
})
//resolve API (get request to http://localhost:3000/  using Express)
server.get('/',(req,res)=>{
    res.status(200).send(`<h1>Server started & waiting for the client request</h1>`)
})
