import format from './format/index.js'
import validate from './validate/index.js'

export default (req, apiKey, parameters) => {
  parameters = parameters || {}
  const data = req.data || {}

  const { Error } = req.namespace('SUMOR_API')
  const { Error: APIError } = req.namespace('API')

  const errors = []

  for (const key in parameters) {
    const parameter = parameters[key] || {}
    data[key] = format(parameter, data[key])

    const parameterErrors = validate(Error, APIError, apiKey, parameter, data[key])

    if (parameterErrors.length) {
      errors.push(new Error('API_PARAMETER_NOT_VALID', { key }, parameterErrors))
    }
  }

  if (errors.length) {
    throw new Error('API_PARAMETERS_NOT_VALID', {}, errors)
  }

  return data
}
