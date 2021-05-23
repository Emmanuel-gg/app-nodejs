const { Schema, model } = import('mongoose')

const userSchema = new Schema({
  username: String,
  passwordHash: String,
  name: String
})

userSchema.set('toJSON', {
  transform: (_, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject._v
  }
})
const User = model('User', userSchema)

module.exports = User
