import stringifyCMD from './convert/stringifyCMD.js'
import stringifyFile from './convert/stringifyFile.js'
import { cacheWriteFile } from './logFileOperator.js'

function getLogger({ namespace = 'default', transform = () => {}, id = '', path: logPath = '' }) {
  // 确保命名空间是小写，避免大小写问题
  namespace = namespace.toLowerCase()

  const showInConsole = (level, message) => {
    console.log(
      stringifyCMD({
        level,
        namespace,
        id
      }),
      message
    )
  }

  const convertToFileString = (level, message, code, data) => {
    let messageString = ''
    if (message !== undefined && message !== null) {
      switch (typeof message) {
        case 'object':
          try {
            messageString = JSON.stringify(message)
          } catch (e) {
            messageString = '[object Object]'
          }
          break
        case 'function':
          messageString = '[Function: ' + (message.name || 'anonymous') + ']'
          break
        case 'symbol':
          messageString = message.toString()
          break
        default:
          messageString = String(message)
      }
    } else {
      messageString = ''
    }
    return stringifyFile({
      level,
      message: messageString,
      code,
      data,
      namespace,
      id
    })
  }

  function asyncLog(level, code, data) {
    let message
    if (typeof code === 'string') {
      message = transform(namespace, code, data)
    }
    let actualCode, actualMessage
    if (message) {
      actualCode = code
      actualMessage = message
    } else {
      actualCode = null
      actualMessage = code
    }
    const fileString = convertToFileString(level, actualMessage, actualCode, data)
    showInConsole(level, actualMessage)
    if (logPath) {
      cacheWriteFile(logPath, fileString)
    }
  }

  return {
    trace: asyncLog.bind(null, 'trace'),
    debug: asyncLog.bind(null, 'debug'),
    info: asyncLog.bind(null, 'info'),
    warn: asyncLog.bind(null, 'warn'),
    error: asyncLog.bind(null, 'error')
  }
}

export default getLogger
