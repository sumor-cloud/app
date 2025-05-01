import { describe, it, expect } from '@jest/globals'
import format from './formatConfig.js'

describe('format function', () => {
  it('当未提供配置时应返回默认值', () => {
    const result = format()
    expect(result.port).toBe(80)
    expect(result.name).toBe('轻呈云应用')
    expect(result.desc).toBe('')
  })

  it('当提供带端口的配置时应覆盖端口', () => {
    const result = format({ port: 3000 })
    expect(result.port).toBe(3000)
  })

  it('应保留配置对象中的其他属性', () => {
    const result = format({ port: 3000, host: 'localhost' })
    expect(result.port).toBe(3000)
    expect(result.host).toBe('localhost')
  })

  it('当提供name和desc时应覆盖默认值', () => {
    const result = format({ name: '测试应用', desc: '这是一个测试应用' })
    expect(result.name).toBe('测试应用')
    expect(result.desc).toBe('这是一个测试应用')
  })
})
