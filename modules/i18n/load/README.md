## 加载配置

load 目录为加载 i18n 配置的目录。将会根据指定目录，加载所有的配置文件。

### 示例

配置目录为 /config/i18n，基础配置文件名为 demo.yml。
则调用 load 模块时，传入的参数为`/config/i18n/demo`。
会加载如下文件：

- /config/i18n/demo.yml
- /config/i18n/demo.zh-CN.yml
- /config/i18n/demo.zh.yml
- /config/i18n/demo.en.yml
- ... 等地区语言后缀的文件

#### 返回值

demo.yml 会作为 origin 的值，其他文件会根据语言后缀，作为对应的语言配置。

```json
{
  "origin": { "key": "ORIGIN" },
  "zh-CN": { "key": "CHINA" },
  "zh": { "key": "CHINESE" },
  "en": { "key": "ENGLISH" }
}
```
