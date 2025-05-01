import { describe, it, expect } from '@jest/globals'
import format from './index.js'

describe('格式化', () => {
  it('当值为 undefined 时，应应用默认值', () => {
    const parameter = { type: 'string', default: 'defaultValue' }
    const result = format(parameter, undefined)
    expect(result).toBe('defaultValue')
  })

  it('当 trim 不为 false 时，应去除字符串两端的空格', () => {
    const parameter = { type: 'string', trim: true }
    const result = format(parameter, '  test  ')
    expect(result).toBe('test')
  })

  it('当 toLowerCase 为 true 时，应将字符串转换为小写', () => {
    const parameter = { type: 'string', toLowerCase: true }
    const result = format(parameter, 'TEST')
    expect(result).toBe('test')
  })

  it('当 toUpperCase 为 true 时，应将字符串转换为大写', () => {
    const parameter = { type: 'string', toUpperCase: true }
    const result = format(parameter, 'test')
    expect(result).toBe('TEST')
  })

  it('当指定小数位数时，应处理数字精度', () => {
    const parameter = { type: 'number', decimal: 2 }
    const result = format(parameter, 123.456)
    expect(result).toBe(123.46)
  })

  it('当没有匹配规则时，应保持原值不变', () => {
    const parameter = { type: 'string' }
    const result = format(parameter, 'unchanged')
    expect(result).toBe('unchanged')
  })
})
