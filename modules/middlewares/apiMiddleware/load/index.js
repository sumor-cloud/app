import path from 'path'
import { glob } from 'glob'
import { getRelativePath } from '../../../utils/pathUtils.js'
import loadConfig from '../../../utils/loadConfig.js'
import { pathToFileURL } from 'url'

export default async apiRoot => {
  // 解析 apiRoot 的绝对路径
  const absoluteApiRoot = path.resolve(apiRoot)

  // 使用 glob 扫描 apiRoot 目录中的 .js 文件
  const jsFiles = glob.sync(`${absoluteApiRoot}/**/*.js`)

  const apis = {}
  for (const file of jsFiles) {
    const relativePath = getRelativePath(apiRoot, file)
    const route = '/' + relativePath

    const config = await loadConfig(file.split('.')[0])
    let callback
    try {
      const program = await import(pathToFileURL(file))
      callback = program.default
    } catch (e) {
      callback = null
    }

    apis[route] = {
      ...config,
      callback
    }
  }

  return apis
}
