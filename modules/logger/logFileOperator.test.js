// logFileOperator.test.ts
// 此文件用于测试 logFileOperator.ts 中的 writeFile 和 cacheWriteFile 方法
import { describe, it, expect, beforeAll } from '@jest/globals'
import { writeFile, cacheWriteFile, setCacheInterval } from './logFileOperator.js'
import fse from 'fs-extra'
import path from 'path'
import tmp from '../../test-utils/tmp.js'

describe('测试 logFileOperator', () => {
  let tempFolder

  beforeAll(async () => {
    tempFolder = await tmp('logFileOperator')
  })

  it('测试 writeFile 方法', async () => {
    setCacheInterval(50)
    const tempFile = path.join(tempFolder, 'fileOperator1.log')
    const log = '测试写入日志'
    await writeFile(tempFile, log)
    const content = await fse.readFile(tempFile, 'utf8')
    // 检查日志内容是否正确写入
    expect(content.trim()).toBe(log)
  })

  it('测试 cacheWriteFile 方法', async () => {
    setCacheInterval(50)
    const tempFile = path.join(tempFolder, 'fileOperator2.log')
    const log1 = '缓存日志1'
    const log2 = '缓存日志2'

    await cacheWriteFile(tempFile, log1)
    await cacheWriteFile(tempFile, log2)

    // 延时等待写入完成
    await new Promise(resolve => setTimeout(resolve, 100))

    const content = await fse.readFile(tempFile, 'utf8')
    // 检查文件中是否包含所有缓存日志
    expect(content).toContain(log1)
    expect(content).toContain(log2)
  })

  it('测试 setCacheInterval 功能', async () => {
    const tempFile = path.join(tempFolder, 'fileOperator3.log')
    // 设置新的缓存间隔
    setCacheInterval(100)

    const logA = '日志A'
    const logB = '日志B'

    await cacheWriteFile(tempFile, logA)
    await cacheWriteFile(tempFile, logB)

    await new Promise(resolve => setTimeout(resolve, 50))

    const exists1 = await fse.exists(tempFile)
    expect(exists1).toBe(false)

    // 等待缓存间隔时间到达
    await new Promise(resolve => setTimeout(resolve, 100))

    const exists2 = await fse.exists(tempFile)
    expect(exists2).toBe(true)
    const content2 = await fse.readFile(tempFile, 'utf8')
    expect(content2).toContain(logA)
    expect(content2).toContain(logB)
  })
})
