import { describe, it, expect, beforeAll, afterEach, afterAll } from '@jest/globals'
import cleanupFiles from './cleanupFiles.js'
import fse from 'fs-extra'
import path from 'path'
import tmp from '../../../test-utils/tmp.js'

const tempDir = await tmp('bodyMiddlewareCleanupFiles')
describe('cleanupFiles', () => {
  beforeAll(async () => {
    await fse.ensureDir(tempDir)
  })

  afterEach(async () => {
    // Ensure temp directory is clean after each test
    const files = await fse.readdir(tempDir)
    await Promise.all(files.map(file => fse.remove(path.join(tempDir, file))))
  })

  afterAll(async () => {
    // Remove temp directory after all tests
    await fse.remove(tempDir)
  })

  it('should do nothing if files is undefined', async () => {
    await cleanupFiles(undefined)
    const files = await fse.readdir(tempDir)
    expect(files.length).toBe(0)
  })

  it('should remove all files in the files object', async () => {
    const filePaths = [
      path.join(tempDir, 'file1.txt'),
      path.join(tempDir, 'file2.txt'),
      path.join(tempDir, 'file3.txt')
    ]

    // Create temporary files
    await Promise.all(filePaths.map(filePath => fse.writeFile(filePath, 'test content')))

    const files = {
      field1: [{ path: filePaths[0] }, { path: filePaths[1] }],
      field2: [{ path: filePaths[2] }]
    }

    await cleanupFiles(files)

    // Assert files are removed
    await Promise.all(
      filePaths.map(async filePath => {
        expect(await fse.exists(filePath)).toBe(false)
      })
    )
  })
})
