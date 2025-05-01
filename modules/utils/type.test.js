import { describe, test, expect } from '@jest/globals'
import type from './type.js'

describe('type 函数', () => {
  test('应该返回 "null" 对于 null', () => {
    expect(type(null)).toBe('null')
  })

  test('应该返回 "array" 对于数组', () => {
    expect(type([])).toBe('array')
  })

  test('应该返回 "regexp" 对于正则表达式', () => {
    expect(type(/abc/)).toBe('regexp')
  })

  test('应该返回 "object" 对于对象', () => {
    expect(type({})).toBe('object')
  })

  test('应该返回 "string" 对于字符串', () => {
    expect(type('hello')).toBe('string')
  })

  test('应该返回 "number" 对于数字', () => {
    expect(type(123)).toBe('number')
  })

  test('应该返回 "boolean" 对于布尔值', () => {
    expect(type(true)).toBe('boolean')
  })

  test('应该返回 "undefined" 对于 undefined', () => {
    expect(type(undefined)).toBe('undefined')
  })

  test('应该返回 "function" 对于函数', () => {
    expect(type(() => {})).toBe('function')
  })
})
