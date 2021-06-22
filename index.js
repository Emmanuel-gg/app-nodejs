require('./mongo')

const express = require('express')
const cors = require('cors')
const notFound = require('./middelware/notFound')
const handleErrors = require('./middelware/handleErrors')
const usersRouter = require('./controllers/users')
const productsRouter = require('./controllers/products')
const authRouter = require('./controllers/auth')

const app = express()
// MIDDLEWARE needed in server start
app.use(cors())
app.use(express.json())

// ROUTES AVALAIBLES
// Auth routes
app.use('/api/auth', authRouter)

// Users routes
app.use('/api/users', usersRouter)

// Products routes
app.use('/api/products', productsRouter)

// MIDDLEWARE needed in server close
app.use(notFound)
app.use(handleErrors)
const PORT = process.env.PORT || 3001
const server = app.listen(PORT, () => {
  // console.log(`Server runing on port ${PORT}`)
})
module.exports = { app, server }
