const mongoose = require('mongoose')

const productoSimpleSchema = mongoose.Schema({
  stock: {
    type: Number,
    required: true
  }
})

productoSimpleSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const ProductoSimple = mongoose.model('ProductoSimple', productoSimpleSchema)

module.exports = ProductoSimple
