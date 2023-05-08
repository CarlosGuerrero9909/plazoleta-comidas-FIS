const sedesRouter = require('express').Router()
const Sede = require('../models/sede')
const Restaurante = require('../models/restaurante')
const jwt = require('jsonwebtoken')

const getTokenFrom = (request) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

sedesRouter.post('/', async (request, response) => {
  const token = getTokenFrom(request)
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const body = request.body

  const restaurante = await Restaurante.findById(body.restaurante)

  const sede = new Sede({
    direccion: body.direccion,
    telefono: body.telefono,
    restaurante: restaurante._id
  })

  const savedSede = await sede.save()
  restaurante.sedes = restaurante.sedes.concat(savedSede._id)
  await restaurante.save()

  response.json(savedSede)
})

module.exports = sedesRouter
