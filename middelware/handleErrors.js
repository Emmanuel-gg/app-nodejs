module.exports = (error, _, response) => {
  if (error.name === 'CastError') {
    response.status(400).send({
      error: 'id used its malformed'
    })
  } else {
    response.status(400).end()
  }
}
