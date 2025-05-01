import { describe, it, expect } from '@jest/globals'
import alertPage from './index.js'

describe('getHtml', () => {
  it('应该用提供的标题替换占位符', () => {
    const options = { svg: 'undraw_alert', title: 'Test Error' }
    const result = alertPage(options)

    expect(result).toContain('Test Error')
    expect(result).toContain('data:image/svg+xml;base64')
  })
})
