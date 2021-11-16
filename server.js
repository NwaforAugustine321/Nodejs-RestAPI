const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()
const App = express()

//CONNECT TO  DB
mongoose.connect(`${process.env.DB_URL}`, {
  useNewUrlParser : true,
 
}).then(() => {
  console.log('DB CONNECTED SUCESSFULLY')
}).catch((err) => {
  console.log(err)
})

//SET MIDDLEWARES
App.use(morgan('dev'))
App.use(bodyParser.json())
App.use(cors())

App.use('/api', require('./routes/product'))
App.use("/api",require('./routes/user'))


//LISTEN TO SERVER
const PORT = process.env.PORT || 8080
App.listen(PORT,()=>{
  console.log(`SERVER CONNECTED SUCESSFULLY ON  PORT ${PORT}`)
})