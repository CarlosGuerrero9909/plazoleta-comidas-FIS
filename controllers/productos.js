const productosRouter = require('express').Router()
const Producto = require('../models/producto')
const Restaurante = require('../models/restaurante')
const Menu = require('../models/menu')
const decodificarToken = require('../utils/loginSecurity')
const actualizarStock = require('../controllers/ingredientes').actualizarStock

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

  const restaurante = await Restaurante.findById(body.restaurante)

  const producto = new Producto({
    nombre: body.nombre,
    clasificacion: body.clasificacion,
    precio: body.precio,
    imagen: body.imagen,
    stockProductoSimple: body?.stock,
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

  const restaurante = await Restaurante.findById(body.restaurante)

  const producto = new Producto({
    nombre: body.nombre,
    clasificacion: body.clasificacion,
    precio: body.precio,
    imagen: body.imagen,
    // ingredientesProductoCompuesto: body?.ingredientes,
    restaurante: restaurante._id
  })

  const productoSaved = await producto.save()
  response.json(productoSaved)
})

productosRouter.put('/actualizar/:id', async (request, response) => {
  const usuario = await decodificarToken(request)
  if (!usuario) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  if (usuario.rol !== 'AdminRestaurante') {
    return response.status(401).json({ error: 'usuario no valido' })
  }

  const body = request.body

  const p = await Producto.findById(request.params.id)

  const producto = {
    nombre: (!body.nombre) ? p.nombre : body.nombre,
    precio: (!body.precio) ? p.precio : body.precio,
    imagen: (!body.imagen) ? p.imagen : body.imagen
  }

  const productoAct = await Producto.findByIdAndUpdate(request.params.id, producto, { new: true })

  if (body.precio) {
    const menus = await Menu.find({ restaurante: p.restaurante, productos: { $in: [request.params.id] } }).populate('productos', { precio: 1 })
    for (const menu of menus) {
      let precioTotal = 0

      menu.productos.forEach((producto) => {
        precioTotal += producto.precio
      })

      const m = {
        precioTotal
      }

      await Menu.findByIdAndUpdate(menu.id, m, { new: true })
    }
  }

  response.json(productoAct)
})

productosRouter.put('/actualizarStock/:id', async (request, response) => {
  const usuario = await decodificarToken(request)
  if (!usuario) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  if (usuario.rol !== 'AdminRestaurante') {
    return response.status(401).json({ error: 'usuario no valido' })
  }

  const body = request.body

  if (body.stock === undefined) {
    return response.status(401).json({ error: 'Producto compuesto no tiene stock' })
  }

  const stockActual = await Producto.findById(request.params.id)

  const producto = {
    stockProductoSimple: actualizarStock(stockActual.stockProductoSimple, body.stock)
  }

  const productoAct = await Producto.findByIdAndUpdate(request.params.id, producto, { new: true })
  response.json(productoAct)
})

productosRouter.delete('/eliminar/:id', async (request, response) => {
  const usuario = await decodificarToken(request)
  if (!usuario) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  if (usuario.rol !== 'AdminRestaurante') {
    return response.status(401).json({ error: 'usuario no valido' })
  }

  await Producto.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

module.exports = productosRouter
