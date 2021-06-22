const jwt = require('jsonwebtoken')

module.exports = (request, _, next) => {
  try {
    const authorization = request.get('authorization')
    let token = null
    if (authorization && authorization.toLocaleLowerCase().startsWith('bearer')) {
      token = authorization.substring(7)
    }
    if (!token) { next({ name: 'JsonWebTokenError' }) }
    const decodeToken = jwt.verify(token, process.env.JSON_WEB_TOKEN_SECRET)

    if (!decodeToken || !decodeToken.id) { next({ name: 'JsonWebTokenError' }) }

    request.body.id = decodeToken.id
    next()
  } catch (e) {
    next(e)
  }
}
