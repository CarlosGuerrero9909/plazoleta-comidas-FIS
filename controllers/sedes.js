const sedesRouter = require('express').Router()
const Sede = require('../models/sede')
const Restaurante = require('../models/restaurante')
const decodificarToken = require('../utils/loginSecurity')

sedesRouter.get('/', async (request, response) => {
  const sedes = await Sede.find({})
  response.json(sedes)
})

sedesRouter.post('/registrarSede', async (request, response) => {
  const usuario = await decodificarToken(request)
  if (!usuario) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  if (usuario.rol !== 'AdminRotonda') {
    return response.status(401).json({ error: 'usuario no valido' })
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
