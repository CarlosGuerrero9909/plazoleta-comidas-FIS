const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const menuSchema = mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  productos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Producto'
    }
  ],
  restaurante: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurante'
  },
  precioTotal: {
    type: Number,
    required: true
  }
})

menuSchema.plugin(uniqueValidator)

menuSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Menu = mongoose.model('Menu', menuSchema)

module.exports = Menu
