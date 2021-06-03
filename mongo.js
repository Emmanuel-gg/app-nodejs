require('dotenv').config()
const mongoose = require('mongoose')
const { MONGO_DB_URI, MONGO_DB_URI_TEST, NODE_ENV } = process.env
const conectionString = NODE_ENV === 'test' ? MONGO_DB_URI_TEST : MONGO_DB_URI

mongoose.connect(conectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
})
  .then(() => {
    // console.log('Database connected')
  }).catch((err) => {
    console.log(err)
  })

// Close moongose conection in a error
process.on('uncaughtException', (error) => {
  console.error(error)
  mongoose.disconnect()
})
