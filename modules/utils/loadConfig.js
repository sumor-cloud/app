import fs from 'fs'
import yaml from 'yaml'
import path from 'path'
import { glob } from 'glob'

export default async (condition, root) => {
  const extensions = ['.yaml', '.json', '.yml']

  if (root) {
    // 多个配置查询，返回列表对象，key为相对路径，值为配置对象

    // 如果condition不包括后缀，则添加后缀，限制其仅允许yaml和json
    if (!condition.includes('yaml') && !condition.includes('json') && !condition.includes('yml')) {
      condition = `${condition}.{yaml,json,yml}`
    }

    const files = await glob(condition, {
      cwd: root
    })

    // 排序以确保后缀名优先级
    files.sort((a, b) => {
      const extA = path.extname(a)
      const extB = path.extname(b)
      return extensions.indexOf(extB) - extensions.indexOf(extA)
    })

    const result = {}
    for (const file of files) {
      const ext = path.extname(file)
      const pathWithoutExt = file.replace(ext, '')
      if (extensions.includes(ext)) {
        const filePath = path.join(root, file)
        const fileContent = fs.readFileSync(filePath, 'utf8')
        if (ext === '.json') {
          result[pathWithoutExt] = JSON.parse(fileContent)
        } else {
          result[pathWithoutExt] = yaml.parse(fileContent)
        }
      }
    }
    return result
  } else {
    // 单个配置查询，返回该配置对象
    const filePath = condition
    const ext = path.extname(filePath)

    // 带后缀，则直接返回
    if (extensions.includes(ext)) {
      const fileContent = fs.readFileSync(filePath, 'utf8')
      if (ext === '.json') {
        return JSON.parse(fileContent)
      } else {
        return yaml.parse(fileContent)
      }
    }

    // 不带后缀，尝试添加后缀
    for (const ext of extensions) {
      const fullPath = `${filePath}${ext}`
      if (fs.existsSync(fullPath)) {
        const fileContent = fs.readFileSync(fullPath, 'utf8')
        if (ext === '.json') {
          return JSON.parse(fileContent)
        } else {
          return yaml.parse(fileContent)
        }
      }
    }

    return {}
  }
}
