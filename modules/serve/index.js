import express from 'express'
import listenApp from './listenApp.js'
import format from './formatConfig.js'

export default async function (config, callbacks) {
  config = format(config)
  const app = express()

  // 添加交互参数
  app.sumor = {
    config
  }
  app.use((req, res, next) => {
    req.sumor = {
      config
    }
    next()
  })

  if (typeof callbacks === 'object') {
    for (const callback of callbacks) {
      await callback(app)
    }
  } else {
    await callbacks(app)
  }

  const close = await listenApp(app, config.port)
  return { app, config, close }
}
