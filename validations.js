module.exports = {

  STRING: 'string',
  BOOLEAN: 'boolean',
  NUMBER: 'number',
  REQUIRED: 'required',
  AT_LEAST_OF: (id, label, amount) => ({
    amount,
    type: 'atLeastOf',
    label,
    id
  })
}
