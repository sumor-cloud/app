export default (parameter, value) => {
  if (value === undefined) {
    value = null
  }
  if (parameter.type !== 'string' && value === '') {
    value = null
  }

  const defaultValue = parameter.default
  const hasDefault = defaultValue !== undefined && defaultValue !== null

  if (hasDefault) {
    if (value === '' && parameter.type === 'string') {
      value = null
    }
    if (value === null) {
      switch (parameter.type) {
        case 'string':
          value = defaultValue
          break
        case 'number':
          value = defaultValue
          break
        default:
          break
      }
    }
  }

  return value
}
