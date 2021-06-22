const bcrypt = require('bcrypt')
const { checkForErrors, hasError } = require('../errors')
const usersRouter = require('express').Router()
const User = require('../models/User')
const { STRING, REQUIRED } = require('../validations')

usersRouter.post('/', async (request, response, next) => {
  try {
    const { body } = request
    const { username, name, password } = body
    const errors = checkForErrors({
      username: {
        param: username,
        validations: [STRING, REQUIRED]
      },
      name: {
        param: name,
        validations: [STRING, REQUIRED]
      },
      password: {
        param: password,
        validations: [STRING, REQUIRED]
      }
    })
    if (hasError(errors)) {
      next({ name: 'ValidationError', errors })
    } else {
      const saltRounds = 10
      const passwordHash = await bcrypt.hash(password, saltRounds)

      const user = new User({
        username,
        name,
        passwordHash
      })

      const savedUser = await user.save()
      response.status(201).json(savedUser)
    }
  } catch (e) {
    next(e)
  }
})
usersRouter.get('/', async (_, response) => {
  const users = await User.find({}).populate('products', {
    name: 1,
    important: 1,
    bought: 1
  })
  response.json(users)
})

module.exports = usersRouter
