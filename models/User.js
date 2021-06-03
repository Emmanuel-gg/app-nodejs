const uniqueValidator = require('mongoose-unique-validator')
const { Schema, model } = require('mongoose')
const { removeIdV } = require('./helpers')
// eslint-disable-next-line no-unused-vars
const Product = require('../models/product')
const userSchema = new Schema({
  username: {
    type: String,
    unique: true
  },
  passwordHash: String,
  name: String,
  products: [{
    type: Schema.Types.ObjectId,
    ref: 'Product'
  }]
})
userSchema.plugin(uniqueValidator)
userSchema.set('toJSON', {
  transform: (_, returnedObject) => {
    returnedObject = removeIdV(returnedObject)
    delete returnedObject.passwordHash
  }
})
const User = model('User', userSchema)

module.exports = User
