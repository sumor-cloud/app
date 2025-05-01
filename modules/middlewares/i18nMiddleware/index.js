import getSystemLanguage from '../../system/getSystemLanguage.js'
import { convert, registerAll } from '../../i18n/index.js'
import getLogger from '../../logger/index.js'
import getError from '../../utils/getError.js'
import fse from 'fs-extra'

let sequence = 0

export default async (app, root) => {
  root = root || process.cwd() + '/i18n'
  const logPath = process.env.LOG_PATH || process.cwd() + '/tmp/logs/main.log'
  const systemLanguage = await getSystemLanguage()
  if (await fse.exists(root)) {
    await registerAll(root)
  }

  app.namespace = namespace => {
    const transform = (namespace, code, data) => {
      return convert(namespace, systemLanguage, code, data)
    }
    const i18n = (code, data) => {
      return transform(namespace, code, data)
    }
    const logger = getLogger({
      transform,
      namespace,
      id: '',
      path: logPath
    })
    const Error = getError({
      namespace,
      transform
    })
    return {
      i18n,
      logger,
      Error
    }
  }

  const appNamespace = app.namespace('app')
  app.i18n = appNamespace.i18n
  app.logger = appNamespace.logger
  app.Error = appNamespace.Error

  app.use((req, res, next) => {
    req.sequence = sequence++
    req.id = `ANONYMOUS-${req.sequence}`
    const userLanguage = req.headers['accept-language'] || systemLanguage

    req.namespace = namespace => {
      const transform = (namespace, code, data) => {
        return convert(namespace, userLanguage, code, data)
      }
      const i18n = (code, data) => {
        return transform(namespace, code, data)
      }
      const logger = getLogger({
        transform,
        namespace,
        id: req.id,
        path: logPath
      })
      const Error = getError({
        namespace,
        transform
      })
      return {
        i18n,
        logger,
        Error
      }
    }

    const reqNamespace = req.namespace('req')
    req.i18n = reqNamespace.i18n
    req.logger = reqNamespace.logger
    req.Error = reqNamespace.Error

    next()
  })
}
