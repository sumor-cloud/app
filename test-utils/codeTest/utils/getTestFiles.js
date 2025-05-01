import fs from 'fs'
import path from 'path'

// 获取当前目录下的所有测试文件的函数
const getTestFiles = testFolder => {
  let testFiles = []
  const files = fs.readdirSync(testFolder)
  files.forEach(file => {
    const filePath = path.join(testFolder, file)
    const stat = fs.statSync(filePath)
    if (stat.isDirectory()) {
      testFiles = testFiles.concat(getTestFiles(filePath))
    } else if (file.endsWith('.test.js')) {
      testFiles.push(filePath.replace(process.cwd() + path.sep, ''))
    }
  })
  return testFiles
}

export default getTestFiles
