import { describe, it, beforeEach, afterEach, expect } from '@jest/globals'
import axios from 'axios'
import express from 'express'
import fileParser from './fileParser.js'
import FormData from 'form-data'
import http from 'http'
import fse from 'fs-extra'

const apis = [
  {
    route: '/upload',
    parameters: {
      file1: { type: 'file' },
      file2: { type: 'file' }
    }
  },
  {
    route: '/test1',
    parameters: {
      name: { type: 'string' }
    }
  },
  {
    route: '/test2'
  }
]

describe('fileParser 中间件', () => {
  let app
  let server
  let baseURL

  beforeEach(done => {
    app = express()

    app.post('/upload', fileParser(apis[0]), async (req, res) => {
      if (req.files) {
        for (const field in req.files) {
          const files = req.files[field]
          // load file
          if (files[0].path) files[0].data = await fse.readFile(files[0].path, 'utf-8')
        }
        res.status(200).send(req.files)
      } else {
        res.status(400).send('No files uploaded')
      }
    })

    app.post('/test1', fileParser(apis[1]), (req, res) => {
      if (!req.files) {
        res.status(400).send('No files uploaded')
      } else {
        res.status(200).send('Files uploaded')
      }
    })
    app.post('/test2', fileParser(apis[2]), (req, res) => {
      if (!req.files) {
        res.status(400).send('No files uploaded')
      } else {
        res.status(200).send('Files uploaded')
      }
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

  it('应该处理已定义路由的文件上传', async () => {
    const formData = new FormData()
    formData.append('file1', Buffer.from('test file 1'), 'file1.txt')
    formData.append('file2', Buffer.from('test file 2'), 'file2.txt')

    let response
    try {
      response = await axios.post(`${baseURL}/upload`, formData, {
        headers: formData.getHeaders()
      })
    } catch (e) {
      console.log(e.response.status)
      console.log(e.response.statusMessage)
      console.log(e.response.data)
    }

    expect(response.status).toBe(200)
    expect(Object.keys(response.data)).toEqual(['file1', 'file2'])
  })

  it('应该返回400当没有文件上传到/test', async () => {
    let response
    try {
      response = await axios.post(
        `${baseURL}/test1`,
        {},
        {
          headers: { 'Content-Type': 'application/json' }
        }
      )
    } catch (e) {
      response = e.response
    }

    expect(response.status).toBe(400)
    expect(response.data).toBe('No files uploaded')
  })

  it('测试无parameters参数情况', async () => {
    let response
    try {
      response = await axios.post(
        `${baseURL}/test2`,
        {},
        {
          headers: { 'Content-Type': 'application/json' }
        }
      )
    } catch (e) {
      response = e.response
    }

    expect(response.status).toBe(400)
    expect(response.data).toBe('No files uploaded')
  })

  it('应该在请求结束后清理上传的文件', async () => {
    const formData = new FormData()
    formData.append('file1', Buffer.from('test file 1'), 'file1.txt')
    formData.append('file2', Buffer.from('test file 2'), 'file2.txt')

    let response
    try {
      response = await axios.post(`${baseURL}/upload`, formData, {
        headers: formData.getHeaders()
      })
    } catch (e) {
      console.log(e.response.status)
      console.log(e.response.statusMessage)
      console.log(e.response.data)
    }

    expect(response.status).toBe(200)
    const files = response.data
    expect(files.file1[0].data).toEqual('test file 1')

    expect(Object.keys(files)).toEqual(['file1', 'file2'])

    // Check if files are cleaned up
    let existsFile = true
    for (let retries = 0; retries < 5 && existsFile; retries++) {
      existsFile = await fse.exists(files.file1[0].path)
      if (existsFile) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
    }
    expect(existsFile).toBeFalsy()
  })
})
