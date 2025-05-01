import getI18nValue from './getI18nTemplate.js'
import stringVariableReplace from './stringVariableReplace.js'

export default function (config, target, code, data) {
  const i18nTemplate = getI18nValue(config, target, code)
  if (i18nTemplate === undefined) {
    return code
  }
  if (typeof i18nTemplate === 'string') {
    return stringVariableReplace(i18nTemplate, data)
  } else {
    return i18nTemplate
  }
}
