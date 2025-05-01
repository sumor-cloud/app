import convertType from './convertType.js'
import defaultValue from './defaultValue.js'
import trim from './trim.js'
import caseSensitive from './caseSensitive.js'
import precision from './precision.js'

export default (parameter, value) => {
  value = defaultValue(parameter, value)

  // 类型强制转换
  value = convertType(parameter.type, value)

  value = trim(parameter, value)
  value = caseSensitive(parameter, value)
  value = precision(parameter, value)

  return value
}
