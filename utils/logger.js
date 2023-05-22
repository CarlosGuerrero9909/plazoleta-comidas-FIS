// El logger tiene dos funciones, info para imprimir mensajes de registro normales y error para todos los mensajes de error.
const info = (...params) => {
  // solo hace los logs si no se esta en modo de ejecucion para pruebas
  if (process.env.NODE_ENV !== 'test') {
    console.log(...params)
  }
}

const error = (...params) => {
  if (process.env.NODE_ENV !== 'test') { 
    console.error(...params)
  }
}

module.exports = {
  info, error
}
