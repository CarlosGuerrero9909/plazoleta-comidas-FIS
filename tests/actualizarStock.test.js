const actualizarStock = require('../controllers/ingredientes').actualizarStock

describe('Actualizar stock', () => {
  test('Se añade 30 al stock', () => {
    const result = actualizarStock(200, 30)
    expect(result).toBe(230)
  })

  test('No se añade nada al stock', () => {
    const result = actualizarStock(200, 0)
    expect(result).toBe(200)
  })

  test('No se añade stock negativo', () => {
    const result = actualizarStock(200, -10)
    expect(result).toBe(200)
  })
})
