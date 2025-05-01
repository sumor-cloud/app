import { describe, it, expect, jest } from '@jest/globals'
import serve from './index.js'

describe('serve', () => {
  it('应该执行单个回调函数', async () => {
    const mockCallback = jest.fn()
    const config = {
      port: Math.floor(Math.random() * (65535 - 1024) + 1024)
    }

    const { app, close } = await serve(config, mockCallback)

    expect(mockCallback).toHaveBeenCalledTimes(1)
    expect(mockCallback).toHaveBeenCalledWith(app)

    await close()
  })

  it('应该按顺序执行多个回调函数', async () => {
    const mockCallback1 = jest.fn()
    const mockCallback2 = jest.fn()
    const config = {
      port: Math.floor(Math.random() * (65535 - 1024) + 1024)
    }

    const { app, close } = await serve(config, [mockCallback1, mockCallback2])

    expect(mockCallback1).toHaveBeenCalledTimes(1)
    expect(mockCallback1).toHaveBeenCalledWith(app)
    expect(mockCallback2).toHaveBeenCalledTimes(1)
    expect(mockCallback2).toHaveBeenCalledWith(app)

    await close()
  })

  it('应该启动并停止服务器', async () => {
    const mockCallback = jest.fn()
    const config = {
      port: Math.floor(Math.random() * (65535 - 1024) + 1024)
    }

    const { close } = await serve(config, mockCallback)

    expect(typeof close).toBe('function')

    await close()
  })

  it('应该在请求中添加 sumor 对象', async () => {
    const mockCallback = app => {
      expect(app.sumor).toBeDefined()
      app.get('/', (req, res) => {
        if (req.sumor) {
          res.send('OK')
        } else {
          res.send('FAIL')
        }
      })
    }
    const config = {
      port: Math.floor(Math.random() * (65535 - 1024) + 1024)
    }
    const { close } = await serve(config, mockCallback)
    const response = await fetch(`http://localhost:${config.port}/`)
    const text = await response.text()
    expect(text).toBe('OK')
    await close()
  })
})
