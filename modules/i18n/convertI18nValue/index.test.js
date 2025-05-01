import { describe, it, expect } from '@jest/globals'
import convertI18n from './index.js'

describe('convertI18n', () => {
  const config = {
    en: { greeting: 'Hello, {name}!' },
    'zh-CN': { greeting: '你好, {name}!' },
    origin: { greeting: 'Hi, {name}!' }
  }
  const config2 = {
    'zh-CN': { greeting: '你好, {name}!' },
    origin: { greeting: 'Hi, {name}!' }
  }
  const config3 = {
    'zh-CN': { allowRegister: true },
    origin: { allowRegister: false }
  }

  it('应该替换模板中的变量', () => {
    const data = { name: 'John' }
    const result = convertI18n(config, 'en', 'greeting', data)
    expect(result).toBe('Hello, John!')
  })

  it('应该返回指定区域的模板', () => {
    const data = { name: '李雷' }
    const result = convertI18n(config, 'zh-CN', 'greeting', data)
    expect(result).toBe('你好, 李雷!')
  })

  it('如果找不到区域，应该返回原始模板', () => {
    const data = { name: 'Jane' }
    const result = convertI18n(config, 'fr', 'greeting', data)
    expect(result).toBe('Hello, Jane!')
  })

  it('如果找不到区域且找不到en，应该返回原始模板', () => {
    const data = { name: 'Jane' }
    const result = convertI18n(config2, 'fr', 'greeting', data)
    expect(result).toBe('Hi, Jane!')
  })

  it('如果类型不是字符串，应该返回原始模板', () => {
    const result1 = convertI18n(config3, 'fr', 'allowRegister', {})
    expect(result1).toBe(false)
    const result2 = convertI18n(config3, 'zh-CN', 'allowRegister', {})
    expect(result2).toBe(true)
  })

  it('如果找不到i18n模板，应该返回代码', () => {
    const data = { name: 'John' }
    const result = convertI18n(config, 'en', 'nonexistent', data)
    expect(result).toBe('nonexistent')
  })
})
