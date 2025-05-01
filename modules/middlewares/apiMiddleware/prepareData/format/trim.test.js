import { describe, it, expect } from '@jest/globals'
import trim from './trim'

describe('去除空格', () => {
  it('应去除字符串两端的空格', () => {
    const parameter = { type: 'string', trim: true }
    expect(trim(parameter, '  hello  ')).toBe('hello')
  })

  it('当 trim 设置为 false 时，不应去除空格', () => {
    const parameter = { type: 'string', trim: false }
    expect(trim(parameter, '  hello  ')).toBe('  hello  ')
  })

  it('对于非字符串类型的值，应返回原始值', () => {
    const parameter = { type: 'number', trim: true }
    expect(trim(parameter, 123)).toBe(123)
  })

  it('应优雅地处理 null 值', () => {
    const parameter = { type: 'string', trim: true }
    expect(trim(parameter, null)).toBe(null)
  })
})
