const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const clienteSchema = mongoose.Schema({
  direccion: {
    type: String,
    required: true
  },
  celular: {
    type: Number,
    required: true
  }
})

const userSchema = mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  rol: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    minlength: 3,
    unique: true
  },
  passwordHash: String,
  cliente: {
    type: clienteSchema
  }
})

userSchema.plugin(uniqueValidator)

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash
  }
})

const Usuario = mongoose.model('Usuario', userSchema)

module.exports = Usuario
