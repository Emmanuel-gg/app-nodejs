const { STRING, BOOLEAN, REQUIRED, NUMBER, AT_LEAST_OF } = require('./validations')

function hasError (errors) {
  let hasErrors = false

  for (const error in errors) {
    if (errors[error].messages?.length > 0) { hasErrors = true }
  }
  return hasErrors
}
function changeDefaultError (error, errors) {
  const newError = errors[error] || {}
  console.log(error.properties?.message)
  console.log({ errors })
  if (error.properties?.message?.length > 0) {
    if (!errors[error]) { errors[error] = {}; errors[error].messages = [] }
    newError.messages = errors[error].messages.concat([errors[error].properties?.message])
  }

  return newError
}
function checkForErrors (fields) {
  const errors = {}
  const atLeastOf = {}
  const errorAtLeastOf = AT_LEAST_OF(null, null)
  for (const field in fields) {
    if (Object.hasOwnProperty.call(fields, field)) {
      const { param, validations } = fields[field]
      errors[field] = {}
      errors[field].messages = []
      const fieldValidation = validations.find(validation => validation.type === errorAtLeastOf.type)
      if (fieldValidation) {
        if (atLeastOf[fieldValidation.id]) {
          atLeastOf[fieldValidation.id].fieldsValues.push(!!param)
          atLeastOf[fieldValidation.id].fieldsNames.push(field)
        } else {
          atLeastOf[fieldValidation.id].fieldsValues = [!!param]
          atLeastOf[fieldValidation.id].fieldsNames = [field]
          atLeastOf[fieldValidation.id].amount = fieldValidation.amount
          atLeastOf[fieldValidation.id].label = fieldValidation.label
        }
      }

      if (typeof (param) === 'undefined' && validations.includes(REQUIRED)) { errors[field].messages.push(errorMessages.MissingParam(field)) }

      if (validations.includes(REQUIRED)) {
        if (validations.includes(STRING)) {
          if (typeof (param) === 'string') {
            if (!(param.length > 0)) {
              errors[field].messages.push(errorMessages.Required(field))
            }
          } else {
            errors[field].messages.push(errorMessages.Required(field))
          }
        } else {
          if (param === null || param === undefined) {
            errors[field].messages.push(errorMessages.Required(field))
          }
        }
      }

      if (validations.includes(STRING)) {
        if (validations.includes(REQUIRED)) {
          if (typeof (param) !== 'string') {
            errors[field].messages.push(errorMessages.MustBeString(field))
          }
        } else if (param !== null && param !== undefined) {
          if (typeof (param) !== 'string') {
            errors[field].messages.push(errorMessages.MustBeString(field))
          }
        }
      }

      if (validations.includes(BOOLEAN)) {
        if (validations.includes(REQUIRED)) {
          if (typeof (param) !== 'boolean') {
            errors[field].messages.push(errorMessages.MustbeBoolean(field))
          }
        } else if (param !== null && param !== undefined) {
          if (typeof (param) !== 'boolean') {
            errors[field].messages.push(errorMessages.MustbeBoolean(field))
          }
        }
      }

      if (validations.includes(NUMBER)) {
        if (validations.includes(REQUIRED)) {
          if (typeof (param) !== 'number') {
            errors[field].messages.push(errorMessages.MustbeNumber(field))
          }
        } else if (param !== null && param !== undefined) {
          if (typeof (param) !== 'number') {
            errors[field].messages.push(errorMessages.MustbeNumber(field))
          }
        }
      }
    }
  }
  for (const value in atLeastOf) {
    if (Object.hasOwnProperty.call(atLeastOf, value)) {
      const { amount, fieldsNames, fieldsValues, label } = atLeastOf[value]
      const fieldsSended = fieldsValues.filter(element => element === true).length

      if (fieldsSended < amount) {
        if (!errors.general) { errors.general = {}; errors.general.messages = [] }
        errorMessages.general.messages.push(errorMessages.AtLeastOf(label, amount, fieldsNames.join(', ')))
      }
    }
  }
  return errors
}

const errorMessages = {
  General: (name) => `The param (${name}) have a error`,
  MissingParam: (name) => `The param (${name}) its missing`,
  MustBeBoolean: (name) => `The param (${name}) must be boolean`,
  MustBeString: (name) => `The param (${name}) must be string`,
  MustBeNumber: (name) => `The param (${name}) must be number`,
  Required: (name) => `The param (${name}) cannot be empty`,
  unique: (name) => `${name} already be taken`,
  AtLeastOf: (label, amount, fields) => `The ${label} must have at least (${amount}) of the fields (${fields})`
}
module.exports = {
  errorMessages,
  checkForErrors,
  hasError,
  changeDefaultError
}
