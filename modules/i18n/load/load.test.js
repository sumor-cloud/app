import { describe, it, expect, beforeAll, afterAll } from '@jest/globals'
import fs from 'fs-extra'
import path from 'path'
import loadI18nConfig from './load.js'
import tmp from '../../../test-utils/tmp.js'

const tmpDir = await tmp('i18nLoad')

describe('加载国际化数据目录', () => {
  beforeAll(() => {
    fs.ensureDirSync(tmpDir)
    fs.writeFileSync(path.join(tmpDir, 'demo.yml'), 'key: origin')
    fs.writeFileSync(path.join(tmpDir, 'demo.zh-CN.yml'), 'key: zh-CN')
    fs.writeFileSync(path.join(tmpDir, 'demo.en.json'), JSON.stringify({ key: 'en' }, null, 2))
    fs.writeFileSync(path.join(tmpDir, 'demodemo.yml'), 'key: Unknown')
  })

  afterAll(() => {
    fs.removeSync(tmpDir)
  })

  it('应该加载基础的 i18n 配置和所有特定语言的配置', async () => {
    const config = await loadI18nConfig(`${tmpDir}/demo`)
    expect(config).toEqual({
      origin: { key: 'origin' },
      'zh-CN': { key: 'zh-CN' },
      en: { key: 'en' }
    })
  })
})
