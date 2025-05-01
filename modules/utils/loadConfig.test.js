import { describe, it, expect } from '@jest/globals'
import loadConfig from './loadConfig.js'
import tmp from '../../test-utils/tmp.js'
import fse from 'fs-extra'
import path from 'path'

describe('loadConfig', () => {
  const prepare = async () => {
    const caseDir = await tmp('config')
    return path.join(caseDir, 'main')
  }

  it('应该将 JSON 配置文件加载为对象', async () => {
    const configPath = await prepare()
    const configContent = { key: 'value' }
    await fse.writeFile(`${configPath}.json`, JSON.stringify(configContent))
    const config = await loadConfig(configPath)
    expect(config).toEqual(configContent)
  })

  it('应该将 YAML 配置文件加载为对象', async () => {
    const configPath = await prepare()
    const configContent = { key: 'value' }
    await fse.writeFile(`${configPath}.yaml`, 'key: value')
    const config = await loadConfig(configPath)
    expect(config).toEqual(configContent)
  })

  it('如果未找到配置文件，则应返回一个空对象', async () => {
    const configPath = await prepare()
    const config = await loadConfig(configPath)
    expect(config).toEqual({})
  })

  it('应该按优先级加载配置文件: yaml > json > yml', async () => {
    const configPath = await prepare()
    const configContentJson = { key: 'json' }
    const configContentYaml = { key: 'yaml' }
    const configContentYml = { key: 'yml' }

    let config
    await fse.writeFile(`${configPath}.yml`, 'key: yml')
    config = await loadConfig(configPath)
    expect(config).toEqual(configContentYml)
    await fse.writeFile(`${configPath}.json`, JSON.stringify(configContentJson))
    config = await loadConfig(configPath)
    expect(config).toEqual(configContentJson)
    await fse.writeFile(`${configPath}.yml`, 'key: yml')
    config = await loadConfig(configPath)
    expect(config).toEqual(configContentJson)
    await fse.writeFile(`${configPath}.yaml`, 'key: yaml')
    config = await loadConfig(configPath)
    expect(config).toEqual(configContentYaml)
  })

  it('应该支持带有多个点的文件名', async () => {
    const configPath = await prepare()
    const configContent = { key: 'value' }
    await fse.writeFile(`${configPath}.zh-CN.json`, JSON.stringify(configContent))
    let config = await loadConfig(`${configPath}.zh-CN`)
    expect(config).toEqual(configContent)
    await fse.writeFile(`${configPath}.zh-CN.yml`, 'key: value')
    config = await loadConfig(`${configPath}.zh-CN`)
    expect(config).toEqual(configContent)
  })

  it('应该支持路径中包含后缀名的情况 (yml)', async () => {
    const configPath = await prepare()
    const configContent = { key: 'value' }
    await fse.writeFile(`${configPath}.yml`, 'key: value')
    const config = await loadConfig(`${configPath}.yml`)
    expect(config).toEqual(configContent)
  })

  it('应该支持路径中包含后缀名的情况 (json)', async () => {
    const configPath = await prepare()
    const configContent = { key: 'value' }
    await fse.writeFile(`${configPath}.json`, JSON.stringify(configContent))
    const config = await loadConfig(`${configPath}.json`)
    expect(config).toEqual(configContent)
  })

  it('应该支持多个配置查询，条件为 *.yaml', async () => {
    const rootDir = await tmp('config')
    const yamlContent1 = { key: 'value1' }
    const yamlContent2 = { key: 'value2' }

    await fse.writeFile(path.join(rootDir, 'config1.yaml'), 'key: value1')
    await fse.writeFile(path.join(rootDir, 'config2.yaml'), 'key: value2')

    const configs = await loadConfig('*.yaml', rootDir)
    expect(configs).toEqual({
      config1: yamlContent1,
      config2: yamlContent2
    })
  })

  it('应该支持多个配置查询，条件为 *', async () => {
    const rootDir = await tmp('config')
    const yamlContent = { key: 'yamlValue' }
    const jsonContent = { key: 'jsonValue' }

    await fse.writeFile(path.join(rootDir, 'config.yaml'), 'key: yamlValue')
    await fse.writeFile(path.join(rootDir, 'config.json'), JSON.stringify(jsonContent))

    const configs = await loadConfig('*', rootDir)
    expect(configs).toEqual({
      config: yamlContent
    })
  })

  it('应该支持多个配置查询，条件为 **/*', async () => {
    const rootDir = await tmp('config')
    const yamlContent = { key: 'yamlValue' }
    const jsonContent = { key: 'jsonValue' }

    const subDir = path.join(rootDir, 'subdir')
    await fse.ensureDir(subDir)

    await fse.writeFile(path.join(rootDir, 'config.yaml'), 'key: yamlValue')
    await fse.writeFile(path.join(subDir, 'config.json'), JSON.stringify(jsonContent))

    const configs = await loadConfig('**/*', rootDir)
    expect(configs).toEqual({
      config: yamlContent,
      'subdir/config': jsonContent
    })
  })
})
