const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/User')

usersRouter.post('/', async (request, response, next) => {
  try {
    const { body } = request
    const { username, name, password } = body
    const errors = {
      username: [],
      password: [],
      name: []

    }

    if (!username || !(username.length > 0)) { errors.username = errors.username.concat(['Debe de proveer un nombre de usuario.']) }

    if (!password || !(password.length > 0)) { errors.password = errors.password.concat(['Debe de proveer una contraseña.']) }

    if (!name || !(name.length > 0)) { errors.name = errors.name.concat(['Debe de proveer un nombre.']) }

    for (const error in errors) {
      if (errors[error].length > 0) { response.status(400).send({ errors }) }
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
      username,
      name,
      passwordHash
    })

    const savedUser = await user.save()
    response.status(201).json(savedUser)
  } catch (e) {
    next(e)
  }
})
usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('products', {
    content: 1,
    date: 1
  })
  response.json(users)
})

module.exports = usersRouter
