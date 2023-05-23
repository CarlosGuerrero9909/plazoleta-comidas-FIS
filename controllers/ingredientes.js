const ingredientesRouter = require('express').Router()
const Ingrediente = require('../models/ingrediente')
const decodificarToken = require('../utils/loginSecurity')

ingredientesRouter.get('/', async (request, response) => {
  const ingredientes = await Ingrediente.find({})
  response.json(ingredientes)
})

ingredientesRouter.post('/registrarIngrediente', async (request, response) => {
  const usuario = await decodificarToken(request)
  if (!usuario) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  if (usuario.rol !== 'AdminRotonda') {
    return response.status(401).json({ error: 'usuario no valido' })
  }

  const body = request.body
  const ingrediente = new Ingrediente({
    nombre: body.nombre,
    stock: body.stock
  })

  const savedIngrediente = await ingrediente.save()

  response.json(savedIngrediente)
})

ingredientesRouter.put('/actualizarStock/:id', async (request, response) => {
  const usuario = await decodificarToken(request)
  if (!usuario) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  if (usuario.rol !== 'AdminRotonda') {
    return response.status(401).json({ error: 'usuario no valido' })
  }

  const body = request.body
  const stockActual = await Ingrediente.findById(request.params.id)

  const ingrediente = ({
    stock: actualizarStock(stockActual.stock, body.stock)
  })

  const ingredienteAct = await Ingrediente.findByIdAndUpdate(request.params.id, ingrediente, { new: true })
  response.json(ingredienteAct)
})

const actualizarStock = (actual, extra) => {
  if (extra <= 0) {
    return actual // si el stock a añadir es cero o negativo no se actualiza
  }
  return actual + extra
}

module.exports = {
  ingredientesRouter,
  actualizarStock
}
