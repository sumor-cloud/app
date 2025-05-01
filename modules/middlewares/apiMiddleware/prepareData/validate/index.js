import checkLength from './checkLength.js'

export default (Error, APIError, apiKey, parameter, value) => {
  const errors = []

  // 检查必填项
  if (parameter.required) {
    if (value === null || (parameter.type === 'string' && value === '')) {
      errors.push(new Error('API_PARAMETER_REQUIRED'))
    }
  }

  // 检查长度
  if (checkLength(parameter, value)) {
    errors.push(new Error('API_PARAMETER_TOO_LONG', { length: parameter.length }))
  }

  // 检查规则
  for (const rule in parameter.rules) {
    const ruleInfo = parameter.rules[rule]
    if (ruleInfo.expression) {
      const regexp = new RegExp(ruleInfo.expression)
      if (!regexp.test(value)) {
        errors.push(new APIError(`parameter.${parameter.key}.rules.${rule}@${apiKey}`))
      }
    }
  }

  return errors
}
