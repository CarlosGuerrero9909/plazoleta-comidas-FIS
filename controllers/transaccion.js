const transaccionRouter = require('express').Router()
const Menu = require('../models/menu')
const Pedido = require('../models/pedido')
const Producto = require('../models/producto')
const calcularIva = require('./menus').calcularIva
const decodificarToken = require('../utils/loginSecurity')
require('../utils/carritoGlobal')

transaccionRouter.post('/disponibilidad', async (request, response) => {
  const usuario = await decodificarToken(request)
  if (!usuario) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const menus = request.body

  console.log(menus)

  global.globalCarrito = []

  const productos = []

  for (const menu of menus) {
    const productosBD = menu.productos

    for (const producto of productosBD) {
      const productoBD = await Producto.findById(producto.id)

      let repetido = false

      for (let i = 0; i < productos.length; i++) {
        if (productos[i].nombre === productoBD.nombre) {
          productos[i].cantidad += menu.quantity
          repetido = true
          break
        }
      }

      if (!repetido) {
        const producto = {
          id: productoBD.id,
          nombre: productoBD.nombre,
          cantidad: menu.quantity,
          stockProductoSimple: productoBD.stockProductoSimple
        }
        productos.push(producto)
      }
    }
  }

  for (const producto of productos) {
    if (producto.stockProductoSimple < producto.cantidad) {
      global.globalCarrito = []
      return response.json({ resultado: false })
    }
  }

  console.log(productos)

  for (const menu of menus) {
    global.globalCarrito.push(menu)
  }

  response.json({ resultado: true })
})

transaccionRouter.post('/pago', async (request, response) => {
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

  const dinero = 200000// Math.floor(Math.random() * (100000 - 40000) + 40000)

  if (dinero >= totalPago) {
    const menus = []
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
      menus.push(menu.id)
    }

    const pedido = new Pedido({
      fecha: new Date(),
      estado: 'Preparando',
      precioTotal: totalPago,
      menu: menus,
      cliente: usuario.id
    })

    await pedido.save()

    global.globalCarrito = []

    return response.json({ resultado: 'pago exitoso' })
  } else {
    return response.status(400).json({ resultado: 'no hay dinero' })
  }
})

module.exports = transaccionRouter
