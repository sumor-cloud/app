# 国际化模块 i18n

## 使用方式

### 基础定义文件

定义基础国际化文件，如 demo.yml

#### 示例

```yaml
USER_NOT_FOUND: 'User not found: {name}'
ALLOW_REGISTER: false
```

### 国际化文件

定义国际化文件，对指定语言或指定国家做常规国际化或特殊处理。注意，国际化不限于翻译，也可以是内容的调整。

#### 国际化匹配规则

在基础定义文件中定义的国际化内容，会被当前语言环境对应的国际化文件中的内容覆盖。
如当前语言为`zh-CN`，以如下顺序查找内容：

1. 加载对应的`.zh-CN.yml`文件，查找是否有对应的国际化。
2. 加载对应的`.zh.yml`文件，查找是否有对应的国际化。
3. 加载对应的`.en.yml`文件，查找是否有对应的国际化。
4. 不国际化，使用原始内容。

#### 指定国家区域示例

##### 简体中文（中国）示例文件

- demo.zh-CN.yml

```yaml
USER_NOT_FOUND: '用户在中国未找到: {name}'
ALLOW_REGISTER: true
```

##### 英语（美国）示例文件

- demo.en-US.yml

```yaml
USER_NOT_FOUND: 'User not found in US: {name}'
```

对于上述配置，在`en-US`环境下，不允许注册，但在 zh-CN 环境下，允许注册。
但由于`en-US`未定义`ALLOW_REGISTER`如`.en.yml`有额外定义，则以`.en.yml`的定义为准。

#### 不指定国家区域示例

##### 英语示例文件

- demo.en.yml

```yaml
USER_NOT_FOUND: 'User not found: {name}'
ALLOW_REGISTER: true
```

对于上述配置，在英语环境下，都允许注册

## 使用

```js
// 引入国际化模块
import initI18n from './index'

// 根据配置文件的目录，初始化国际化模块
const i18n = initI18n({
  namespace: 'DEMO',
  i18n: process.cwd() + '/config/i18n',
  id: 'USER001',
  index: 'SERVER1-000001',
  log: process.cwd() + '/tmp/log/main'
})

// 获取国际化内容
const userNotFound = i18n('USER_NOT_FOUND', { name: 'tester' })

// 记录日志
const { logger } = i18n
logger.info('USER_NOT_FOUND', { name: 'tester' })

// 抛出异常，该操作会调用logger.error
const { Error } = i18n
throw new Error('USER_NOT_FOUND', { name: 'tester' })
```
