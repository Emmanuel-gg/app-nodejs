/* eslint jest/no-hooks: ["error", { "allow": ["afterAll"] }] */
const mongoose = require('mongoose')
const { api, server } = require('./helpers/')
const { getProducts, setupProducts } = require('./helpers/products')
const { setupUsers } = require('./helpers/users')
describe('products CRUD tests', () => {
  it('should insert a product', async () => {
    expect.assertions(2)
    const users = await setupUsers()
    const user = users[0]
    const newUser = {
      username: user.username,
      password: 'password'
    }
    const apiLogin = await api
      .post('/api/auth/login')
      .send(newUser)
    const productsAtStart = await setupProducts()

    const newProduct = {
      name: 'Producto 2',
      important: true,
      bought: false,
      user: {
        id: user._id
      }
    }

    await api
      .post('/api/products')
      .auth(apiLogin.body.token, { type: 'bearer' })
      .send(newProduct)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const productsAtEnd = await getProducts()
    expect(productsAtEnd).toHaveLength(productsAtStart.length + 1)

    const names = productsAtEnd.map(p => p.name)
    expect(names).toContain(newProduct.name)

    // expect(user.products).toContain(apiPostProduct.body._id)
  }, 30000)

  it('should give error if not send token', async () => {
    expect.assertions(2)
    const productsAtStart = await setupProducts()

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
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const productsAtEnd = await getProducts()
    expect(productsAtEnd).toHaveLength(productsAtStart.length + 1)

    const names = productsAtEnd.map(p => p.name)
    expect(names).toContain(newProduct.name)

    // expect(user.products).toContain(apiPostProduct.body._id)
  }, 30000)
  it('should close all conections', async () => {
    expect.assertions(1)
    await mongoose.disconnect()
    await server.close()
    expect(!server._handle).toBe(true)
  }, 30000)
})
