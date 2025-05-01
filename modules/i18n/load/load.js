import loadConfig from '../../utils/loadConfig.js'
import path from 'path'

async function loadI18nConfig(i18nPath) {
  const result = {
    origin: {}
  }

  // 去除i18nPath后缀
  i18nPath = i18nPath.split('.')[0]

  const root = path.dirname(i18nPath)
  const name = path.basename(i18nPath)
  const files = await loadConfig(name + '*', root)

  for (const key in files) {
    // key为name.*才是国际化文件
    const prefix = `${name}.`

    if (key === name) {
      result.origin = files[key]
    } else if (key.startsWith(prefix)) {
      const lang = key.replace(prefix, '')
      result[lang] = files[key]
    }
  }

  return result
}

export default loadI18nConfig
