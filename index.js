require('./mongo')

const express = require('express')
const cors = require('cors')
const notFound = require('./middelware/notFound')
const handleErrors = require('./middelware/handleErrors')

const app = express()
// MIDDLEWARE needed in server start
app.use(cors())
app.use(express.json())

// ROUTES AVALAIBLES
app.get('/', (_, response) => {
  response.send('<h1>Hello World</h1>')
})
// MIDDLEWARE needed in server close
app.use(notFound)
app.use(handleErrors)
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server runing on port ${PORT}`)
})
