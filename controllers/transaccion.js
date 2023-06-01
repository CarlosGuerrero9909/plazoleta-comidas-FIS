const transaccionRouter = require('express').Router()
const Menu = require('../models/menu')
const Producto = require('../models/producto')
const calcularIva = require('./menus').calcularIva
const decodificarToken = require('../utils/loginSecurity')
require('../utils/carritoGlobal')

transaccionRouter.get('/disponibilidad', async (request, response) => {
  const usuario = await decodificarToken(request)
  if (!usuario) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const body = request.body
  const menus = body?.menus

  for (const menu of menus) {
    const menuBD = await Menu.findById(menu.id)
    const productos = menuBD.productos
    for (const producto of productos) {
      const productoBD = await Producto.findById(producto)
      if (productoBD.stockProductoSimple < menu.quantity) {
        global.globalCarrito = []
        return response.json({ resultado: false })
      }
    }
    global.globalCarrito.push(menu)
  }

  response.json({ resultado: true })
})

transaccionRouter.get('/pago', async (request, response) => {
  const usuario = await decodificarToken(request)
  if (!usuario) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  if (global.globalCarrito.length === 0) {
    return response.status(400).json({ resultado: 'No hay menus en el carrito' })
  }

  let totalPago = 0

  for (const menu of global.globalCarrito) {
    totalPago += calcularIva(menu.precioTotal) * menu.quantity
  }

  const dinero = Math.floor(Math.random() * (100000 - 40000) + 40000)

  if (dinero >= totalPago) {
    for (const menu of global.globalCarrito) {
      const menuBD = await Menu.findById(menu.id)
      const productos = menuBD.productos
      for (const producto of productos) {
        const productoBD = await Producto.findById(producto)
        if (productoBD.stockProductoSimple !== undefined) {
          const newStockSimple = {
            stockProductoSimple: productoBD.stockProductoSimple - menu.quantity
          }
          await Producto.findByIdAndUpdate(productoBD.id, newStockSimple, { new: true })
        }
      }
    }

    global.globalCarrito = []

    return response.json({ resultado: true })
  } else {
    return response.status(400).json({ resultado: false })
  }
})

module.exports = transaccionRouter
