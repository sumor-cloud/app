import { describe, it, expect } from '@jest/globals'
import caseSensitive from './caseSensitive'

describe('区分大小写', () => {
  it('当参数.toLowerCase 为 true 时，应将字符串转换为小写', () => {
    const result = caseSensitive({ toLowerCase: true, type: 'string' }, 'Hello World')
    expect(result).toBe('hello world')
  })

  it('当参数.toUpperCase 为 true 时，应将字符串转换为大写', () => {
    const result = caseSensitive({ toUpperCase: true, type: 'string' }, 'Hello World')
    expect(result).toBe('HELLO WORLD')
  })

  it('当参数.type 不是字符串时，应返回原始值', () => {
    const result = caseSensitive({ toLowerCase: true, type: 'number' }, 12345)
    expect(result).toBe(12345)
  })

  it('当值为 null 时，应返回 null', () => {
    const result = caseSensitive({ toLowerCase: true, type: 'string' }, null)
    expect(result).toBeNull()
  })

  it('当 toLowerCase 和 toUpperCase 同时为 true 时，应优先处理为大写', () => {
    const result = caseSensitive(
      {
        toLowerCase: true,
        toUpperCase: true,
        type: 'string'
      },
      'Hello World'
    )
    expect(result).toBe('HELLO WORLD') // 大写优先
  })
})
