const mongoose = require('mongoose')

const productoCompuestoSchema = mongoose.Schema({
  ingredientes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ingrediente'
    }
  ]
})

productoCompuestoSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const ProductoCompuesto = mongoose.model('ProductoCompuesto', productoCompuestoSchema)

module.exports = ProductoCompuesto
