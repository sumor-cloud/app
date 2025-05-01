export default (parameter, value) => {
  if (parameter.length && value !== null) {
    switch (parameter.type) {
      case 'string':
        if (value.length > parameter.length) {
          return true
        }
        break
      case 'number':
        if (value.toString().length > parameter.length) {
          return true
        }
        break
      case 'array':
      case 'file':
        if (Array.isArray(value) && value.length > parameter.length) {
          return true
        }
        break
      default:
        break
    }
  }

  return false
}
