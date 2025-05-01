# convertI18n

此模块提供了一个函数，用于使用给定数据转换 i18n 模板。它支持多种语言和地区，如果找不到指定的地区，则回退到原始模板。

## 用法

```typescript
import convertI18n from './index'
import { I18nConfig, I18nData } from '../types'

const config: I18nConfig = {
  en: { greeting: 'Hello, {name}!' },
  'zh-CN': { greeting: '你好, {name}!' },
  origin: { greeting: 'Hi, {name}!' }
}

const data: I18nData = { name: 'John' }
const result = convertI18n(config, 'en', 'greeting', data)
console.log(result) // 输出: Hello, John!
```

## 函数

### convertI18n(config: I18nConfig, target: string, code: string, data: I18nData): I18nValue

- `config`: i18n 配置对象。
- `target`: 目标地区或语言。
- `code`: 要查找的 i18n 代码。
- `data`: 用于替换模板中变量的数据。

返回用提供的数据替换变量后的 i18n 值。
