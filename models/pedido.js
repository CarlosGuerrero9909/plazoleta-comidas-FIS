const mongoose = require('mongoose')

const pedidoSchema = mongoose.Schema({
  fecha: {
    type: Date,
    required: true
  },
  estado: {
    type: String,
    required: true
  },
  precioTotal: {
    type: Number,
    required: true
  },
  menu: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Menu'
    }
  ],
  cliente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario'
  }
})

pedidoSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash
  }
})

const Pedido = mongoose.model('Pedido', pedidoSchema)

module.exports = Pedido
