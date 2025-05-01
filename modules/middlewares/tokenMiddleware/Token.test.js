import { describe, test, expect, beforeEach, jest } from '@jest/globals'
import Token from './Token'

describe('Token 类测试', () => {
  let mockReq
  let token

  beforeEach(() => {
    mockReq = {
      id: '',
      namespace: jest.fn().mockReturnValue({
        i18n: {},
        logger: {},
        Error: class MockError extends Error {
          constructor(code, details) {
            super(code)
            this.code = code
            this.details = details
          }
        }
      })
    }
    token = new Token(mockReq)
  })

  test('初始化 Token', () => {
    expect(token.id).toBe('')
    expect(token.user).toBe('')
    expect(token.data).toEqual({})
    expect(token.permission).toEqual({})
  })

  test('设置和获取 id', () => {
    token.id = '123'
    expect(token.id).toBe('123')
  })

  test('设置和获取 user', () => {
    token.user = 'testUser'
    expect(token.user).toBe('testUser')
    expect(mockReq.id).toContain('testUser-')
  })

  test('设置和获取 data', () => {
    token.data = { key: 'value' }
    expect(token.data).toEqual({ key: 'value' })
  })

  test('设置和获取 permission', () => {
    token.permission = { read: ['file1'], write: 'file2' }
    expect(token.permission).toEqual({ read: ['file1'], write: ['file2'] })
  })

  test('检查权限', () => {
    token.user = 'testUser'
    token.permission = { read: ['file1'] }

    expect(() => token.check('read', 'file1')).not.toThrow()
    expect(() => token.check('write')).toThrowError('PERMISSION_DENIED')
  })

  test('销毁 Token', () => {
    token.destroy()
    expect(token.id).toBe('')
    expect(mockReq.id).toContain('ANONYMOUS-')
  })
})
