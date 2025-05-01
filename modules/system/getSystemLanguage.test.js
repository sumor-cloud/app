import { describe, it, expect } from '@jest/globals'
import getSystemLanguage from './getSystemLanguage.js'
import { osLocale } from 'os-locale'
describe('i18n Middleware', () => {
  it('加载系统语言', async () => {
    delete process.env.LANGUAGE
    const language = await getSystemLanguage()
    const expectLanguage = await osLocale()
    expect(language).toBe(expectLanguage)

    process.env.LANGUAGE = 'zh-CN'
    const language2 = await getSystemLanguage()
    expect(language2).toBe('zh-CN')

    process.env.LANGUAGE = 'en-US'
    const language3 = await getSystemLanguage()
    expect(language3).toBe('en-US')
  })
})
