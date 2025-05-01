import { describe, test, expect } from '@jest/globals'
import convertType from './convertType.js'

describe('参数类型转换', () => {
  test('应转换为字符串', () => {
    expect(convertType('string', 123)).toBe('123')
    expect(convertType('string', true)).toBe('true')
  })

  test('应转换为数字', () => {
    expect(convertType('number', '123')).toBe(123)
    expect(() => convertType('number', 'abc')).toThrow('INVALID')
  })

  test('应转换为布尔值', () => {
    expect(convertType('boolean', 1)).toBe(true)
    expect(convertType('boolean', 0)).toBe(false)
  })

  test('应转换为数组', () => {
    expect(convertType('array', '[1,2,3]')).toEqual([1, 2, 3])
    expect(convertType('array', [1, 2, 3])).toEqual([1, 2, 3])
    expect(() => convertType('array', 'not an array')).toThrow('INVALID')
    expect(() => convertType('array', 123)).toThrow('INVALID')
  })

  test('对象类型传入数组应报错', () => {
    expect(() => convertType('array', { key: 'value' })).toThrow('INVALID')
  })

  test('应转换为对象', () => {
    expect(convertType('object', { key: 'value' })).toEqual({ key: 'value' })
    expect(convertType('object', '{"key":"value"}')).toEqual({ key: 'value' })
    expect(() => convertType('object', 'not an object')).toThrow('INVALID')
    expect(() => convertType('object', 123)).toThrow('INVALID')
  })

  test('对于未知类型应返回原值', () => {
    expect(convertType('unknown', 'value')).toBe('value')
  })

  test('对于 null 值应返回 null', () => {
    expect(convertType('string', null)).toBeNull()
  })

  test('应转换为文件类型', () => {
    expect(() => convertType('file', 'not an array')).toThrow('INVALID')
    expect(() => convertType('file', 123)).toThrow('INVALID')
    expect(() => convertType('file', {})).toThrow('INVALID')
    expect(convertType('file', [])).toEqual([])
    expect(convertType('file', [{ path: '' }, { path: '' }])).toEqual([{ path: '' }, { path: '' }])
  })
})
