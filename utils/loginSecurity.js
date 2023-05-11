const jwt = require('jsonwebtoken')
const User = require('../models/usuario')

const getTokenFrom = (request) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

const decodificarToken = (request) => {
  const token = getTokenFrom(request)
  if (!token) return null

  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!decodedToken.id) return null

  return User.findById(decodedToken.id)
}

module.exports = decodificarToken
