const User = require('../../models/User')
const bcrypt = require('bcrypt')
const { api } = require('../helpers/')

const TestUser = { username: 'emmanuel', password: 'password', name: 'Emmanuel' }

const getUsers = async () => {
  const usersDB = await User.find({})
  const users = usersDB.map(user => user.toJSON())
  return users
}
const getUser = async (_id) => {
  const userDB = await User.findById(_id).populate('products', {
    name: 1
  })
  console.log({ userDB })
  return userDB.toJSON()
}

async function setupUsers () {
  await User.deleteMany({})

  const { username, password } = TestUser

  const passwordHash = await bcrypt.hash(password, 10)
  const user = new User({ username, passwordHash })

  await user.save()
  const users = await getUsers()

  const { body: { token } } = await api
    .post('/api/auth/login')
    .send(TestUser)

  return { users, token }
}
module.exports = {
  getUsers,
  getUser,
  setupUsers,
  TestUser
}
