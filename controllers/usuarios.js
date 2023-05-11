const usersRouter = require('express').Router()
const User = require('../models/usuario')
const decodificarToken = require('../utils/loginSecurity')
const bcrypt = require('bcrypt')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({})
  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const body = request.body

  if (body.password === undefined || body.password.length < 3) {
    return response.status(400).json({ error: 'password is too short or missing' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    fullName: body.fullName,
    rol: 'Cliente',
    email: body.email,
    passwordHash,
    cliente: body?.cliente
  })

  const savedUser = await user.save()

  response.json(savedUser)
})

usersRouter.post('/registrarAdminRestaurante', async (request, response) => {
  const usuario = await decodificarToken(request)
  if (!usuario) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  if (usuario.rol !== 'AdminRotonda') {
    return response.status(401).json({ error: 'usuario no valido' })
  }

  const body = request.body
  if (body.password === undefined || body.password.length < 3) {
    return response.status(400).json({ error: 'password is too short or missing' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    fullName: body.fullName,
    rol: 'AdminRestaurante',
    email: body.email,
    passwordHash
  })

  const savedUser = await user.save()

  response.json(savedUser)
})

usersRouter.delete('/:id', async (request, response) => {
  await User.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

module.exports = usersRouter
