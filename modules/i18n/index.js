import convertI18nValue from './convertI18nValue/index.js'
import { cache, register, registerAll } from './registry.js'
import path from 'path'

export { cache as data }

export { register, registerAll }

// 预定义的 i18n 文件夹路径
const moduleRoot = new URL('.', import.meta.url).pathname
const predefinedI18nPath = path.join(moduleRoot, '../../i18n')
await registerAll(predefinedI18nPath)
const predefinedI18nExtPath = path.join(moduleRoot, '../../i18nExt')
await registerAll(predefinedI18nExtPath)

const convert = function (namespace, target, code, data = {}) {
  if (!cache[namespace.toLowerCase()]) {
    return
  }

  const i18nConfig = cache[namespace.toLowerCase()]

  return convertI18nValue(i18nConfig, target, code, data)
}

export { convert }
