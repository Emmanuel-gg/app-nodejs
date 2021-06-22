/* eslint jest/no-hooks: ["error", { "allow": ["afterAll"] }] */
const mongoose = require('mongoose')
const { api, server } = require('./helpers/')
const { getProducts, setupProducts, TestProduct } = require('./helpers/products')
const { getUser } = require('./helpers/users')
const { errorMessages } = require('../errors')
describe('products CRUD tests', () => {
  it('should insert a product', async () => {
    expect.assertions(3)

    const { products: productsAtStart, token, user } = await setupProducts()

    const newProductRaw = {
      name: 'Producto 2',
      important: true,
      bought: false,
      user: {
        id: user._id
      }
    }
    const apiPostProduct = await api
      .post('/api/products')
      .auth(token, { type: 'bearer' })
      .send(newProductRaw)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    const newProduct = apiPostProduct.body

    const productsAtEnd = await getProducts()
    expect(productsAtEnd).toHaveLength(productsAtStart.length + 1)

    const names = productsAtEnd.map(p => p.name)
    expect(names).toContain(newProduct.name)

    const userWithNewProduct = await getUser(user.id)
    const userProductNames = userWithNewProduct.products.map(p => {
      return p.name
    })
    expect(userProductNames).toContain(newProduct.name)
  }, 30000)

  it('should give error if not send token', async () => {
    expect.assertions(2)
    const { products: productsAtStart } = await setupProducts()

    const newProduct = {
      name: 'Producto 2',
      important: true,
      bought: false,
      user: {
        id: 1
      }
    }

    await api
      .post('/api/products')
      .send(newProduct)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    const productsAtEnd = await getProducts()
    expect(productsAtEnd).toHaveLength(productsAtStart.length)

    const names = productsAtEnd.map(p => p.name)
    expect(names).not.toContain(newProduct.name)
  }, 30000)

  it('should delete a product', async () => {
    expect.assertions(3)

    const { products: productsAtStart, token, user } = await setupProducts()

    await api
      .delete('/api/products/' + productsAtStart[0].id)
      .auth(token, { type: 'bearer' })
      .expect(204)

    const productsAtEnd = await getProducts()
    expect(productsAtEnd).toHaveLength(productsAtStart.length - 1)

    const names = productsAtEnd.map(p => p.name)
    expect(names).not.toContain(TestProduct.name)

    const userWithNewProduct = await getUser(user.id)
    const userProductNames = userWithNewProduct.products.map(p => {
      return p.name
    })
    expect(userProductNames).not.toContain(TestProduct.name)
  }, 30000)

  it('should delete all product', async () => {
    expect.assertions(2)

    const { token, user } = await setupProducts()

    const newProductRaw = {
      name: 'Producto 2',
      important: true,
      bought: false,
      user: {
        id: user._id
      }
    }
    await api
      .post('/api/products')
      .auth(token, { type: 'bearer' })
      .send(newProductRaw)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    await api
      .delete('/api/products/')
      .send({ action: 'delete' })
      .auth(token, { type: 'bearer' })
      .expect(204)

    const productsAtEnd = await getProducts()
    expect(productsAtEnd).toHaveLength(0)

    const userWithNonProduct = await getUser(user.id)
    expect(userWithNonProduct.products).toHaveLength(0)
  }, 30000)

  it('should not delete all product', async () => {
    expect.assertions(3)

    const { products: productsAtStart, token, user } = await setupProducts()

    const newProductRaw = {
      name: 'Producto 2',
      important: true,
      bought: false,
      user: {
        id: user._id
      }
    }
    await api
      .post('/api/products')
      .auth(token, { type: 'bearer' })
      .send(newProductRaw)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const deleteAll = await api
      .delete('/api/products/')
      .auth(token, { type: 'bearer' })
      .expect(400)

    expect(deleteAll.body.errors.id.messages).toContain(errorMessages.MissingParam('id'))
    const productsAtEnd = await getProducts()
    expect(productsAtEnd).toHaveLength(productsAtStart.length + 1)

    const userWithNonProduct = await getUser(user.id)
    expect(userWithNonProduct.products).toHaveLength(productsAtStart.length + 1)
  }, 30000)
  /*
  it.ignore('should bought a product', async () => {
    expect.assertions(1)

    const { products: productsAtStart, token } = await setupProducts()

    const productChanged = await api
      .patch(`/api/products/${productsAtStart[0].id}/bought`)
      .auth(token, { type: 'bearer' })
      .send({
        price: 80000
      })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(productChanged.body.bought).toBe(true)
  }, 30000) */

  it('should close all conections', async () => {
    expect.assertions(1)
    await mongoose.disconnect()
    await server.close()
    expect(!server._handle).toBe(true)
  }, 30000)
})
