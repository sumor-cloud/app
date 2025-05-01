import type from './type.js'

export default ({ namespace, transform = () => {} }) => {
  const lowerCaseNamespace = namespace.toLowerCase()
  const capitalizedNamespace =
    lowerCaseNamespace.charAt(0).toUpperCase() + lowerCaseNamespace.slice(1)

  return class SumorError extends Error {
    constructor(code, data, errors) {
      super()
      this.name = `${capitalizedNamespace}Error`
      this.namespace = lowerCaseNamespace
      this.code = code

      this.errors = []
      if (errors) {
        if (errors instanceof Error) {
          this.errors = [errors]
        } else if (Array.isArray(errors)) {
          this.errors = errors.filter(error => error instanceof Error)
        }
      }

      this.data = type(data) === 'object' ? data : {}
    }

    set message(_) {
      throw new Error('message is readonly, please use code and data to set message.')
    }

    get message() {
      return transform(namespace, this.code, this.data) || this.code
    }

    json() {
      const errors = this.errors.map(error => {
        if (error.json) {
          return error.json()
        } else {
          return {
            code: error.code || 'UNKNOWN_ERROR',
            message: error.message,
            data: error.data || {},
            errors: []
          }
        }
      })
      return {
        code: this.code,
        message: this.message,
        data: this.data,
        errors
      }
    }
  }
}
