import fse from 'fs-extra'
import path from 'path'

// await fse.remove(path.join(process.cwd(), 'tmp', 'test'))

export default async namespace => {
  namespace = namespace || 'unknown'
  const random = Math.random().toString(36).substring(7)
  const folderName = namespace + '-' + random
  const tmpDir = path.join(process.cwd(), 'tmp', 'test', folderName)

  await fse.ensureDir(tmpDir)

  return tmpDir
}
