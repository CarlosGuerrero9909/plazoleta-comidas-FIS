// El manejo de las variables de entorno se extrae en un archivo utils/config.js separado
require('dotenv').config()

const PORT = process.env.PORT
let MONGODB_URI = process.env.MONGODB_URI

// en modo de ejecucion para pruebas se utiliza una direccion modgoDB diferente
if (process.env.NODE_ENV === 'test') {
  MONGODB_URI = process.env.TEST_MONGODB_URI
}

module.exports = {
  MONGODB_URI,
  PORT
}
