import load from './load/index.js'
import bodyMiddleware from '../bodyMiddleware/index.js'
import sendSuccess from './response/sendSuccess.js'
import sendNotFound from './response/sendNotFound.js'
import sendError from './response/sendError.js'
import errorCatcher from './errorCatcher.js'
import prepareData from './prepareData/index.js'
import getExposeApis from './exposeApis/index.js'
import { data as i18nData } from '../../i18n/index.js'
import metadataToSwagger from './metadataToSwagger.js'
import swaggerUi from 'swagger-ui-express'
import path from 'path'
import { fileURLToPath } from 'url'
import express from 'express'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default apiRoot => {
  return async app => {
    const appNamespace = app.namespace('SUMOR_API')
    const apis = await load(apiRoot)
    const exposeApis = await getExposeApis(apis, appNamespace.logger)
    const prefix = '/api'
    for (const path in exposeApis) {
      const apiInfo = exposeApis[path]

      let middlewares = [...bodyMiddleware(apiInfo)]
      const callback = apiInfo.callback

      middlewares.push(async (req, res, next) => {
        const reqNamespace = req.namespace('SUMOR_API')
        if (callback) {
          const dataString = JSON.stringify(req.data)
          reqNamespace.logger.trace('API_CALLED', {
            path: req.path,
            data: dataString
          })
          req.data = prepareData(req, apiInfo.key, apiInfo.parameters)
          const result = await callback(req, res)
          sendSuccess(req, res, result)
        } else {
          // 接口程序加载失败，不可执行
          throw new reqNamespace.Error('API_PROGRAM_WRONG')
        }
      })

      // 捕捉中间件错误
      middlewares = middlewares.map(errorCatcher)

      middlewares.push((err, req, res, next) => {
        sendError(req, res, err)
      })

      // 监听API请求
      for (const method of apiInfo.methods) {
        app[method.toLowerCase()](path, middlewares)
      }

      if (apiInfo.callback) {
        appNamespace.logger.debug('API_REGISTERED', {
          path,
          name: apiInfo.name ? ' - ' + apiInfo.name : ''
        })
      } else {
        appNamespace.logger.error('API_REGISTERED_FAILED', { path })
      }
    }

    app.all(`/sumor/i18n`, (req, res) => {
      sendSuccess(req, res, i18nData)
    })

    const metadata = {
      name: '轻呈云应用',
      desc: '',
      apis: {}
    }
    if (app.sumor && app.sumor.config) {
      metadata.name = app.sumor.config.name
      metadata.desc = app.sumor.config.desc
    }
    for (const path in exposeApis) {
      const result = Object.assign({}, exposeApis[path])
      delete result.callback
      metadata.apis[path] = result
    }
    app.all(`/sumor/metadata`, (req, res) => {
      sendSuccess(req, res, metadata)
    })

    // 添加 Swagger UI
    app.use('/api-docs', express.static(__dirname + '/public'))
    app.use(
      '/api-docs',
      swaggerUi.serve,
      swaggerUi.setup(metadataToSwagger(metadata), {
        customCss: '.swagger-ui .topbar, .version-stamp { display: none !important }',
        customSiteTitle: metadata.name,
        customfavIcon: './favicon.ico'
      })
    )

    app.get('/api', (req, res) => {
      res.redirect('/api-docs')
    })

    // 监听prefix，让没匹配到的接口，返回报错页面
    app.all(`${prefix}/*`, sendNotFound)
  }
}
