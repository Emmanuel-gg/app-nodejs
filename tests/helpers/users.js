const User = require('../../models/User')
const bcrypt = require('bcrypt')

const getUsers = async () => {
  const usersDB = await User.find({})
  const users = usersDB.map(user => user.toJSON())
  return users
}

async function setupUsers () {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('password', 10)
  const user = new User({ username: 'emmanuel', passwordHash })

  await user.save()
  const users = await getUsers()
  return users
}
module.exports = {
  getUsers,
  setupUsers
}
