import { describe, it, expect, beforeEach, afterEach } from '@jest/globals'
import bodyMiddleware from './index.js'
import axios from 'axios'
import express from 'express'
import http from 'http'
import FormData from 'form-data'

const api = {
  route: '/upload',
  parameters: {
    name: { type: 'string' },
    file: { type: 'file' }
  }
}

// 修改describe和it的描述为中文
describe('bodyMiddleware', () => {
  let app
  let server
  let baseURL

  beforeEach(done => {
    app = express()
    app.use(express.json())
    app.post(api.route, bodyMiddleware(api), (req, res) => {
      res.status(200).send(req.data)
    })

    server = http.createServer(app).listen(() => {
      const { port } = server.address()
      baseURL = `http://localhost:${port}`
      done()
    })
  })

  afterEach(() => {
    server.close()
  })

  it('应该正确加载所有中间件', () => {
    const middlewares = bodyMiddleware(api)
    expect(middlewares).toHaveLength(6)
  })

  it('应该正确处理文件上传', async () => {
    const formData = new FormData()
    formData.append('name', 'test')
    formData.append('file', Buffer.from('test file'), 'file.txt')

    let response
    try {
      response = await axios.post(`${baseURL}${api.route}`, formData, {
        headers: formData.getHeaders()
      })
    } catch (e) {
      response = e.response
    }

    expect(response.status).toBe(200)
    expect(response.data.name).toBe('test')
    expect(response.data.file).toBeDefined()
    expect(response.data.file[0].name).toBe('file.txt')
  })
})
