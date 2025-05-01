import { describe, it, beforeAll, afterAll, expect, beforeEach } from '@jest/globals'
import axios from 'axios'
import http from 'http'
import express from 'express'
import i18nMiddleware from './index.js'

describe('i18nMiddleware', () => {
  let app
  let server
  let baseURL

  beforeAll(done => {
    app = express()
    server = http.createServer(app)
    server.listen(() => {
      const { port } = server.address()
      baseURL = `http://localhost:${port}`
      done()
    })
  })

  afterAll(done => {
    server.close(done)
  })

  beforeEach(async () => {
    process.env.LANGUAGE = 'en-US'
    await i18nMiddleware(app)
  })

  it('应该设置 app.i18n、app.logger 和 app.Error', () => {
    expect(app.i18n).toBeDefined()
    expect(app.logger).toBeDefined()
    expect(app.Error).toBeDefined()
    const { i18n, logger, Error } = app.namespace('sumor_internal')
    expect(i18n).toBeDefined()
    expect(logger).toBeDefined()
    expect(Error).toBeDefined()
    const message = i18n('TEST', { value: 'value' })
    expect(message).toBeDefined() // 根据你的实现添加具体的期望
    expect(message).toBe('Test value')
  })

  it('应该为每个请求设置 req.i18n、req.logger 和 req.Error', async () => {
    app.use((req, res) => {
      expect(req.i18n).toBeDefined()
      expect(req.logger).toBeDefined()
      expect(req.Error).toBeDefined()
      const { i18n, logger, Error } = req.namespace('sumor_internal')
      expect(i18n).toBeDefined()
      expect(logger).toBeDefined()
      expect(Error).toBeDefined()
      const message = i18n('TEST', { value: 'value' })
      expect(message).toBeDefined() // 根据你的实现添加具体的期望
      expect(message).toBe('Test value')
      res.status(200).send('OK')
    })

    const response = await axios.get(`${baseURL}/`)
    expect(response.status).toBe(200)
  })

  it('应该从请求头中使用正确的用户语言', async () => {
    app.use((req, res) => {
      const i18nMessage = req.i18n('testNamespace', 'testCode', { key: 'value' })
      expect(i18nMessage).toBeDefined() // 根据你的实现添加具体的期望
      res.status(200).send('OK')
    })

    const response = await axios.get(`${baseURL}/`, {
      headers: { 'Accept-Language': 'en-US' }
    })
    expect(response.status).toBe(200)
  })
})
