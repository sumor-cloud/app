import { describe, it, expect } from '@jest/globals'
import stringify from './stringifyCMD.js'
import chalk from 'chalk'

const timestamp = 1609459200000 // 2021-01-01T00:00:00.000Z

describe('日志对象转命令行输出字符串', () => {
  it('应该使用默认值格式化日志消息', () => {
    const result = stringify({}).replace(/\.\d{3}/, '')
    const date = new Date().toISOString().replace('T', ' ').replace('Z', '')
    expect(result).toBe(chalk.blue(`[${date}] [INFO] [DEFAULT] -`.replace(/\.\d{3}/, '')))
  })

  it('应该使用自定义值格式化日志消息', () => {
    const result = stringify({
      level: 'error',
      timestamp,
      namespace: 'custom',
      id: '12345'
    })
    expect(result).toBe(chalk.red('[2021-01-01 00:00:00.000] [ERROR] [CUSTOM] [12345] -'))
  })

  it('应该为每个日志级别使用正确的颜色', () => {
    const levels = ['trace', 'debug', 'info', 'warn', 'error', 'unknown']
    const colors = [chalk.gray, chalk.green, chalk.blue, chalk.yellow, chalk.red, chalk.white]
    levels.forEach((level, color) => {
      const result = stringify({
        level,
        timestamp,
        id: '12345'
      })
      const date = new Date(timestamp).toISOString().replace('T', ' ').replace('Z', '')
      expect(result).toBe(colors[color](`[${date}] [${level.toUpperCase()}] [DEFAULT] [12345] -`))
    })
  })
})
