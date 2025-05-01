import { describe, it, expect } from '@jest/globals'
import load from './index.js'
import fse from 'fs-extra'
import path from 'path'
import tmp from '../../../../test-utils/tmp.js'

describe('load', () => {
  it('应该加载指定目录下的所有.js文件', async () => {
    const tmpDir = await tmp('apiLoader')
    await fse.writeFile(path.join(tmpDir, 'test1.js'), 'syntax error')
    await fse.writeFile(path.join(tmpDir, 'test2.js'), 'export default ()=>{return "test2";}')
    await fse.writeFile(path.join(tmpDir, 'test2.json'), '{"name":"Test 2"}')
    await fse.writeFile(path.join(tmpDir, 'test4.ts'), 'export default ()=>{return "test4";}')

    await fse.ensureDir(tmpDir + '/deep')
    await fse.writeFile(
      path.join(tmpDir, 'deep', 'test3.js'),
      'export default ()=>{return "test3";}'
    )

    const apis = await load(tmpDir)
    expect(Object.keys(apis).length).toBe(3)
    expect(Object.keys(apis).sort()).toStrictEqual(['/deep/test3', '/test1', '/test2'])
    expect(apis['/test2'].name).toBe('Test 2')

    // 检查加载失败的文件
    expect(apis['/test1'].callback).toBeNull()
    expect(apis['/test2'].callback()).toBe('test2')
  })
})
