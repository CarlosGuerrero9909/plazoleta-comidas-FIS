const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const ingredienteSchema = mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  stock: {
    type: Number,
    required: true
  }
})

ingredienteSchema.plugin(uniqueValidator)

ingredienteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Ingrediente = mongoose.model('Ingrediente', ingredienteSchema)

module.exports = Ingrediente
