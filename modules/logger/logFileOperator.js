import fse from 'fs-extra'
import { setTimeout } from 'timers'

const cache = {}
let cacheInterval = 500

const writeFile = async (fileName, logContent) => {
  await fse.ensureFile(fileName)
  await fse.appendFile(fileName, logContent + '\n')
}

const setTimer = fileName => {
  return setTimeout(async () => {
    const fileCache = cache[fileName]
    if (fileCache) {
      const logContent = fileCache.cache.join('\n')
      fileCache.cache = []
      fileCache.busy = true
      await writeFile(fileName, logContent)
      fileCache.busy = false

      if (fileCache.cache.length === 0) {
        cache[fileName] = {
          timer: null,
          busy: false,
          cache: []
        }
      } else {
        fileCache.timer = setTimer(fileName)
      }
    }
  }, cacheInterval)
}

const cacheWriteFile = (fileName, logContent) => {
  if (!cache[fileName] || !cache[fileName].timer) {
    cache[fileName] = {
      busy: false,
      timer: setTimer(fileName),
      cache: []
    }
  }
  cache[fileName].cache.push(logContent)
}

const setCacheInterval = interval => {
  cacheInterval = interval
}

export { writeFile, cacheWriteFile, setCacheInterval }
