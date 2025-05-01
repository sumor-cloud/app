import { describe, it, expect } from '@jest/globals'
import parseFile from './parseFile.js'

describe('parseFile', () => {
  it('应该正确解析日志文件字符串', () => {
    const fileString = `{"message":"test%20message","data":"%7B%22key%22%3A%22value%22%7D"}\n{"message":"another%20message","data":"%7B%22anotherKey%22%3A%22anotherValue%22%7D"}`
    const result = parseFile(fileString)
    expect(result).toEqual([
      { message: 'test message', data: { key: 'value' } },
      { message: 'another message', data: { anotherKey: 'anotherValue' } }
    ])
  })

  it('应该返回空数组对于空文件字符串', () => {
    const fileString = ''
    const result = parseFile(fileString)
    expect(result).toEqual([])
  })

  it('应该忽略文件字符串中的空行', () => {
    const fileString = `{"message":"test%20message","data":"%7B%22key%22%3A%22value%22%7D"}\n\n{"message":"another%20message","data":"%7B%22anotherKey%22%3A%22anotherValue%22%7D"}`
    const result = parseFile(fileString)
    expect(result).toEqual([
      { message: 'test message', data: { key: 'value' } },
      { message: 'another message', data: { anotherKey: 'anotherValue' } }
    ])
  })
})
