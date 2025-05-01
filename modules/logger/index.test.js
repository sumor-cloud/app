import { describe, it, expect, beforeAll, afterAll } from '@jest/globals'
import getLogger from './index.js'
import { setCacheInterval } from './logFileOperator.js'
import fse from 'fs-extra'

const logFolder = `${process.cwd()}/tmp/logger`

describe('日志器', () => {
  beforeAll(async () => {
    setCacheInterval(50)
    await fse.ensureDir(logFolder)
  })
  afterAll(async () => {
    await fse.remove(logFolder)
  })

  it('记录日志消息到控制台和文件', async () => {
    const logFile = `${logFolder}/default.log`
    const logger = getLogger({
      path: logFile
    })

    logger.info('测试消息')
    await new Promise(resolve => setTimeout(resolve, 100))

    const logContent = await fse.readFile(logFile, 'utf-8')
    expect(logContent).toContain('default')
    expect(logContent).toContain(encodeURIComponent('测试消息'))
    expect(logContent).toContain('info')
  })

  it('消息不是字符串时，应该转换为字符串', async () => {
    const logFile = `${logFolder}/nonStringMessage.log`
    const logger = getLogger({
      path: logFile
    })

    logger.info({ key: 'value' })
    logger.info([1, 2, 3])
    logger.info(() => 'function')
    logger.info(Symbol('symbol'))
    await new Promise(resolve => setTimeout(resolve, 100))

    const logContent = await fse.readFile(logFile, 'utf-8')
    expect(logContent).toContain('default')
    expect(logContent).toContain(encodeURIComponent('"key":"value"'))
    expect(logContent).toContain(encodeURIComponent('[1,2,3]'))
    expect(logContent).toContain(encodeURIComponent('[Function: anonymous]'))
    expect(logContent).toContain(encodeURIComponent('Symbol(symbol)'))
  })

  it('应该处理不同的日志级别', async () => {
    const logFile = `${logFolder}/level.log`
    const logger = getLogger({
      namespace: 'test',
      path: logFile
    })
    logger.error('错误信息')
    logger.warn('警告信息')
    logger.debug('调试信息')
    await new Promise(resolve => setTimeout(resolve, 100))

    const logContent = await fse.readFile(logFile, 'utf-8')
    expect(logContent).toContain('test')
    expect(logContent).toContain(encodeURIComponent('错误信息'))
    expect(logContent).toContain('error')
    expect(logContent).toContain(encodeURIComponent('警告信息'))
    expect(logContent).toContain('warn')
    expect(logContent).toContain(encodeURIComponent('调试信息'))
    expect(logContent).toContain('debug')
  })

  it('测试消息转换', async () => {
    const logFile = `${logFolder}/transform.log`
    const logger = getLogger({
      namespace: 'transform',
      path: logFile,
      transform: (namespace, code, data) =>
        `转换后的消息: ${namespace} ${code} ${JSON.stringify(data)}`
    })

    logger.info('测试消息', { key: 'value' })
    await new Promise(resolve => setTimeout(resolve, 100))
    const logContent = await fse.readFile(logFile, 'utf-8')
    expect(logContent).toContain('transform')
    expect(logContent).toContain(
      encodeURIComponent('转换后的消息: transform 测试消息 {"key":"value"}')
    )
    expect(logContent).toContain('info')
  })

  it('对象无法序列化时，应该记录为[object Object]', async () => {
    const logFile = `${logFolder}/unserializableObject.log`
    const logger = getLogger({
      path: logFile
    })

    const circularObj = {}
    circularObj.self = circularObj

    logger.info(circularObj)
    await new Promise(resolve => setTimeout(resolve, 100))

    const logContent = await fse.readFile(logFile, 'utf-8')
    expect(logContent).toContain('default')
    expect(logContent).toContain(encodeURIComponent('[object Object]'))
    expect(logContent).toContain('info')
  })

  it('消息为null时，应该记录为空字符串', async () => {
    const logFile = `${logFolder}/nullMessage.log`
    const logger = getLogger({
      path: logFile
    })

    logger.info(null)
    await new Promise(resolve => setTimeout(resolve, 100))

    const logContent = await fse.readFile(logFile, 'utf-8')
    expect(logContent).toContain('default')
    expect(logContent).toContain(encodeURIComponent(''))
    expect(logContent).toContain('info')
  })
})
