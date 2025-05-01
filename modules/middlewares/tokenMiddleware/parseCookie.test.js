import { describe, test, expect } from '@jest/globals'
import parseCookie from './parseCookie'

// 测试文件主要用于验证 parseCookie 函数的功能是否正确

describe('parseCookie 函数测试', () => {
  // 测试：正常解析 cookie 字符串
  test('应该正确解析有效的 cookie 字符串', () => {
    const cookieString = 'key1=value1; key2=value2'
    const expectedOutput = {
      key1: 'value1',
      key2: 'value2'
    }
    expect(parseCookie(cookieString)).toEqual(expectedOutput)
  })

  // 测试：处理空字符串
  test('应该返回空对象当输入为空字符串时', () => {
    const cookieString = ''
    const expectedOutput = {}
    expect(parseCookie(cookieString)).toEqual(expectedOutput)
  })

  // 测试：处理 null 或 undefined
  test('应该返回空对象当输入为 null 或 undefined 时', () => {
    expect(parseCookie(null)).toEqual({})
    expect(parseCookie(undefined)).toEqual({})
  })

  // 测试：处理没有值的键
  test('应该将没有值的键的值设置为 null', () => {
    const cookieString = 'key1=; key2=value2'
    const expectedOutput = {
      key1: null,
      key2: 'value2'
    }
    expect(parseCookie(cookieString)).toEqual(expectedOutput)
  })

  // 测试：处理多余的空格
  test('应该正确处理键和值周围的多余空格', () => {
    const cookieString = ' key1 = value1 ; key2 = value2 '
    const expectedOutput = {
      key1: 'value1',
      key2: 'value2'
    }
    expect(parseCookie(cookieString)).toEqual(expectedOutput)
  })
})
