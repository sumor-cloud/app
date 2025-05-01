import { describe, test, expect } from '@jest/globals'
import defaultValue from './defaultValue.js'

describe('defaultValue 函数', () => {
  test('当值为 undefined 时应返回 null', () => {
    expect(defaultValue({ type: 'string' }, undefined)).toBeNull()
  })

  test('当值为空字符串且类型为非字符串时应返回 null', () => {
    expect(defaultValue({ type: 'number' }, '')).toBeNull()
  })

  test('当有默认值且值为 null 时应返回默认值', () => {
    expect(defaultValue({ type: 'string', default: 'default' }, null)).toBe('default')
    expect(defaultValue({ type: 'number', default: 42 }, null)).toBe(42)
  })

  test('当值为空字符串且类型为字符串时应返回默认值', () => {
    expect(defaultValue({ type: 'string', default: 'default' }, '')).toBe('default')
  })

  test('当无默认值时应保持原值', () => {
    expect(defaultValue({ type: 'string' }, 'value')).toBe('value')
    expect(defaultValue({ type: 'number' }, 123)).toBe(123)
  })

  test('当默认值为 null 或 undefined 时应保持原值', () => {
    expect(defaultValue({ type: 'string', default: null }, null)).toBeNull()
    expect(defaultValue({ type: 'string', default: undefined }, null)).toBeNull()
  })
})
