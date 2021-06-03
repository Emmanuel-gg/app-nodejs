const Product = require('../../models/Product')

const getProducts = async () => {
  const productsDB = await Product.find({})
  const products = productsDB.map(user => user.toJSON())
  return products
}

async function setupProducts () {
  await Product.deleteMany({})

  const product = new Product({ name: 'Producto 1', important: true, bought: false })

  await product.save()
  const products = await getProducts()
  return products
}
module.exports = {
  getProducts,
  setupProducts
}
