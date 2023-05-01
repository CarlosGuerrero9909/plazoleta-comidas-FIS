const usersRouter = require('express').Router()
const User = require('../models/usuario')
const bcrypt = require('bcrypt')

usersRouter.get('/', async (request, response, next) => {
  const users = await User.find({})
  response.json(users)
})

usersRouter.post('/', async (request, response, next) => {
  const body = request.body

  if (body.password === undefined || body.password.length < 3) {
    return response.status(400).json({ error: 'password is too short or missing' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    fullName: body.fullName,
    rol: body.rol,
    email: body.email,
    passwordHash,
    cliente: body?.cliente
  })

  const savedUser = await user.save()

  response.json(savedUser)
})

usersRouter.delete('/:id', async (request, response) => {
  await User.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

module.exports = usersRouter
