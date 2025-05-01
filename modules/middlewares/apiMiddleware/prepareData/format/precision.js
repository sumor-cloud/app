export default (parameter, value) => {
  if (
    parameter.type === 'number' &&
    parameter.decimal !== undefined &&
    parameter.decimal !== null &&
    typeof value === 'number'
  ) {
    value = Number(value.toFixed(parameter.decimal))
  }

  return value
}
