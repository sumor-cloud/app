export default (parameter, value) => {
  const needLowerCase = parameter.toLowerCase === true
  const needUpperCase = parameter.toUpperCase === true

  if (value !== null && needLowerCase) {
    switch (parameter.type) {
      case 'string':
        value = value.toLowerCase()
        break
      default:
        break
    }
  }

  if (value !== null && needUpperCase) {
    switch (parameter.type) {
      case 'string':
        value = value.toUpperCase()
        break
      default:
        break
    }
  }

  return value
}
