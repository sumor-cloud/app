import load from './load/load.js'
import { glob } from 'glob'
import path from 'path'

// Extracted utility functions
import { filterOneDot, filterDoubleDot, getRelativePath, joinPath } from '../utils/pathUtils.js'

export const cache = {}

export async function register(namespace, data) {
  namespace = namespace.toLowerCase()
  // namespace = namespace.toUpperCase()
  cache[namespace] = cache[namespace] || {}

  // 传入路径，则根据路径读取数据
  if (typeof data === 'string') {
    data = await load(data)
  }

  for (const key in data) {
    cache[namespace][key] = cache[namespace][key] || {}
    cache[namespace][key] = {
      ...cache[namespace][key],
      ...data[key]
    }
  }
}

export async function registerAll(directory) {
  const absDirectory = path.resolve(directory)

  const files = glob.sync(`${absDirectory}/**/*.*`)
  const originFiles = filterOneDot(files)
  const extFiles = filterDoubleDot(files)

  // 处理扩展文件列表，去除扩展属性
  const extFilesOrigin = extFiles.map(file => {
    const paths = file.split('.')
    return paths[0] + '.' + paths[2]
  })

  const allOriginFiles = originFiles.concat(extFilesOrigin)

  for (const file of allOriginFiles) {
    const ns = getRelativePath(absDirectory, file)
    await register(ns, joinPath(process.cwd(), file))
  }
}
