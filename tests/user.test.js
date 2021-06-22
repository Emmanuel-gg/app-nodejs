/* eslint jest/no-hooks: ["error", { "allow": ["afterAll"] }] */
const mongoose = require('mongoose')
const { api, server } = require('./helpers/')
const { getUsers, setupUsers, TestUser } = require('./helpers/users')
const { errorMessages } = require('../errors')
describe('user tests', () => {
  it('should insert a user', async () => {
    expect.assertions(2)
    const { users: usersAtStart } = await setupUsers()

    const newUser = {
      username: 'usuario',
      name: 'Usuario',
      password: 'password'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await getUsers()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  }, 30000)

  it('should fail with a username already taken', async () => {
    expect.assertions(3)
    const { users: usersAtStart } = await setupUsers()

    const result = await api
      .post('/api/users')
      .send(TestUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.errors.username.messages).toContain('username already be taken')
    const usersAtEnd = await getUsers()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
    const names = usersAtEnd.map(u => u.name)
    expect(names).not.toContain(TestUser.name)
  }, 30000)

  it('should fail if receives neither password nor username nor name', async () => {
    expect.assertions(4)
    const { users: usersAtStart } = await setupUsers()

    const newUser = {
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.errors.username.messages).toContain(errorMessages.MissingParam('username'))
    expect(result.body.errors.name.messages).toContain(errorMessages.MissingParam('name'))
    expect(result.body.errors.password.messages).toContain(errorMessages.MissingParam('password'))

    const usersAtEnd = await getUsers()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  }, 30000)

  it('should close all conections', async () => {
    expect.assertions(1)
    await mongoose.disconnect()
    await server.close()
    expect(!server._handle).toBe(true)
  }, 30000)
})
