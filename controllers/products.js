
const User = require('../models/User')
const Product = require('../models/product')
const productsRouter = require('express').Router()
const jwt = require('jsonwebtoken')

productsRouter.post('/', async (request, response, next) => {
  try {
    const { body } = request
    const { name, important, bought } = body

    const authorization = request.get('authorization')
    let token = null
    if (authorization && authorization.toLocaleLowerCase().startsWith('bearer')) {
      token = authorization.substring(7)
    }
    if (!token) { return response.status(401).json({ error: 'token missing or invalid' }) }
    const decodeToken = jwt.verify(token, process.env.JSON_WEB_TOKEN_SECRET)

    if (!decodeToken || !decodeToken.id) { return response.status(401).json({ error: 'token missing or invalid' }) }

    const user = await User.findById(decodeToken.id)
    const product = new Product({
      name,
      important,
      bought,
      user: user._id
    })
    const savedProduct = await product.save()
    user.products = user.products.concat(savedProduct._id)
    user.save()

    response.status(201).json(savedProduct)
  } catch (e) {
    console.log({ e })
    next(e)
  }
})
productsRouter.get('/', async (request, response) => {
  const products = await Product.find({}).populate('user', {
    username: 1,
    name: 1
  })
  response.json(products)
})

module.exports = productsRouter
