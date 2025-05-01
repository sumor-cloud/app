import { describe, it, expect } from '@jest/globals'
import getI18nTemplate from './getI18nTemplate.js'

describe('获取国际化结果', () => {
  const i18nConfig = {
    origin: { key: 'origin', key2: 'origin' },
    'zh-CN': { key: 'zh-CN' },
    en: { key: 'en' }
  }

  it('应该返回指定语言和国家的国际化内容', async () => {
    const value = await getI18nTemplate(i18nConfig, 'zh-CN', 'key')
    expect(value).toBe('zh-CN')
  })

  it('应该返回指定语言的国际化内容', async () => {
    const value = await getI18nTemplate(i18nConfig, 'en-US', 'key')
    expect(value).toBe('en')
  })

  it('应该返回基础定义文件中的内容', async () => {
    const value = await getI18nTemplate(i18nConfig, 'fr-FR', 'key2')
    expect(value).toBe('origin')
  })

  it('应该返回null当没有匹配的国际化内容', async () => {
    const value = await getI18nTemplate({}, 'fr-FR', 'nonexistentKey')
    expect(value).toBeNull()
  })

  it('应该返回默认语言的国际化内容当指定语言和国家不存在', async () => {
    const value = await getI18nTemplate(i18nConfig, 'es-ES', 'key')
    expect(value).toBe('en')
  })

  it('应该返回基础定义文件中的内容当指定语言和默认语言不存在', async () => {
    const value = await getI18nTemplate(i18nConfig, 'jp-JP', 'key2')
    expect(value).toBe('origin')
  })
})
