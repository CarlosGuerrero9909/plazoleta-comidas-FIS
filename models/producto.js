const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const productoSchema = mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  clasificacion: {
    type: String,
    required: true
  },
  precio: {
    type: Number,
    required: true
  },
  imagen: {
    type: String,
    required: true
  },
  productoSimple: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductoSimple'
  },
  productoCompuesto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductoCompuesto'
  },
  restaurante: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurante'
  }
})

productoSchema.plugin(uniqueValidator)

productoSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Producto = mongoose.model('Producto', productoSchema)

module.exports = Producto
