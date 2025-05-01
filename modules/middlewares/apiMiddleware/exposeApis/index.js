import { register } from '../../../i18n/index.js'

const hasFileParameter = parameters => {
  let hasFile = false
  for (const param in parameters) {
    if (parameters[param].type === 'file') {
      hasFile = true
      break
    }
  }
  return hasFile
}

export default async (apis, logger) => {
  const exposeApis = {}
  const i18n = {
    origin: {}
  }
  for (const path in apis) {
    const apiInfo = apis[path]

    apiInfo.key = path
    apiInfo.name = apiInfo.name || ''
    apiInfo.desc = apiInfo.desc || ''
    apiInfo.parameters = apiInfo.parameters || {}
    const hasFile = hasFileParameter(apiInfo.parameters)
    const defaultMethods = hasFile ? ['POST', 'PUT'] : ['GET', 'POST', 'PUT', 'DELETE']
    if (apiInfo.methods) {
      // 检查是否包含不合要求的方法，包含则抛出警告日志，并删除该方法
      const invalidMethods = apiInfo.methods.filter(method => !defaultMethods.includes(method))
      if (invalidMethods.length > 0) {
        logger.warn('API_METHOD_NOT_ALLOWED', {
          path,
          methods: invalidMethods.join(',')
        })
        apiInfo.methods = apiInfo.methods.filter(method => defaultMethods.includes(method))
      }
    } else {
      apiInfo.methods = defaultMethods
    }
    apiInfo.callback = apiInfo.callback || null

    for (const parameter in apiInfo.parameters) {
      const parameterInfo = apiInfo.parameters[parameter] || {}
      parameterInfo.key = parameter
      parameterInfo.type = parameterInfo.type || 'string'
      parameterInfo.required = parameterInfo.required === true
      parameterInfo.name = parameterInfo.name || ''
      parameterInfo.desc = parameterInfo.desc || ''
      parameterInfo.length = parameterInfo.length || null
      i18n.origin[`parameter.${parameter}.name@${path}`] = parameterInfo.name
      i18n.origin[`parameter.${parameter}.desc@${path}`] = parameterInfo.desc
      parameterInfo.rules = parameterInfo.rules || {}

      for (const rule in parameterInfo.rules) {
        const ruleInfo = parameterInfo.rules[rule]
        i18n.origin[`parameter.${parameter}.rules.${rule}@${path}`] = ruleInfo.message
      }
    }

    const prefix = '/api'
    const listenPaths = Array.isArray(apiInfo.path)
      ? apiInfo.path
      : [apiInfo.path || `${prefix}${path}`] // Renamed listenPath to path

    for (const apiPath of listenPaths) {
      // 处理国际化原始数据
      i18n.origin[`name@${path}`] = apiInfo.name
      exposeApis[apiPath] = {
        key: apiInfo.key,
        name: apiInfo.name,
        desc: apiInfo.desc,
        parameters: apiInfo.parameters,
        methods: apiInfo.methods,
        callback: apiInfo.callback
      }
    }
  }

  await register('API', i18n)
  return exposeApis
}
