module.exports = (error, _, response, next) => {
  if (response.headersSent) {
    return next(error)
  }
  if (error.name === 'CastError') {
    response.status(400).send({
      error: 'id used its malformed'
    })
  } else if (error.name === 'JsonWebTokenError') {
    response.status(400).send({
      error: 'Token missing or invalid'
    })
  } else if (error.name === 'ValidationError') {
    console.error(error.errors.username)
    if (error.errors && error.errors.username) {
      response.status(400).send({
        errors: { username: { message: 'Username already be taken' } }
      })
    }
    response.status(400).end({ errors: { general: 'Ocurrió un error de validación con los campos' } })
  } else {
    response.status(400).end()
  }
}
