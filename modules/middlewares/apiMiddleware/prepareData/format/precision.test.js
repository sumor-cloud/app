import { describe, it, expect } from '@jest/globals'

import precision from './precision'

describe('precision', () => {
  it('should round a number to the specified decimal places', () => {
    const parameter = { type: 'number', decimal: 2 }
    const result = precision(parameter, 3.14159)
    expect(result).toBe(3.14)
  })

  it('should return the original number if decimal is not specified', () => {
    const parameter = { type: 'number' }
    const result = precision(parameter, 3.14159)
    expect(result).toBe(3.14159)
  })

  it('should handle null or undefined decimal gracefully', () => {
    const parameter = { type: 'number', decimal: null }
    const result = precision(parameter, 3.14159)
    expect(result).toBe(3.14159)

    parameter.decimal = undefined
    const result2 = precision(parameter, 3.14159)
    expect(result2).toBe(3.14159)
  })

  it('should return the original value if it is not a number', () => {
    const parameter = { type: 'number', decimal: 2 }
    const result = precision(parameter, 'not-a-number')
    expect(result).toBe('not-a-number')
  })
})
