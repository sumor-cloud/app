function getI18nTemplate(i18nConfig, region, code) {
  // 优先查找指定语言和国家的国际化内容
  if (i18nConfig[region] && i18nConfig[region][code] !== undefined) {
    return i18nConfig[region][code]
  }

  // 查找指定语言的国际化内容
  const language = region.split('-')[0]
  if (i18nConfig[language] && i18nConfig[language][code] !== undefined) {
    return i18nConfig[language][code]
  }

  // 查找默认语言的国际化内容
  if (i18nConfig.en && i18nConfig.en[code] !== undefined) {
    return i18nConfig.en[code]
  }

  // 返回基础定义文件中的内容
  if (i18nConfig.origin) {
    return i18nConfig.origin[code]
  }

  return null
}

export default getI18nTemplate
