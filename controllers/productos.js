const productosRouter = require('express').Router()
const Producto = require('../models/producto')
const ProductoSimple = require('../models/productoSimple')
const Restaurante = require('../models/restaurante')
// const ProductoCompuesto = require('../models/productoCompuesto')
const decodificarToken = require('../utils/loginSecurity')

productosRouter.get('/', async (request, response) => {
  const productos = await Producto.find({})
  response.json(productos)
})

productosRouter.post('/registrarProductoSimple', async (request, response) => {
  const usuario = await decodificarToken(request)
  if (!usuario) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  if (usuario.rol !== 'AdminRestaurante') {
    return response.status(401).json({ error: 'usuario no valido' })
  }

  const body = request.body

  const productoSimple = new ProductoSimple({
    stock: body.productoSimple.stock
  })

  const productoSimpleSaved = await productoSimple.save()
  const restaurante = await Restaurante.findById(body.restaurante)

  const producto = new Producto({
    nombre: body.nombre,
    clasificacion: body.clasificacion,
    precio: body.precio,
    imagen: body.imagen,
    productoSimple: productoSimpleSaved._id,
    restaurante: restaurante._id
  })

  const productoSaved = await producto.save()
  response.json(productoSaved)
})

productosRouter.post('/registrarProductoCompuesto', async (request, response) => {
  const usuario = await decodificarToken(request)
  if (!usuario) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  if (usuario.rol !== 'AdminRestaurante') {
    return response.status(401).json({ error: 'usuario no valido' })
  }

  const body = request.body

  /* const productoCompuesto = new ProductoCompuesto({
    ingredientes: body.ingredientes
  })

  const productoCompuestoSaved = productoCompuesto.save() */
  const restaurante = await Restaurante.findById(body.restaurante)

  const producto = new Producto({
    nombre: body.nombre,
    clasificacion: body.clasificacion,
    precio: body.precio,
    imagen: body.precio,
    // productoCompuesto: productoCompuestoSaved._id,
    restaurante: restaurante._id
  })

  const productoSaved = await producto.save()
  response.json(productoSaved)
})

productosRouter.put('/actualizarProductoSimple/:id', async (request, response) => {
  const usuario = await decodificarToken(request)
  if (!usuario) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  if (usuario.rol !== 'AdminRestaurante') {
    return response.status(401).json({ error: 'usuario no valido' })
  }

  const body = request.body

  const producto = {
    nombre: body.nombre,
    precio: body.precio,
    imagen: body.imagen
  }

  const productoAct = await Producto.findByIdAndUpdate(request.params.id, producto, { new: true })
  response.json(productoAct)
})

productosRouter.delete('/eliminarProductoSimple/:id', async (request, response) => {
  const usuario = await decodificarToken(request)
  if (!usuario) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  if (usuario.rol !== 'AdminRestaurante') {
    return response.status(401).json({ error: 'usuario no valido' })
  }

  const producto = await Producto.findById(request.params.id)

  await Producto.findByIdAndRemove(request.params.id)
  await ProductoSimple.findByIdAndRemove(producto.productoSimple)
  response.status(204).end()
})

module.exports = productosRouter
