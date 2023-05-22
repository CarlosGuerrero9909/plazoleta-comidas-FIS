const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const restauranteSchema = mongoose.Schema({
  nombre: {
    type: String,
    unique: true
  },
  especialidad: {
    type: String,
    required: true
  },
  logo: {
    type: String,
    required: true
  },
  banner: {
    type: String,
    required: true
  },
  sedes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Sede'
    }
  ],
  menus: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Menu'
    }
  ],
  adminRestaurante: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario'
  }
})

restauranteSchema.plugin(uniqueValidator)

restauranteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Restaurante = mongoose.model('Restaurante', restauranteSchema)

module.exports = Restaurante
