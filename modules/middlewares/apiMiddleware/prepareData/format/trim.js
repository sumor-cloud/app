export default (parameter, value) => {
  const needTrim = parameter.trim !== false

  if (value !== null && needTrim) {
    switch (parameter.type) {
      case 'string':
        value = value.trim()
        break
      default:
        break
    }
  }

  return value
}
