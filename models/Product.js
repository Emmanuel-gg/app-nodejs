const { Schema, model } = require('mongoose')
const { removeIdV } = require('./helpers')
const productSchema = new Schema({
  name: String,
  important: Boolean,
  bought: Boolean,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
})

productSchema.set('toJSON', {
  transform: (_, returnedObject) => {
    returnedObject = removeIdV(returnedObject)
  }
})
const Product = model('Product', productSchema)

module.exports = Product
