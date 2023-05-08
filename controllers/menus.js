const menusRouter = require('express').Router()
const Menu = require('../models/menu')
const Producto = require('../models/producto')
const User = require('../models/usuario')
const jwt = require('jsonwebtoken')

const getTokenFrom = (request) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

menusRouter.get('/', async (request, response) => {
  const menus = await Menu.find({}).populate('productos', { nombre: 1, clasificacion: 1, precio: 1 }).populate('restaurante', { nombre: 1 })
  response.json(menus)
})

menusRouter.post('/registrarMenu', async (request, response) => {
  const token = getTokenFrom(request)
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const usuario = await User.findById(decodedToken.id)

  if (usuario.rol !== 'AdminRestaurante') {
    return response.status(401).json({ error: 'usuario no valido' })
  }

  const body = request.body

  const productos = []

  // Permite ejecutar las promesas en orden, ya que el for no es asincronico
  for (const idProducto of body.productos) {
    const producto = await Producto.findById(idProducto)
    productos.push(producto)
  }

  let precioTotal = 0

  productos.forEach((producto) => {
    precioTotal += producto.precio
  })

  const menu = new Menu({
    nombre: body.nombre,
    productos: body.productos,
    restaurante: body.restaurante,
    precioTotal
  })

  const menuSaved = await menu.save()
  response.json(menuSaved)
})

module.exports = menusRouter
