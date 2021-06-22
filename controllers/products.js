
const { checkForErrors, hasError, errorMessages } = require('../errors')
const productsRouter = require('express').Router()
const Product = require('../models/product')
const User = require('../models/User')
const auth = require('../middelware/auth')
const { STRING, BOOLEAN, REQUIRED, AT_LEAST_OF } = require('../validations')
productsRouter.post('/', auth, async (request, response, next) => {
  const { body } = request
  const { name, important, id } = body

  const errors = checkForErrors({
    name: {
      param: name,
      validations: [STRING, REQUIRED]
    }
  })

  if (hasError(errors)) {
    next({ name: 'ValidationError', errors })
  } else {
    const user = await User.findById(id)
    const product = new Product({
      name,
      important: important || false,
      bought: false,
      user: user._id
    })

    const savedProduct = await product.save()
    user.products = user.products.concat(savedProduct._id)
    await user.save()

    response.status(201).json(savedProduct)
  }
})

productsRouter.get('/', async (request, response) => {
  const products = await Product.find({}).populate('user', {
    username: 1,
    name: 1
  })
  response.json(products)
})

productsRouter.delete('/:id?', auth, async (request, response, next) => {
  const { body, params } = request
  const { id } = body
  const idProducto = params.id
  if (!idProducto) {
    if (body.action === 'delete') {
      await Product.deleteMany({})
      const user = await User.findById(id)
      user.products = []
      await user.save()

      response.status(204).end()
    } else {
      next({ name: 'ValidationError', errors: { id: { messages: [errorMessages.MissingParam('id')] } } })
    }
  } else {
    const productToDelete = await Product.findById(idProducto)

    if (!productToDelete) {
      next({ error: { name: 'ResourceNotFound', resource: 'Product' } })
    }

    await Product.deleteOne({ _id: idProducto })
    const user = await User.findById(id)
    user.products = user.products.filter(product => product.id !== idProducto)
    await user.save()

    response.status(204).end()
  }
})

productsRouter.patch('/:id', auth, async (request, response, next) => {
  const { body, params } = request
  const idProducto = params.id

  const errors = checkForErrors({
    name: {
      param: body.name,
      validations: [STRING, AT_LEAST_OF('dataProduct', 'Product Data', 1)]
    },
    important: {
      param: body.important,
      validations: [BOOLEAN, AT_LEAST_OF('dataProduct', 'Product Data', 1)]
    },
    idProducto: {
      param: idProducto,
      validations: [STRING, REQUIRED]
    }
  })

  if (hasError(errors)) {
    next({ name: 'ValidationError', errors })
  } else {
    const productToPatch = await Product.findById(idProducto)

    if (!productToPatch) {
      next({ error: { name: 'ResourceNotFound', resource: 'Product' } })
    }

    const product = await Product.updateOne({ _id: idProducto }, { $set: body })

    response.status(200).end(product)
  }
})

module.exports = productsRouter
