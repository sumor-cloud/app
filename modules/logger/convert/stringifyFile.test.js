import { describe, it, expect } from '@jest/globals'
import stringifyFile from './stringifyFile.js'
import parseFile from './parseFile.js'

describe('日志对象转文件输出字符串', () => {
  it('应该使用默认值记录消息', () => {
    let logString = ''

    const message = '测试消息'
    logString += stringifyFile({ message })

    const log = parseFile(logString)[0]

    expect(log.level).toBe('info')
    expect(log.message).toBe(message)
    expect(log.timestamp).toBeGreaterThan(0)
    expect(log.namespace).toBe('DEFAULT')
    expect(log.id).toBe('')
    expect(log.code).toBe('')
    expect(log.data).toEqual({})
  })

  it('应该记录多条消息', () => {
    let logString = ''

    const messages = ['测试消息 1', '测试消息 2', '测试消息 3']
    messages.forEach(message => {
      logString += stringifyFile({ message }) + '\n'
    })

    const logs = parseFile(logString)

    logs.forEach((log, index) => {
      expect(log.level).toBe('info')
      expect(log.message).toBe(messages[index])
      expect(log.timestamp).toBeGreaterThan(0)
      expect(log.namespace).toBe('DEFAULT')
      expect(log.id).toBe('')
      expect(log.code).toBe('')
      expect(log.data).toEqual({})
    })
  })

  it('应该记录带有特殊字符的消息', () => {
    let logString = ''

    const message = '带有特殊字符的测试消息\n新行\t制表符'
    logString += stringifyFile({ message })

    const log = parseFile(logString)[0]

    expect(log.level).toBe('info')
    expect(log.message).toBe(message)
    expect(log.timestamp).toBeGreaterThan(0)
    expect(log.namespace).toBe('DEFAULT')
    expect(log.id).toBe('')
    expect(log.code).toBe('')
    expect(log.data).toEqual({})
  })

  it('应该记录带有code和data的消息', () => {
    let logString = ''

    const message = '测试消息'
    const code = 'testKey'
    const data = { foo: 'bar' }
    logString += stringifyFile({ message, code, data })

    const log = parseFile(logString)[0]

    expect(log.level).toBe('info')
    expect(log.message).toBe(message)
    expect(log.timestamp).toBeGreaterThan(0)
    expect(log.namespace).toBe('DEFAULT')
    expect(log.id).toBe('')
    expect(log.code).toBe(code)
    expect(log.data).toEqual(data)
  })
})
