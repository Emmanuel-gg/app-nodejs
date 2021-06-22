const { Schema, model } = require('mongoose')
const { removeIdV } = require('./helpers')
const productSchema = new Schema({
  name: String,
  important: Boolean,
  bought: Boolean,
  price: Number,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
})

productSchema.set('toJSON', {
  transform: (_, returnedObject) => {
    console.log({ returnedObject })
    returnedObject = removeIdV(returnedObject)
  }
})
const Product = model('Product', productSchema)

module.exports = Product
