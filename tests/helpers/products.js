const Product = require('../../models/Product')
const User = require('../../models/User')
const { setupUsers } = require('./users')

const TestProduct = {
  name: 'Producto 1',
  important: true,
  bought: false
}

const getProducts = async () => {
  const productsDB = await Product.find({})
  const products = productsDB.map(user => user.toJSON())
  return products
}

async function setupProducts () {
  await Product.deleteMany({})
  const { users: [userRaw], token } = await setupUsers()
  const user = await User.findById(userRaw.id)
  const product = new Product({
    ...TestProduct,
    user
  })

  const productBD = await product.save()
  user.products = user.products.concat([productBD._id])
  await user.save()
  const products = await getProducts()
  return { products, token, user }
}
module.exports = {
  getProducts,
  setupProducts,
  TestProduct
}
