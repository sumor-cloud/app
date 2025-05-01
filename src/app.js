import loadConfig from '../modules/utils/loadConfig.js'
import serve from '../modules/serve/index.js'
import i18nMiddleware from '../modules/middlewares/i18nMiddleware/index.js'
import { cache } from '../modules/i18n/registry.js'
import apiMiddleware from '../modules/middlewares/apiMiddleware/index.js'
import tokenMiddleware from '../modules/middlewares/tokenMiddleware/index.js'

export default async configPath => {
  configPath = configPath || `${process.cwd()}/config/config`
  const userConfig = await loadConfig(configPath)

  const initApp = app => {
    const { logger } = app.namespace('sumor_app')
    logger.info('APP_STARTING')

    for (const namespace in cache) {
      logger.debug('I18N_REGISTERED', { namespace: namespace.toUpperCase() })
    }

    // 记录HTTP请求
    app.use(async (req, res, next) => {
      const { logger } = req.namespace('SUMOR_HTTP')
      const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || '0.0.0.0'
      const agent = req.headers['user-agent'] || 'unknown agent'
      logger.trace(`${req.method} ${req.originalUrl} IP/${ip} ${agent}`)
      next()
    })
  }

  const { app, config } = await serve(userConfig, [
    i18nMiddleware,
    tokenMiddleware,
    initApp,
    apiMiddleware(`${process.cwd()}/api`)
  ])

  const { logger } = app.namespace('sumor_app')

  logger.info('APP_STARTED', { port: config.port })
}
