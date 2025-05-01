export default (type, value) => {
  if (value === null) return value

  switch (type) {
    case 'string':
      if (typeof value !== 'string') {
        return JSON.stringify(value)
      } else {
        return String(value)
      }
    case 'number':
      if (isNaN(Number(value))) {
        throw new Error('INVALID')
      }
      return Number(value)
    case 'boolean':
      return Boolean(value)
    case 'array':
      if (typeof value === 'string') {
        try {
          return JSON.parse(value)
        } catch {
          throw new Error('INVALID')
        }
      } else if (!Array.isArray(value)) {
        throw new Error('INVALID')
      }
      return value
    case 'object':
      if (typeof value === 'string') {
        try {
          return JSON.parse(value)
        } catch {
          throw new Error('INVALID')
        }
      } else if (typeof value !== 'object') {
        throw new Error('INVALID')
      }
      return value
    case 'file':
      if (!Array.isArray(value)) {
        throw new Error('INVALID')
      }
      return value
    default:
      return value
  }
}
