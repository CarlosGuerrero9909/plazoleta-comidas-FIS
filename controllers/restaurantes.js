const restaurantesRouter = require('express').Router()
const Restaurante = require('../models/restaurante')
const User = require('../models/usuario')
const jwt = require('jsonwebtoken')

const getTokenFrom = (request) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

restaurantesRouter.get('/', async (request, response) => {
  const restaurantes = await Restaurante.find({}).populate('sedes', { direccion: 1, telefono: 1 }).populate('menus', { nombre: 1 }).populate('adminRestaurante', { fullName: 1, rol: 1 })
  response.json(restaurantes)
})

restaurantesRouter.post('/registrarRestaurante', async (request, response) => {
  const token = getTokenFrom(request)
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const usuario = await User.findById(decodedToken.id)

  if (usuario.rol !== 'AdminRotonda') {
    return response.status(401).json({ error: 'usuario no valido' })
  }

  const body = request.body
  const resaturante = new Restaurante({
    nombre: body.nombre,
    especialidad: body.especialidad,
    adminRestaurante: body.adminRestaurante
  })

  const savedRestaurante = await resaturante.save()

  response.json(savedRestaurante)
})

module.exports = restaurantesRouter
