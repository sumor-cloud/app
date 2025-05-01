import { describe, it, expect, beforeAll, afterAll } from '@jest/globals'
import fs from 'fs-extra'
import path from 'path'
import { registerAll, cache, register } from './registry.js'
import tmp from '../../test-utils/tmp.js'

const tmp1Dir = await tmp('i18nRegistry1')
const tmp2Dir = await tmp('i18nRegistry2')
const tmp3Dir = await tmp('i18nRegistry3')

describe('注册I18n', () => {
  beforeAll(() => {
    fs.ensureDirSync(tmp1Dir)
    fs.writeFileSync(path.join(tmp1Dir, 'demo.yml'), 'key: origin')
    fs.writeFileSync(path.join(tmp1Dir, 'demo.en.yml'), 'key: en')
    fs.writeFileSync(path.join(tmp1Dir, 'demo.zh-CN.yml'), 'key: zh-CN')
    fs.writeFileSync(path.join(tmp1Dir, 'demo2.json'), '{"key": "origin"}')
    fs.writeFileSync(path.join(tmp1Dir, 'demo2.en.json'), '{"key": "en"}')
    fs.writeFileSync(path.join(tmp1Dir, 'demo2.zh-CN.json'), '{"key": "zh-CN"}')

    fs.ensureDirSync(tmp2Dir)
    fs.writeFileSync(path.join(tmp2Dir, 'demo3.yml'), 'key: origin')
    fs.ensureDirSync(tmp3Dir)
    fs.writeFileSync(path.join(tmp3Dir, 'demo3.zh-CN.yml'), 'key: zh-CN')
  })

  afterAll(() => {
    fs.removeSync(tmp1Dir)
    fs.removeSync(tmp2Dir)
  })

  it('通过路径，注册所有指定路径下的i18n配置文件', async () => {
    await registerAll(tmp1Dir)
    expect(cache.demo).toBeDefined()
    expect(cache.demo.origin).toBeDefined()
    expect(cache.demo.en).toBeDefined()
    expect(cache.demo['zh-CN']).toBeDefined()
    expect(cache.demo.origin.key).toBe('origin')
    expect(cache.demo.en.key).toBe('en')
    expect(cache.demo['zh-CN'].key).toBe('zh-CN')

    expect(cache.demo2).toBeDefined()
    expect(cache.demo2.origin).toBeDefined()
    expect(cache.demo2.en).toBeDefined()
    expect(cache.demo2['zh-CN']).toBeDefined()
    expect(cache.demo2.origin.key).toBe('origin')
    expect(cache.demo2.en.key).toBe('en')
    expect(cache.demo2['zh-CN'].key).toBe('zh-CN')
  })

  it('通过路径，注册单个文件', async () => {
    await register('demo3', path.join(tmp2Dir, 'demo3.yml'))
    expect(cache.demo3).toBeDefined()
    expect(cache.demo3.origin).toBeDefined()
    expect(cache.demo3.origin.key).toBe('origin')
  })

  it('通过路径，注册单个文件，命名空间已存在', async () => {
    await register('demo3', path.join(tmp2Dir, 'demo3.yml'))
    expect(cache.demo3).toBeDefined()
    expect(cache.demo3.origin).toBeDefined()
    expect(cache.demo3.origin.key).toBe('origin')
    expect(cache.demo3['zh-CN']).toBeUndefined()
    await register('demo3', path.join(tmp3Dir, 'demo3.yml'))
    expect(cache.demo3['zh-CN']).toBeDefined()
    expect(cache.demo3['zh-CN'].key).toBe('zh-CN')
  })

  it('通过数据，注册单个命名空间', async () => {
    await register('demo4', {
      origin: {
        key: 'origin'
      },
      'zh-CN': {
        key: 'zh-CN'
      }
    })
    expect(cache.demo4).toBeDefined()
    expect(cache.demo4.origin).toBeDefined()
    expect(cache.demo4.origin.key).toBe('origin')
    expect(cache.demo4['zh-CN']).toBeDefined()
    expect(cache.demo4['zh-CN'].key).toBe('zh-CN')
  })
})
