import { describe, it, expect } from '@jest/globals'
import getError from './getError'

describe('getError 函数', () => {
  const transform = (namespace, code, data) => `${code}: ${JSON.stringify(data)}`
  const options = { namespace: 'Test', transform }
  const SumorError = getError(options)

  it('无transform函数时，message应该等于code', () => {
    const NonTransformError = getError({ namespace: 'NonTransform' })
    const error = new NonTransformError('ERROR_CODE')
    expect(error.code).toBe('ERROR_CODE')
    expect(error.message).toBe('ERROR_CODE')
  })

  it('应该创建一个具有正确名称和代码的错误对象', () => {
    const error = new SumorError('ERROR_CODE', { key: 'value' })
    expect(error.name).toBe('TestError')
    expect(error.code).toBe('ERROR_CODE')
    expect(error.data).toEqual({ key: 'value' })
  })

  it('应该正确处理 errors 数组', () => {
    const innerError = new Error('Inner error')
    const error = new SumorError('ERROR_CODE', {}, [innerError])
    expect(error.errors).toHaveLength(1)
    expect(error.errors[0].message).toBe('Inner error')
  })

  it('尝试直接设置 message 时应该抛出错误', () => {
    const error = new SumorError('ERROR_CODE', {})
    expect(() => {
      error.message = 'New message'
    }).toThrow('message is readonly, please use code and data to set message.')
  })

  it('应该将单个 Error 对象正确包装到 errors 数组中', () => {
    const innerError = new Error('Inner error')
    const error = new SumorError('ERROR_CODE', {}, innerError)
    expect(error.errors).toHaveLength(1)
    expect(error.errors[0]).toBe(innerError)
  })

  it('应该在 data 不是对象时将 data 设置为空对象', () => {
    const error = new SumorError('ERROR_CODE', 'notAnObject')
    expect(error.data).toEqual({})
  })

  it('应该生成正确的 JSON 表示', () => {
    const error = new SumorError('ERROR_CODE', { key: 'value' })
    const json = error.json()
    expect(json).toEqual({
      code: 'ERROR_CODE',
      message: 'ERROR_CODE: {"key":"value"}',
      data: { key: 'value' },
      errors: []
    })
  })

  it('应该在 JSON 表示中包含嵌套的错误', () => {
    const error1 = new SumorError('ERROR_CODE', { key: 'value1' })
    const error2 = new SumorError('ERROR_CODE', { key: 'value2' }, error1)
    const json = error2.json()
    expect(json).toEqual({
      code: 'ERROR_CODE',
      message: 'ERROR_CODE: {"key":"value2"}',
      data: { key: 'value2' },
      errors: [
        {
          code: 'ERROR_CODE',
          message: 'ERROR_CODE: {"key":"value1"}',
          data: { key: 'value1' },
          errors: []
        }
      ]
    })
  })

  it('应该在 JSON 表示中包含嵌套的其他错误', () => {
    const error1 = new Error('Inner error 1')
    const error2 = new SumorError('ERROR_CODE', { key: 'value2' }, error1)
    const json = error2.json()
    expect(json).toEqual({
      code: 'ERROR_CODE',
      message: 'ERROR_CODE: {"key":"value2"}',
      data: { key: 'value2' },
      errors: [
        {
          code: 'UNKNOWN_ERROR',
          message: 'Inner error 1',
          data: {},
          errors: []
        }
      ]
    })
  })
})
