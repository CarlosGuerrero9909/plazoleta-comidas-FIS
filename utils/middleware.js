// Los middleware son funciones que se pueden utilizar para manejar objetos de request y response.
const logger = require('./logger')
const jwt = require('jsonwebtoken')
const User = require('./../models/user')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({
      error: 'token expired'
    })
  }

  next(error)
}

// Aísla el token del encabezado de authorization
// request.token se puede utilizar ya que se registro este middleware en el archivo app.js
// El middleware toma el token del encabezado Authorization y lo coloca en el campo token del objeto request.
const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')

  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    const token = authorization.substring(7)
    request.token = token
  } else {
    request.token = null
  }

  next()
}

// Encuentra al usuario y lo establece en el objeto de solicitud
const userExtractor = async (request, response, next) => {
  if (!request.token) {
    request.user = null
  } else {
    // La validez del token se comprueba con jwt.verify. El método también decodifica el token, o devuelve el objeto en el que se basó el token
    // El objeto decodificado del token contiene los campos username y id, que le dice al servidor quién hizo la solicitud.
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
      request.user = null
    } else {
      request.user = await User.findById(decodedToken.id)
    }
  }

  next()
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor
}
