const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const sedeSchema = mongoose.Schema({
  direccion: {
    type: String,
    required: true,
    unique: true
  },
  telefono: {
    type: String,
    required: true
  },
  restaurante: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurante'
  }
})

sedeSchema.plugin(uniqueValidator)

sedeSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
const Sede = mongoose.model('Sede', sedeSchema)

module.exports = Sede
