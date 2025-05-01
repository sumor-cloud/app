import { afterAll, beforeAll, describe, expect, it } from '@jest/globals'
import axios from 'axios'
import express from 'express'
import i18nMiddleware from '../../i18nMiddleware/index.js'
import http from 'http'
import fse from 'fs-extra'
import sendError from './sendError.js'

const tmpTroubleshooting = './tmp/testTroubleshooting'

describe('Error Middleware', () => {
  let app
  let server
  let baseURL

  beforeAll(async () => {
    app = express()
    app.use(express.json())

    process.env.LANGUAGE = 'en-US'
    await i18nMiddleware(app)

    app.get('/error', (req, res, next) => {
      const error = new Error('Test Error')
      error.code = 'TEST_ERROR'
      throw error
    })
    app.get('/unknown_error', (req, res, next) => {
      throw new Error('Unknown Error')
    })

    app.get('/json_error', (req, res, next) => {
      const error = new Error('JSON Error')
      error.code = 'JSON_ERROR'
      error.json = () => {
        return {
          code: error.code,
          message: error.message
        }
      }
      throw error
    })

    app.get('/error_no_code', (req, res, next) => {
      throw new Error('Unknown Error')
    })

    app.get('/no_error', (req, res, next) => {
      res.status(200).send('No Error')
    })

    app.get('/no_login', (req, res, next) => {
      sendError(req, res, {
        json: () => {
          return {
            code: 'LOGIN_EXPIRED',
            message: 'Login expired'
          }
        }
      })
    })

    app.get('/no_permission', (req, res, next) => {
      sendError(req, res, {
        json: () => {
          return {
            code: 'PERMISSION_DENIED',
            message: 'Permission denied'
          }
        }
      })
    })

    app.use((err, req, res, next) => {
      sendError(req, res, err)
    })

    app.get('*', (req, res, next) => {
      res.status(404).send('Not Found')
    })

    await new Promise(resolve => {
      server = http.createServer(app).listen(() => {
        const { port } = server.address()
        baseURL = `http://localhost:${port}`
        resolve()
      })
    })
  })

  afterAll(done => {
    server.close(done)
  })

  it('应该通过 HTML 返回错误信息', async () => {
    let error
    try {
      await axios.get(`${baseURL}/error`, {
        headers: {
          Accept: 'text/html',
          'Accept-Language': 'en-US'
        }
      })
    } catch (e) {
      error = e
    }
    expect(error).toBeDefined()
    expect(error.response.status).toBe(500)
    expect(error.response.data).toContain(`<title>Interface error`)
    expect(error.response.data).toContain(`Show more technical details`)

    // 保存 HTML 文件到临时目录
    const tempDir = `${tmpTroubleshooting}/errorMiddleware.html`
    await fse.ensureDir(tmpTroubleshooting)
    await fse.writeFile(tempDir, error.response.data)
  })

  it('应该通过 JSON 返回错误信息', async () => {
    let error
    try {
      await axios.get(`${baseURL}/error`, {
        headers: { Accept: 'application/json' }
      })
    } catch (e) {
      error = e
    }
    expect(error).toBeDefined()
    expect(error.response.status).toBe(500)
    expect(error.response.data.code).toEqual('API_ERROR')

    // 保存 HTML 文件到临时目录
    const tempDir = `${tmpTroubleshooting}/errorMiddleware.json`
    await fse.ensureDir(tmpTroubleshooting)
    await fse.writeJson(tempDir, error.response.data)
  })

  it('国际化支持', async () => {
    let error
    try {
      await axios.get(`${baseURL}/error`, {
        headers: {
          Accept: 'text/html',
          'Accept-Language': 'zh-CN'
        }
      })
    } catch (e) {
      error = e
    }
    expect(error).toBeDefined()
    expect(error.response.status).toBe(500)
    expect(error.response.data).toContain(`<title>接口异常`)
    expect(error.response.data).toContain(`显示更多技术细节`)

    // 保存 HTML 文件到临时目录
    const tempDir = `${tmpTroubleshooting}/errorMiddleware_zh-CN.html`
    await fse.ensureDir(tmpTroubleshooting)
    await fse.writeFile(tempDir, error.response.data)
  })

  it('应该通过 JSON 返回自定义错误信息', async () => {
    let error
    try {
      await axios.get(`${baseURL}/json_error`, {
        headers: { Accept: 'application/json' }
      })
    } catch (e) {
      error = e
    }
    expect(error).toBeDefined()
    expect(error.response.status).toBe(500)
    expect(error.response.data).toEqual({
      code: 'JSON_ERROR',
      message: 'JSON Error'
    })

    // 保存 JSON 文件到临时目录
    const tempDir = `${tmpTroubleshooting}/errorMiddleware_json.json`
    await fse.ensureDir(tmpTroubleshooting)
    await fse.writeJson(tempDir, error.response.data)
  })

  it('应该返回 404 错误', async () => {
    const response = await axios.get(`${baseURL}/not-found`, {
      validateStatus: status => status === 404
    })
    expect(response.status).toBe(404)
    expect(response.data).toBe('Not Found')
  })

  it('应该返回 200 状态码', async () => {
    const response = await axios.get(`${baseURL}/no_error`)
    expect(response.status).toBe(200)
    expect(response.data).toBe('No Error')
  })

  it('未知错误', async () => {
    let error
    try {
      await axios.get(`${baseURL}/error_no_code`, {
        headers: {
          Accept: 'application/json',
          'Accept-Language': 'zh-CN'
        }
      })
    } catch (e) {
      error = e
    }
    expect(error).toBeDefined()
    expect(error.response.status).toBe(500)
    expect(error.response.data.message).toContain('接口异常')

    // 保存 JSON 文件到临时目录
    const tempDir = `${tmpTroubleshooting}/errorMiddleware_no_code.json`
    await fse.ensureDir(tmpTroubleshooting)
    await fse.writeJson(tempDir, error.response.data)
  })

  it('应该返回 401 状态码，当错误代码为 LOGIN_EXPIRED', async () => {
    let error
    try {
      await axios.get(`${baseURL}/no_login`, {
        headers: {
          Accept: 'application/json',
          'Accept-Language': 'en-US'
        }
      })
    } catch (e) {
      error = e
    }
    expect(error).toBeDefined()
    expect(error.response.status).toBe(401)
    expect(error.response.data.code).toEqual('LOGIN_EXPIRED')
  })

  it('应该返回 403 状态码，当错误代码为 PERMISSION_DENIED', async () => {
    let error
    try {
      await axios.get(`${baseURL}/no_permission`, {
        headers: {
          Accept: 'application/json',
          'Accept-Language': 'en-US'
        }
      })
    } catch (e) {
      error = e
    }
    expect(error).toBeDefined()
    expect(error.response.status).toBe(403)
    expect(error.response.data.code).toEqual('PERMISSION_DENIED')
  })
})
