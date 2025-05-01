import { describe, it, expect } from '@jest/globals'
import checkLength from './checkLength.js'

describe('数据长度检查', () => {
  it('应该返回 true，当字符串长度超过限制', () => {
    const parameter = { type: 'string', length: 5 }
    const value = 'exceeds'
    expect(checkLength(parameter, value)).toBe(true)
  })

  it('应该返回 false，当字符串长度在限制范围内', () => {
    const parameter = { type: 'string', length: 10 }
    const value = 'short'
    expect(checkLength(parameter, value)).toBe(false)
  })

  it('应该返回 true，当数字长度超过限制', () => {
    const parameter = { type: 'number', length: 3 }
    const value = 12345
    expect(checkLength(parameter, value)).toBe(true)
  })

  it('应该返回 false，当数字长度在限制范围内', () => {
    const parameter = { type: 'number', length: 5 }
    const value = 123
    expect(checkLength(parameter, value)).toBe(false)
  })

  it('应该返回 true，当数组长度超过限制', () => {
    const parameter = { type: 'array', length: 2 }
    const value = [1, 2, 3]
    expect(checkLength(parameter, value)).toBe(true)
  })

  it('应该返回 false，当数组长度在限制范围内', () => {
    const parameter = { type: 'array', length: 5 }
    const value = [1, 2, 3]
    expect(checkLength(parameter, value)).toBe(false)
  })

  it('应该返回 false，当值为 null', () => {
    const parameter = { type: 'string', length: 5 }
    const value = null
    expect(checkLength(parameter, value)).toBe(false)
  })

  it('应该返回 false，当类型不受支持', () => {
    const parameter = { type: 'unsupported', length: 5 }
    const value = 'test'
    expect(checkLength(parameter, value)).toBe(false)
  })
})
