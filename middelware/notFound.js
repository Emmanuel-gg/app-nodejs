module.exports = (_, response) => {
  response.status(404).send({
    error: 'Page not found'
  })
}
