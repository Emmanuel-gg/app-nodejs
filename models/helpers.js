const removeIdV = (obj) => {
  obj.id = obj._id
  delete obj._id
  delete obj._v
  delete obj.__v
  return obj
}

module.exports = { removeIdV }
