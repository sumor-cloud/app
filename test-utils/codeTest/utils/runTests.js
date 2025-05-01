import { execSync } from 'child_process'
import fse from 'fs-extra'
import path from 'path'

// 替换 .test.ts 为 .test.js
const runTests = async (config, file) => {
  await fse.remove(path.join(process.cwd(), 'tmp', 'test'))

  await fse.ensureFile(config)
  await fse.writeFile(config, file, 'utf-8')

  let folder = 'all'
  if (file !== '') {
    folder = file.replace('.test.js', '').replace(/\/|\\/g, '.').replace('.index', '')
  }
  const root = `./output/test/${folder}`
  await fse.remove(path.join(process.cwd(), root))

  try {
    const cmdArr = [
      'node --experimental-vm-modules node_modules/jest/bin/jest.js',
      file.replace(/\\/g, '/'),
      '--coverage',
      '--coverageDirectory=' + root + '/coverage'
    ]
    console.log(cmdArr.join(' '))
    execSync(cmdArr.join(' '), {
      stdio: 'inherit'
    })
  } catch (e) {
    if (e) {
      console.log('\n单元测试失败，调试请查看上述日志')
    }
  }
  return root
}

export default runTests
