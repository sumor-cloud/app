import { describe, it, expect } from '@jest/globals'
import prepareData from './index.js'

describe('prepareData', () => {
  it('应该转换类型并验证参数', () => {
    const req = {
      data: {
        name: 'John',
        age: '25'
      },
      namespace: namespace => {
        if (namespace === 'SUMOR_API') {
          return {
            Error: class extends Error {
              constructor(code, details) {
                super(code)
                this.details = details
              }
            }
          }
        }
        if (namespace === 'API') {
          return {
            Error: class extends Error {
              constructor(code, details) {
                super(code)
                this.details = details
              }
            }
          }
        }
      }
    }

    const parameters = {
      name: { type: 'string', required: true, length: 10 },
      age: { type: 'number', required: true }
    }

    const result = prepareData(req, '/unit-test', parameters)

    expect(result).toEqual({
      name: 'John',
      age: 25
    })
  })

  it('应该抛出缺少必需参数的错误', () => {
    const req = {
      data: {},
      namespace: namespace => {
        if (namespace === 'SUMOR_API') {
          return {
            Error: class extends Error {
              constructor(code, details) {
                super(code)
                this.details = details
              }
            }
          }
        }
        if (namespace === 'API') {
          return {
            Error: class extends Error {
              constructor(code, details) {
                super(code)
                this.details = details
              }
            }
          }
        }
      }
    }

    const parameters = {
      name: { type: 'string', required: true }
    }

    expect(() => prepareData(req, '/unit-test', parameters)).toThrowError(
      'API_PARAMETERS_NOT_VALID'
    )
  })

  it('应该抛出字符串超出长度限制的错误', () => {
    const req = {
      data: {
        name: 'This is a very long name'
      },
      namespace: namespace => {
        if (namespace === 'SUMOR_API') {
          return {
            Error: class extends Error {
              constructor(code, details) {
                super(code)
                this.details = details
              }
            }
          }
        }
        if (namespace === 'API') {
          return {
            Error: class extends Error {
              constructor(code, details) {
                super(code)
                this.details = details
              }
            }
          }
        }
      }
    }

    const parameters = {
      name: { type: 'string', required: true, length: 10 }
    }

    expect(() => prepareData(req, '/unit-test', parameters)).toThrowError(
      'API_PARAMETERS_NOT_VALID'
    )
  })
})
