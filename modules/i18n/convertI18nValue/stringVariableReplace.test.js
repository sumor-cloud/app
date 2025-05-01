import { describe, test, expect } from '@jest/globals'
import stringVariableReplace from './stringVariableReplace.js'

describe('字符串变量替换工具', () => {
  test('替换占位符为值', () => {
    const template = 'User not found: {name}'
    const data = { name: 'Tester' }
    const result = stringVariableReplace(template, data)
    expect(result).toBe('User not found: Tester')
  })

  test('如果未提供值，则返回占位符', () => {
    const template = 'User not found: {name}'
    const data = {}
    const result = stringVariableReplace(template, data)
    expect(result).toBe('User not found: ?')
  })

  test('如果值是对象，则将占位符替换为JSON字符串', () => {
    const template = 'User details: {user}'
    const data = { user: { id: 1, name: 'Tester' } }
    const result = stringVariableReplace(template, data)
    expect(result).toBe('User details: {"id":1,"name":"Tester"}')
  })

  test('如果值为null，则返回问号', () => {
    const template = 'User not found: {name}'
    const data = { name: null }
    const result = stringVariableReplace(template, data)
    expect(result).toBe('User not found: ?')
  })

  test('将数字值转换为字符串', () => {
    const template = 'User age: {age}'
    const data = { age: 30 }
    const result = stringVariableReplace(template, data)
    expect(result).toBe('User age: 30')
  })
})
