import mergeData from './mergeData'
import { describe, it, expect, beforeEach, jest } from '@jest/globals'

describe('mergeData middleware', () => {
  let req, res, next

  beforeEach(() => {
    req = {
      params: { param1: 'value1' },
      query: { query1: 'value2' },
      body: { body1: 'value3' },
      files: { file1: 'value4' }
    }
    res = {}
    next = jest.fn()
  })

  it('应该将 params、query、body 和 files 合并到 req.data 中', () => {
    mergeData(req, res, next)

    expect(req.data).toEqual({
      param1: 'value1',
      query1: 'value2',
      body1: 'value3',
      file1: 'value4'
    })
    expect(next).toHaveBeenCalled()
  })

  it('应该处理空的 params、query、body 和 files', () => {
    req = { params: {}, query: {}, body: {}, files: {} }

    mergeData(req, res, next)

    expect(req.data).toEqual({})
    expect(next).toHaveBeenCalled()
  })
})
