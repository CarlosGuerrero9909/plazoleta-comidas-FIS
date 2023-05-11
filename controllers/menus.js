const menusRouter = require('express').Router()
const Menu = require('../models/menu')
const Producto = require('../models/producto')
const decodificarToken = require('../utils/loginSecurity')

menusRouter.get('/', async (request, response) => {
  const menus = await Menu.find({}).populate('productos', { nombre: 1, clasificacion: 1, precio: 1 }).populate('restaurante', { nombre: 1 })
  response.json(menus)
})

menusRouter.post('/registrarMenu', async (request, response) => {
  const usuario = await decodificarToken(request)
  if (!usuario) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
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
    imagen: body.imagen,
    restaurante: body.restaurante,
    precioTotal
  })

  const menuSaved = await menu.save()
  response.json(menuSaved)
})

module.exports = menusRouter
