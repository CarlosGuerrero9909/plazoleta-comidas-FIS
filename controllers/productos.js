const productosRouter = require('express').Router()
const Producto = require('../models/producto')
const ProductoSimple = require('../models/productoSimple')
// const ProductoCompuesto = require('../models/productoCompuesto')
const User = require('../models/usuario')
const jwt = require('jsonwebtoken')

const getTokenFrom = (request) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

productosRouter.get('/', async (request, response) => {
  const productos = await Producto.find({})
  response.json(productos)
})

productosRouter.post('/registrarProductoSimple', async (request, response) => {
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

  const productoSimple = new ProductoSimple({
    stock: body.productoSimple.stock
  })

  const productoSimpleSaved = await productoSimple.save()

  const producto = new Producto({
    nombre: body.nombre,
    clasificacion: body.clasificacion,
    precio: body.precio,
    productoSimple: productoSimpleSaved._id,
    restaurante: body.restaurante
  })

  const productoSaved = await producto.save()
  response.json(productoSaved)
})

productosRouter.post('/registrarProductoCompuesto', async (request, response) => {
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

  /* const productoCompuesto = new ProductoCompuesto({
    ingredientes: body.ingredientes
  })

  const productoCompuestoSaved = productoCompuesto.save() */

  const producto = new Producto({
    nombre: body.nombre,
    clasificacion: body.clasificacion,
    precio: body.precio,
    // productoCompuesto: productoCompuestoSaved._id,
    restaurante: body.restaurante
  })

  const productoSaved = await producto.save()
  response.json(productoSaved)
})

module.exports = productosRouter
