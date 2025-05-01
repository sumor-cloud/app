import { describe, it, expect } from '@jest/globals'
import { filterOneDot, filterDoubleDot, getRelativePath, joinPath } from './pathUtils.js'

describe('Utility Functions', () => {
  it('过滤出包含一个点的文件', () => {
    const files = ['demo.yml', 'demo.zh-CN.yml', 'demo.en.json', 'demo.en.json.bak']
    const filteredFiles = filterOneDot(files)
    expect(filteredFiles.length).toBe(1)
    expect(filteredFiles).toContain('demo.yml')
  })

  it('过滤出包含两个点的文件', () => {
    const files = ['demo.yml', 'demo.zh-CN.yml', 'demo.en.json', 'demo.en.json.bak']
    const filteredFiles = filterDoubleDot(files)
    expect(filteredFiles.length).toBe(2)
    expect(filteredFiles).toContain('demo.en.json')
    expect(filteredFiles).toContain('demo.zh-CN.yml')
  })

  it('获取相对路径', () => {
    const absDirectory = '/Users/demo'
    const file = '/Users/demo/tmp/i18n/registry1/demo.yml'
    const relativePath = getRelativePath(absDirectory, file)
    expect(relativePath).toBe('tmp/i18n/registry1/demo')

    // 支持windows
    const absDirectoryWin = 'C:\\Users\\demo'
    const fileWin = 'C:\\Users\\demo\\tmp\\i18n\\registry1\\demo.yml'
    const relativePathWin = getRelativePath(absDirectoryWin, fileWin)
    expect(relativePathWin).toBe('tmp/i18n/registry1/demo')
  })

  it('拼接路径 - 空路径数组', () => {
    expect(joinPath()).toBe('')
  })

  it('拼接路径 - 多路径拼接', () => {
    if (process.platform === 'darwin' || process.platform === 'linux') {
      const path1 = '/Users/demo'
      const path2 = 'tmp/i18n'
      const path3 = 'registry1/demo.yml'
      expect(joinPath(path1, path2, path3)).toBe('/Users/demo/tmp/i18n/registry1/demo.yml')
    }

    if (process.platform === 'win32') {
      const path1 = 'C:\\Users\\demo'
      const path2 = 'tmp\\i18n'
      const path3 = 'registry1\\demo.yml'
      expect(joinPath(path1, path2, path3)).toBe('C:\\Users\\demo\\tmp\\i18n\\registry1\\demo.yml')
    }
  })
})
