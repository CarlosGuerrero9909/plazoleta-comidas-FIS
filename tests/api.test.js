const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const api = supertest(app)
const Producto = require('../models/producto')


beforeEach(async () => {
    //se eliminan e insertan los productos inciales para que el estado incial se siempre el mismo
    await Producto.deleteMany({})
    await Producto.insertMany(helper.productosIniciales)
})

describe('Consular productos cuando hay productos guardados', () => {
    test('productos son retornados como json', async () => {
        await api
        .get('/api/productos')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    }, 100000)

    test('todos los productos son retornados', async () => {
        const response = await api.get('/api/productos')
        expect(response.body).toHaveLength(helper.productosIniciales.length)
    })
})

describe('Añadir un producto', () => {
    test('exitoso con producto valido', async () => {
        const nuevoProducto = {
        "nombre": "Papas fritas",
        "clasificacion": "Acompañamiento",
        "precio": 7000,
        "imagen": "link de la imagen",
        "stock": 330,
        "restaurante": "646bbf8804567e13df995498"
        }
        
        const usuario = await helper.obtenerUsuario()

        await api
        .post('/api/productos/registrarProductoSimple')
        .set('Authorization', 'Bearer ' + usuario.token)
        .send(nuevoProducto)
        .expect(200)
        .expect('Content-Type', /application\/json/)

        const productosAlFinal = await helper.productosEnDB()
        expect(productosAlFinal).toHaveLength(helper.productosIniciales.length + 1)

        const contents = productosAlFinal.map(n => n.nombre)
        expect(contents).toContain('Papas fritas')
    })

    test('falla con codigo 400 si los datos son invalidos o incompletos', async () => {
        const nuevoProducto = {
        "clasificacion": "Acompañamiento",
        "restaurante": "646bbf8804567e13df995498"
        }
        const usuario = await helper.obtenerUsuario()

        await api
        .post('/api/productos/registrarProductoSimple')
        .set('Authorization', 'Bearer ' + usuario.token)
        .send(nuevoProducto)
        .expect(400)

        const productosAlFinal = await helper.productosEnDB()

        expect(productosAlFinal).toHaveLength(helper.productosIniciales.length)
    })
})

describe('Eliminando un producto', () => {
    test('exitoso con codigo 204 si el id es valido', async () => {
        const productosAlInicio = await helper.productosEnDB()
        const productoParaEliminar = productosAlInicio[0]
        const usuario = await helper.obtenerUsuario()

        await api
        .delete(`/api/productos/eliminar/${productoParaEliminar.id}`)
        .set('Authorization', 'Bearer ' + usuario.token)
        .expect(204)

        const productosAlFinal = await helper.productosEnDB()

        expect(productosAlFinal).toHaveLength(
        helper.productosIniciales.length - 1
        )

        const contents = productosAlFinal.map(r => r.nombre)

        expect(contents).not.toContain(productoParaEliminar.nombre)
    })

    test('fallido con codigo 400 si no encuentra el id', async () => {
        const usuario = await helper.obtenerUsuario()

        await api
            .delete(`/api/productos/eliminar/${helper.idNoExistente}`)
            .set('Authorization', 'Bearer ' + usuario.token)
            .expect(400)
    
        const productosAlFinal = await helper.productosEnDB()
    
        expect(productosAlFinal).toHaveLength(
            helper.productosIniciales.length
        )
    })
})

describe('Actualizar un producto', () => {
    test('exitoso con id valido', async () => {
        const productosAlInicio = await helper.productosEnDB()
        const productoParaActualizar = productosAlInicio[0]
        const usuario = await helper.obtenerUsuario()
        
        const nuevoProducto = {
        "nombre": "Nuevo nombre",
        "precio": 2000,
        "imagen": "Nueva imagen"
        }

        await api
        .put(`/api/productos/actualizar/${productoParaActualizar.id}`)
        .set('Authorization', 'Bearer ' + usuario.token)
        .send(nuevoProducto)
        .expect(200)

        const productosAlFinal = await helper.productosEnDB()
        const nom = productosAlFinal.map(r => r.nombre)
        const pre = productosAlFinal.map(r => r.precio)
        const ima = productosAlFinal.map(r => r.imagen)

        expect(nom).toContain(nuevoProducto.nombre)
        expect(pre).toContain(nuevoProducto.precio)
        expect(ima).toContain(nuevoProducto.imagen)
    })

    test('fallido con codigo 404 si no encuentra el id', async () => {
        const usuario = await helper.obtenerUsuario()

        const nuevoProducto = {
            "nombre": "Nuevo nombre",
            "precio": 2000,
            "imagen": "Nueva imagen"
        }

        await api
            .put(`/api/productos/eliminar/${helper.idNoExistente}`)
            .set('Authorization', 'Bearer ' + usuario.token)
            .send(nuevoProducto)
            .expect(404)
    })
})


afterAll(() => {
  mongoose.connection.close()
})