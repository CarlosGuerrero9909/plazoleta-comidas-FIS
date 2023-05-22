const Producto = require('../models/producto')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const productosIniciales = [
    {
        "nombre": "Nuggets de pollo",
        "clasificacion": "Plato fuerte",
        "precio": 10000,
        "imagen": "link de la imagen",
        "stock": 200,
        "restaurante": "646bbf8804567e13df995498"
    },
    {
        "nombre": "Gaseosa Coca-Cola 250ml",
        "clasificacion": "Bebida",
        "precio": 4700,
        "imagen": "link de la imagen",
        "stock": 200,
        "restaurante": "646bbf8804567e13df995498"
    }
  ]

  const idNoExistente = async () => {
    const producto = new Producto({
        "nombre": "Gaseosa Pepsi 250ml",
        "clasificacion": "Bebida",
        "precio": 3700,
        "imagen": "link de la imagen",
        "stock": 300,
        "restaurante": "646adfc8467967de29251ee1"
    })

    await producto.save()
    await producto.remove()
  
    return producto._id.toString()
  }

  const productosEnDB = async () => {
    const productos = await Producto.find({})
    return productos.map(producto => producto.toJSON())
  }

  const obtenerUsuario = async () => {
    const usuario = await api
          .post('/api/login')
          .send({
              "email":"alfonzo123@gmail.com",
              "password": "alfonzo123"
          })
    return usuario.body
  }

  module.exports = {
    productosIniciales,
    idNoExistente,
    productosEnDB,
    obtenerUsuario
  }