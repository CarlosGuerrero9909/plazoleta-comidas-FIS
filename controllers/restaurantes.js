const restaurantesRouter = require('express').Router()
const Restaurante = require('../models/restaurante')
const decodificarToken = require('../utils/loginSecurity')

restaurantesRouter.get('/', async (request, response) => {
  const restaurantes = await Restaurante.find({}).populate('sedes', { direccion: 1, telefono: 1 }).populate('menus', { nombre: 1 }).populate('adminRestaurante', { fullName: 1, rol: 1 })
  response.json(restaurantes)
})

restaurantesRouter.post('/registrarRestaurante', async (request, response) => {
  const usuario = await decodificarToken(request)
  if (!usuario) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
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
