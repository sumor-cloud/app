import { describe, it, expect } from '@jest/globals'
import { convert } from './index.js'

describe('i18n 转换函数', () => {
  it('如果命名空间未注册，返回undefined', () => {
    const result = convert('unregisteredNamespace', 'target', 'code')
    expect(result).toBeUndefined()
  })
  it('检查预定义的 i18n 文件夹路径', () => {
    expect(convert('sumor_internal', 'en', 'TEST', { value: 'value' })).toBe('Test value')
    expect(convert('SUMOR_INTERNAL', 'zh-CN', 'TEST', { value: 'value' })).toBe('测试 value')
  })
})
