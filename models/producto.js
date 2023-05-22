const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

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
  stockProductoSimple: {
    type: Number
  },
  ingredientesProductoCompuesto: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ingrediente'
    }],
    sparse: true
  },
  restaurante: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurante'
  }
});

productoSchema.plugin(uniqueValidator);

productoSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
  getters: true
});

productoSchema.path('ingredientesProductoCompuesto').get(function (ingredientes) {
  if (!ingredientes || ingredientes.length === 0) {
    // Si no hay ingredientes, devuelve undefined para ocultar el campo
    return undefined;
  }
  return ingredientes;
});

const Producto = mongoose.model('Producto', productoSchema);

module.exports = Producto;
