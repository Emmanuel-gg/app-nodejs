const { hasError, changeDefaultError } = require('../errors')

module.exports = (error, _, response, next) => {
  if (response.headersSent) {
    return next(error)
  }
  console.log('Entre en handleErrors')
  console.log(error)
  if (error.name === 'CastError') {
    response.status(400).send({
      error: 'id used its malformed'
    })
  } else if (error.name === 'JsonWebTokenError') {
    response.status(401).send({
      error: 'Token missing or invalid'
    })
  } else if (error.name === 'ValidationError') {
    for (const e in error.errors) {
      if (Object.hasOwnProperty.call(error.errors, e)) {
        const element = error.errors[e]
        error.errors[e] = changeDefaultError(element, error.errors)
      }
    }
    if (hasError(error.errors)) {
      response.status(400).send({
        errors: error.errors
      })
    } else {
      console.warn('Error controlled too general:', error)
      response.status(400).send({ errors: { general: 'An error has ocurred with the validation of the fields' } })
    }
  } else if (error.name === 'ResourceNotFound') {
    response.status(404).send({ errors: { general: `Not resource (${error.resource}) found with that id` } })
  } else if (error.name === 'MissingParams') {
    response.status(404).send({ errors: { general: `Not resource (${error.resource}) found with that id` } })
  } else {
    response.status(400).end()
  }
}
