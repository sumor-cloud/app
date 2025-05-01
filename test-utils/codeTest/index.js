import inquirer from 'inquirer'
import path from 'path'
import fse from 'fs-extra'
import getTestFiles from './utils/getTestFiles.js'
import runTests from './utils/runTests.js'
import startServer from './utils/startServer.js'
const LAST_TEST_FILE_PATH = path.join(process.cwd(), 'tmp', 'tools', 'codeTest', 'lastTestFile.txt')

// 主函数
const executeCodeTest = async () => {
  const testFiles = getTestFiles(path.join(process.cwd(), 'modules'))
  if (testFiles.length === 0) {
    console.log('未找到测试文件。')
    return
  }

  // const sortedTestFiles = testFiles.sort((a, b) => {
  //   if (a.endsWith('/index.test.js') && !b.endsWith('/index.test.js')) return -1
  //   if (!a.endsWith('/index.test.js') && b.endsWith('/index.test.js')) return 1
  //   return a.localeCompare(b)
  // })

  let displayTestFiles = testFiles.map(file => {
    if (file.endsWith('/index.test.js'))
      return {
        name: file.replace('/index.test.js', ''),
        value: file
      }
    return {
      name: file.replace('.test.js', ''),
      value: file
    }
  })
  displayTestFiles = displayTestFiles.sort((a, b) => {
    if (b.name > a.name) return -1
    else return 1
  })

  let lastTestFile = ''
  if (await fse.exists(LAST_TEST_FILE_PATH)) {
    lastTestFile = await fse.readFile(LAST_TEST_FILE_PATH, 'utf-8')
  }

  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'file',
      message: `选择要运行的测试文件:（共${displayTestFiles.length - 1}个）`,
      choices: [{ name: `全部`, value: '' }, ...displayTestFiles],
      default: lastTestFile
    }
  ])

  let selectedFile = answers.file
  selectedFile = selectedFile || ''
  const report = await runTests(LAST_TEST_FILE_PATH, selectedFile)

  const unitPath = path.join(report, 'unit')

  const generatedUnitPath = path.join(process.cwd(), 'output', 'unit')
  await fse.move(generatedUnitPath, path.join(process.cwd(), unitPath))

  const unitPort = await startServer(path.join(process.cwd(), unitPath))
  console.log(`单元测试报告请访问 http://localhost:${unitPort}`)
  // console.log(` - 报告目录：${unitPath}`)

  const coveragePath = path.join(report, 'coverage', 'lcov-report')

  // 将custom.css的内容追加到base.css文件中
  const customCssPath = path.join(new URL('.', import.meta.url).pathname, 'custom.css')
  const baseCssPath = path.join(coveragePath, 'base.css')
  const customCss = await fse.readFile(customCssPath, 'utf-8')
  await fse.appendFile(baseCssPath, customCss)

  const coveragePort = await startServer(path.join(process.cwd(), coveragePath))
  console.log(`覆盖率报告请访问 http://localhost:${coveragePort}`)
  // console.log(` - 报告目录：${coveragePath}`)
}

executeCodeTest()
