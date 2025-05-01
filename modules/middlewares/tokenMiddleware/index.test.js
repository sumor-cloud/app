import { describe, it, beforeAll, afterAll, expect } from '@jest/globals'
import axios from 'axios'
import express from 'express'
import tokenMiddleware from './index.js'
import i18nMiddleware from '../i18nMiddleware/index.js'
import http from 'http'

describe('Token Middleware 测试', () => {
  let app
  let server
  let baseURL

  beforeAll(async () => {
    app = express()
    await i18nMiddleware(app)
    tokenMiddleware(app)

    app.get('/test', (req, res) => {
      res.json({ token: req.token.id })
    })

    app.get('/login', (req, res) => {
      req.token.id = 'test-token'
      res.json({ token: req.token.id })
    })

    server = http.createServer(app)
    await new Promise(resolve => {
      server.listen(() => {
        const { port } = server.address()
        baseURL = `http://localhost:${port}`
        resolve()
      })
    })
  })

  afterAll(done => {
    server.close(done)
  })

  it('应从 Authorization 头中提取 Bearer token', async () => {
    const response = await axios.get(`${baseURL}/test`, {
      headers: {
        Authorization: 'Bearer test-token'
      }
    })

    expect(response.data.token).toBe('test-token')
  })

  it('如存在 Authorization 头，但不以 Bearer 开头，则不读取token', async () => {
    const response = await axios.get(`${baseURL}/test`, {
      headers: {
        Authorization: 'test-token'
      }
    })

    expect(response.data.token).toBe('')
  })

  it('应从 Cookie 中提取 token', async () => {
    const response = await axios.get(`${baseURL}/test`, {
      headers: {
        Cookie: 't=test-cookie-token'
      }
    })

    expect(response.data.token).toBe('test-cookie-token')
  })

  it('应设置新的 token 到 Cookie 中', async () => {
    const response = await axios.get(`${baseURL}/login`)

    const setCookieHeader = response.headers['set-cookie']
    expect(setCookieHeader).toBeDefined()
    expect(setCookieHeader[0]).toMatch(/t=.+; Path=\/; HttpOnly; Max-Age=8640000/)
  })
})

describe('Token Middleware 测试，无namespace中间件', () => {
  let app
  let server
  let baseURL

  beforeAll(async () => {
    app = express()
    tokenMiddleware(app)

    app.get('/test', (req, res) => {
      if (!req.token) {
        res.send('NO_TOKEN')
      } else {
        res.send('HAS_TOKEN')
      }
    })

    server = http.createServer(app)
    await new Promise(resolve => {
      server.listen(() => {
        const { port } = server.address()
        baseURL = `http://localhost:${port}`
        resolve()
      })
    })
  })

  afterAll(done => {
    server.close(done)
  })

  it('检测TOKEN，不应存在', async () => {
    const response = await axios.get(`${baseURL}/test`)
    expect(response.data).toBe('NO_TOKEN')
  })
})
