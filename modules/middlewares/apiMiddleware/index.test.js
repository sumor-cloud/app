import { afterAll, beforeAll, describe, expect, it } from '@jest/globals'
import axios from 'axios'
import express from 'express'
import http from 'http'
import fse from 'fs-extra'
import tmp from '../../../test-utils/tmp.js'
import apiMiddleware from './index.js'
import i18nMiddleware from '../i18nMiddleware/index.js'

const tmpFolder = await tmp('apiMiddleware')

describe('API Middleware', () => {
  let app
  let server
  let baseURL

  beforeAll(async () => {
    app = express()
    app.use(express.json())

    const apiPath = `${tmpFolder}/api`
    await fse.ensureDir(apiPath)
    const files = {
      'hello.js':
        'export default (req, res) => { const name = req.data.name || "World"; return `Hello, ${name}!`; }', // eslint-disable-line
      'hello.json': JSON.stringify({
        name: 'Hello API',
        path: ['/api/hello', '/api/hello/:name'],
        parameters: {
          name: {
            type: 'string',
            required: true,
            description: 'Name of the person to greet'
          }
        }
      }),
      'syntaxError.js': 'syntax error`' // eslint-disable-line
    }
    for (const [fileName, content] of Object.entries(files)) {
      await fse.writeFile(`${apiPath}/${fileName}`, content)
    }

    await i18nMiddleware(app, tmpFolder + '/i18n')
    await apiMiddleware(apiPath)(app)

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

  it('验证参数传递正常', async () => {
    // 测试缺少必填参数
    let error
    try {
      await axios.get(`${baseURL}/api/hello`)
    } catch (e) {
      error = e
    }
    expect(error).toBeDefined()
    expect(error.response.status).toBe(400)
    expect(error.response.data.code).toBe('API_PARAMETERS_NOT_VALID')
    expect(error.response.data.errors[0].code).toBe('API_PARAMETER_NOT_VALID')
    expect(error.response.data.errors[0].errors[0].code).toBe('API_PARAMETER_REQUIRED')

    // 测试params
    const response1 = await axios.get(`${baseURL}/api/hello/Alice`)
    expect(response1.status).toBe(200)
    expect(response1.data.data).toBe('Hello, Alice!')

    // 测试query
    const response2 = await axios.get(`${baseURL}/api/hello?name=Bob`)
    expect(response2.status).toBe(200)
    expect(response2.data.data).toBe('Hello, Bob!')

    // 测试body
    const response3 = await axios.post(`${baseURL}/api/hello`, { name: 'Charlie' })
    expect(response3.status).toBe(200)
    expect(response3.data.data).toBe('Hello, Charlie!')

    // 测试HTML响应
    const response4 = await axios.get(`${baseURL}/api/hello`, {
      params: { name: 'John' },
      headers: {
        Accept: 'text/html'
      }
    })
    expect(response4.status).toBe(200)
    expect(response4.data).toContain('Hello, John!</pre>')
  })

  it('验证错误处理', async () => {
    let error
    try {
      await axios.get(`${baseURL}/api/syntaxError`)
    } catch (e) {
      error = e
    }

    expect(error).toBeDefined()
    expect(error.response.status).toBe(500)
    expect(error.response.data.code).toBe('API_PROGRAM_WRONG')
  })

  it('获取API元数据', async () => {
    const response = await axios.get(`${baseURL}/sumor/metadata`)
    expect(response.status).toBe(200)
    expect(response.data.code).toBe('OK')
    expect(response.data.data.apis['/api/hello']).toBeDefined()
  })

  it('未找到接口', async () => {
    let error
    try {
      await axios.get(`${baseURL}/api/nonexistent`)
    } catch (e) {
      error = e
    }
    expect(error).toBeDefined()
    expect(error.response.status).toBe(404)
    expect(error.response.data.code).toBe('API_NOT_FOUND')
  })

  it('长文本处理', async () => {
    const longText = 'a'.repeat(10000) + 'DEMO'
    const response = await axios.post(
      `${baseURL}/api/hello`,
      { name: longText },
      {
        headers: {
          Accept: 'text/html'
        }
      }
    )
    expect(response.status).toBe(200)
    expect(response.data).toContain('DEMO')
  })
})
