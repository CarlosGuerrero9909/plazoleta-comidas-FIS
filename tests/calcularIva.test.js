const calcularIva = require('../controllers/menus').calcularIva

describe('Calcular IVA', () => {
  test('Precio con IVA para menu con valor de 10 mil', () => {
    const result = calcularIva(10000)

    expect(result).toBe(11900)
  })

  test('Precio con IVA para menu gratis', () => {
    const result = calcularIva(0)

    expect(result).toBe(0)
  })
})
